import type { Command } from "./Command.js";
import type { Query } from "./Query.js";

/**
 * Something every request of one kind passes through on its way to its handler:
 * logging, validation, a transaction.
 *
 * `next` is the rest of the way — the behaviours after this one, then the
 * handler. A behaviour that does not call it has answered the request itself.
 * One that does sees what comes back, or the failure, on the way out.
 */
export interface Behaviour {
  invoke<T>(request: Command<T> | Query<T>, next: () => Promise<T>): Promise<T>;
}
