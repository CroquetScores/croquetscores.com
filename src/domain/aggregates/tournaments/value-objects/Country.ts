import { Validator } from "../../../common/validation/Validator.js";
import type { Flag } from "./Flag.js";

/** Every rule a country can break, besides those of its flag. */
export type CountryErrorCode = "Country.NameMissing";

// Nothing is asked of a name but that there is one. The names of countries are
// not a shape rules can be written for.
const names = new Validator<string, CountryErrorCode>({
  fields: [
    {
      field: "name",
      code: "Country.NameMissing",
      isBrokenBy: (given) => given === "",
    },
  ],
});

/**
 * A country a tournament is played in, or a player plays for: known by its
 * code, and shown by its name and its flag.
 *
 * It is made from its flag rather than from a code, and its code is its flag's
 * name, so there is no code for a country to have that its flag does not.
 */
export class Country {
  readonly #flag: Flag;
  readonly #name: string;

  private constructor(flag: Flag, name: string) {
    this.#flag = flag;
    this.#name = name;
  }

  /**
   * The country whose flag is `flag`, called `name` less any whitespace at
   * either end. Throws {@link ValidationError} naming the first rule it breaks.
   */
  static from(flag: Flag, name: string): Country {
    const trimmed = name.trim();
    names.ensureValid(trimmed);
    return new Country(flag, trimmed);
  }

  /** Its code, which is its flag's name, and how it is known. */
  get code(): string {
    return String(this.#flag);
  }

  get flag(): Flag {
    return this.#flag;
  }

  /** What a reader calls it, in English. */
  get name(): string {
    return this.#name;
  }

  /** Two countries are the same when their codes are, whatever their names. */
  equals(other: Country | undefined): boolean {
    return other instanceof Country && this.code === other.code;
  }

  toString(): string {
    return this.#name;
  }
}
