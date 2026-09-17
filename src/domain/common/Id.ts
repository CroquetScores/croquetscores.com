import { Validator } from "./validation/Validator.js";

/** Every rule a written id can break. */
export type IdErrorCode = "Id.WrongKind" | "Id.Malformed";

// The plain form of a uuid: lowercase hex and hyphens, and nothing else. An
// id is compared as text, so a copy in capitals would be a different id from
// the one it was copied from, and is refused rather than quietly lowercased.
const PLAIN_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

interface Writing {
  /** The kind and its slash, as every id of the kind begins. */
  readonly prefix: string;
  readonly written: unknown;
}

// A writing comes from a database column, a URL or a log line, and what is
// there is not always a string. That is a writing of no kind at all rather
// than a crash, so the first rule asks before anything reads it as text.
const writings = new Validator<Writing, IdErrorCode>({
  fields: [
    {
      field: "written",
      code: "Id.WrongKind",
      isBrokenBy: ({ prefix, written }) =>
        typeof written !== "string" || !written.startsWith(prefix),
    },
    {
      field: "written",
      code: "Id.Malformed",
      isBrokenBy: ({ prefix, written }) =>
        typeof written === "string" &&
        written.startsWith(prefix) &&
        !PLAIN_UUID.test(written.slice(prefix.length)),
    },
  ],
});

/**
 * What a thing that lasts is known by.
 *
 * An id is written as the kind of thing, a slash, then a uuid in its plain
 * form. The kind is there so that an account's id can never be mistaken for
 * a tournament's, and the form is one that needs no quoting or escaping
 * anywhere it goes and compares as plain text.
 *
 * The uuid is random rather than drawn from the time. Nothing in the domain
 * reads a clock, and an id drawn from one would be the first thing that did.
 * It comes from the platform's own generator, which every runtime provides
 * without anything being imported.
 *
 * Each kind of id is a class of its own, so that the type says what a value
 * names. A subclass gives its kind to {@link Id.mint} and {@link Id.read} and
 * hands what comes back to the constructor: minting and reading are separate
 * questions, and a constructor that did either depending on what it was given
 * would mint a new id whenever it was handed nothing by mistake.
 *
 * The value is held where nothing outside can reach it, so an id cannot be
 * altered after it is made and a subclass is free to have fields of its own.
 */
export abstract class Id {
  readonly #value: string;

  protected constructor(value: string) {
    this.#value = value;
  }

  /** The writing of a new id of the kind, unlike any minted before. */
  protected static mint(kind: string): string {
    return `${kind}/${globalThis.crypto.randomUUID()}`;
  }

  /**
   * The writing given, once it is known to be an id of the kind. Throws
   * {@link ValidationError} naming the first rule it breaks.
   */
  protected static read(kind: string, written: string): string {
    const writing: Writing = { prefix: `${kind}/`, written };
    writings.ensureValid(writing);
    return written;
  }

  get value(): string {
    return this.#value;
  }

  /** Two ids are the same when they are written the same. */
  equals(other: Id | undefined): boolean {
    return other instanceof Id && this.#value === other.#value;
  }

  toString(): string {
    return this.#value;
  }
}
