import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import { CompetitionId } from "../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { TournamentId } from "../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import type { ImportDatabase } from "./ImportDatabase.js";
import type { Tournament as OldTournament } from "./ravendb-models/Tournament.js";
import type { Importer, ReadDocument } from "./runImporter.js";

// The competitions of `tournament` in use, by their written ids, in order.
const inUse = (tournament: Tournament): string[] =>
  tournament.competitions
    .filter(({ reference }) => !reference.archived)
    .map(({ reference }) => reference.id.value);

/**
 * Reads the old sites' tournaments again, last of all, and puts the
 * competitions of each one brought over in the order the old sites listed
 * them (OrderCompetitions.feature): the competitions were brought over a
 * collection at a time, every block before any knockout. Each listed is moved
 * up until it is where the list puts it, so those the list does not hold end
 * up after those it does, in the order they were in.
 *
 * A tournament left behind or refused, and a listed competition that was, is
 * passed over: its refusal was kept when it was imported.
 */
export class OrderCompetitions implements Importer<OldTournament> {
  readonly collection = "Tournaments";

  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly database: ImportDatabase,
  ) {}

  async importDocument({
    website,
    id,
    document,
  }: ReadDocument<OldTournament>): Promise<void> {
    await this.unitOfWork.inTransaction(async () => {
      const written = await this.database.findTournamentOf(website, id);
      if (written === undefined) return;
      const tournament = await this.tournaments.load(
        TournamentId.from(written),
      );
      if (tournament === undefined) return;

      const listed: string[] = [];
      for (const { Id } of document.Competitions) {
        const found = await this.database.findCompetitionOf(website, Id);
        if (found !== undefined && !listed.includes(found.competitionId)) {
          listed.push(found.competitionId);
        }
      }

      // Done as the tournament's first manager, who created it, when it was
      // created.
      const [by] = tournament.managers;
      if (by === undefined) throw new Error("The tournament has no manager.");
      listed.forEach((competition, place) => {
        let at = inUse(tournament).indexOf(competition);
        while (at > place) {
          tournament.moveCompetition(
            CompetitionId.from(competition),
            "up",
            by,
            tournament.starts,
          );
          at -= 1;
        }
      });

      await this.tournaments.save(tournament);
    });
  }
}
