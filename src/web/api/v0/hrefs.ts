// Where the API tells of a thing, which is the `href` every answer of it gives
// (the public site's page is its `uri`). Held here so that the list and the
// tournament say the same of the same thing.

// Where the public site shows a thing, as the path a link to it is made from:
// the address the application keeps, which has no slash before it, with one.
export const uriOf = (address: string): string => `/${address}`;

// An id is its kind, a slash, and the rest; an address of the API names a thing
// by the rest, so that the id is one segment of it.
export const bare = (id: string): string => id.slice(id.indexOf("/") + 1);

export const tournamentHref = (tournament: string): string =>
  `/api/v0/tournaments/${bare(tournament)}`;

export const competitionHref = (
  tournament: string,
  competition: string,
): string => `${tournamentHref(tournament)}/competitions/${bare(competition)}`;

/** Where the API tells of a competition's standings, which only a block and a Swiss have. */
export const standingsHref = (
  tournament: string,
  competition: string,
): string => `${competitionHref(tournament, competition)}/standings`;

/** Where the API tells of a competition's games. */
export const gamesHref = (tournament: string, competition: string): string =>
  `${competitionHref(tournament, competition)}/games`;
