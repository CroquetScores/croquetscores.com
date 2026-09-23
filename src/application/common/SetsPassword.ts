// What a command says about the password it sets, and where the hash of that
// password is put on its way in.
//
// Two of the behaviours standing in front of the transaction read this saying:
// the one that asks whether the password has been breached, and the one that
// hashes it. It is held here rather than in either of them so that a command
// says it once and both read the same words, and so that neither behaviour has
// to import the other to find out what a command said.

/**
 * A command that sets a password, which of its fields holds it, and where the
 * hash of it goes.
 *
 * Saying so is the command's because only the command knows what it is doing
 * with the password it carries: signing in carries one too, and neither asking
 * about that one nor hashing it is wanted. A command that sets none says
 * nothing, and one that sets a password only sometimes says nothing when it
 * does not.
 */
export interface SetsPassword {
  readonly passwordField: string | undefined;
  readonly passwordHash: PasswordHash;
}

/** The password a command sets, and the field it came in. */
export interface PasswordSet {
  readonly field: string;
  readonly password: string;
}

/**
 * Where the hash of the password a command sets is put on its way in, and
 * where its handler reads it.
 *
 * A command is otherwise everything it was made with, held where nothing can
 * move it. The hash cannot be given at the making: it is not known then, and
 * making it is the very thing being kept out of the transaction. So a command
 * that sets a password carries a place for one instead, filled once in front
 * of the transaction and read inside it.
 */
export class PasswordHash {
  #made: string | undefined;

  /**
   * Puts the hash there. A second is refused rather than kept, because one
   * command sets one password: two hashes of it mean something in front of the
   * transaction ran twice, and the handler would be taking whichever of them
   * happened to be last.
   */
  put(hash: string): void {
    if (this.#made !== undefined) {
      throw new Error(
        "The password this command sets has been hashed already, and one command sets one password.",
      );
    }
    this.#made = hash;
  }

  /**
   * The hash. Throws when nothing has put one there, which is a command that
   * reached its handler with nothing in front of it to hash what it sets: a
   * mistake in how the application was put together, rather than anything to
   * tell whoever sent the command.
   */
  get made(): string {
    if (this.#made === undefined) {
      throw new Error(
        "Nothing hashed the password this command sets before its handler was given it.",
      );
    }
    return this.#made;
  }
}

const nameOf = (request: object): string =>
  request.constructor.name || "A command";

/**
 * The password `request` says it sets, or nothing where it sets none.
 *
 * Handed back as it will be kept, which is with the whitespace at either end
 * taken off: a password is trimmed wherever one is made from what a command
 * carries. Trimmed here rather than by making the password out of what the
 * command carries, because what a password may be is the password's own rule
 * and has been asked in front of this; all either reader needs is the words
 * that will be hashed.
 */
export const passwordSetBy = (request: object): PasswordSet | undefined => {
  const field = (request as Partial<SetsPassword>).passwordField;
  if (typeof field !== "string") return undefined;

  const given = (request as unknown as Record<string, unknown>)[field];
  // A command that says which field holds the password it sets, and holds no
  // password there, is a mistake in the code that made it rather than anything
  // to tell whoever sent it: what it says of itself and what it carries
  // disagree, and passing it on would set a password from nothing.
  if (typeof given !== "string") {
    throw new Error(
      `${nameOf(request)} says it sets a password from ${field}, which holds no password.`,
    );
  }
  return { field, password: given.trim() };
};

/**
 * Where the hash of the password `request` sets goes. A command that says it
 * sets a password and carries nowhere to put the hash of it is the same
 * mistake as one whose field holds no password: it could never be handled,
 * since its handler has no hash to set a password from.
 */
export const hashOfPasswordSetBy = (request: object): PasswordHash => {
  const hash = (request as Partial<SetsPassword>).passwordHash;
  if (!(hash instanceof PasswordHash)) {
    throw new Error(
      `${nameOf(request)} says it sets a password and carries nowhere to put the hash of it.`,
    );
  }
  return hash;
};
