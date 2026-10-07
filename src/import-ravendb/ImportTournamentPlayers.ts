import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import { TournamentId } from "../domain/aggregates/tournaments/primitives/TournamentId.js";
import { TournamentPlayerId } from "../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { Flags } from "../domain/aggregates/tournaments/value-objects/Flags.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import type { ImportDatabase } from "./ImportDatabase.js";
import { describedFailure } from "./ImportRefused.js";
import { nameToImport, numberedApart } from "./names.js";
import { oldFlagOf } from "./oldSites.js";
import type { TournamentPlayers } from "./ravendb-models/TournamentPlayers.js";
import type { Importer, ReadDocument } from "./runImporter.js";

/** Whether the old sites' player called `name` was their bye. */
export const isOldBye = (name: string): boolean =>
  name.trim().toLowerCase() === "bye";

/**
 * The flag the site flies for a player the old sites showed `representing`'s
 * flag for, where the site has that flag.
 */
export const flagOf = (representing: string | null): string | undefined => {
  if (representing === null || representing.trim() === "") return undefined;
  const old = oldFlagOf(representing.trim());
  return old === undefined ? undefined : Flags.thereAre.find(old)?.toString();
};

/**
 * Loads the tournament the tournament document `documentId` on `website`
 * became. Whatever names a tournament is brought over only once the
 * tournament is (ImportWholeTournaments.feature), so one that was not is a
 * fault in the import rather than in the document.
 */
export const tournamentBecome = async (
  database: ImportDatabase,
  tournaments: AggregateRepository<Tournament, TournamentId>,
  website: string,
  documentId: string,
): Promise<Tournament> => {
  const written = await database.findTournamentOf(website, documentId);
  const tournament =
    written === undefined
      ? undefined
      : await tournaments.load(TournamentId.from(written));
  if (tournament === undefined) {
    throw new Error(`The tournament ${documentId} was not brought over.`);
  }
  return tournament;
};

/**
 * Adds each player of the old sites' tournaments to the tournament it became,
 * in the order the document lists them, and keeps what each became, by the
 * number the old sites gave them (ImportTournamentPlayers.feature).
 *
 * A player the site refuses is kept as an error naming them, and the rest are
 * added all the same. The bye is kept as a bye, for a knockout to find. A
 * tournament played by teams has no players of its own, so its players are
 * left for its team matches.
 */
export class ImportTournamentPlayers implements Importer<TournamentPlayers> {
  readonly collection = "TournamentPlayers";

  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly database: ImportDatabase,
  ) {}

  async importDocument({
    website,
    id,
    document,
  }: ReadDocument<TournamentPlayers>): Promise<void> {
    await this.unitOfWork.inTransaction(async () => {
      const tournamentDocument = document.Tournament.Id;
      const tournament = await tournamentBecome(
        this.database,
        this.tournaments,
        website,
        tournamentDocument,
      );
      if (tournament.format.isTeamFormat) return;

      // Done as the tournament's first manager, who created it, when it was
      // created.
      const [by] = tournament.managers;
      if (by === undefined) throw new Error("The tournament has no manager.");
      const at = tournament.starts;
      const added: { readonly number: number; readonly id: string }[] = [];

      for (const player of document._Players) {
        if (isOldBye(player.Name)) {
          added.push({
            number: player._Id,
            id: TournamentPlayerId.bye().value,
          });
          continue;
        }
        try {
          const playerId = TournamentPlayerId.create();
          tournament.addPlayer(
            playerId,
            {
              name: numberedApart(
                nameToImport(player.Name),
                tournament.players.map((each) => each.name.toString()),
              ),
              representing: player.Representing ?? undefined,
              flag: flagOf(player.Representing),
            },
            by,
            at,
          );
          added.push({ number: player._Id, id: playerId.value });
        } catch (failure) {
          await this.database.recordError(
            `${website}/${id}`,
            `player ${String(player._Id)}: ${describedFailure(failure)}`,
          );
        }
      }

      await this.tournaments.save(tournament);
      for (const { number, id: playerId } of added) {
        await this.database.recordImportedPlayer(
          website,
          tournamentDocument,
          number,
          playerId,
        );
      }
    });
  }
}
