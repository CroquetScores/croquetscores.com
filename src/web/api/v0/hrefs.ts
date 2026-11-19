// Where the API tells of a thing, which is the `href` every answer of it gives
// (the public site's page is its `address`). Held here so that the list and the
// tournament say the same of the same thing.

// An id is its kind, a slash, and the rest; an address of the API names a thing
// by the rest, so that the id is one segment of it.
export const bare = (id: string): string => id.slice(id.indexOf("/") + 1);

export const tournamentHref = (tournament: string): string =>
  `/api/v0/tournaments/${bare(tournament)}`;

export const competitionHref = (
  tournament: string,
  competition: string,
): string => `${tournamentHref(tournament)}/competitions/${bare(competition)}`;
