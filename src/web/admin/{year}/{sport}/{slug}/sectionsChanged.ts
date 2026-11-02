// How the section bar learns that the competitions it leads to have changed
// (TournamentSections.feature). The tabs that add, change, move and archive
// them and the bar are neighbours on one page and share nothing but the
// window, so the tab says so there and the bar asks again.
//
// An event rather than a value passed down: the bar is drawn by the page, the
// tabs are drawn inside the page's tab control, and threading a counter
// through both would make every page that has a bar carry it, to serve the
// one page whose tabs change what the bar holds.

const name = "croquetscores:sections-changed";

/** Says that the competitions of a tournament are not what they were. */
export const sectionsChanged = (): void => {
  window.dispatchEvent(new Event(name));
};

/** Calls `changed` whenever they are, and returns how to stop. */
export const whenSectionsChange = (changed: () => void): (() => void) => {
  window.addEventListener(name, changed);
  return () => {
    window.removeEventListener(name, changed);
  };
};
