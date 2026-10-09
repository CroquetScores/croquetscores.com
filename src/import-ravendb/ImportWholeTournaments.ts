import type { ImportDatabase } from "./ImportDatabase.js";
import { describedFailure } from "./ImportRefused.js";
import type { Commentary as OldCommentary } from "./ravendb-models/Commentary.js";
import type {
  Competition as OldCompetition,
  TeamMatch as OldTeamMatch,
} from "./ravendb-models/Competition.js";
import { isPlayedByTeams } from "./ImportTournaments.js";
import type { Tournament as OldTournament } from "./ravendb-models/Tournament.js";
import type { TournamentPlayers } from "./ravendb-models/TournamentPlayers.js";
import type { Importer, ReadDocument } from "./runImporter.js";

/** One of the old sites' databases, asked for what names a tournament. */
export interface TournamentDocuments {
  /**
   * The documents of `collection` that name the tournament
   * `tournamentDocumentId`, in any case, in the same order however often it
   * is asked.
   */
  naming<TDocument extends object>(
    collection: string,
    tournamentDocumentId: string,
  ): Promise<readonly { readonly id: string; readonly document: TDocument }[]>;
}

/** What brings over a tournament, and each kind of document that names one. */
export interface TournamentParts {
  readonly tournament: Importer<OldTournament>;
  readonly players: Importer<TournamentPlayers>;
  /** In the order a competition its tournament does not list is added in. */
  readonly competitions: readonly Importer<OldCompetition>[];
  readonly commentaries: Importer<OldCommentary>;
}

// A document that names a tournament, and what brings it over.
interface Named {
  readonly id: string;
  readonly document: object;
  readonly importer: Importer<object>;
}

/**
 * Whether the old sites archived `document`, to be rid of it. Left out of a
 * document that is never archived, such as a tournament's players.
 */
export const isArchived = (document: object): boolean =>
  (document as { IsArchived?: unknown }).IsArchived === true;

/**
 * `tournament` held over the days of `named`'s team matches not archived,
 * where it is played by teams and has one (ImportWholeTournaments.feature):
 * starting when the first of them started and finishing when the last
 * finished, which the old sites often did not keep as the tournament's own,
 * and a test is refused outside its tournament's days. As it is otherwise.
 * The old sites wrote every moment alike, so the earliest is the least.
 */
/**
 * `tournament` as played by teams where it was set up as a Standard
 * tournament listing one competition, a team match, which the site keeps
 * only as a test of a tournament played by teams (ImportWholeTournaments.feature);
 * as it is otherwise.
 */
const setUpAsPlayedByTeams = (tournament: OldTournament): OldTournament => {
  const [only, ...others] = tournament.Competitions;
  return tournament.TournamentType.trim().toLowerCase() === "standard" &&
    others.length === 0 &&
    only !== undefined &&
    only.Id.toLowerCase().startsWith("teammatches/")
    ? { ...tournament, TournamentType: "teams" }
    : tournament;
};

const heldOverItsTeamMatches = (
  tournament: OldTournament,
  named: readonly Named[],
): OldTournament => {
  if (!isPlayedByTeams(tournament.TournamentType)) return tournament;
  const played = named.flatMap(({ document, importer }) =>
    importer.collection === "TeamMatches" && !isArchived(document)
      ? [document as OldTeamMatch]
      : [],
  );
  if (played.length === 0) return tournament;
  const starts = played.map(({ Start }) => Start).sort();
  const finishes = played.map(({ Finish }) => Finish).sort();
  return {
    ...tournament,
    Start: starts[0] ?? tournament.Start,
    Finish: finishes.at(-1) ?? tournament.Finish,
  };
};

/**
 * Brings each of the old sites' tournaments over with everything that names
 * it (ImportWholeTournaments.feature): the tournament, then its players, then
 * its competitions in the order it listed them, then its commentaries. A
 * competition it does not list goes after those it does.
 *
 * Each document is brought over in a transaction of its own, as it was when
 * each collection was brought over by itself, so that one the site refuses is
 * kept as an error against it and leaves the rest standing. A tournament
 * archived is left behind with everything naming it. One refused is kept as
 * an error by whoever runs this, and everything naming it as an error of its
 * own, so that the errors count every document not brought over.
 *
 * Every tournament read is kept as read, so that RefuseLeftOvers can find
 * what no tournament took: an archived one at once, and any other once the
 * old site has said what names it. One the old site could not be asked about
 * is not kept as read, so that what names it is refused there, and counted,
 * rather than passed over as though it had been taken.
 */
export class ImportWholeTournaments implements Importer<OldTournament> {
  readonly collection = "Tournaments";

  constructor(
    private readonly documents: TournamentDocuments,
    private readonly parts: TournamentParts,
    private readonly database: ImportDatabase,
  ) {}

  async importDocument(read: ReadDocument<OldTournament>): Promise<void> {
    const { website, id, document } = read;
    // Left behind with everything that names it, as an archived one is: one
    // that lists no competition was started on the old sites and never
    // played, whatever names it.
    if (document.IsArchived || document.Competitions.length === 0) {
      await this.database.recordTournamentRead(website, id);
      return;
    }

    // Asked for all at once, since none waits on another's answer and each
    // is a round trip to the old site.
    const [players, commentaries, ...competitions] = await Promise.all([
      this.#naming(this.parts.players, id),
      this.#naming(this.parts.commentaries, id),
      ...this.parts.competitions.map((importer) => this.#naming(importer, id)),
    ]);
    const named = [
      ...players,
      ...this.#inListedOrder(document, competitions.flat()),
      ...commentaries,
    ];
    await this.database.recordTournamentRead(website, id);

    try {
      await this.parts.tournament.importDocument({
        ...read,
        document: heldOverItsTeamMatches(setUpAsPlayedByTeams(document), named),
      });
    } catch (failure) {
      for (const each of named) {
        if (isArchived(each.document)) continue;
        await this.database.recordError(
          `${website}/${each.id}`,
          `ImportWholeTournaments.TournamentRefused: The tournament ${id} it names was refused.`,
        );
      }
      throw failure;
    }

    for (const each of named) {
      try {
        await each.importer.importDocument({
          website,
          id: each.id,
          document: each.document,
        });
      } catch (failure) {
        await this.database.recordError(
          `${website}/${each.id}`,
          describedFailure(failure),
        );
      }
    }
  }

  async #naming<TDocument extends object>(
    importer: Importer<TDocument>,
    tournamentDocumentId: string,
  ): Promise<Named[]> {
    const found = await this.documents.naming<TDocument>(
      importer.collection,
      tournamentDocumentId,
    );
    return found.map(({ id, document }) => ({
      id,
      document,
      importer,
    }));
  }

  // Sorted, rather than each moved up after it is added, so that a
  // competition is added where it belongs and records nothing besides. The
  // sort keeps the order of those it puts in the same place, which for those
  // the list does not hold is the order they were found in. The old sites
  // wrote a key in more than one case, so each is compared in small letters.
  #inListedOrder(tournament: OldTournament, competitions: Named[]): Named[] {
    const listed = tournament.Competitions.map(({ Id }) => Id.toLowerCase());
    const placeOf = ({ id }: Named): number => {
      const at = listed.indexOf(id.toLowerCase());
      return at === -1 ? listed.length : at;
    };
    return [...competitions].sort(
      (one, other) => placeOf(one) - placeOf(other),
    );
  }
}
