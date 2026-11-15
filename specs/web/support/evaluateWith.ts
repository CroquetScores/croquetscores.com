// Calls a function written out as text in the page, with an argument, and gives
// back what it returned. The text is written here and the argument is data:
// it is sent as JSON, which is a value in a script's own language, so what a
// scenario names, a selector or a title, is never read as code.
//
// Written out as text rather than as a function because the specs are not
// written against the browser's types, which have no `document` to name. It
// was once enough to hand Playwright the text and the argument; Playwright
// 1.65 no longer calls a function it is given as text, and says nothing: what
// comes back is undefined, so a scenario about a colour found none.
import type { Page } from "playwright";

export const evaluateWith = <T>(
  page: Page,
  functionText: string,
  argument: unknown,
): Promise<T> =>
  page.evaluate<T>(`(${functionText})(${JSON.stringify(argument)})`);
