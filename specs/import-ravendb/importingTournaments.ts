// What the features importing the old sites' tournaments, players and
// competitions share: the importers over the scenario's own database, the old
// document a scenario is writing, built a field at a time, the old site every
// document written is kept in, and the steps more than one of the features is
// written in. Imported by their step definitions
// rather than found by Cucumber, so that each step is defined once, whichever
// feature is run.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { AggregateRepository } from "../../src/application/common/AggregateRepository.js";
import { ProjectingEventStore } from "../../src/application/common/ProjectingEventStore.js";
import { CommentariesByTournament } from "../../src/infrastructure/read-models/CommentariesByTournament.js";
import { ManagerNotesByTournament } from "../../src/infrastructure/read-models/ManagerNotesByTournament.js";
import { SeeNotes } from "../../src/import-ravendb/SeeNotes.js";
import { ImportErrorsNote } from "../../src/import-ravendb/ImportErrorsNote.js";
import { ManagerNote } from "../../src/domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import type { ManagerNoteId } from "../../src/domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import { Account } from "../../src/domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../src/domain/aggregates/accounts/AccountId.js";
import { Commentary } from "../../src/domain/aggregates/tournaments/commentaries/Commentary.js";
import { Competition } from "../../src/domain/aggregates/tournaments/competitions/Competition.js";
import type { CompetitionPlayer } from "../../src/domain/aggregates/tournaments/competitions/CompetitionPlayer.js";
import type { GamePlayerId } from "../../src/domain/aggregates/tournaments/competitions/Game.js";
import { CompetitionGameAdded } from "../../src/domain/aggregates/tournaments/competitions/events/CompetitionGameAdded.js";
import type { CommentaryId } from "../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import { CompetitionId } from "../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { TournamentId } from "../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import { Tournament } from "../../src/domain/aggregates/tournaments/Tournament.js";
import type { CompetitionInTournament } from "../../src/domain/aggregates/tournaments/Tournament.js";
import type {
  Accepted,
  AcceptedImportErrors,
} from "../../src/import-ravendb/AcceptedImportErrors.js";
import { ImportBlocks } from "../../src/import-ravendb/ImportBlocks.js";
import { ImportCommentaries } from "../../src/import-ravendb/ImportCommentaries.js";
import { ImportedAccounts } from "../../src/import-ravendb/ImportedAccounts.js";
import { ImportKnockouts } from "../../src/import-ravendb/ImportKnockouts.js";
import { ImportSwisses } from "../../src/import-ravendb/ImportSwisses.js";
import { ImportTeamMatches } from "../../src/import-ravendb/ImportTeamMatches.js";
import { ImportTournamentPlayers } from "../../src/import-ravendb/ImportTournamentPlayers.js";
import { ImportTournaments } from "../../src/import-ravendb/ImportTournaments.js";
import {
  ImportWholeTournaments,
  type TournamentDocuments,
} from "../../src/import-ravendb/ImportWholeTournaments.js";
import type { CompetitionPlayer as OldCompetitionPlayer } from "../../src/import-ravendb/ravendb-models/Competition.js";
import type { Tournament as OldTournament } from "../../src/import-ravendb/ravendb-models/Tournament.js";
import type {
  DocumentSource,
  Importer,
} from "../../src/import-ravendb/runImporter.js";
import { TournamentsByAccount } from "../../src/infrastructure/read-models/TournamentsByAccount.js";
import { TournamentsByAddress } from "../../src/infrastructure/read-models/TournamentsByAddress.js";
import { TournamentsByWebsite } from "../../src/infrastructure/read-models/TournamentsByWebsite.js";
import { accountsOf } from "../infrastructure/support/accounts.js";
import { unitOfWorkOf } from "../infrastructure/support/transactions.js";
import type { SpecWorld } from "../support/world.js";
import { importDatabaseOf } from "./importing.js";

// The old documents, as a scenario writes them: every field changeable, which
// the documents the import reads are not.
type Writable<T> = { -readonly [Field in keyof T]: T[Field] };

export type WrittenTournament = Writable<
  Omit<OldTournament, "Managers" | "Scorers" | "Competitions" | "CreatedBy">
> & {
  CreatedBy: { Id: string };
  // Besides whoever created it, whom the old sites made both.
  Managers: { Id: string }[];
  Scorers: { Id: string }[];
  Competitions: { Id: string }[];
};

export interface WrittenPlayer {
  _Id: number;
  Name: string;
  Representing: string | null;
}

export type WrittenCompetitionPlayer = Writable<
  Omit<OldCompetitionPlayer, "CarryForward">
> & {
  CarryForward: Writable<OldCompetitionPlayer["CarryForward"]>;
};

export interface WrittenGame {
  Id: number;
  Winner: { PlayerId: number; Score: { _Score: string } };
  Loser: { PlayerId: number; Score: { _Score: string } };
  CreatedAt: string;
}

