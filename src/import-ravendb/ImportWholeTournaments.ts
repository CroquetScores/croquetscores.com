import type { ImportDatabase } from "./ImportDatabase.js";
import {
  type AcceptedImportErrors,
  oldSitePathOf,
} from "./AcceptedImportErrors.js";
import { couldBeATeamMatch, namedForTwoTeams } from "./ImportTeamMatches.js";
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
  /**
   * What it was before it was tried as a team match: brought over as that
   * where it is not.
   */
  readonly original?: {
    readonly document: object;
    readonly importer: Importer<object>;
  };
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
 * `tournament` as played by teams where it was set up as a Standard tournament
 * whose competitions are all team matches, one or more, which the site keeps
 * only as tests of a tournament played by teams
 * (ImportWholeTournaments.feature); as it is otherwise.
 */
const setUpAsPlayedByTeams = (tournament: OldTournament): OldTournament =>
  tournament.TournamentType.trim().toLowerCase() === "standard" &&
  tournament.Competitions.length > 0 &&
  tournament.Competitions.every(({ Id }) =>
    Id.toLowerCase().startsWith("teammatches/"),
  )
    ? { ...tournament, TournamentType: "teams" }
    : tournament;

// Tournaments the old sites kept as played by teams that were not, by the
// website and the document (ImportWholeTournaments.feature):
// tournaments/80204, the Murphy Shield LPG Southport v Chester, with no team
// match, only a block.
const STANDARD: ReadonlySet<string> = new Set([
  "croquetscores.com/tournaments/80204",
]);

// Tournaments left behind with everything that names them, by the website
// and the document, with why (ImportWholeTournaments.feature):
// tournaments/82149, the Mt Albert Croquet Club Rose Bowl Tournament, whose
// block and team match had no games.
const LEFT_BEHIND: ReadonlyMap<string, string> = new Map([
  ["croquetscores.com/tournaments/82149", "No games"],
]);

/**
 * A block, knockout or Swiss tried as a team match: played over its
 * tournament's days, the best of what it was kept as or of 1, and expected to
 * have as many matches as its games say (ImportTeamMatches.ts).
 */
const asTeamMatch = (
  competition: object,
  tournament: OldTournament,
): object => {
  const { BestOf: kept, Name: name } = competition as {
    BestOf?: unknown;
    Name?: unknown;
  };
  return {
    ...competition,
    // Written "A vs B", as a team match is named.
    Name: typeof name === "string" ? (namedForTwoTeams(name) ?? name) : name,
    BestOf: typeof kept === "number" && kept > 0 ? kept : 1,
    Start: tournament.Start,
    Finish: tournament.Finish,
    ExpectedMatches: 1,
    Group: null,
  };
};

// What a kind of competition is called in what is said of it.
const KINDS: Readonly<Record<string, string>> = {
  Blocks: "block",
  Knockouts: "knockout",
  Swisses: "Swiss",
};

/**
 * Where the tournament `document` was on its old site, as "2025/gc/rose-bowl":
 * the year it started, its sport, and its slug.
 */
