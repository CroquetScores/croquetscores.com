// How a page of the help, written in Markdown among the files of docs/help,
// becomes a page of the site.
//
// The pages name each other by the file they are written in and show their
// pictures by where they sit among the files, because that is how they read
// where they are written, in an editor or on GitHub. On the site neither means
// anything, so each is turned into where the page or the picture is found.
import MarkdownIt, {
  type MarkdownIt as Markdown,
  type Token,
} from "markdown-it";
import { posix } from "node:path";

/** Where the help is read from. */
export const helpPath = "/help";

/** Where the pictures of the help are read from, whatever language the page is in. */
export const helpImagesPath = `${helpPath}/images`;

export interface ConvertedHelpPage {
  /** The first heading, which is what the page is called. */
  readonly title: string;
  readonly html: string;
  /** Where the pages it links to are, as the help names them: "" is the first. */
  readonly pagesLinkedTo: readonly string[];
  /** Where the pictures it shows are, as {@link helpImageName} names them. */
  readonly imagesShown: readonly string[];
  /**
   * The date, as 2026-10-13, a page of what's new says it was released, by a
   * second level heading "Released 2026-10-13"; nothing where it says none.
   */
  readonly released: string | undefined;
}

// Pictures are kept once, among the English pages, and the other languages
// reach them from there, so a path that has climbed out of the language's own
// folder into english/ is the same picture as the one written beside the
// English page.
const english = "../english/";

const withoutEnglish = (resolved: string): string =>
  resolved.startsWith(english) ? resolved.slice(english.length) : resolved;

/**
 * What a picture is called wherever the help is read from: where it is among
 * the English pages, less the folder of pictures it sits in, since the site
 * has no use for a folder that holds only pictures.
 */
export const helpImageName = (resolved: string): string => {
  const name = withoutEnglish(resolved);
  const folder = posix.dirname(name);
  const parent =
    posix.basename(folder) === "images" ? posix.dirname(folder) : folder;
  return parent === "."
    ? posix.basename(name)
    : `${parent}/${posix.basename(name)}`;
};

/** What a page is called wherever the help is read from: "" is the first. */
export const helpPageName = (resolved: string): string => {
  const name = withoutEnglish(resolved).replace(/\.md$/, "");
  if (name === "index") return "";
  return name.endsWith("/index") ? name.slice(0, -"/index".length) : name;
};

const isElsewhere = (href: string): boolean =>
  href.startsWith("/") ||
  href.startsWith("#") ||
  /^[a-z][a-z0-9+.-]*:/i.test(href);

const markdown = (): Markdown =>
  // Markup written in a page is shown as the characters it is. Nothing a
  // translator writes should be able to run on the site.
  new MarkdownIt({ html: false, breaks: false, linkify: false });

const inlineTokens = (tokens: readonly Token[]): Token[] =>
  tokens.flatMap((token) => [token, ...inlineTokens(token.children ?? [])]);

const releasedHeading = /^Released (\d{4}-\d{2}-\d{2})$/;

// Read from a heading rather than from a line of its own, so that the date is
// on the page for a reader as well as for the alert: the page says what it is,
// and the alert goes by what the page says.
const releasedOf = (tokens: readonly Token[]): string | undefined => {
  for (const [index, token] of tokens.entries()) {
    if (token.type !== "heading_open" || token.tag !== "h2") continue;
    const found = releasedHeading.exec(tokens[index + 1]?.content ?? "");
    if (found !== null) return found[1];
  }
  return undefined;
};

/**
 * `markdown` of the page at `pagePath`, which is where it is among its
 * language's files, as "tournament-managers/index.md".
 */
export const convertHelpPage = (
  source: string,
  pagePath: string,
): ConvertedHelpPage => {
  const reader = markdown();
  const tokens = reader.parse(source, {});
  const from = posix.dirname(pagePath);
  const pagesLinkedTo: string[] = [];
  const imagesShown: string[] = [];

  for (const token of inlineTokens(tokens)) {
    if (token.type === "link_open") {
      // An attribute may be a number as markdown-it types it, though these are not.
      const href = String(token.attrGet("href") ?? "");
      if (isElsewhere(href)) continue;
      const [target = "", fragment] = href.split("#");
      const name = helpPageName(posix.normalize(posix.join(from, target)));
      pagesLinkedTo.push(name);
      token.attrSet(
        "href",
        `${helpPath}${name === "" ? "" : `/${name}`}${fragment === undefined ? "" : `#${fragment}`}`,
      );
    } else if (token.type === "image") {
      const src = String(token.attrGet("src") ?? "");
      if (isElsewhere(src)) continue;
      const name = helpImageName(posix.normalize(posix.join(from, src)));
      imagesShown.push(name);
      token.attrSet("src", `${helpImagesPath}/${name}`);
    }
  }

  // The first heading of any level, since a page that begins with a second
  // level heading is still called by it, and the build refuses one with none.
  const heading = tokens.findIndex((token) => token.type === "heading_open");
  const title = tokens[heading + 1]?.children
    ?.filter((token) => token.type === "text" || token.type === "code_inline")
    .map((token) => token.content)
    .join("");

  return {
    title: heading === -1 || title === undefined ? "" : title,
    html: reader.renderer.render(tokens, reader.options, {}),
    pagesLinkedTo,
    imagesShown,
    released: releasedOf(tokens),
  };
};
