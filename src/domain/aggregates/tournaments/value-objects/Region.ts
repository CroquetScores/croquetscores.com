import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a region can break. */
export type RegionErrorCode =
  "Region.CodeMissing" | "Region.NotLettersOrDigits" | "Region.NameMissing";

interface Candidate {
  readonly code: string;
  readonly name: string;
}

// Letters of any alphabet, since the old site made its codes from the regions'
// own names, "cór" and "únlr" among them.
const lettersAndDigits = /^[\p{L}\p{Nd}]+$/u;

const regions = new Validator<Candidate, RegionErrorCode>({
  fields: [
    {
      field: "code",
      code: "Region.CodeMissing",
      isBrokenBy: ({ code }) => code === "",
    },
    {
      field: "code",
      code: "Region.NotLettersOrDigits",
      isBrokenBy: ({ code }) => code !== "" && !lettersAndDigits.test(code),
    },
    {
      field: "name",
      code: "Region.NameMissing",
      isBrokenBy: ({ name }) => name === "",
    },
  ],
});

/**
 * `code` as the region code somebody meant: without whitespace at either end,
 * with any accent typed after its letter joined to it, and in lower case. So a
 * country finds a region by a code written the way the region keeps it.
 */
export const asRegionCode = (code: string): string =>
  code.trim().normalize("NFC").toLowerCase();

/**
 * A region of a country a tournament is played in: known by its code within
 * its country, and shown by its name.
 *
 * It says nothing of which country it is in, since which regions a country has
 * is the country's to say, and two countries can each have a region with the
 * same code.
 */
export class Region {
  readonly #code: string;
  readonly #name: string;

  private constructor(code: string, name: string) {
    this.#code = code;
    this.#name = name;
  }

  /**
   * The region coded `code`, taken as the code that was meant, and called
   * `name` less any whitespace at either end. Throws {@link ValidationError}
   * naming the first rule it breaks.
   */
  static from(code: string, name: string): Region {
    const candidate = { code: asRegionCode(code), name: name.trim() };
    regions.ensureValid(candidate);
    return new Region(candidate.code, candidate.name);
  }

  /** How it is known within its country: the code the old site gave it. */
  get code(): string {
    return this.#code;
  }

  /** What a reader calls it. */
  get name(): string {
    return this.#name;
  }

  toString(): string {
    return this.#name;
  }
}
