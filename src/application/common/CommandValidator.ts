import type { Command } from "./Command.js";
import type { BrokenRule } from "../../domain/common/validation/Validator.js";
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

  /**
   * Every rule `command` breaks, in the order the rules are declared, each with
   * the fields of the command it reads. Those are the command's own fields even
   * where a rule was written for something smaller the command carries in one
   * of them, so that whoever shows a rule knows which field it is about.
   */
  abstract validate(command: TCommand): readonly BrokenRule[];
}
