// Node runs the tests; stand in for Workers' entrypoint base classes.
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, next) {
    if (specifier !== "cloudflare:workers") return next(specifier, context);
    return { url: "data:text/javascript,export class WorkerEntrypoint {}; export class DurableObject { constructor(ctx, env) { this.ctx = ctx; this.env = env; } }", shortCircuit: true };
  },
});
