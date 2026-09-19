import { Validator } from "../../../common/validation/Validator.js";

/** Every rule an email address can break. */
export type EmailAddressErrorCode =
  | "EmailAddress.Missing"
  | "EmailAddress.NoAt"
  | "EmailAddress.MoreThanOneAt"
  | "EmailAddress.NothingBeforeAt"
  | "EmailAddress.NoDomain"
  | "EmailAddress.HasSpaces"
  | "EmailAddress.TooLong";

// The most any mail system will carry.
const MOST_CHARACTERS = 254;

const ats = (given: string): number => given.split("@").length - 1;

// Only asked of an address with exactly one @, so that each rule is about one
// thing: an address with none or two is refused for that, and not also for
// having no domain.
const domainOf = (given: string): string | undefined =>
  ats(given) === 1 ? given.slice(given.indexOf("@") + 1) : undefined;

// Checked by what an address must have rather than by a regular expression:
// each rule is one thing a reader can be told they got wrong, and a pattern
// that tried to be all of them at once could only say that something was.
const addresses = new Validator<string, EmailAddressErrorCode>({
  fields: [
    {
      field: "address",
      code: "EmailAddress.Missing",
      isBrokenBy: (given) => given === "",
    },
    {
      field: "address",
      code: "EmailAddress.NoAt",
      isBrokenBy: (given) => given !== "" && ats(given) === 0,
    },
    {
      field: "address",
      code: "EmailAddress.MoreThanOneAt",
      isBrokenBy: (given) => ats(given) > 1,
    },
    {
      field: "address",
      code: "EmailAddress.NothingBeforeAt",
      isBrokenBy: (given) => ats(given) === 1 && given.startsWith("@"),
    },
    {
      field: "address",
      code: "EmailAddress.NoDomain",
      isBrokenBy: (given) => {
        const domain = domainOf(given);
        if (domain === undefined) return false;
        const parts = domain.split(".");
        return parts.length < 2 || parts.some((part) => part === "");
      },
    },
    {
      field: "address",
      code: "EmailAddress.HasSpaces",
      isBrokenBy: (given) => /\s/.test(given),
    },
    {
      field: "address",
      code: "EmailAddress.TooLong",
      isBrokenBy: (given) => [...given].length > MOST_CHARACTERS,
    },
  ],
});

/**
 * An email address an account can be reached at, and found by.
 *
 * It is kept as it was given, trimmed, for writing to, and compared in lower case, so
 * that Someone@Example.com and someone@example.com are one address: mail
 * systems treat them so in practice, and a reader who registers as one and
 * signs in as the other is the same reader.
 */
export class EmailAddress {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * The address `given`, less any whitespace at either end. Throws
   * {@link ValidationError} naming the first rule it breaks.
   */
  static from(given: string): EmailAddress {
    // A space around an address is nobody's meaning, so it is taken off before
    // the rules are asked, and a space is refused only where it stays.
    const trimmed = given.trim();
    addresses.ensureValid(trimmed);
    return new EmailAddress(trimmed);
  }

  /** The address in the one form it is compared, and found, in. */
  get comparable(): string {
    return this.#given.toLowerCase();
  }

  /** Two addresses are the same when they differ, if at all, only in case. */
  equals(other: EmailAddress | undefined): boolean {
    return (
      other instanceof EmailAddress && this.comparable === other.comparable
    );
  }

  /** The address as it was given, trimmed, which is how it is written to. */
  toString(): string {
    return this.#given;
  }
}