export interface WrittenCompetition {
  Tournament: { Id: string };
  Name: string;
  Slug?: string;
  Players: { _Players: WrittenCompetitionPlayer[] };
  Games: { _Games: WrittenGame[] };
  IsArchived: boolean;
  BestOf: number;
  Size: number;
  Start: string;
  Finish: string;
  ExpectedMatches: number;
  Group: string | null;
}

export type CompetitionKind = "block" | "knockout" | "swiss" | "team match";

export interface WrittenComment {
  Content: string;
  CreatedAt: string;
  IsArchived: boolean;
}

export interface WrittenCommentary {
  Tournament: { Id: string };
  Commentator: { Id: string };
  Title: string;
  Comments: WrittenComment[];
  IsArchived: boolean;
}

/** The old document a scenario is writing, and where it is from. */
export type Writing =
  | {
      readonly kind: "tournament";
      readonly website: string;
      readonly id: string;
      readonly document: WrittenTournament;
    }
  | {
      readonly kind: "players";
      readonly website: string;
      readonly id: string;
      readonly document: {
        Tournament: { Id: string };
        _Players: WrittenPlayer[];
      };
    }
  | {
      readonly kind: CompetitionKind;
      readonly website: string;
      readonly id: string;
      readonly document: WrittenCompetition;
    }
  | {
      readonly kind: "commentary";
      readonly website: string;
      readonly id: string;
      readonly document: WrittenCommentary;
    };

/**
 * One old site's documents as a scenario wrote them, a list to each
 * collection, read as RavenDB is read.
 */
export class WrittenSite implements DocumentSource, TournamentDocuments {
  readonly #collections = new Map<string, { id: string; document: object }[]>();
  // The collections asking what names a tournament fails for, as RavenDB's
  // does when it gives up waiting for an index.
  readonly #failing = new Set<string>();

  constructor(readonly website: string) {}

  /** Has asking `collection` what names a tournament fail from now on. */
  failNaming(collection: string): void {
    this.#failing.add(collection);
  }

  add(collection: string, id: string, document: object): void {
    const documents = this.#collections.get(collection) ?? [];
    documents.push({ id, document });
    this.#collections.set(collection, documents);
  }

  /** The document `id`, of whichever collection it is in. */
  find(id: string): object | undefined {
    for (const documents of this.#collections.values()) {
      const found = documents.find((each) => each.id === id);
      if (found !== undefined) return found.document;
    }
    return undefined;
  }

  page<TDocument extends object>(
    collection: string,
    skip: number,
    take: number,
  ): Promise<readonly { readonly id: string; readonly document: TDocument }[]> {
    return Promise.resolve(
      (this.#collections.get(collection) ?? []).slice(skip, skip + take) as {
        id: string;
        document: TDocument;
      }[],
    );
  }

  // In any case, as RavenDB compares them.
  naming<TDocument extends object>(
    collection: string,
    tournamentDocumentId: string,
  ): Promise<readonly { readonly id: string; readonly document: TDocument }[]> {
    if (this.#failing.has(collection)) {
      return Promise.reject(
        new Error(`Waiting for the index of ${collection} timed out.`),
      );
    }
    return Promise.resolve(
      (this.#collections.get(collection) ?? []).filter(
        ({ document }) =>
          (
            document as { Tournament?: { Id: string } }
          ).Tournament?.Id.toLowerCase() === tournamentDocumentId.toLowerCase(),
      ) as { id: string; document: TDocument }[],
    );
  }
}

interface Importers {
  /** Brings over a tournament on `website` with what names it there. */
  readonly whole: (website: string) => ImportWholeTournaments;
  readonly tournaments: ImportTournaments;
  readonly players: ImportTournamentPlayers;
  readonly blocks: ImportBlocks;
  readonly knockouts: ImportKnockouts;
  readonly swisses: ImportSwisses;
  readonly teamMatches: ImportTeamMatches;
  readonly commentaries: ImportCommentaries;
}

/** What a scenario's import accepted, kept for the scenario to read. */
class AcceptedInScenario implements AcceptedImportErrors {
  readonly said: Accepted[] = [];

  accept(accepted: Accepted): Promise<void> {
    this.said.push(accepted);
    return Promise.resolve();
  }
}

interface Importing {
  readonly tournaments: AggregateRepository<Tournament, TournamentId>;
  readonly competitions: AggregateRepository<Competition, CompetitionId>;
  readonly commentaries: AggregateRepository<Commentary, CommentaryId>;
  /** The commentaries of each tournament, as the read model of them has them. */
  readonly commentariesByTournament: CommentariesByTournament;
  readonly managerNotes: AggregateRepository<ManagerNote, ManagerNoteId>;
  /** The notes of each tournament, as the read model of them has them. */
  readonly managerNotesByTournament: ManagerNotesByTournament;
  readonly importers: Importers;
  readonly accepted: AcceptedInScenario;
  /** What the scenario's import corrected, kept the same way. */
  readonly corrected: AcceptedInScenario;
  writing?: Writing;
  /** The tournament written last, which "the tournament" means. */
  tournament?: Writing & { readonly kind: "tournament" };
  refused?: unknown;
  /** Every document written, by its website. */
  readonly sites: Map<string, WrittenSite>;
}

