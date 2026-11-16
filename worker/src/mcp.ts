// The MCP endpoint at /mcp. Requests reach it only with a valid yaft.cc access token, and the
// grant's props (the GitHub token and the picked repository) arrive decrypted in `ctx.props`.
import { createMcpHandler, McpServer, type CallToolResult } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { GitHubError, type GitHub } from "../../app/src/lib/github.ts";
import { convert, fetchRates, type Rates, type Stored, type Transaction } from "../../app/src/lib/records.ts";
import { githubFor, WRITE, type Props } from "./connect.ts";
import type { Env } from "./index.ts";
import { addTransaction, LedgerError, localNow, readLedger, readMonth, updateTransaction, type Ledger } from "./ledger.ts";

interface McpContext extends ExecutionContext {
  props: Props;
  auth: { scope: string[] };
}

export const mcpHandler = {
  async fetch(request: Request, _env: Env, ctx: ExecutionContext): Promise<Response> {
    const { props, auth } = ctx as McpContext;
    return createMcpHandler(() => yaftServer(props, auth.scope.includes(WRITE))).fetch(request);
  },
};

const MONTH = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM");
const LOCAL_DATE = z
  .string()
  .describe("Local date and time as YYYY-MM-DDTHH:mm:ss (or YYYY-MM-DD), with no time zone suffix.");
const TO_AMOUNT = z
  .number()
  .positive()
  .optional()
  .describe("Transfers between accounts in different currencies, where it is required: how much arrived, in the receiving account's currency.");

