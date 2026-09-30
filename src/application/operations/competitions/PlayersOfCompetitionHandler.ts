import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import {
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { askedBy, tournamentFor } from "../tournaments/tournamentOperations.js";
import {
  type Competitions,
  competitionOf,
  toldOf,
} from "./competitionOperations.js";
import {
  type ListedCompetitionPlayer,
  PlayersOfCompetition,
} from "./PlayersOfCompetition.js";

export class PlayersOfCompetitionHandler extends QueryHandler<
  PlayersOfCompetition,
  readonly ListedCompetitionPlayer[]
> {
  readonly handles: RequestType<PlayersOfCompetition> = PlayersOfCompetition;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly competitions: Competitions,
  ) {
    super();
  }

  async handle(
    query: PlayersOfCompetition,
  ): Promise<readonly ListedCompetitionPlayer[]> {
    const by = await askedBy(this.accounts, query.account);
    const tournament = await tournamentFor(
      this.tournaments,
      query.tournament,
      "PlayersOfCompetition",
    );
    // A scorer lists them too, to choose who won and who lost a game.
    if (!tournament.manages(by) && !tournament.scores(by)) {
      throw new TournamentRefused(
        "Tournament.NotAManagerOrScorer",
        "Only a manager or a scorer of the tournament can ask for this.",
      );
    }
    const id = CompetitionId.from(query.competition);
    if (
      !tournament.competitions.some(({ reference }) => reference.id.equals(id))
    ) {
      throw new TournamentRefused(
        "Tournament.NoSuchCompetition",
        "The tournament has no such competition.",
      );
    }
    const competition = await competitionOf(this.competitions, id);
    const told = toldOf(tournament, id);
    // What the person is, said once, by the tournament.
    const people = new Map(
      tournament.players.map((player) => [player.id.value, player]),
    );
    return competition.players.flatMap((player): ListedCompetitionPlayer[] => {
      if (player.isBye) {
        return [
          {
            id: player.id.value,
            tournamentPlayer: player.tournamentPlayerId.value,
            name: "",
            representing: undefined,
            flag: undefined,
            withdrawn: false,
            hasPlayed: false,
            drawnAgainst: undefined,
            bye: true,
            order: player.order,
          },
        ];
      }
      const person = people.get(player.tournamentPlayerId.value);
      return person === undefined
        ? []
        : [
            {
              id: player.id.value,
              tournamentPlayer: player.tournamentPlayerId.value,
              name: person.name.toString(),
              representing: person.representing,
              flag: person.flag === undefined ? undefined : String(person.flag),
              withdrawn: player.withdrawn,
              hasPlayed: competition.hasPlayed(player.id),
              drawnAgainst: competition.drawnAgainst(player.id, told)?.value,
              bye: false,
              order: player.order,
            },
          ];
    });
  }
}