const importings = new WeakMap<SpecWorld, Importing>();

/**
 * The importers over the scenario's own database, made the first time any is
 * asked for, over the accounts "the users are imported" keeps: everything is
 * kept in the store the accounts are, with the site's read models over
 * tournaments kept in step, as the import keeps them.
 */
export const importingOf = (world: SpecWorld): Importing => {
  const found = importings.get(world);
  if (found !== undefined) return found;
  const unitOfWork = unitOfWorkOf(world);
  const accounts = accountsOf(world);
  const database = importDatabaseOf(world);
  const commentariesByTournament = new CommentariesByTournament(unitOfWork);
  const managerNotesByTournament = new ManagerNotesByTournament(unitOfWork);
  const store = new ProjectingEventStore(accounts.store, [
    accounts.readModel,
    accounts.byGoogleAccount,
    new TournamentsByAddress(unitOfWork),
    new TournamentsByAccount(unitOfWork),
    // Where an error of a document refused whole finds its tournament's name
    // and address, as it does in the import.
    new TournamentsByWebsite(unitOfWork),
    commentariesByTournament,
    managerNotesByTournament,
  ]);
  // Wrapped rather than handed over as they are: a static passed on its own is
  // a method separated from what it was declared on.
  const tournaments = new AggregateRepository(
    store,
    (id: TournamentId, events) => Tournament.rebuiltFrom(id, events),
  );
  const competitions = new AggregateRepository(
    store,
    (id: CompetitionId, events) => Competition.rebuiltFrom(id, events),
  );
  const accountRepository = new AggregateRepository(
    store,
    (id: AccountId, events) => Account.rebuiltFrom(id, events),
  );
  const commentaries = new AggregateRepository(
    store,
    (id: CommentaryId, events) => Commentary.rebuiltFrom(id, events),
  );
  const managerNotes = new AggregateRepository(
    store,
    (id: ManagerNoteId, events) => ManagerNote.rebuiltFrom(id, events),
  );
  const seeNotes = new SeeNotes(
    unitOfWork,
    tournaments,
    managerNotes,
    managerNotesByTournament,
    database,
  );
  const accepted = new AcceptedInScenario();
  const corrected = new AcceptedInScenario();
  const importErrorsNote = new ImportErrorsNote(
    unitOfWork,
    tournaments,
    managerNotes,
    managerNotesByTournament,
    database,
    seeNotes,
  );
  const importing = {
    unitOfWork,
    tournaments,
    competitions,
    database,
    accepting: accepted,
    correcting: corrected,
    notes: importErrorsNote,
  };
  const importedAccounts = new ImportedAccounts(
    accountRepository,
    accounts.hasher,
    database,
  );
  const players = new ImportTournamentPlayers(
    unitOfWork,
    tournaments,
    database,
  );
  const blocks = new ImportBlocks(importing);
  const knockouts = new ImportKnockouts(importing);
  const swisses = new ImportSwisses(importing);
  const teamMatches = new ImportTeamMatches(importing);
  const commentaryImporter = new ImportCommentaries(
    unitOfWork,
    tournaments,
    commentaries,
    importedAccounts,
    database,
    commentariesByTournament,
  );
  const tournamentImporter = new ImportTournaments(
    unitOfWork,
    tournaments,
    importedAccounts,
    database,
  );
  const sites = new Map<string, WrittenSite>();
  const made: Importing = {
    tournaments,
    competitions,
    commentaries,
    commentariesByTournament,
    managerNotes,
    managerNotesByTournament,
    accepted,
    corrected,
    importers: {
      whole: (website) =>
        new ImportWholeTournaments(
          siteOf(sites, website),
          {
            tournament: tournamentImporter,
            players,
            competitions: [blocks, knockouts, swisses, teamMatches],
            commentaries: commentaryImporter,
          },
          database,
          corrected,
          seeNotes,
        ),
      tournaments: tournamentImporter,
      players,
      blocks,
      knockouts,
      swisses,
      teamMatches,
      commentaries: commentaryImporter,
    },
    sites,
  };
  importings.set(world, made);
  return made;
};

const siteOf = (
  sites: Map<string, WrittenSite>,
  website: string,
): WrittenSite => {
  const site = sites.get(website) ?? new WrittenSite(website);
  sites.set(website, site);
  return site;
};

/** The old site `website`, as the scenario has written it. */
export const writtenSiteOf = (world: SpecWorld, website: string): WrittenSite =>
  siteOf(importingOf(world).sites, website);

/** Every old site the scenario has written a document on. */
export const writtenSites = (world: SpecWorld): readonly WrittenSite[] => [
  ...importingOf(world).sites.values(),
];

