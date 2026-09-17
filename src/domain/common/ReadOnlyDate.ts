import { ValidationError } from "./validation/ValidationError.js";

/** Every rule a moment can break. */
export type ReadOnlyDateErrorCode = "ReadOnlyDate.Unreadable";

// How Node asks an object to describe itself. Named by the well-known key
// rather than by importing node:util, so nothing in the domain depends on Node.
const INSPECT: unique symbol = Symbol.for(
  "nodejs.util.inspect.custom",
) as never;

/**
 * A moment that cannot be moved once it is known.
 *
 * The language's own Date can be set to another time by anything holding it,
 * and everything else holding the same one sees the change. An event stamped
 * with one could be re-stamped by whatever happened to hold it. This holds the
 * moment as a number nothing outside can reach, hands out a fresh Date each
 * time one is asked for, and writes itself in UTC so that one moment is
 * written one way wherever it was made.
 *
 * A private field is invisible to JSON and to console.log, so both are told
 * what to show: the moment, written, as a Date would be.
 */
export class ReadOnlyDate {
  readonly #time: number;

  private constructor(time: number) {
    this.#time = time;
  }

  /**
   * The moment `date` is at. Throws {@link ValidationError} when the date
   * cannot be read, because a moment nobody can say is not a moment.
   */
  static from(date: Date): ReadOnlyDate {
    const time = date.getTime();
    if (Number.isNaN(time)) {
      throw new ValidationError<ReadOnlyDateErrorCode>(
        "ReadOnlyDate.Unreadable",
      );
    }
    return new ReadOnlyDate(time);
  }

  /** A Date at this moment. Moving it moves nothing here. */
  toDate(): Date {
    return new Date(this.#time);
  }

  /** The moment written in UTC, as `2026-09-17T09:00:00.000Z`. */
  toISOString(): string {
    return this.toDate().toISOString();
  }

  equals(other: ReadOnlyDate | undefined): boolean {
    return other instanceof ReadOnlyDate && this.#time === other.#time;
  }

  toString(): string {
    return this.toISOString();
  }

  toJSON(): string {
    return this.toISOString();
  }

  [INSPECT](): string {
    return `ReadOnlyDate ${this.toISOString()}`;
  }
}
