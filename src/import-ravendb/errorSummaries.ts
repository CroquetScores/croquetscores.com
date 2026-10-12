// What a refused game or player of a competition is said as, for a person
// rather than for whoever reads the code (ImportDatabase.feature): "Game Tim
// 26 beat Trev 0 in Spring Open - Knockout because they are not drawn to play
// each other." In English, as the rest of what the import says is.

// Why the site refused something, by the code it refused it with, as the end
// of a sentence beginning "because".
const REASONS: Readonly<Record<string, string>> = {
  "Competition.NotDrawnToMeet": "they are not drawn to play each other",
  "Competition.MatchDecided": "their match was already decided",
  "Competition.ExpectedMatchesReached":
    "the test already had as many matches as it was expected to have",
  "Competition.SameTeam": "they play for the same team",
  "Competition.NoSuchPlayer": "a player plays for neither team",
  "Competition.DrawNotFilled": "the knockout's draw is not filled",
  "Competition.PlayerAlreadyEntered": "they are already in the competition",
  "CompetitionPlayer.Withdrawn": "a player had withdrawn",
  "Game.SamePlayer": "a player cannot play themselves",
  "Game.WinnerNotAhead": "the winner's score is not ahead of the loser's",
  "Game.LoserMarked": "the loser's score carries a mark only a winner's can",
  "ImportCompetition.PlayerNotInCompetition":
    "a player of the game is not in the competition",
  "ImportCompetition.PlayerNotBroughtOver":
    "they were not brought over to the tournament",
  "ImportTeamMatches.RepresentsNeitherTeam":
    "they represent neither of the teams",
  "PersonName.TooLong": "their name is too long",
  "TournamentPlayer.NoLetterOrDigit": "their name has no letter or digit",
};

// Why the site refused a game, said for a reader of the tournament rather
// than for whoever reads the import, as a clause after "because".
const PLAIN_REASONS: Readonly<Record<string, string>> = {
  "Competition.NotDrawnToMeet":
    "the two players were not due to meet at that stage of the knockout's draw",
  "Competition.MatchDecided": "their match had already been decided",
  "Competition.ExpectedMatchesReached":
    "the team match already had as many matches as it was expected to have",
  "Competition.SameTeam": "both players are on the same team",
  "Competition.NoSuchPlayer": "a player is not on either of the two teams",
  "Competition.DrawNotFilled": "the knockout's draw was not full",
  "Competition.PlayerAlreadyEntered":
    "a player was already entered in the competition",
  "CompetitionPlayer.Withdrawn":
    "a player had already withdrawn from the competition",
  "Game.SamePlayer": "the game was recorded with the same player on both sides",
  "Game.WinnerNotAhead":
    "the winner's score was not higher than the loser's score",
  "Game.LoserMarked": "the loser's score was marked as a winning score",
  "ImportCompetition.PlayerNotInCompetition":
    "a player of the game is not entered in the competition",
  "ImportCompetition.PlayerNotBroughtOver":
    "a player of the game could not be brought over to the tournament",
  "ImportTeamMatches.RepresentsNeitherTeam":
    "a player was recorded as representing a team that is not in the match",
  "PersonName.TooLong": "a player's name is too long",
  "TournamentPlayer.NoLetterOrDigit":
    "a player's name has no letter or digit in it",
};

// Why the site did not enter a player, said for a reader of the tournament, as
// a clause after "because".
const PLAIN_PLAYER_REASONS: Readonly<Record<string, string>> = {
  "ImportTeamMatches.RepresentsNeitherTeam":
    "they were recorded as representing a team that is not in the match",
  "PersonName.TooLong": "their name is too long for the new site",
  "TournamentPlayer.NoLetterOrDigit": "their name has no letter or digit in it",
  "CompetitionPlayer.Withdrawn": "they had already withdrawn",
};

/**
 * Why a player was not entered, said for a reader of the tournament, as the
 * end of a sentence beginning "because" (ImportCompetition.feature).
 */
export const plainPlayerReasonOf = (failure: unknown): string => {
  const code = (failure as { code?: unknown } | null)?.code;
  return typeof code === "string" && PLAIN_PLAYER_REASONS[code] !== undefined
    ? PLAIN_PLAYER_REASONS[code]
    : "the new site's rules do not allow it";
};

/**
 * Why `failure` was refused, said for a reader of the tournament, as the end of
 * a sentence beginning "because" (ImportTeamMatches.feature).
 */
export const plainReasonOf = (failure: unknown): string => {
  const code = (failure as { code?: unknown } | null)?.code;
  return typeof code === "string" && PLAIN_REASONS[code] !== undefined
    ? PLAIN_REASONS[code]
    : "the new site's rules do not allow it";
};

/** Why `failure` was refused, by its code, or that its code was not known. */
export const reasonOf = (failure: unknown): string => {
  const code = (failure as { code?: unknown } | null)?.code;
  if (typeof code !== "string") return "of an error the import did not expect";
  return REASONS[code] ?? `the site refused it (${code})`;
};

/** Where a game or a player was, as "Spring Open - Knockout". */
export const placeOf = (
  tournament: string,
  competition: string | undefined,
): string =>
  competition === undefined ? tournament : `${tournament} - ${competition}`;

/** A game, said as who beat whom and by what, and `where`. */
export const gameSaid = (
  game: {
    readonly winner: string;
    readonly winnerScore: string;
    readonly loser: string;
    readonly loserScore: string;
  },
  where: string,
): string =>
  `Game ${game.winner} ${game.winnerScore} beat ${game.loser} ${game.loserScore} in ${where}`;

/** A player, said as who and `where`. */
export const playerSaid = (name: string, where: string): string =>
  `Player ${name} in ${where}`;
