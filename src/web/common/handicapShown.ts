// A handicap is kept as it was written, so that "+4" is not turned into "4"
// (TournamentPlayer.ts), and so "4.0" is kept as "4.0". A reader of a list
// has no use for the point where nothing follows it, so it is left off
// there, in the admin's lists and the public pages alike, which say so with
// this one rule so that they cannot come to differ.
export const handicapShown = (handicap: string): string =>
  handicap.replace(/\.0$/, "");
