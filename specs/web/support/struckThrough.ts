// Whether something on a page is drawn struck through, as the page's own
// scripting would see it, which the specs are not compiled to know. Here
// rather than in any one page's steps, because every page that strikes
// through a withdrawn player or their games is held to it the same way.
import type { Locator } from "playwright";

// The lines `found` is drawn with, as "line-through underline", or "none".
const decorationLinesOf = (found: Locator): Promise<string> =>
  found.evaluate(
    (element: unknown) =>
      (
        globalThis as unknown as {
          getComputedStyle(element: unknown): {
            textDecorationLine: string;
          };
        }
      ).getComputedStyle(element).textDecorationLine,
  );

/** Whether `found` is drawn with a line through it. */
export const isStruckThrough = async (found: Locator): Promise<boolean> =>
  /line-through/.test(await decorationLinesOf(found));

/** Whether `found` is drawn underlined, as a link is. */
export const isUnderlined = async (found: Locator): Promise<boolean> =>
  /underline/.test(await decorationLinesOf(found));

/**
 * Whether a player's meta-data, which is a box of its own that a line of text
 * decoration does not run through, is drawn with a line across it instead.
 */
export const isMetaDataStruckThrough = (found: Locator): Promise<boolean> =>
  found.first().evaluate((element: unknown) => {
    const style = (
      globalThis as unknown as {
        getComputedStyle(
          element: unknown,
          pseudo: string,
        ): { content: string; borderTopWidth: string };
      }
    ).getComputedStyle(element, "::after");
    return style.content !== "none" && parseFloat(style.borderTopWidth) > 0;
  });
