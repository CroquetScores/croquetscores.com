// How the site draws what its writers write in Markdown: a commentary's
// comments (commentary.ts) and a tournament's subtitle (layout.ts). Each is
// drawn by a Markdown of its own made here, so that what one adds to it, as a
// comment's turns that begin no list, is not the other's.
import MarkdownIt, { type MarkdownIt as Markdown } from "markdown-it";

/**
 * A Markdown that draws from Markdown alone. HTML is turned off, so that HTML
 * written in it is shown as the characters it is and kept from running, the
 * one guard a page needs, whatever was kept. A line break is a line break,
 * since what is drawn is typed on a phone by somebody who has never heard
 * that Markdown wants two. A web address written out with its scheme, and an
 * email address, are drawn as links without the Markdown a link is otherwise
 * written in, as the old site drew them; a name with no scheme, as
 * "example.com", is left as it is, as it was there, since a word with a full
 * stop in it is not always an address.
 *
 * A link is one the site does not vouch for, so that a search engine gives it
 * nothing, which is what a link put there to sell something is after; and the
 * page it leads to is told nothing of the one it was followed from.
 */
export const markdownWithoutHtml = (): Markdown => {
  const markdown = new MarkdownIt({
    html: false,
    breaks: true,
    linkify: true,
  });
  markdown.linkify.set({ fuzzyLink: false });
  const drawLink = markdown.renderer.rules.link_open;
  markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
    tokens[index]?.attrSet("rel", "nofollow ugc noopener noreferrer");
    return drawLink === undefined
      ? self.renderToken(tokens, index, options)
      : drawLink(tokens, index, options, env, self);
  };
  return markdown;
};
