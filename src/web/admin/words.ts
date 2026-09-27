// The admin's words, in the reader's language. The server says them into the
// page as it sends it (adminPage.ts), since the admin is built ahead of time
// and cannot know who will read it, and the admin reads them from there rather
// than asking for them once it is running: it would otherwise draw itself
// before it had anything to say.
//
// The admin's own development server has no server behind the page to say
// anything into it, so there each word is shown by its key, which is still a
// page to look at rather than a page that failed to draw.

// Where the server puts them. Written again here rather than imported from
// adminPage.ts, which the admin's bundle cannot take in: it is the server's.
const wordsId = "admin-words";

const words: Readonly<Record<string, string>> = (() => {
  const said = document.getElementById(wordsId)?.textContent;
  return said === undefined || said === null
    ? {}
    : (JSON.parse(said) as Record<string, string>);
})();

/** Whether there are words for `key`, for a refusal that may have none. */
export const knows = (key: string): boolean => key in words;

/** The words for `key`, with each `{name}` in them filled from `fill`. */
export const say = (
  key: string,
  fill: Readonly<Record<string, string>> = {},
): string =>
  (words[key] ?? key).replace(
    /\{(\w+)\}/g,
    (whole, name: string) => fill[name] ?? whole,
  );
