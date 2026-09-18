import type { Command } from "./Command.js";
import type { RequestType } from "./Mediator.js";

/**
 * The rules for what one kind of command may carry.
 *
 * It names the kind of command it validates, so registering it with the
 * validation behaviour needs nothing but the validator, and it is never asked
 * about any command but the one it says. Which rules there are, and the order
 * the broken ones come back in, are its own.
 */
export abstract class CommandValidator<TCommand extends Command<unknown>> {
  /** The kind of command this validates. */
  abstract readonly validates: RequestType<TCommand>;

  /** Every rule `command` breaks, in the order the rules are declared. */
  abstract validate(command: TCommand): readonly string[];
}
