// A heading as it is laid out, for the steps of a block's grid and its
// summary: the words of a heading of more than one are parted by line breaks
// rather than spaces, which leave nothing between them in its text, so a
// heading is read a line at a time.
import type { Locator } from "playwright";

/** Each line of `heading` as it is laid out, trimmed. */
export const linesOf = async (heading: Locator): Promise<string[]> =>
  (await heading.innerText())
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

/** `heading`'s lines read as one, a space between each. */
export const headingOf = async (heading: Locator): Promise<string> =>
  (await linesOf(heading)).join(" ");