// The documents, as each is written to begin with -------------------------------

/**
 * A tournament that is well made, so that what is refused is only ever what
 * the scenario named: the Spring Open, from 1 to 3 March 2014, the first sport
 * its website offered, in the Standard format, kept in Sydney's time zone. Its
 * slug is made from the document `id`, as "spring-open-12", since the old
 * sites never gave two tournaments of one year and one sport the same slug,
 * and the site refuses a second tournament at an address another has.
 */
export const aTournament = (
  website: string,
  id: string,
): WrittenTournament => ({
  Name: "Spring Open",
  Start: "2014-03-01T00:00:00.0000000",
  // On the day blocks stop being left behind for having nothing in them
  // (ImportBlocks.feature), so that a block a scenario writes with nothing in
  // it is brought over unless the scenario says when the tournament finished.
  // A tournament brought over may finish any time after it starts
  // (bringOver.feature).
  Finish: "2026-10-01T00:00:00.0000000",
  Slug: `spring-open-${id
    .slice(id.indexOf("/") + 1)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`,
  CreatedBy: { Id: "users/1" },
  Managers: [],
  Scorers: [],
  // One no document is, since a tournament that lists no competition is left
  // behind (ImportWholeTournaments.feature). A scenario about what one lists
  // says it, or that it lists nothing.
  Competitions: [{ Id: "blocks/0" }],
  SportType: website === "gateballscores.com" ? "GB" : "AC",
  TournamentType: "standard",
  TimeZoneId: "AUS Eastern Standard Time",
  Notes: null,
  DrawnMatchesAreNotDecidedByNetHoops: false,
  IsArchived: false,
});

// As the old sites kept it: whoever created it a manager and a scorer, and
// every manager a scorer.
const asKept = (written: WrittenTournament): OldTournament => ({
  ...written,
  Managers: [written.CreatedBy, ...written.Managers],
  Scorers: [written.CreatedBy, ...written.Managers, ...written.Scorers],
});

const NAMES: Readonly<Record<CompetitionKind, string>> = {
  block: "A Block",
  knockout: "Knockout",
  swiss: "Swiss",
  "team match": "New Zealand vs England",
};

/** A competition of `tournament` that is well made, and holds nobody. */
export const aCompetition = (
  kind: CompetitionKind,
  tournament: string,
): WrittenCompetition => ({
  Tournament: { Id: tournament },
  Name: NAMES[kind],
  Players: { _Players: [] },
  Games: { _Games: [] },
  IsArchived: false,
  BestOf: 1,
  Size: 2,
  Start: "2014-03-01T00:00:00.0000000",
  Finish: "2014-03-03T00:00:00.0000000",
  ExpectedMatches: 6,
  Group: null,
});

/** The player numbered `number`, carrying nothing and not withdrawn. */
export const aCompetitionPlayer = (
  number: number,
): WrittenCompetitionPlayer => ({
  _Id: number,
  Name: `Player ${String(number)}`,
  Representing: null,
  CarryForward: {
    MatchWins: 0,
    MatchLosses: 0,
    GameWins: 0,
    GameLosses: 0,
    ForHoops: 0,
    AgainstHoops: 0,
  },
  IsWithdrawn: false,
});

export const writingOf = (world: SpecWorld): Writing => {
  const { writing } = importingOf(world);
  assert.ok(writing !== undefined, "No old document is being written.");
  return writing;
};

export const tournamentWritten = (world: SpecWorld): WrittenTournament => {
  const writing = writingOf(world);
  assert.equal(writing.kind, "tournament", "No tournament is being written.");
  return writing.document;
};

export const competitionWritten = (world: SpecWorld): WrittenCompetition => {
  const writing = writingOf(world);
  assert.ok(
    writing.kind !== "tournament" &&
      writing.kind !== "players" &&
      writing.kind !== "commentary",
    "No competition is being written.",
  );
  return writing.document;
};

export const commentaryWritten = (world: SpecWorld): WrittenCommentary => {
  const writing = writingOf(world);
  assert.ok(writing.kind === "commentary", "No commentary is being written.");
  return writing.document;
};

/** That the scenario writes `writing` next, and asks nothing yet of what it is refused. */
export const startWriting = (world: SpecWorld, writing: Writing): void => {
  const state = importingOf(world);
  state.writing = writing;
  state.refused = undefined;
  if (writing.kind === "tournament") state.tournament = writing;
  siteOf(state.sites, writing.website).add(
    writing.kind === "tournament"
      ? "Tournaments"
      : importerFor(state.importers, writing.kind).collection,
    writing.id,
    writing.document,
  );
};

// Bringing a document over -------------------------------------------------------

const importerFor = (
  importers: Importers,
  kind: Exclude<Writing["kind"], "tournament">,
): Importer<object> =>
  ({
    players: importers.players,
    block: importers.blocks,
    knockout: importers.knockouts,
    swiss: importers.swisses,
    "team match": importers.teamMatches,
    commentary: importers.commentaries,
  })[kind];

