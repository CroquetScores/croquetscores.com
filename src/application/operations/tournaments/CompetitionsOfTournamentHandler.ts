import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { Games } from "../../services/Games.js";
import {
  CompetitionsOfTournament,
  type ListedCompetition,
} from "./CompetitionsOfTournament.js";
import { managedOrScoredBy } from "./tournamentOperations.js";

// The day a moment falls on in UTC, written as "2026-10-03".
const dayOf = (moment: ReadOnlyDate): string =>
  moment.toISOString().slice(0, 10);

export class CompetitionsOfTournamentHandler extends QueryHandler<
  CompetitionsOfTournament,
  readonly ListedCompetition[]
> {
  readonly handles: RequestType<CompetitionsOfTournament> =
    CompetitionsOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly games: Games,
  ) {
    super();
  }

  async handle(
    query: CompetitionsOfTournament,
  ): Promise<readonly ListedCompetition[]> {
    const { tournament, part } = await managedOrScoredBy(
      this.tournaments,
      this.accounts,
      query.account,
      query.tournament,
      "CompetitionsOfTournament",
    );
    // In the tournament's own order, which it keeps lowest first. A scorer is
    // answered the competitions in use alone: an archived one is set aside,
    // and has no scores to enter.
    const answered = tournament.competitions.filter(
      ({ reference }) => part === "manager" || !reference.archived,
    );
    // What has been played in each test, read all at once rather than one
    // test after another, since every page of the admin asks for this list.
    const played = new Map(
      await Promise.all(
        answered
          .filter(({ shape }) => shape.kind === "test")
          .map(
            async ({ reference }) =>
              [
                reference.id.value,
                await this.games.playedIn(tournament.id, reference.id),
              ] as const,
          ),
      ),
    );
    const listed: ListedCompetition[] = [];
    for (const { reference, shape, rules } of answered) {
      const about = {
        id: reference.id.value,
        name: reference.name.toString(),
        slug: reference.slug.toString(),
        archived: reference.archived,
        handicap: rules.handicap,
        drawsAllowed: rules.drawsAllowed,
        worldRankings: rules.worldRankings,
      };
      if (shape.kind === "knockout") {
        listed.push({
          ...about,
          kind: shape.kind,
          places: shape.draw.places,
          rounds: shape.draw.rounds.map((round) => round.games),
        });
      } else if (shape.kind === "test") {
        listed.push({
          ...about,
          kind: shape.kind,
          bestOf: shape.bestOf.games,
          teams: [shape.firstTeam, shape.secondTeam].flatMap((id) =>
            tournament.teams
              .filter((team) => team.id.equals(id))
              .map((team) => ({
                id: team.id.value,
                name: team.name.toString(),
                shortName: team.shortName.toString(),
              })),
          ),
          starts: dayOf(shape.starts),
          finishes: dayOf(shape.finishes),
          expectedMatches: shape.expectedMatches.count,
          group: shape.group?.toString(),
          hasGames: (played.get(reference.id.value)?.matchesStarted ?? 0) > 0,
        });
      } else if (shape.kind === "block") {
        listed.push({
          ...about,
          kind: shape.kind,
          bestOf: shape.bestOf.games,
          rounds: shape.rounds.count,
        });
      } else {
        listed.push({ ...about, kind: shape.kind, bestOf: shape.bestOf.games });
      }
    }
    return listed;
  }
}
