import { ImportRefused } from "./ImportRefused.js";

/** What "npm run import:ravendb" is run with (importArguments.feature). */
export interface ImportArguments {
  /**
   * Stop once this many errors are kept (runImporter.feature). Nothing where
   * the import is to be read to its end.
   */
  readonly stopAfterErrors: number | undefined;
  /**
   * Bring over only the tournaments that started on this day or after it, as
   * year-month-day (ImportWholeTournaments.feature). Nothing where there is
   * no first day.
   */
  readonly from: string | undefined;
  /** The last day a tournament started on to be brought over, as above. */
  readonly to: string | undefined;
}

const STOP_AFTER_ERRORS = "--stop-after-errors";
const FROM = "--from";
const TO = "--to";

// A whole number of 1 or more, as digits and nothing else: no sign, point or
// exponent, which Number would take.
const readCount = (given: string): number => {
  if (given === "") {
    throw new ImportRefused(
      "ImportArguments.NoCount",
      `${STOP_AFTER_ERRORS} needs a count of errors to stop after.`,
    );
  }
  const count = /^\d+$/.test(given) ? Number(given) : 0;
  if (!Number.isSafeInteger(count) || count < 1) {
    throw new ImportRefused(
      "ImportArguments.NotACount",
      `${STOP_AFTER_ERRORS} needs a whole number of 1 or more, not "${given}".`,
    );
  }
  return count;
};

// A day of the calendar, written as four digits, two and two with hyphens
// between and nothing else. A Date is asked whether it is one, since it moves
// the 30th of February to March rather than refusing it.
const readDay = (switchName: string, given: string): string => {
  if (given === "") {
    throw new ImportRefused(
      "ImportArguments.NoDay",
      `${switchName} needs a day, written as 2026-03-01.`,
    );
  }
  const when = new Date(`${given}T00:00:00Z`);
  // A month of 13 is no time at all, which toISOString throws for.
  const real =
    /^\d{4}-\d{2}-\d{2}$/.test(given) &&
    !Number.isNaN(when.getTime()) &&
    when.toISOString().startsWith(given);
  if (!real) {
    throw new ImportRefused(
      "ImportArguments.NotADay",
      `${switchName} needs a day, written as 2026-03-01, not "${given}".`,
    );
  }
  return given;
};

/**
 * The switches the import was run with, `given` in the order they were,
 * after "--" as npm needs. A switch the import does not have, one with no
 * count or day, a count that is not a whole number of 1 or more, a day that
 * is not a day of the calendar, one given twice, and a first day after the
 * last are refused (importArguments.feature).
 */
export const readImportArguments = (
  given: readonly string[],
): ImportArguments => {
  let stopAfterErrors: number | undefined;
  let from: string | undefined;
  let to: string | undefined;
  for (let at = 0; at < given.length; at += 1) {
    const word = given[at] ?? "";
    const [switchName, joined] = word.split(/=(.*)/s, 2);
    if (
      switchName !== STOP_AFTER_ERRORS &&
      switchName !== FROM &&
      switchName !== TO
    ) {
      throw new ImportRefused(
        "ImportArguments.UnknownSwitch",
        `${word} is not a switch of the import's. It has ${STOP_AFTER_ERRORS} {count}, ${FROM} {day} and ${TO} {day}.`,
      );
    }
    const alreadyGiven =
      switchName === STOP_AFTER_ERRORS
        ? stopAfterErrors !== undefined
        : switchName === FROM
          ? from !== undefined
          : to !== undefined;
    if (alreadyGiven) {
      throw new ImportRefused(
        "ImportArguments.GivenTwice",
        `${switchName} was given more than once.`,
      );
    }
    // Joined by an equals sign, or the word that follows.
    if (joined === undefined) at += 1;
    const value = joined ?? given[at] ?? "";
    if (switchName === STOP_AFTER_ERRORS) stopAfterErrors = readCount(value);
    else if (switchName === FROM) from = readDay(FROM, value);
    else to = readDay(TO, value);
  }
  // Written year-month-day, so that the one that is less in text is the
  // earlier day.
  if (from !== undefined && to !== undefined && from > to) {
    throw new ImportRefused(
      "ImportArguments.DaysBackwards",
      `${FROM} ${from} is after ${TO} ${to}, so no tournament could start between them.`,
    );
  }
  return { stopAfterErrors, from, to };
};
