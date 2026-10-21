/**
 * The selector for the link in the header's navigation called `label`. A link
 * drawn as a picture, as the way home is, keeps its word in a span for a
 * reader who cannot see the picture, and Playwright matches text on the
 * smallest element holding it, so the link itself is found through the span.
 */
export const menuLink = (label: string): string =>
  `.menu-links a:is(:text-is("${label}"), :has(> .visually-hidden:text-is("${label}")))`;