export function yaftServer(props: Props, canWrite: boolean, gh: GitHub = githubFor(props.github.accessToken)) {
  const { repo, timeZone } = props;
  const server = new McpServer({ name: "yaft", version: "1.0.0" }, {
    instructions: `YAFT is a personal finance tracker. A transaction's amount is a plain number in its account's currency (IDR has no decimals); totals, budgets, and summaries are in the user's main currency, converted at the day's rate. Investment accounts hold the capital put in, not a market value. Dates are the user's local wall-clock time; the user's time zone is ${timeZone}. Call list_accounts_and_categories before adding a transaction to get valid ids.`,
  });
  const thisMonth = () => localNow(timeZone).slice(0, 7);

  server.registerTool(
    "list_accounts_and_categories",
    {
      description: "Accounts, categories, and monthly budgets. Ids from here are what add_transaction takes.",
      annotations: { readOnlyHint: true },
    },
    () =>
      run(async () => {
        const ledger = await readLedger(gh, repo);
        return {
          mainCurrency: ledger.baseCurrency,
          accounts: ledger.accounts.map((a) => ({ id: a.id, name: a.name, type: a.type ?? "cash", currency: a.currency })),
          categories: ledger.categories.map((c) => ({ id: c.id, name: c.name, type: c.type, emoji: c.emoji })),
          budgets: ledger.budgets.map((b) => ({ id: b.id, name: b.name, monthlyLimit: b.amount, categoryIds: b.categoryIds })),
        };
      }),
  );

  server.registerTool(
    "account_balances",
    {
      description:
        "Each account's current balance in its own currency, and total assets (cash, invested, overall) in the main currency. Reads every transaction, so call it only when balances are asked for.",
      annotations: { readOnlyHint: true },
    },
    () =>
      run(async () => {
        const ledger = await readLedger(gh, repo, { since: "0000-00" });
        const rates = await ratesFor(ledger);
        const base = ledger.baseCurrency;
        const balance = new Map(ledger.accounts.map((a) => [a.id, a.openingBalance ?? 0]));
        const add = (id: string | undefined, v: number) => id && balance.has(id) && balance.set(id, balance.get(id)! + v);
        for (const t of ledger.transactions) {
          if (t.type === "income") add(t.accountId, t.amount);
          else if (t.type === "expense") add(t.accountId, -t.amount);
          else {
            add(t.accountId, -t.amount);
            add(t.toAccountId, t.toAmount ?? t.amount);
          }
        }
        const totals = { cash: 0, invested: 0, total: 0 };
        const noRate: string[] = [];
        const accounts = ledger.accounts.map((a) => {
          const own = balance.get(a.id)!;
          const value = convert(own, a.currency, base, rates);
          if (value === null) noRate.push(a.name);
          else {
            totals[a.type === "investment" ? "invested" : "cash"] += value;
            totals.total += value;
          }
          return { id: a.id, name: a.name, type: a.type ?? "cash", currency: a.currency, balance: cents(own), inMainCurrency: value === null ? null : cents(value) };
        });
        return {
          mainCurrency: base,
          ratesDate: rates?.date,
          accounts,
          totals: { cash: cents(totals.cash), invested: cents(totals.invested), total: cents(totals.total) },
          ...(noRate.length > 0 && { leftOutOfTotals: `No exchange rate right now for ${noRate.join(", ")}.` }),
        };
      }),
  );

  server.registerTool(
    "list_transactions",
    {
      description: "Transactions dated in one month, newest first.",
      inputSchema: z.object({
        month: MONTH.optional().describe("YYYY-MM; defaults to the current month."),
        search: z.string().optional().describe("Only transactions whose title or note contains this text."),
        categoryId: z.string().optional(),
        accountId: z.string().optional(),
      }),
      annotations: { readOnlyHint: true },
    },
    ({ month, search, categoryId, accountId }) =>
      run(async () => {
        const ledger = await readMonth(gh, repo, month ?? thisMonth());
        const q = search?.toLowerCase();
        const txs = ledger.transactions.filter(
          (t) =>
            (!q || `${t.title}\n${t.note}`.toLowerCase().includes(q)) &&
            (!categoryId || t.categoryId === categoryId) &&
            (!accountId || t.accountId === accountId || t.toAccountId === accountId),
        );
        return { month: month ?? thisMonth(), transactions: txs.map((t) => view(t, ledger)) };
      }),
  );

  server.registerTool(
    "month_summary",
    {
      description: "Income, spending by category, and budget progress for one month.",
      inputSchema: z.object({ month: MONTH.optional().describe("YYYY-MM; defaults to the current month.") }),
      annotations: { readOnlyHint: true },
    },
    ({ month }) =>
      run(async () => {
        const m = month ?? thisMonth();
        const ledger = await readMonth(gh, repo, m);
        const rates = await ratesFor(ledger);
        const currencyOf = (id: string) => ledger.accounts.find((a) => a.id === id)?.currency ?? ledger.baseCurrency;
        // Everything in the main currency; a transaction with no rate yet is left out and counted.
        const inBase = ledger.transactions.flatMap((t) => {
          const amount = convert(t.amount, currencyOf(t.accountId), ledger.baseCurrency, rates);
          return amount === null ? [] : [{ ...t, amount }];
        });
        const spent = new Map<string, number>();
        let income = 0;
        let expense = 0;
        for (const t of inBase) {
          if (t.type === "income") income += t.amount;
          if (t.type !== "expense") continue;
          expense += t.amount;
          const key = t.categoryId ?? "";
          spent.set(key, (spent.get(key) ?? 0) + t.amount);
        }
        const name = (id: string) => ledger.categories.find((c) => c.id === id)?.name ?? "Uncategorized";
        return {
          month: m,
          currency: ledger.baseCurrency,
          income: cents(income),
          expense: cents(expense),
          net: cents(income - expense),
          count: ledger.transactions.length,
          ...(inBase.length < ledger.transactions.length && {
            leftOut: `${ledger.transactions.length - inBase.length} transactions have no exchange rate right now.`,
          }),
          spendingByCategory: [...spent].sort((a, b) => b[1] - a[1]).map(([id, total]) => ({ categoryId: id || null, name: name(id), total: cents(total) })),
          budgets: ledger.budgets.map((b) => {
            const used = inBase
              .filter((t) => t.type === "expense" && (b.categoryIds.length === 0 || (!!t.categoryId && b.categoryIds.includes(t.categoryId))))
              .reduce((sum, t) => sum + t.amount, 0);
            return { name: b.name, limit: b.amount, spent: cents(used), left: cents(b.amount - used) };
          }),
        };
      }),
  );

  if (!canWrite) return server;
  const via = props.clientName.replace(/\s+/g, " ").slice(0, 40) || "an agent";

  server.registerTool(
    "add_transaction",
    {
      description: "Record an expense, income, or transfer. It appears on the user's phone within a minute.",
      inputSchema: z.object({
        type: z.enum(["expense", "income", "transfer"]),
        amount: z.number().positive().describe("Always positive; type gives the direction."),
        accountId: z.string().describe("Account the money leaves (expense, transfer) or enters (income)."),
        toAccountId: z.string().optional().describe("Transfers only: the account the money enters."),
        toAmount: TO_AMOUNT,
        categoryId: z.string().optional().describe("Expenses and income only; must match the type."),
        title: z.string().max(200).optional().describe("Short label, such as the merchant."),
        note: z.string().max(2000).optional(),
        date: LOCAL_DATE.optional().describe("Defaults to now in the user's time zone."),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
    },
    (input) =>
      run(async () => {
        const tx = await addTransaction(gh, repo, { ...input, timeZone }, via);
        return { added: withoutPath(tx) };
      }),
  );

  server.registerTool(
    "update_transaction",
    {
      description: "Change fields of an existing transaction by id. Omitted fields stay as they are.",
      inputSchema: z.object({
        id: z.string(),
        type: z.enum(["expense", "income", "transfer"]).optional(),
        amount: z.number().positive().optional(),
        accountId: z.string().optional(),
        toAccountId: z.string().optional(),
        toAmount: TO_AMOUNT,
        categoryId: z.string().optional(),
        title: z.string().max(200).optional(),
        note: z.string().max(2000).optional(),
        date: LOCAL_DATE.optional(),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    },
    ({ id, ...patch }) =>
      run(async () => {
        const tx = await updateTransaction(gh, repo, id, patch, via);
        return { updated: withoutPath(tx) };
      }),
  );

  return server;
}

function view(t: Stored<Transaction>, ledger: Ledger) {
  const account = (id?: string) => ledger.accounts.find((a) => a.id === id)?.name;
  return {
    id: t.id,
    date: t.date,
    type: t.type,
    amount: t.amount,
    currency: ledger.accounts.find((a) => a.id === t.accountId)?.currency,
    toAmount: t.toAmount,
    title: t.title,
    note: t.note || undefined,
    category: ledger.categories.find((c) => c.id === t.categoryId)?.name,
    account: account(t.accountId),
    toAccount: account(t.toAccountId),
  };
}

/** Today's rates for the main currency; null when every account uses it or no rate source answers. */
async function ratesFor(ledger: Ledger): Promise<Rates | null> {
  if (ledger.accounts.every((a) => a.currency === ledger.baseCurrency)) return null;
  // The rates change once a day, so Cloudflare's cache answers most calls without leaving the edge.
  const cached: typeof fetch = (input, init) => fetch(input, { ...init, cf: { cacheTtl: 6 * 60 * 60, cacheEverything: true } });
  return fetchRates(ledger.baseCurrency, cached).catch(() => null);
}

const cents = (n: number) => Math.round(n * 100) / 100;

function withoutPath<T extends { path: string }>({ path: _path, ...rest }: T) {
  return rest;
}

/** The result as JSON text; problems the agent can act on come back as tool errors, not failures. */
async function run(fn: () => Promise<unknown>): Promise<CallToolResult> {
  try {
    return { content: [{ type: "text", text: JSON.stringify(await fn(), null, 2) }] };
  } catch (error) {
    if (error instanceof LedgerError) return { isError: true, content: [{ type: "text", text: error.message }] };
    if (error instanceof GitHubError && (error.status === 401 || error.status === 403 || error.status === 404)) {
      return {
        isError: true,
        content: [{ type: "text", text: `GitHub refused access to the repository (${error.status}: ${error.message}). The user may have uninstalled the YAFT GitHub App from it; connecting again fixes that.` }],
      };
    }
    throw error;
  }
}