// Brings `writing` over, keeping whatever it is refused with as the
// scenario's to judge rather than throwing it. A tournament is brought over
// whole, with whatever names it that has been written by then.
const importWriting = async (
  world: SpecWorld,
  writing: Writing,
): Promise<void> => {
  const state = importingOf(world);
  state.refused = undefined;
  try {
    if (writing.kind === "tournament") {
      await state.importers.whole(writing.website).importDocument({
        website: writing.website,
        id: writing.id,
        document: asKept(writing.document),
      });
    } else {
      await importerFor(state.importers, writing.kind).importDocument({
        website: writing.website,
        id: writing.id,
        document: writing.document,
      });
    }
  } catch (failure) {
    state.refused = failure;
  }
};

/** Brings the document being written over. */
export const importWritten = async (world: SpecWorld): Promise<void> => {
  await importWriting(world, writingOf(world));
};

/** Brings the tournament written last over, whole. */
export const importTournamentWritten = async (
  world: SpecWorld,
): Promise<void> => {
  const { tournament } = importingOf(world);
  assert.ok(tournament !== undefined, "No tournament has been written.");
  await importWriting(world, tournament);
};

/** Brings the tournament `id` on `website` over, whole, as it was written. */
export const importTournamentCalled = async (
  world: SpecWorld,
  id: string,
  website: string,
): Promise<void> => {
  const document = writtenSiteOf(world, website).find(id);
  assert.ok(document !== undefined, `No tournament ${id} has been written.`);
  await importWriting(world, {
    kind: "tournament",
    website,
    id,
    document: document as WrittenTournament,
  });
};

/** Brings `writing` over as a scenario's setting, which is refused with nothing. */
export const imported = async (
  world: SpecWorld,
  writing: Writing,
): Promise<void> => {
  startWriting(world, writing);
  await importWritten(world);
  const { refused } = importingOf(world);
  assert.equal(
    refused,
    undefined,
    `Importing was refused: ${inspect(refused)}`,
  );
};

// What was kept -------------------------------------------------------------------

/** The tournament the document `id` on `website` became. */
export const tournamentKeptFor = async (
  world: SpecWorld,
  id: string,
  website: string,
): Promise<Tournament> => {
  const state = importingOf(world);
  const written = await importDatabaseOf(world).findTournamentOf(website, id);
  assert.ok(
    written !== undefined,
    `${id} is not kept as any tournament.` +
      (state.refused === undefined
        ? ""
        : ` Importing was refused: ${inspect(state.refused)}`),
  );
  const tournament = await world.asARequest(() =>
    state.tournaments.load(TournamentId.from(written)),
  );
  assert.ok(tournament !== undefined, `${written} has no events.`);
  return tournament;
};

/**
 * The competition the document `id` on `website` became, with the tournament
 * it is in and what the tournament says of it.
 */
export const competitionKeptFor = async (
  world: SpecWorld,
  id: string,
  website: string,
): Promise<{
  readonly tournament: Tournament;
  readonly competition: Competition;
  readonly inTournament: CompetitionInTournament;
}> => {
  const state = importingOf(world);
  const found = await importDatabaseOf(world).findCompetitionOf(website, id);
  assert.ok(
    found !== undefined,
    `${id} is not kept as any competition.` +
      (state.refused === undefined
        ? ""
        : ` Importing was refused: ${inspect(state.refused)}`),
  );
  const competitionId = CompetitionId.from(found.competitionId);
  return world.asARequest(async () => {
    const tournament = await state.tournaments.load(
      TournamentId.from(found.tournamentId),
    );
    assert.ok(tournament !== undefined, `${found.tournamentId} has no events.`);
    const inTournament = tournament.competitions.find(({ reference }) =>
      reference.id.equals(competitionId),
    );
    assert.ok(inTournament !== undefined, "The tournament does not have it.");
    const competition =
      (await state.competitions.load(competitionId)) ??
      Competition.rebuiltFrom(competitionId, []);
    return { tournament, competition, inTournament };
  });
};

/**
 * What the player who played as `id` in `competition` is called: the
 * tournament's player they were entered as, or the player of a team.
 */
export const nameOf = (
  tournament: Tournament,
  competition: Competition,
  id: GamePlayerId,
): string => {
  const entered = competition.players.find((each) => each.id.equals(id));
  const player =
    (entered === undefined
      ? undefined
      : tournament.players.find((each) =>
          each.id.equals(entered.tournamentPlayerId),
        )) ??
    tournament.teams
      .flatMap((team) => team.players)
      .find((each) => each.id.equals(id));
  assert.ok(player !== undefined, `Nobody plays as ${id.value}.`);
  return player.name.toString();
};

