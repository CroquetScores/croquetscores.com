import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import {
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { askedBy, tournamentFor } from "../tournaments/tournamentOperations.js";
import { PlayersOfTest, type TeamInTest } from "./PlayersOfTest.js";

export class PlayersOfTestHandler extends QueryHandler<
  PlayersOfTest,
  readonly TeamInTest[]
> {
  readonly handles: RequestType<PlayersOfTest> = PlayersOfTest;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: PlayersOfTest): Promise<readonly TeamInTest[]> {
    const by = await askedBy(this.accounts, query.account);
    const tournament = await tournamentFor(
      this.tournaments,
      query.tournament,
      "PlayersOfTest",
    );
    if (!tournament.mayManage(by) && !tournament.scores(by)) {
      throw new TournamentRefused(
        "Tournament.NotAManagerOrScorer",
        "Only a manager or a scorer of the tournament can ask for this.",
      );
    }
    // Listed to enter its scores, which an archived tournament and an
    // archived test take none of.
    if (tournament.archived) {
      throw new TournamentRefused(
        "Tournament.Archived",
        "An archived tournament can only be restored.",
      );
    }
    const id = CompetitionId.from(query.test);
    const found = tournament.competitions.find(({ reference }) =>
      reference.id.equals(id),
    );
    if (found === undefined) {
      throw new TournamentRefused(
        "Tournament.NoSuchCompetition",
        "The tournament has no such competition.",
      );
    }
    if (found.reference.archived) {
      throw new TournamentRefused(
        "Tournament.CompetitionArchived",
        "An archived competition can only be restored.",
      );
    }
    const { shape } = found;
    if (shape.kind !== "test") {
      throw new TournamentRefused(
        "Tournament.NotATest",
        "The competition is not a test, and has no teams.",
      );
    }
    // An archived player plays no game, so they are not answered.
    return [shape.firstTeam, shape.secondTeam].flatMap((teamId) =>
      tournament.teams
        .filter((team) => team.id.equals(teamId))
        .map((team) => ({
          id: team.id.value,
          name: team.name.toString(),
          shortName: team.shortName.toString(),
          players: team.players
            .filter(({ archived }) => !archived)
            .map((player) => ({
              id: player.id.value,
              name: player.name.toString(),
            })),
        })),
    );
  }
}
