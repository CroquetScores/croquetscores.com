// The test locale, as a reader of a page sees it: English with every phrase
// marked where it begins and ends (src/web/testLocale.ts makes it, for a site
// that has the test control). The marks are written here again rather than
// read from the site, since a site that changed them should fail these
// scenarios and not follow them.
export const testLocaleTag = "en-XA";

/** How the test locale marks the beginning and the end of every phrase. */
export const opens = "⟦";
export const closes = "⟧";

/** `text` with the test locale's marks taken off, where it has them. */
export const unmarked = (text: string): string =>
  text.split(opens).join("").split(closes).join("");
