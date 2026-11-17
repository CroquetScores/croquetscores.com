// The language the specs use to find words that did not come from a catalogue:
// English with every phrase marked where it begins and ends. A word on a page
// in it that is not marked came from somewhere other than a catalogue.
//
// Made from the English catalogue rather than written by hand, so a word with
// no English entry cannot be in it either. A site offers it only when it has
// the test control (src/web/testControl.ts); nobody else is offered it.
import type { Language } from "./common/language.js";

export const testLocaleTag = "en-XA";

/** How the test locale marks the beginning and the end of every phrase. */
export const opens = "⟦";
export const closes = "⟧";

// A value the site holds as markup, an email's body and nothing else, is marked
// inside its tags rather than around them. What a reader sees is then marked,
// as it is on a page, while the markup stays markup: marking the whole value
// would put the marks outside the paragraphs, where no reader sees them, and
// leave every paragraph looking as though it came from somewhere other than a
// catalogue. The whitespace either side of the words is kept out of the marks
// and put back around them, rather than cut out of the middle, because
// replacing one string with another would read a `$` in the words as a
// pattern of its own.
const markedBetweenTags = (markup: string): string =>
  markup.replace(
    />(\s*)([^<]*?)(\s*)</g,
    (whole, before: string, between: string, after: string) =>
      between === "" ? whole : `>${before}${marked(between)}${after}<`,
  );

export const marked = (text: string): string =>
  text.includes("<") ? markedBetweenTags(text) : `${opens}${text}${closes}`;

/** The test locale, made from `english`. */
export const testLocaleFrom = (english: Language): Language => ({
  tag: testLocaleTag,
  name: marked(english.name),
  words: Object.fromEntries(
    Object.entries(english.words).map(([key, text]) => [key, marked(text)]),
  ),
});
