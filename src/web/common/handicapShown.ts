// A handicap is kept in the events as it was written, and the admin's lists
// are made from them, but the read models keep it as the number it is, so the
// public pages and the API show "4" for "+4" and for "4.0"
// (TournamentContents.feature). This says the same of what was written, so
// that the admin's lists show what the pages do.
export const handicapShown = (handicap: string): string =>
  handicap.replace(/^\+/, "").replace(/\.0$/, "");
