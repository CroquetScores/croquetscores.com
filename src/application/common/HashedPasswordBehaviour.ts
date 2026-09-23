// Hashes the password a command sets on its way in, and hands the hash to the
// command so that its handler has one without making it.
//
// Where the hashing happens is the whole of this. A hash is slow to make on
// purpose — a slice of a second and a good deal of memory, so that whoever
// steals a table of hashes pays that for every guess — and a handler that
// hashes for itself pays it inside the transaction its command is running in,
// holding a pooled database connection doing nothing and the rows the command
// has touched locked for the whole of it. So the hash is made in front of the
// transaction instead, before a connection is borrowed.
//
// It stands behind validation, and behind the breached password check: the
// cost is worth paying only for a password that is going to be kept, and a
// hash of a password already known to have been breached is a thing that need
// never exist.
//
// It stands in the command's line alone, since nothing a query does sets a
// password.
import type { PasswordHasher } from "../services/PasswordHasher.js";
import type { Behaviour } from "./Behaviour.js";
import type { Command } from "./Command.js";
import type { Query } from "./Query.js";
import { hashOfPasswordSetBy, passwordSetBy } from "./SetsPassword.js";

export class HashedPasswordBehaviour implements Behaviour {
  constructor(private readonly passwords: PasswordHasher) {}

  async invoke<TResult>(
    request: Command<TResult> | Query<TResult>,
    next: () => Promise<TResult>,
  ): Promise<TResult> {
    const set = passwordSetBy(request);
    if (set === undefined) return next();

    // Where the hash goes is asked for before the hashing, so that a command
    // with nowhere to put one is told so without first paying for a hash
    // nobody can take.
    const hash = hashOfPasswordSetBy(request);
    hash.put(await this.passwords.hash(set.password));
    return next();
  }
}
