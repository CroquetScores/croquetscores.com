import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { type TournamentNamed, TournamentsNamed } from "./TournamentsNamed.js";

/**
 * Each tournament read from its own stream. The few a reader's keys name are
 * cheap to read, and a read model of names by id would be one more thing to
 * keep in step for nothing else to use.
 */
export class TournamentsNamedHandler extends QueryHandler<
  TournamentsNamed,
  readonly TournamentNamed[]
> {
  readonly handles: RequestType<TournamentsNamed> = TournamentsNamed;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
  ) {
    super();
  }

  async handle(query: TournamentsNamed): Promise<readonly TournamentNamed[]> {
    const named: TournamentNamed[] = [];
    for (const written of new Set(query.tournaments)) {
      let id: TournamentId;
      try {
        id = TournamentId.from(written);
      } catch (failure) {
        if (failure instanceof ValidationError) continue;
        throw failure;
      }
      const tournament = await this.tournaments.load(id);
      if (tournament === undefined) continue;
      named.push({
        id: written,
        name: tournament.name.toString(),
        year: Number(tournament.starts.toISOString().slice(0, 4)),
      });
    }
    return named;
  }
}
