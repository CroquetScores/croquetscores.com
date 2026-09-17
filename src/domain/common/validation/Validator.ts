import { ValidationError } from "./ValidationError.js";

/**
 * What a rule may call a field of the candidate.
 *
 * A candidate with fields names them, so a rule naming one that does not exist
 * does not compile. That matters because nothing else would notice: a rule
 * reading several fields that misspells one simply never hears it is broken,
 * and complains a second time about the same mistake. A candidate that is a
 * single value, such as a string, has one field and nothing to misspell it
 * against, so any name will do.
 *
 * A candidate that may be missing altogether is judged by what it is when it
 * is there. Asking of T itself would ask of each possibility separately, and
 * the missing one would let any name through for all of them.
 */
export type FieldName<T> =
  NonNullable<T> extends object ? keyof NonNullable<T> & string : string;

/**
 * A rule that reads a single field of a candidate.
 *
 * Every rule is asked about every candidate, including one that has already
 * broken an earlier rule on the same field, so it must answer for anything the
 * candidate might hold — a missing field included.
 */
export interface FieldRule<T, TCode extends string = string> {
  /** The field it reads, so that rules reading several fields know it is broken. */
  readonly field: FieldName<T>;
  readonly code: TCode;
  isBrokenBy(candidate: T): boolean;
}

/** A rule that reads several fields, and so needs each of them to be valid. */
export interface SpanningRule<T, TCode extends string = string> {
  readonly reads: readonly FieldName<T>[];
  readonly code: TCode;
  isBrokenBy(candidate: T): boolean;
}

export interface Rules<T, TCode extends string = string> {
  readonly fields: readonly FieldRule<T, TCode>[];
  readonly spanning?: readonly SpanningRule<T, TCode>[] | undefined;
}

/**
 * Holds the rules for one kind of value, once, and answers the two questions
 * asked of them.
 *
 * Checking reports every rule broken, because somebody who typed the candidate
 * is owed the whole list. Requiring a candidate to be valid refuses on the
 * first, because by then an invalid candidate is a defect in the calling code.
 * Both ask the same rules, so they cannot disagree about what is valid.
 *
 * The order the rules are declared in is the order the codes come back in, and
 * so which code a refusal names. That order is part of the contract.
 */
export class Validator<T, TCode extends string = string> {
  readonly #fields: readonly FieldRule<T, TCode>[];
  readonly #spanning: readonly SpanningRule<T, TCode>[];

  constructor(rules: Rules<T, TCode>) {
    this.#fields = rules.fields;
    this.#spanning = rules.spanning ?? [];
  }

  /** Every code the candidate breaks, in rule order. Empty means it is valid. */
  check(candidate: T): TCode[] {
    const codes: TCode[] = [];
    const brokenFields = new Set<FieldName<T>>();

    for (const rule of this.#fields) {
      if (rule.isBrokenBy(candidate)) {
        codes.push(rule.code);
        brokenFields.add(rule.field);
      }
    }

    for (const rule of this.#spanning) {
      // Comparing a field that is already wrong can only complain a second time
      // about the same mistake, and point whoever reads it at the wrong field.
      if (rule.reads.some((field) => brokenFields.has(field))) continue;
      if (rule.isBrokenBy(candidate)) codes.push(rule.code);
    }

    return codes;
  }

  /**
   * Throws {@link ValidationError} naming the first rule the candidate breaks.
   *
   * It stops at that rule rather than asking {@link check} for the whole list
   * and keeping one of it. This is what every value made from a candidate goes
   * through, almost always with a candidate that breaks nothing, and the list
   * and the record of broken fields were being built each time to be thrown
   * away. The answer is the same: the first code checking reports is the first
   * field rule broken, and when no field rule is broken nothing keeps a rule
   * reading several fields quiet, so the first of those broken is next.
   */
  ensureValid(candidate: T): void {
    for (const rule of this.#fields) {
      if (rule.isBrokenBy(candidate))
        throw new ValidationError<TCode>(rule.code);
    }
    for (const rule of this.#spanning) {
      if (rule.isBrokenBy(candidate))
        throw new ValidationError<TCode>(rule.code);
    }
  }
}