/** The competition's player who is the tournament player called `name`. */
export const competitionPlayerCalled = (
  tournament: Tournament,
  competition: Competition,
  name: string,
): CompetitionPlayer => {
  const tournamentPlayer = tournament.players.find(
    (each) => each.name.toString() === name,
  );
  assert.ok(tournamentPlayer !== undefined, `Nobody is called ${name}.`);
  const player = competition.players.find((each) =>
    each.tournamentPlayerId.equals(tournamentPlayer.id),
  );
  assert.ok(player !== undefined, `${name} is not in the competition.`);
  return player;
};

/** The games of a competition in use, in the order they were added. */
export const gamesInUse = (competition: Competition) =>
  competition.games.filter((game) => !game.archived);

/** When the first game the competition `id` on `website` was added at. */
export const firstGameAddedAt = async (
  world: SpecWorld,
  id: string,
  website: string,
): Promise<string> => {
  const { competition } = await competitionKeptFor(world, id, website);
  const events = await world.asARequest(() =>
    accountsOf(world).store.getEvents(competition.id),
  );
  const added = events.find((event) => event instanceof CompetitionGameAdded);
  assert.ok(added !== undefined, "No game was added.");
  return added.occurredAt.toISOString();
};

// Importers being stood up -------------------------------------------------------

// Each says which importer a feature is about, and every importer is stood up
// the first time any is, since a scenario setting one feature's scene brings
// documents over by the others.
const standUp = function (this: SpecWorld): void {
  importingOf(this);
};
Given("the tournaments are imported", standUp);
Given("the tournament players are imported", standUp);
Given("the blocks are imported", standUp);
Given("the knockouts are imported", standUp);
Given("the Swisses are imported", standUp);
Given("the team matches are imported", standUp);
Given("the commentaries are imported", standUp);

// Scenes set by bringing documents over -----------------------------------------

const tournamentImported = async (
  world: SpecWorld,
  id: string,
  website: string,
  fields: Partial<WrittenTournament> = {},
): Promise<void> => {
  await imported(world, {
    kind: "tournament",
    website,
    id,
    document: { ...aTournament(website, id), ...fields },
  });
};

Given(
  "a tournament {string} on {string} is imported",
  async function (this: SpecWorld, id: string, website: string) {
    await tournamentImported(this, id, website);
  },
);

// Started and finished on the one day, so that a scenario says only when it
// finished.
Given(
  "a tournament {string} on {string} finishing on {string} is imported",
  async function (this: SpecWorld, id: string, website: string, day: string) {
    await tournamentImported(this, id, website, { Start: day, Finish: day });
  },
);

Given(
  "a tournament {string} on {string} of the type {string} is imported",
  async function (this: SpecWorld, id: string, website: string, type: string) {
    await tournamentImported(this, id, website, { TournamentType: type });
  },
);

// Each in a document of its own, which the old sites never did, so that a
// scenario can name its players one at a time.
const playerImported = async (
  world: SpecWorld,
  number: number,
  tournament: string,
  website: string,
  name: string,
): Promise<void> => {
  await imported(world, {
    kind: "players",
    website,
    id: `tournamentplayers/${tournament}/${String(number)}`,
    document: {
      Tournament: { Id: tournament },
      _Players: [{ _Id: number, Name: name, Representing: null }],
    },
  });
};

Given(
  "player {int} of {string} on {string} is imported as {string}",
  async function (
    this: SpecWorld,
    number: number,
    tournament: string,
    website: string,
    name: string,
  ) {
    await playerImported(this, number, tournament, website, name);
  },
);

Given(
  "player {int} of {string} on {string} was the old site's bye",
  async function (
    this: SpecWorld,
    number: number,
    tournament: string,
    website: string,
  ) {
    await playerImported(this, number, tournament, website, "Bye");
  },
);

// Writing a competition's players and games ---------------------------------------

/** The player numbered `number` of the competition being written, added where there is none. */
export const competitionPlayerWritten = (
  world: SpecWorld,
  number: number,
): WrittenCompetitionPlayer => {
  const players = competitionWritten(world).Players._Players;
  const found = players.find((player) => player._Id === number);
  if (found !== undefined) return found;
  const added = aCompetitionPlayer(number);
  players.push(added);
  return added;
};

// The player numbered `number` of whatever document is being written: the
// tournament's players, or a competition's.
const playerWritten = (
  world: SpecWorld,
  number: number,
): { Name: string; Representing: string | null } => {
  const writing = writingOf(world);
  if (writing.kind === "players") {
    const players = writing.document._Players;
    const found = players.find((player) => player._Id === number);
    if (found !== undefined) return found;
    const added = {
      _Id: number,
      Name: `Player ${String(number)}`,
      Representing: null,
    };
    players.push(added);
    return added;
  }
  return competitionPlayerWritten(world, number);
};

Given(
  "player {int} is called {string}",
  function (this: SpecWorld, number: number, name: string) {
    playerWritten(this, number).Name = name;
  },
);

Given(
  "player {int} represents {string}",
  function (this: SpecWorld, number: number, representing: string) {
    playerWritten(this, number).Representing = representing;
  },
);

