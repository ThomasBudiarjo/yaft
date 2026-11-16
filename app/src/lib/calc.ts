export type Op = '+' | '−' | '×' | '÷';
export const OPS: Op[] = ['÷', '×', '−', '+'];

/**
 * Evaluates what the keypad typed, such as "12000+8500×2", with × and ÷ before + and −.
 * A trailing operator is ignored so the total shows while the user is still typing.
 */
export function evaluate(expression: string): number | null {
  const tokens = expression.match(/\d*\.?\d+|\d+\.|[+−×÷]/g);
  if (!tokens) return null;
  if (OPS.includes(tokens[tokens.length - 1] as Op)) tokens.pop();
  if (tokens.length === 0 || OPS.includes(tokens[0] as Op)) return null;

  const terms: number[] = [Number(tokens[0])];
  const signs: ('+' | '−')[] = [];
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i] as Op;
    const n = Number(tokens[i + 1]);
    if (op === '×') terms[terms.length - 1] *= n;
    else if (op === '÷') terms[terms.length - 1] = n === 0 ? NaN : terms[terms.length - 1] / n;
    else {
      signs.push(op);
      terms.push(n);
    }
  }
  let total = terms[0];
  signs.forEach((op, i) => (total = op === '+' ? total + terms[i + 1] : total - terms[i + 1]));
  return Number.isFinite(total) ? Math.round(total * 100) / 100 : null;
}

/** The next expression after pressing a key, or the same one when the key is not allowed there. */
export function press(expression: string, key: string): string {
  if (key === '⌫') return expression.slice(0, -1);
  const last = expression.slice(-1);
  if (OPS.includes(key as Op)) {
    if (!expression) return expression;
    return OPS.includes(last as Op) ? expression.slice(0, -1) + key : expression + key;
  }
  const number = expression.split(/[+−×÷]/).pop() ?? '';
  if (key === '.') return number.includes('.') ? expression : expression + (number ? '.' : '0.');
  if (key === '000') return number && !/^0+$/.test(number) ? expression + '000' : expression;
  if (number === '0') return expression.slice(0, -1) + key;
  if (number.split('.')[1]?.length >= 2) return expression;
  return expression + key;
}

export const hasOperator = (expression: string) => /\d[+−×÷]\d/.test(expression);

/**
 * A number typed into a text field, in either style: "21274464.65", "21,274,464.65", or the
 * Indonesian "21.274.464,65". A lone separator followed by exactly three digits groups thousands
 * ("1.000"), unless the number starts with 0 ("0,125"); otherwise the last separator is the
 * decimal point. Null for anything else.
 */
export function parseAmount(text: string): number | null {
  const cleaned = text.replace(/[\s\u00a0]/g, '');
  if (!/^-?[\d.,]*\d[\d.,]*$/.test(cleaned)) return null;
  const last = Math.max(cleaned.lastIndexOf('.'), cleaned.lastIndexOf(','));
  const decimals = last >= 0 ? cleaned.length - last - 1 : 0;
  const separators = cleaned.match(/[.,]/g) ?? [];
  const leadingZero = /^-?0$/.test(cleaned.slice(0, last));
  const isDecimal = decimals > 0 && (decimals !== 3 || new Set(separators).size > 1 || leadingZero);
  const whole = (isDecimal ? cleaned.slice(0, last) : cleaned).replace(/[.,]/g, '');
  const n = Number(isDecimal ? `${whole}.${cleaned.slice(last + 1)}` : whole);
  return Number.isFinite(n) ? n : null;
}