const oldAddressOf = (document: OldTournament): string =>
  `${document.Start.slice(0, 4)}/${document.SportType.trim().toLowerCase()}/${document.Slug}`;

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
    private readonly correcting: AcceptedImportErrors,
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
    // Left behind the same way where the import names it, and said as
    // corrected, with why.
    const why = LEFT_BEHIND.get(`${website}/${id}`.toLowerCase());
    if (why !== undefined) {
      await this.database.recordTournamentRead(website, id);
      await this.#corrected(
        website,
        id,
        document,
        undefined,
        "ImportWholeTournaments.LeftBehind",
        why,
      );
      return;
    }

    // Asked for all at once, since none waits on another's answer and each
    // is a round trip to the old site.
    const [players, commentaries, ...competitions] = await Promise.all([
      this.#naming(this.parts.players, id),
      this.#naming(this.parts.commentaries, id),
      ...this.parts.competitions.map((importer) => this.#naming(importer, id)),
    ]);
    // A tournament the import names as Standard is set up as one, whatever
    // the old site said.
    const standard = STANDARD.has(`${website}/${id}`.toLowerCase());
    const setUp = standard
      ? { ...document, TournamentType: "standard" }
      : setUpAsPlayedByTeams(document);

    // A block, knockout or Swiss of a tournament played by teams, which the
    // site has no place for, that is named for two teams and whose players
    // each represent one, is tried as a team match, by what brings over team
    // matches, and is brought over as what it was where that is refused.
    const teamMatches: Importer<object> | undefined =
      this.parts.competitions.find(
        ({ collection }) => collection === "TeamMatches",
      );
    const tried = (each: Named): Named =>
      teamMatches !== undefined &&
      isPlayedByTeams(setUp.TournamentType) &&
      each.importer.collection in KINDS &&
      !isArchived(each.document) &&
      couldBeATeamMatch(
        each.document as Parameters<typeof couldBeATeamMatch>[0],
      )
        ? {
            ...each,
            document: asTeamMatch(each.document, document),
            importer: teamMatches,
            original: { document: each.document, importer: each.importer },
          }
        : each;
    const named = [
      ...players,
      ...this.#inListedOrder(document, competitions.flat()),
      ...commentaries,
    ].map(tried);
    await this.database.recordTournamentRead(website, id);
    try {
      await this.parts.tournament.importDocument({
        ...read,
        document: heldOverItsTeamMatches(setUp, named),
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

    if (standard) {
      await this.#corrected(
        website,
        id,
        document,
        undefined,
        "ImportWholeTournaments.ImportedAsStandard",
        `${document.Name} was kept as played by teams, with no team match to play, and is brought over as a Standard tournament.`,
      );
    }

    for (const tryAsTeamMatch of named) {
      let each: Named = tryAsTeamMatch;
      if (tryAsTeamMatch.original !== undefined) {
        // Tried as a team match. Where it is refused, whatever it kept is
        // rolled back with it, and it is brought over as what it was.
        try {
          await tryAsTeamMatch.importer.importDocument({
            website,
            id: tryAsTeamMatch.id,
            document: tryAsTeamMatch.document,
          });
          const kind = KINDS[tryAsTeamMatch.original.importer.collection];
          await this.#corrected(
            website,
            id,
            document,
            tryAsTeamMatch,
            "ImportWholeTournaments.ImportedAsTeamMatch",
            `${(tryAsTeamMatch.document as { Name?: string }).Name ?? tryAsTeamMatch.id} was kept as a ${kind ?? "competition"} of a tournament played by teams, which the site has no place for, and is brought over as a team match.`,
          );
          continue;
        } catch {
          each = { ...tryAsTeamMatch, ...tryAsTeamMatch.original };
        }
      }
      try {
        await each.importer.importDocument({
          website,
          id: each.id,
          document: each.document,
        });
      } catch (failure) {
        // Kept with the tournament, which is over by now, and with what a
        // competition was called on the old site, since it never became one.
        // On the site, it is the tournament's page that can be read; on the
        // old site, a competition's own.
        const tournament = await this.database.tournamentOf(website, id);
        const { Name: name, Slug: slug } = each.document as {
          Name?: unknown;
          Slug?: unknown;
        };
        const competition = this.#isCompetition(each.importer);
        await this.database.recordError(
          `${website}/${each.id}`,
          describedFailure(failure),
          tournament === undefined
            ? undefined
            : {
                ...tournament,
                newSitePath: tournament.tournamentAddress,
                oldSitePath: oldSitePathOf(
                  tournament.tournamentAddress,
                  competition && typeof slug === "string" ? slug : undefined,
                ),
                ...(competition &&
                typeof name === "string" &&
                name.trim() !== ""
                  ? { competitionName: name }
                  : {}),
              },
        );
      }
    }
  }

  // Says that `each`, or the tournament `id` itself where it is undefined,
  // was corrected as `code`, with where it is on the site, the tournament's
  // page where it was brought over, and on the old site.
  async #corrected(
    website: string,
    id: string,
    document: OldTournament,
    each: Named | undefined,
    code: string,
    description: string,
  ): Promise<void> {
    const tournament = await this.database.tournamentOf(website, id);
    const slug = (each?.document as { Slug?: unknown } | undefined)?.Slug;
    await this.correcting.accept({
      documentId: `${website}/${each?.id ?? id}`,
      website,
      newSitePath: tournament?.tournamentAddress,
      oldSitePath: oldSitePathOf(
        oldAddressOf(document),
        typeof slug === "string" ? slug : undefined,
      ),
      what: "",
      code,
      description,
    });
  }

  // Whether `importer` brings over one of the kinds of competition.
  #isCompetition(importer: Importer<object>): boolean {
    return (this.parts.competitions as readonly Importer<object>[]).includes(
      importer,
    );
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
