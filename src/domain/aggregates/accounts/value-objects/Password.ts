import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a password can break. */
export type PasswordErrorCode = "Password.Missing" | "Password.TooShort";

// NIST asks for at least 8, and 15 where a password is all there is. The site
// asks for more than NIST's least, as Password.feature says.
const FEWEST_CHARACTERS = 12;

// Characters as a reader counts them, as a name's are, so that a password is
// not refused for how its keyboard spelled an accented letter.
const graphemes = new Intl.Segmenter();
const charactersIn = (text: string): number =>
  [...graphemes.segment(text)].length;

// Nothing is asked of which kinds of character a password has. Rules like that
// make a password harder to remember without making it harder to guess.
const passwords = new Validator<string, PasswordErrorCode>({
  fields: [
    {
      field: "password",
      code: "Password.Missing",
      isBrokenBy: (given) => given === "",
    },
    {
      field: "password",
      code: "Password.TooShort",
      isBrokenBy: (given) =>
        given !== "" && charactersIn(given) < FEWEST_CHARACTERS,
    },
  ],
});

// How Node asks an object to describe itself. Named by the well-known key
// rather than by importing node:util, so nothing in the domain depends on Node.
const INSPECT: unique symbol = Symbol.for(
  "nodejs.util.inspect.custom",
) as never;

const HIDDEN = "[password]";

/**
 * A password, held only long enough to be checked and hashed.
 *
 * Anything that writes it out — a log line, an error's message, JSON sent
 * somewhere — gets a placeholder rather than the password, so that a password
 * passed to something that writes its arguments down is not written down with
 * them. Its words are handed out only by {@link Password.reveal}, asked for by
 * name, which is where a hasher asks.
 */
export class Password {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * The password `given`, less any whitespace at either end. Throws
   * {@link ValidationError} naming the first rule it breaks; the refusal names
   * the rule and never the password.
   */
  static from(given: string): Password {
    // Every form trims a password as it is typed. It is trimmed again here so
    // that one reaching a hasher any other way is the same password, and not
    // one a reader could never type again.
    const trimmed = given.trim();
    passwords.ensureValid(trimmed);
    return new Password(trimmed);
  }

  /** The password itself, for hashing or checking against a hash. */
  reveal(): string {
    return this.#given;
  }

  toString(): string {
    return HIDDEN;
  }

  toJSON(): string {
    return HIDDEN;
  }

  [INSPECT](): string {
    return HIDDEN;
  }
}
