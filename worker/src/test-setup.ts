// Node runs the tests; the OAuth provider imports the Workers runtime only for a base class.
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, next) {
    if (specifier !== "cloudflare:workers") return next(specifier, context);
    return { url: "data:text/javascript,export class WorkerEntrypoint {}", shortCircuit: true };
  },
});
