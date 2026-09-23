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
import { passwordSetBy } from "./SetsPassword.js";
import { RequestInvalid } from "./ValidationBehaviour.js";

export class BreachedPasswordBehaviour implements Behaviour {
  constructor(private readonly breached: BreachedPasswords) {}

  async invoke<TResult>(
    request: Command<TResult> | Query<TResult>,
    next: () => Promise<TResult>,
  ): Promise<TResult> {
    const set = passwordSetBy(request);
    if (set === undefined) return next();

    // A breached password is refused the way a password too short is refused,
    // because it is the same thing to whoever typed it: something wrong with
    // what they typed, told to them beside the field they typed it into. A
    // password nobody could check is neither allowed nor refused here, so the
    // check's own refusal is let out as it came, and what to do about it is
    // decided where the command was sent from.
    if (await this.breached.isBreached(set.password)) {
      throw new RequestInvalid(request, [
        { code: "Password.Breached", fields: [set.field] },
      ]);
    }
    return next();
  }
}
