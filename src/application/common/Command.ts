import { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../domain/common/validation/ValidationError.js";

/** Every reason a command can be refused where it is made. */
export type CommandErrorCode =
  "Command.RequestedAtMissing" | "Command.RequestedByNotAnAccount";

/**
 * Something the application is asked to change.
 *
 * Every command says when it was asked for, and who asked if anybody signed in
 * did. Both are decided once, at the edge, and handed down: nothing below the
 * web layer reads a clock or wonders who is signed in.
 *
 * When is a read-only date rather than the language's own, which anything
 * holding the command could move, and who is an account's id read as one. A
 * command that cannot say when, or that names somebody with anything but an
 * account's id, is refused here, where it is made: that is a mistake in the code
 * making it, and by the time a command exists it can say both. Nobody asking is
 * allowed — registering and signing in are asked for by nobody signed in — and
 * then whoever caused its events is the handler's to say.
 *
 * Both are held where nothing outside can reach them. A behaviour that moved
 * either, between the command being checked and its events being stamped,
 * would leave one request recorded as two.
 *
 * `_result` is never set. It carries the type of what handling the command
 * answers, so that sending one is typed by what comes back.
 */
export abstract class Command<TResult> {
  declare readonly _result?: TResult;

  readonly #requestedAt: ReadOnlyDate;
  readonly #requestedBy: AccountId | undefined;

  protected constructor(requestedAt: ReadOnlyDate, requestedBy?: AccountId) {
    // The types say as much, and are checked here all the same, because a
    // command is made from what the edge was given, and the mistake this
    // catches — a plain date, an id left as text — is the one the types are
    // talked out of by whatever cast got it there.
    if (!(requestedAt instanceof ReadOnlyDate)) {
      throw new ValidationError<CommandErrorCode>("Command.RequestedAtMissing");
    }
    if (requestedBy !== undefined && !(requestedBy instanceof AccountId)) {
      throw new ValidationError<CommandErrorCode>(
        "Command.RequestedByNotAnAccount",
      );
    }
    this.#requestedAt = requestedAt;
    this.#requestedBy = requestedBy;
  }

  /** When it was asked for. */
  get requestedAt(): ReadOnlyDate {
    return this.#requestedAt;
  }

  /** Who asked for it, or nothing when nobody signed in did. */
  get requestedBy(): AccountId | undefined {
    return this.#requestedBy;
  }
}
