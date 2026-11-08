// Running a script in the page with values it is handed, rather than values
// spliced into its text.
//
// Playwright evaluates a string and does not call it, even when the string is
// a function, so `evaluate("({ selector }) => ...", { selector })` hands the
// page nothing and gets nothing back. A function written in the spec would be
// called with its argument, but the specs are typed without the browser's own
// types, so it cannot name `document`. So the values are put on the page first,
// by a function that needs no browser types, and the script reads them from
// there. They reach the page as data and are never part of the script.
import type { Page } from "playwright";

/** Where the values wait for the script to read them. */
const where = "specArguments";

/**
 * Hands `given` to the page, then evaluates `script`, which reads it as
 * `globalThis.specArguments`. Every script that uses this writes out the call
 * itself, as `(({ a, b }) => ...)(globalThis.specArguments)`.
 */
export const evaluateWith = async <T>(
  page: Page,
  script: string,
  given: unknown,
): Promise<T> => {
  await page.evaluate(
    ([name, value]) => {
      Reflect.set(globalThis, name as string, value);
    },
    [where, given],
  );
  return page.evaluate<T>(script);
};
