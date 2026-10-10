import { ImportRefused } from "./ImportRefused.js";

/** What "npm run import:ravendb" is run with (importArguments.feature). */
export interface ImportArguments {
  /**
   * Stop once this many errors are kept (runImporter.feature). Nothing where
   * the import is to be read to its end.
   */
  readonly stopAfterErrors: number | undefined;
}

const STOP_AFTER_ERRORS = "--stop-after-errors";

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

/**
 * The switches the import was run with, `given` in the order they were,
 * after "--" as npm needs. A switch the import does not have, one with no
 * count, a count that is not a whole number of 1 or more, and one given
 * twice are refused (importArguments.feature).
 */
export const readImportArguments = (
  given: readonly string[],
): ImportArguments => {
  let stopAfterErrors: number | undefined;
  for (let at = 0; at < given.length; at += 1) {
    const word = given[at] ?? "";
    const [switchName, joined] = word.split(/=(.*)/s, 2);
    if (switchName !== STOP_AFTER_ERRORS) {
      throw new ImportRefused(
        "ImportArguments.UnknownSwitch",
        `${word} is not a switch of the import's. It has ${STOP_AFTER_ERRORS} {count}.`,
      );
    }
    if (stopAfterErrors !== undefined) {
      throw new ImportRefused(
        "ImportArguments.GivenTwice",
        `${STOP_AFTER_ERRORS} was given more than once.`,
      );
    }
    // Joined by an equals sign, or the word that follows.
    if (joined === undefined) at += 1;
    stopAfterErrors = readCount(joined ?? given[at] ?? "");
  }
  return { stopAfterErrors };
};