Given(
  "player {int} represents nothing",
  function (this: SpecWorld, number: number) {
    playerWritten(this, number).Representing = null;
  },
);

// The game numbered `number`, added where there is none, won 26 to nothing by
// nobody in particular until the scenario says who.
const gameWritten = (world: SpecWorld, number: number): WrittenGame => {
  const games = competitionWritten(world).Games._Games;
  const found = games.find((game) => game.Id === number);
  if (found !== undefined) return found;
  const added: WrittenGame = {
    Id: number,
    Winner: { PlayerId: 0, Score: { _Score: "26" } },
    Loser: { PlayerId: 0, Score: { _Score: "0" } },
    CreatedAt: "2014-03-01T12:00:00.0000000",
  };
  games.push(added);
  return added;
};

Given(
  "game {int} was won by player {int}",
  function (this: SpecWorld, game: number, player: number) {
    gameWritten(this, game).Winner.PlayerId = player;
  },
);

Given(
  "game {int} was lost by player {int}",
  function (this: SpecWorld, game: number, player: number) {
    gameWritten(this, game).Loser.PlayerId = player;
  },
);

Given(
  "game {int}'s winner scored {string}",
  function (this: SpecWorld, game: number, score: string) {
    gameWritten(this, game).Winner.Score._Score = score;
  },
);

Given(
  "game {int}'s loser scored {string}",
  function (this: SpecWorld, game: number, score: string) {
    gameWritten(this, game).Loser.Score._Score = score;
  },
);

Given(
  "game {int} was kept at {string}",
  function (this: SpecWorld, game: number, moment: string) {
    gameWritten(this, game).CreatedAt = moment;
  },
);

// Bringing the document over -----------------------------------------------------

const importIt = async function (this: SpecWorld): Promise<void> {
  await importWritten(this);
};
Given(
  "{string} fails when asked which {string} name a tournament",
  function (this: SpecWorld, website: string, collection: string) {
    writtenSiteOf(this, website).failNaming(collection);
  },
);

When("the tournament is imported", async function (this: SpecWorld) {
  await importTournamentWritten(this);
});
When("the players are imported", importIt);
When("the competition is imported", importIt);
When("the team match is imported", importIt);

Then(
  /^importing the (?:tournament|players|competition|team match|commentary) is refused with "(.*)"$/,
  function (this: SpecWorld, code: string) {
    const { refused } = importingOf(this);
    assert.ok(refused !== undefined, "Importing was not refused.");
    assert.equal((refused as { code?: unknown }).code, code, inspect(refused));
  },
);

// By what its message says, for a refusal whose code is not the whole of it.
Then(
  /^importing the (?:tournament|players|competition|team match|commentary) is refused saying "(.*)"$/,
  function (this: SpecWorld, says: string) {
    const { refused } = importingOf(this);
    assert.ok(refused !== undefined, "Importing was not refused.");
    const message = (refused as { message?: unknown }).message;
    assert.ok(
      typeof message === "string" && message.includes(says),
      inspect(refused),
    );
  },
);

Then(
  /^importing the (?:tournament|players|competition|team match|commentary) is not refused$/,
  function (this: SpecWorld) {
    const { refused } = importingOf(this);
    assert.equal(
      refused,
      undefined,
      `Importing was refused: ${inspect(refused)}`,
    );
  },
);

// What was kept, of more than one feature ---------------------------------------

Then(
  "{string} on {string} is not kept as any tournament",
  async function (this: SpecWorld, id: string, website: string) {
    assert.equal(
      await importDatabaseOf(this).findTournamentOf(website, id),
      undefined,
    );
  },
);

Then(
  "{string} on {string} is not kept as any competition",
  async function (this: SpecWorld, id: string, website: string) {
    assert.equal(
      await importDatabaseOf(this).findCompetitionOf(website, id),
      undefined,
    );
  },
);

Then(
  "player {int} of {string} on {string} is not kept as any player",
  async function (
    this: SpecWorld,
    number: number,
    tournament: string,
    website: string,
  ) {
    assert.equal(
      await importDatabaseOf(this).findPlayerOf(website, tournament, number),
      undefined,
    );
  },
);

Then(
  "the tournament kept for {string} on {string} has the competition {string}",
  async function (this: SpecWorld, id: string, website: string, name: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.ok(
      tournament.competitions.some(
        ({ reference }) => reference.name.toString() === name,
      ),
      `It has ${tournament.competitions.map(({ reference }) => String(reference.name)).join(", ")}.`,
    );
  },
);

Then(
  "the competition {string} of the tournament kept for {string} on {string} is not archived",
  async function (this: SpecWorld, name: string, id: string, website: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    const found = tournament.competitions.find(
      ({ reference }) => reference.name.toString() === name,
    );
    assert.ok(found !== undefined, `It has no competition ${name}.`);
    assert.equal(found.reference.archived, false);
  },
);

