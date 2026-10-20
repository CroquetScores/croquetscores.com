// What every operation on a competition's players shares: the tournament asked
// first, since a competition knows nothing of who may change it or of the
// tournament's players, and the competition found, or begun where nothing has
// been done to it yet.
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import {
  Competition,
  type Told,
} from "../../../domain/aggregates/tournaments/competitions/Competition.js";
import type { Game } from "../../../domain/aggregates/tournaments/competitions/Game.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import {
  type CompetitionInTournament,
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import {
  askedBy,
  managedBy,
  tournamentFor,
  unlessArchived,
} from "../tournaments/tournamentOperations.js";

// The tournament `written`, and who asks, once `account` is known to manage it
// or to score it: anybody else is refused as `Tournament.NotAManagerOrScorer`.
const managedOrScoredBy = async (
  tournaments: AggregateRepository<Tournament, TournamentId>,
  accounts: AggregateRepository<Account, AccountId>,
  account: string,
  written: string,
  operation: string,
): Promise<{ readonly by: AccountId; readonly tournament: Tournament }> => {
  const by = await askedBy(accounts, account);
  const tournament = await tournamentFor(tournaments, written, operation);
  if (!tournament.mayManage(by) && !tournament.scores(by)) {
    throw new TournamentRefused(
      "Tournament.NotAManagerOrScorer",
      "Only a manager or a scorer of the tournament can ask for this.",
    );
  }
  return { by, tournament };
};

/** Where a tournament's competitions are kept, each under its own id. */
export type Competitions = AggregateRepository<Competition, CompetitionId>;

/**
 * The competition `id`, rebuilt from its stream, or one with no players where
 * nothing has been done to it: a competition's stream begins with the first
 * thing done to it, not when the tournament adds it.
 */
export const competitionOf = async (
  competitions: Competitions,
  id: CompetitionId,
): Promise<Competition> =>
  (await competitions.load(id)) ?? Competition.rebuiltFrom(id, []);

/**
 * The competition `id` of `tournament`, or refused as
 * `Tournament.NoSuchCompetition`: archived or not, since an archived one is
 * still the tournament's and what it tells of itself is still true.
 */
export const competitionFound = (
  tournament: Tournament,
  id: CompetitionId,
): CompetitionInTournament => {
  const found = tournament.competitions.find(({ reference }) =>
    reference.id.equals(id),
  );
  if (found === undefined) {
    throw new TournamentRefused(
      "Tournament.NoSuchCompetition",
      "The tournament has no such competition.",
    );
  }
  return found;
};

/**
 * The competition `id` of `tournament` as `competitionFound` has it, and
 * refused as `Tournament.CompetitionArchived` where it is archived, since the
 * only thing to be done to one is to restore it.
 */
export const competitionInUse = (
  tournament: Tournament,
  id: CompetitionId,
): CompetitionInTournament => {
  const found = competitionFound(tournament, id);
  if (found.reference.archived) {
    throw new TournamentRefused(
      "Tournament.CompetitionArchived",
      "An archived competition can only be restored.",
    );
  }
  return found;
};

/**
 * What `tournament` tells its competition `id` of itself: what kind of
 * competition it is, with a knockout's draw, and whether drawn games are
 * allowed. A test is told who plays for which team too, every team's players
 * among them, so that it can say of one who plays for neither of its own that
 * the test does not have them.
 */
export const toldOf = (tournament: Tournament, id: CompetitionId): Told => {
  const found = competitionFound(tournament, id);
  if (found.shape.kind !== "test") {
    return { shape: found.shape, drawsAllowed: tournament.drawsAllowed };
  }
  return {
    shape: found.shape,
    drawsAllowed: tournament.drawsAllowed,
    teamPlayers: tournament.teams.flatMap((team) =>
      team.players.map((player) => ({
        id: player.id,
        team: team.id,
        archived: player.archived,
      })),
    ),
  };
};

/**
 * Whether a game of `competition`, which is the tournament's competition
 * `id`, counts for nothing where games are counted or shown, with what the
 * tournament told it of itself bound once: so that every page that answers
 * games asks the same way (`Competition.countsForNothing`).
 */
export const countsForNothingIn = (
  competition: Competition,
  tournament: Tournament,
  id: CompetitionId,
): ((game: Game) => boolean) => {
  const told = toldOf(tournament, id);
  return (game) => competition.countsForNothing(game, told);
};

/**
 * The competition `written` of the tournament `tournamentWritten`, once the
 * tournament has said `account` may change it: refused, in this order, as
 * `Account.Forgotten`, as `operation`'s `NoSuchTournament`, as
 * `Tournament.NotAManager`, as `Tournament.Archived` for a tournament that can
 * only be restored, and as `Tournament.NoSuchCompetition` or
 * `Tournament.CompetitionArchived`. Where `scorers` is so, a scorer may too,
 * and anybody else is refused as `Tournament.NotAManagerOrScorer`.
 */
export const competitionManagedBy = async (
  tournaments: AggregateRepository<Tournament, TournamentId>,
  accounts: AggregateRepository<Account, AccountId>,
  competitions: Competitions,
  request: {
    readonly account: string;
    readonly tournament: string;
    readonly competition: string;
  },
  operation: string,
  { scorers = false }: { readonly scorers?: boolean } = {},
): Promise<{
  readonly by: AccountId;
  readonly tournament: Tournament;
  readonly competition: Competition;
  readonly told: Told;
}> => {
  const { by, tournament } = scorers
    ? await managedOrScoredBy(
        tournaments,
        accounts,
        request.account,
        request.tournament,
        operation,
      )
    : await managedBy(
        tournaments,
        accounts,
        request.account,
        request.tournament,
        operation,
      );
  unlessArchived(tournament);
  const id = CompetitionId.from(request.competition);
  competitionInUse(tournament, id);
  return {
    by,
    tournament,
    competition: await competitionOf(competitions, id),
    told: toldOf(tournament, id),
  };
};
