import { Validator } from "./validation/Validator.js";

/** Every rule a written slug can break. */
export type SlugErrorCode = "Slug.Empty" | "Slug.Malformed";

// The accents written over and under letters in the Latin, Greek and Cyrillic
// scripts. Only these are taken off: a mark in another script, such as a vowel
// sign in Devanagari, is part of the letter rather than decoration on it, and
// taking it off would spell a different word.
const ACCENTS = /[̀-ͯ]/g;

// Anything that is not part of a letter or a digit, in any script.
const NEITHER_LETTER_NOR_DIGIT = /[^\p{L}\p{M}\p{N}]+/u;

// Taken apart first, so that an accent is a mark of its own that can be taken
// off and a ligature or a full-width letter is the plain letters it stands
// for, and put back together last, so that a letter the taking apart split in
// two, as it does a Korean syllable, is one letter again.
const slugOf = (name: string): string =>
  name
    .normalize("NFKD")
    .replace(ACCENTS, "")
    .toLowerCase()
    .split(NEITHER_LETTER_NOR_DIGIT)
    .filter((part) => part !== "")
    .join("-")
    .normalize("NFC");

// A writing is a slug when making a slug from it gives it back. So what is read
// is only ever what making one would have given, and there is one statement of
// what a slug looks like rather than a second that could come to disagree.
const writings = new Validator<string, SlugErrorCode>({
  fields: [
    {
      field: "written",
      code: "Slug.Empty",
      isBrokenBy: (written) => written === "",
    },
    {
      field: "written",
      code: "Slug.Malformed",
      isBrokenBy: (written) => written !== "" && slugOf(written) !== written,
    },
  ],
});

/**
 * The part of an address that names one thing, made from its name.
 *
 * A slug is kept once it is made rather than made again from the name each
 * time it is wanted, so that a thing whose name is corrected is still found
 * where it was. Whether a slug is taken already is for whatever it names to
 * ask, since a slug does not know what else there is.
 */
export class Slug {
  readonly #written: string;

  private constructor(written: string) {
    this.#written = written;
  }

  /**
   * The slug made from `name`. Throws {@link ValidationError} as
   * `Slug.Empty` when the name has no letter or digit in it.
   */
  static fromName(name: string): Slug {
    return Slug.from(slugOf(name));
  }

  /**
   * The slug written as `written`. Throws {@link ValidationError} naming the
   * first rule it breaks.
   */
  static from(written: string): Slug {
    writings.ensureValid(written);
    return new Slug(written);
  }

  equals(other: Slug | undefined): boolean {
    return other instanceof Slug && this.#written === other.#written;
  }

  toString(): string {
    return this.#written;
  }
}
