// The address a request is logged with (addressToLog.feature).

// What in an address lets whoever holds it act as a reader: a signed link
// (link.ts), and the state and code a reader brings back from Google
// (google.ts). Nothing else the site answers is asked for by these names.
const actingAsAReader = new Set(["link", "state", "code"]);

// A name as the site reads it, which is as Fastify's query parser does: a plus
// is a space and an escape is the character, and a name whose escapes will not
// be read is read as it was written.
const nameAsRead = (written: string): string => {
  try {
    return decodeURIComponent(written.replaceAll("+", " "));
  } catch {
    return written;
  }
};

/**
 * `url` with the value of every name that lets somebody act as a reader
 * written as taken out, whatever the path and however the name was spelt, and
 * the rest of it as it was. Said as taken out rather than left out, so that
 * whoever reads the log knows there was one.
 */
export const addressToLog = (url: string): string => {
  const at = url.indexOf("?");
  if (at === -1) return url;
  const said = url
    .slice(at + 1)
    .split("&")
    .map((pair) => {
      const equals = pair.indexOf("=");
      if (equals === -1) return pair;
      const name = pair.slice(0, equals);
      return actingAsAReader.has(nameAsRead(name)) ? `${name}=[removed]` : pair;
    });
  return `${url.slice(0, at)}?${said.join("&")}`;
};
