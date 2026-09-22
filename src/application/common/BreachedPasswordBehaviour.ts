// Asks whether a command's password has been breached on its way in, and
// refuses one that has before anything behind this sees it — its transaction
// among them.
//
// Where the asking happens is the whole of this. A handler that asks for
// itself asks from inside the transaction its command is running in, and a
// transaction held open across a request to another site holds a database
// connection for as long as that site takes to answer. So the asking is done
// in front of the transaction instead, and it stands behind validation, so
// that a password breaking its own rules is refused without going near the
// network.
//
// It stands in the command's line alone, since nothing a query does sets a
// password.
import type { BreachedPasswords } from "../services/BreachedPasswords.js";
import type { Behaviour } from "./Behaviour.js";
import type { Command } from "./Command.js";
import type { Query } from "./Query.js";
import { RequestInvalid } from "./ValidationBehaviour.js";

/**
 * A command that sets a password, and which of its fields holds it.
 *
 * Saying so is the command's because only the command knows what it is doing
 * with the password it carries: signing in carries one too, and checking that
 * one would turn a breach into a reader locked out of the very account they
 * need to get into to change it. A command that sets none says nothing, and
 * one that sets a password only sometimes says nothing when it does not.
 */
export interface SetsPassword {
  readonly passwordField: string | undefined;
}

const fieldSet = (request: object): string | undefined => {
  const field = (request as Partial<SetsPassword>).passwordField;
  return typeof field === "string" ? field : undefined;
};

export class BreachedPasswordBehaviour implements Behaviour {
  constructor(private readonly breached: BreachedPasswords) {}

  async invoke<TResult>(
    request: Command<TResult> | Query<TResult>,
    next: () => Promise<TResult>,
  ): Promise<TResult> {
    const field = fieldSet(request);
    if (field === undefined) return next();

    const given = (request as unknown as Record<string, unknown>)[field];
    // A command that says which field holds the password it sets, and holds
    // no password there, is a mistake in the code that made it rather than
    // anything to tell whoever sent it: what it says of itself and what it
    // carries disagree, and passing it on would set a password from nothing.
    if (typeof given !== "string") {
      throw new Error(
        `${request.constructor.name || "A command"} says it sets a password from ${field}, which holds no password.`,
      );
    }

    // Asked about as it will be kept, which is with the whitespace at either
    // end taken off: a password is trimmed wherever one is made from what a
    // command carries. A breached password typed with a space after it would
    // otherwise be asked about as nobody will ever type it again, found clean,
    // and then kept as the breached password it is. Trimmed here rather than
    // by making the password out of what the command carries, because what a
    // password may be is the password's own rule and has been asked already;
    // all this needs is the words that will be hashed.
    const password = given.trim();

    // A breached password is refused the way a password too short is refused,
    // because it is the same thing to whoever typed it: something wrong with
    // what they typed, told to them beside the field they typed it into. A
    // password nobody could check is neither allowed nor refused here, so the
    // check's own refusal is let out as it came, and what to do about it is
    // decided where the command was sent from.
    if (await this.breached.isBreached(password)) {
      throw new RequestInvalid(request, [
        { code: "Password.Breached", fields: [field] },
      ]);
    }
    return next();
  }
}
