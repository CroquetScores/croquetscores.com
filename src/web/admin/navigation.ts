// Moving between the admin's pages without the browser loading the page again
// (App.feature). The address is changed in place and App draws whichever page
// it names, as it does when the browser's back button changes it.

/** Where the admin is, as its pages' links write it. */
export const here = (): string =>
  `${window.location.pathname}${window.location.search}`;

/**
 * Goes to one of the admin's own pages. "replace" is for a page that finds it
 * has been opened at an address its tournament has moved on from, which is
 * not somewhere the back button should return to.
 */
export const go = (to: string, how: "push" | "replace" = "push"): void => {
  if (how === "replace") {
    window.history.replaceState(null, "", to);
  } else {
    window.history.pushState(null, "", to);
    // As a page loaded afresh would be. Going back is left to the browser,
    // which puts the reader where they were.
    window.scrollTo(0, 0);
  }
  // Said as the back button says it, since that is what App already listens
  // for, rather than as a second event meaning the same thing.
  window.dispatchEvent(new PopStateEvent("popstate"));
};

/**
 * The page a click on a link would open in place, or nothing where the click
 * is the browser's to follow: a link out of the admin, which only draws its
 * own pages; one to a file it was built with; and one the reader asked for
 * in a new tab or window, or to save, with a modifier key, another button,
 * or the link's own say.
 */
export const inPlace = (event: MouseEvent): string | undefined => {
  if (event.defaultPrevented || event.button !== 0) return undefined;
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
    return undefined;
  }
  const link =
    event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!(link instanceof HTMLAnchorElement)) return undefined;
  if (!["", "_self"].includes(link.target) || link.hasAttribute("download")) {
    return undefined;
  }
  const to = new URL(link.href);
  if (to.origin !== window.location.origin) return undefined;
  if (!/^\/admin(\/|$)/.test(to.pathname)) return undefined;
  if (to.pathname.startsWith("/admin/assets/")) return undefined;
  return `${to.pathname}${to.search}${to.hash}`;
};
