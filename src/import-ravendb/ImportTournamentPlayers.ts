import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import type { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import { TournamentId } from "../domain/aggregates/tournaments/primitives/TournamentId.js";
import { TournamentPlayerId } from "../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { Flags } from "../domain/aggregates/tournaments/value-objects/Flags.js";
import type { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import type { ImportDatabase } from "./ImportDatabase.js";
import { errorOf } from "./AcceptedImportErrors.js";
import { describedFailure } from "./ImportRefused.js";
import {
  nameToImport,
  numberedApart,
  worldRankingNameToImport,
} from "./names.js";
import { oldFlagOf } from "./oldSites.js";
import type { TournamentPlayers } from "./ravendb-models/TournamentPlayers.js";
import type { Importer, ReadDocument } from "./runImporter.js";
import { isNamedBye } from "../domain/aggregates/tournaments/TournamentPlayer.js";

/**
 * Whether the old sites' player called `name` was a bye: "Bye", or one of
 * several a manager entered, as "Bye 2". Asked as the site asks whether a
 * player is named as a bye, so that every player it would refuse for it is
 * kept as the bye instead.
 */
export const isOldBye = (name: string): boolean => isNamedBye(name);

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
 * Adds the old sites' player called `Name`, representing `Representing`, to
 * `tournament`, as the site will take them: their name numbered apart from
 * any the tournament's players have, and flying the flag of whatever they
 * represent. The player's id, or the refusal thrown where the site refuses
 * them.
 *
 * A player whose name is exactly the name one of the tournament's players
 * has is that player and is not added again, as a team's player of a name the
 * team has is (ImportTeamMatches.feature): the old sites could list one
 * person more than once, and told them apart by what they represented, which
 * the site does not. The first of them stays as they were. Only the name
 * as it is kept is compared, so a name another case, or numbered apart
 * before, is not found and is numbered apart as it was.
 */
export const addOldPlayer = (
  tournament: Tournament,
  player: { readonly Name: string; readonly Representing: string | null },
  by: AccountId,
  at: ReadOnlyDate,
): TournamentPlayerId => {
  const imported = nameToImport(player.Name);
  const already = tournament.players.find(
    (each) => each.name.toString() === imported,
  );
  if (already !== undefined) return already.id;

  const playerId = TournamentPlayerId.create();
  const name = numberedApart(
    imported,
    tournament.players.map((each) => each.name.toString()),
  );
  tournament.addPlayer(
    playerId,
    {
      name,
      // Known in the rankings without the brackets that end the name, which
      // the old sites used to tell people apart and the rankings do not.
      // Where the sport has no world rankings the tournament keeps their name
      // whatever is given.
      worldRankingName: worldRankingNameToImport(name),
      representing: player.Representing ?? undefined,
      flag: flagOf(player.Representing),
    },
    by,
    at,
  );
  return playerId;
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
          const playerId = addOldPlayer(tournament, player, by, at);
          added.push({ number: player._Id, id: playerId.value });
        } catch (failure) {
          await this.database.recordError(
            `${website}/${id}`,
            `player ${String(player._Id)}: ${describedFailure(failure)}`,
            errorOf(tournament),
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
