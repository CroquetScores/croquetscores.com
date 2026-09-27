// Reading a page for the test locale's marks (languages.ts). Here rather than
// in language.steps.ts, whose rules first needed them, because every page
// whose words are held to the reader's language reads them the same way, the
// admin's among them, and one reader of them is one answer.
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";
import { closes, opens } from "./languages.js";

/** Whether `text` is marked at both ends, as a phrase from a catalogue is. */
export const isMarked = (text: string): boolean =>
  text.startsWith(opens) && text.endsWith(closes);

// Every piece of text a reader sees within `selector`, each of which must be
// marked at both ends: one that is not came from somewhere other than a
// catalogue. What the reader typed is in the fields rather than in the text,
// and is not looked at.
//
// Anything matching `names` is left out, because a name is not a word of
// anybody's language and so is in no catalogue to be marked: the site's own
// name, and each language in the list, which is named in its own language.
/** The text within `selector` that did not come from a catalogue. */
export const unmarkedWithin = async (
  world: SpecWorld,
  selector: string,
  names: readonly string[] = [],
): Promise<string[]> => {
  const found = await world.browserPage.evaluate<string[] | null>(`(() => {
    const root = document.querySelector(${JSON.stringify(selector)});
    if (!root) return null;
    const named = [...root.querySelectorAll(${JSON.stringify(names.join(", ") || "nothing-at-all")})];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const texts = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (named.some((one) => one.contains(node))) continue;
      const text = node.textContent.trim();
      if (text !== "") texts.push(text);
    }
    return texts;
  })()`);
  assert.ok(
    found !== null,
    `There is nothing on the page matching ${selector}.`,
  );
  assert.ok(found.length > 0, `There are no words in ${selector}.`);

  // A phrase still holding a place for something is a stray too, though it is
  // marked at both ends like any other: what a reader sees is {siteName}, which
  // is nobody's language, and the marks would otherwise say it came from a
  // catalogue and leave it at that.
  const leftToFill = /\{[A-Za-z]+\}/;
  return found.filter((text) => leftToFill.test(text) || !isMarked(text));
};

// What a reader who cannot see something hears it announced as, which is an
// attribute rather than anything on the page.
/** The name `selector` is announced by, or nothing where it has none. */
export const announcedAs = async (
  world: SpecWorld,
  selector: string,
): Promise<string | null> =>
  world.browserPage.evaluate<string | null>(
    `(() => {
      const found = document.querySelector(${JSON.stringify(selector)});
      return found ? found.getAttribute("aria-label") : null;
    })()`,
  );