Then(
  /^the competition kept for "(.*)" on "(.*)" has (\d+) games?$/,
  async function (this: SpecWorld, id: string, website: string, count: string) {
    const { competition } = await competitionKeptFor(this, id, website);
    assert.equal(gamesInUse(competition).length, Number(count));
  },
);

Then(
  "the tournament kept for {string} on {string} has no players",
  async function (this: SpecWorld, id: string, website: string) {
    assert.deepEqual((await tournamentKeptFor(this, id, website)).players, []);
  },
);

Then(
  /^the tournament kept for "(.*)" on "(.*)" has (\d+) players?$/,
  async function (this: SpecWorld, id: string, website: string, count: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(tournament.players.length, Number(count));
  },
);

Then(
  "the tournament kept for {string} on {string} has the team {string}",
  async function (this: SpecWorld, id: string, website: string, name: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.ok(
      tournament.teams.some((team) => team.name.toString() === name),
      `It has ${tournament.teams.map((team) => team.name.toString()).join(", ")}.`,
    );
  },
);

// What was accepted rather than kept as an error -----------------------------------

const acceptedOf = (world: SpecWorld, documentId: string): Accepted[] =>
  importingOf(world).accepted.said.filter(
    (accepted) => accepted.documentId === documentId,
  );

Then(
  "{string} is accepted as {string}",
  function (this: SpecWorld, documentId: string, code: string) {
    const said = acceptedOf(this, documentId);
    assert.ok(
      said.some((accepted) => accepted.code === code),
      `Nothing of ${documentId} is accepted as ${code}: ${inspect(said)}`,
    );
  },
);

Then(
  "{string} of {string} is accepted as {string}",
  function (this: SpecWorld, what: string, documentId: string, code: string) {
    const said = acceptedOf(this, documentId);
    assert.ok(
      said.some((accepted) => accepted.what === what && accepted.code === code),
      `${what} of ${documentId} is not accepted as ${code}: ${inspect(said)}`,
    );
  },
);

Then(
  "nothing is accepted of {string}",
  function (this: SpecWorld, documentId: string) {
    assert.deepEqual(acceptedOf(this, documentId), []);
  },
);

Then(
  "what is accepted of {string} is at {string} on the new site and {string} on the old site",
  function (
    this: SpecWorld,
    documentId: string,
    newSitePath: string,
    oldSitePath: string,
  ) {
    const said = acceptedOf(this, documentId);
    assert.ok(said.length > 0, `Nothing of ${documentId} is accepted.`);
    for (const accepted of said) {
      assert.equal(accepted.newSitePath, newSitePath);
      assert.equal(accepted.oldSitePath, oldSitePath);
    }
  },
);

// By what it names rather than by its wording, which is said once, where
// what is accepted is.
Then(
  "what is accepted of {string} names {string}",
  function (this: SpecWorld, documentId: string, named: string) {
    const said = acceptedOf(this, documentId);
    assert.ok(
      said.some((accepted) => accepted.description.includes(named)),
      `Nothing accepted of ${documentId} names ${named}: ${inspect(said)}`,
    );
  },
);

// What was corrected of what the old sites kept --------------------------------

const correctedOf = (world: SpecWorld, documentId: string): Accepted[] =>
  importingOf(world).corrected.said.filter(
    (corrected) => corrected.documentId === documentId,
  );

Then(
  "{string} is corrected as {string}",
  function (this: SpecWorld, documentId: string, code: string) {
    const said = correctedOf(this, documentId);
    assert.ok(
      said.some((corrected) => corrected.code === code),
      `Nothing of ${documentId} is corrected as ${code}: ${inspect(said)}`,
    );
  },
);

Then(
  "{string} of {string} is corrected as {string}",
  function (this: SpecWorld, what: string, documentId: string, code: string) {
    const said = correctedOf(this, documentId);
    assert.ok(
      said.some(
        (corrected) => corrected.what === what && corrected.code === code,
      ),
      `${what} of ${documentId} is not corrected as ${code}: ${inspect(said)}`,
    );
  },
);

Then(
  "what is corrected of {string} is at {string} on the new site",
  function (this: SpecWorld, documentId: string, newSitePath: string) {
    const said = correctedOf(this, documentId);
    assert.ok(said.length > 0, `Nothing of ${documentId} is corrected.`);
    assert.ok(
      said.some((corrected) => corrected.newSitePath === newSitePath),
      `Nothing of ${documentId} is corrected at ${newSitePath}: ${inspect(said)}`,
    );
  },
);

Then(
  "nothing is corrected of {string}",
  function (this: SpecWorld, documentId: string) {
    assert.deepEqual(correctedOf(this, documentId), []);
  },
);

Then(
  "what is corrected of {string} names {string}",
  function (this: SpecWorld, documentId: string, named: string) {
    const said = correctedOf(this, documentId);
    assert.ok(
      said.some((corrected) => corrected.description.includes(named)),
      `Nothing corrected of ${documentId} names ${named}: ${inspect(said)}`,
    );
  },
);
