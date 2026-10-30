// "npm run import:ravendb". Empties the site's database, then brings the old
// sites over into it from RavenDB: their users, then each tournament with its
// players, its blocks, knockouts, Swisses and team matches, and its
// commentaries, and last whatever names a tournament that was not there, as an
// error. What it accepted rather than keeping as an error, and what it
// corrected of what the old sites kept, are said in docs/import-from-ravendb,
// a file for each code and import-errors.md for the errors it kept, every file
// of which it deletes first (ImportFiles.feature). Once
// every site is over, the site's roles are
// given to whoever holds them, and the players the world rankings know are
// imported from the rankings' own lists, since emptying the database emptied
// them too.
//
// The second place, beside src/web/server.ts, where concrete implementations
// are chosen and wired: the import is put together from the same parts as the
// site, so that what it writes is what the site reads.
import { join } from "node:path";

import { AggregateRepository } from "../application/common/AggregateRepository.js";
import { ProjectingEventStore } from "../application/common/ProjectingEventStore.js";
import { Account } from "../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import { nameAccountEvents } from "../domain/aggregates/accounts/events/accountEvents.js";
import { Commentary } from "../domain/aggregates/tournaments/commentaries/Commentary.js";
import { nameCommentaryEvents } from "../domain/aggregates/tournaments/commentaries/events/commentaryEvents.js";
import { nameManagerNoteEvents } from "../domain/aggregates/tournaments/manager-notes/events/managerNoteEvents.js";
import { Competition } from "../domain/aggregates/tournaments/competitions/Competition.js";
import { nameCompetitionEvents } from "../domain/aggregates/tournaments/competitions/events/competitionEvents.js";
import { nameTournamentEvents } from "../domain/aggregates/tournaments/events/tournamentEvents.js";
import { ManagerNote } from "../domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import type { ManagerNoteId } from "../domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { CommentaryId } from "../domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { CompetitionId } from "../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../domain/aggregates/tournaments/primitives/TournamentId.js";
import { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { EventRegistry } from "../domain/common/EventRegistry.js";
import { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import { loadEnvFile } from "../infrastructure/config/Config.js";
import { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import { createPool } from "../infrastructure/database/pool.js";
import { PostgresWorldRankingPlayers } from "../infrastructure/database/PostgresWorldRankingPlayers.js";
import { AccountEventSealing } from "../infrastructure/encryption/AccountEventSealing.js";
import { AccountKeys } from "../infrastructure/encryption/AccountKeys.js";
import { KeyedEmailAddressHasher } from "../infrastructure/encryption/KeyedEmailAddressHasher.js";
import { PostgresEventStore } from "../infrastructure/event-store/PostgresEventStore.js";
import { Argon2id } from "../infrastructure/identity/Argon2id.js";
import { ImportedPasswordHasher } from "../infrastructure/identity/ImportedPasswordHasher.js";
import { OldSitePasswordHasher } from "../infrastructure/identity/OldSitePasswordHasher.js";
import { AccountsByEmailAddress } from "../infrastructure/read-models/AccountsByEmailAddress.js";
import { AccountsByGoogleAccount } from "../infrastructure/read-models/AccountsByGoogleAccount.js";
import { AccountsByRole } from "../infrastructure/read-models/AccountsByRole.js";
import { TournamentsByAccount } from "../infrastructure/read-models/TournamentsByAccount.js";
import { TournamentsByWebsite } from "../infrastructure/read-models/TournamentsByWebsite.js";
import { SearchByWebsite } from "../infrastructure/read-models/SearchByWebsite.js";
import { TournamentsByAddress } from "../infrastructure/read-models/TournamentsByAddress.js";
import { ManagerNotesByTournament } from "../infrastructure/read-models/ManagerNotesByTournament.js";
import { CommentariesByTournament } from "../infrastructure/read-models/CommentariesByTournament.js";
import {
  WorldRankingWebsite,
  worldRankingSportNames,
} from "../infrastructure/services/WorldRankingWebsite.js";
import type { ImportReport } from "../application/operations/world-rankings/ImportWorldRankingPlayers.js";
import { ImportFiles } from "./ImportFiles.js";
import { GiveRoles, type RoleHolders } from "./GiveRoles.js";
import { ImportBlocks } from "./ImportBlocks.js";
import { ImportCommentaries } from "./ImportCommentaries.js";
import { ImportDatabase } from "./ImportDatabase.js";
import { ImportedAccounts } from "./ImportedAccounts.js";
import { ImportErrorsNote } from "./ImportErrorsNote.js";
import { ImportKnockouts } from "./ImportKnockouts.js";
import { ImportSwisses } from "./ImportSwisses.js";
import { ImportTeamMatches } from "./ImportTeamMatches.js";
import { ImportTournaments } from "./ImportTournaments.js";
import { WorldRankingEvents } from "./WorldRankingEvents.js";
import { ImportUsers } from "./ImportUsers.js";
import { ImportWholeTournaments } from "./ImportWholeTournaments.js";
import { SeeNotes } from "./SeeNotes.js";
import { ImportWorldRankingPlayerNames } from "./ImportWorldRankingPlayerNames.js";
import { ImportRefused } from "./ImportRefused.js";
import { readImportArguments } from "./importArguments.js";
import { loadImportConfig } from "./loadImportConfig.js";
import { RavenDbDocuments } from "./RavenDbDocuments.js";
import { RefuseLeftOvers } from "./RefuseLeftOvers.js";
import {
  type Importer,
  minutesAndSeconds,
  numbers,
  runImporter,
  stoppingAfter,
} from "./runImporter.js";

// Says, to the one place that asks for the world rankings, that the import
// stopped before them.
class StoppedBeforeRankings extends Error {}

// Who holds each of the site's roles, by the addresses their users had on the
// old sites (GiveRoles.feature).
const ROLE_HOLDERS: RoleHolders = {
  administrator: ["tim@26tp.com"],
  "ac-world-ranking-officer": ["chris@butedock.com", "croquetscores@gmail.com"],
  "gc-world-ranking-officer": [
    "richard.bilton30@talktalk.net",
    "pfreer@netspeed.com.au",
    "pfreer77@gmail.com",
    "eduardorochagolf@hotmail.com",
    "jeff@ipsedixit.net",
    "johnchristie8@gmail.com",
    "snmulliner@gmail.com",
  ],
};

// The old site every role holder was a user of, whose users are imported
// before the roles are given.
const ROLE_HOLDERS_SITE = "croquetscores.com";

// What the import says of the world ranking players as it imports them. In
// English, as the rest of what it says is: it is read by whoever runs it, not
// by a reader of the site.
const said = (report: ImportReport, notRead: number): string => {
  switch (report.kind) {
    case "reading":
      return `Reading the world rankings' ${worldRankingSportNames[report.sport]} list`;
    case "read":
      return `Read ${numbers.format(report.players)} ${worldRankingSportNames[report.sport]} players`;
    case "kept":
      return `Kept ${numbers.format(report.players)} ${worldRankingSportNames[report.sport]} players`;
    case "refused":
      return `The ${worldRankingSportNames[report.sport]} list was not read, and its players were not kept: ${report.code}. ${report.message}`;
    case "finished":
      return notRead === 0
        ? "Imported the world ranking players"
        : `Imported the world ranking players, but ${numbers.format(notRead)} of the lists were not read`;
  }
};

// Where the import writes, without the credentials that got it there.
const where = (url: string): string => {
  const parsed = new URL(url);
  return `${parsed.pathname.slice(1)} on ${parsed.hostname}:${parsed.port === "" ? "5432" : parsed.port}`;
};

loadEnvFile();
const config = loadImportConfig();
// Refused before the database it would empty is touched.
const switches = (() => {
  try {
    return readImportArguments(process.argv.slice(2));
  } catch (failure) {
    if (failure instanceof ImportRefused) {
      console.error(`${failure.code}: ${failure.message}`);
      process.exit(1);
    }
    throw failure;
  }
})();
const started = Date.now();
// The day of the machine the import is run on, since the old sites wrote the
// day a tournament was held and not a moment, and that is the day its managers
// were living. Read once, so that a run that crosses midnight judges every
// tournament by the day it began on.
const today = new Date(started - new Date(started).getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 10);

const pool = createPool(config.databaseUrl);
try {
  const unitOfWork = new UnitOfWork(pool);
  const database = new ImportDatabase(pool, unitOfWork);

  // What it corrected of what the old sites kept, what it accepted rather than
  // keeping as an error, and the errors it kept, said in a file for each code
  // and one of the errors, in docs/import-from-ravendb, linking to the
  // tournaments on the development site, where an import is looked at, as well
  // as on the old sites. The folder is emptied first, of every file in it.
  const correcting = new ImportFiles(
    join(import.meta.dirname, "../../docs/import-from-ravendb"),
    "http://localhost:3000",
  );
  await correcting.begin(new Date());
  // Each error kept is said as it is kept, so that an import that stops
  // partway through still says what it kept before it stopped.
  database.afterErrorKept((error) => correcting.keptError(error));

  const worldRankingEvents = await WorldRankingEvents.readFrom(
    join(import.meta.dirname, "../infrastructure/world-rankings/events"),
  );

  console.log(`Emptying ${where(config.databaseUrl)}`);
  await database.reset();

  const accountKeys = new AccountKeys(unitOfWork, config.accountEncryptionKey);
  const emailAddresses = new KeyedEmailAddressHasher(
    config.accountEmailAddressHashKey,
  );
  // Asked by bringing commentaries over which titles and slugs are taken.
  const commentariesByTournament = new CommentariesByTournament(unitOfWork);
  // Every one of the site's read models, kept in step with everything
  // brought over, as the site keeps them with everything it records.
  const managerNotesByTournament = new ManagerNotesByTournament(unitOfWork);
  const eventStore = new ProjectingEventStore(
    new PostgresEventStore(
      unitOfWork,
      nameManagerNoteEvents(
        nameCommentaryEvents(
          nameCompetitionEvents(
            nameTournamentEvents(nameAccountEvents(new EventRegistry())),
          ),
        ),
      ),
      new AccountEventSealing(accountKeys, unitOfWork),
    ),
    [
      new AccountsByEmailAddress(unitOfWork, emailAddresses),
      new AccountsByGoogleAccount(
        unitOfWork,
        config.accountEmailAddressHashKey,
      ),
      new AccountsByRole(unitOfWork),
      new TournamentsByAddress(unitOfWork),
      new TournamentsByAccount(unitOfWork),
      new TournamentsByWebsite(unitOfWork),
      new SearchByWebsite(unitOfWork),
      managerNotesByTournament,
      commentariesByTournament,
    ],
  );
  const accounts = new AggregateRepository(
    eventStore,
    (id: AccountId, events) => Account.rebuiltFrom(id, events),
  );
  const managerNotes = new AggregateRepository(
    eventStore,
    (id: ManagerNoteId, events) => ManagerNote.rebuiltFrom(id, events),
  );
  const passwords = new ImportedPasswordHasher(
    new Argon2id(),
    new OldSitePasswordHasher(config.oldSitePasswordSalt),
  );

  const tournaments = new AggregateRepository(
    eventStore,
    (id: TournamentId, events) => Tournament.rebuiltFrom(id, events),
  );
  const competitions = new AggregateRepository(
    eventStore,
    (id: CompetitionId, events) => Competition.rebuiltFrom(id, events),
  );
  const commentaries = new AggregateRepository(
    eventStore,
    (id: CommentaryId, events) => Commentary.rebuiltFrom(id, events),
  );
  // What says, in a note, where the games of a competition that could not be
  // brought over are.
  const seeNotes = new SeeNotes(
    unitOfWork,
    tournaments,
    managerNotes,
    managerNotesByTournament,
    database,
  );
  // What says, in a note, the games between players of one team, which the
  // site has no place for in a test.
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
    // What it accepts is said with what it corrects.
    accepting: correcting,
    correcting,
    notes: importErrorsNote,
  };
  // One for every importer that names a user, so that a user is one account
  // wherever they are named.
  const importedAccounts = new ImportedAccounts(
    accounts,
    emailAddresses,
    database,
  );

  const users = new ImportUsers(
    unitOfWork,
    accounts,
    emailAddresses,
    passwords,
    database,
  );
  // What brings over a tournament and each kind of document that names one.
  // The competitions are in the order one its tournament does not list is
  // added in, as they were when each kind was brought over by itself.
  const parts = {
    tournament: new ImportTournaments(
      unitOfWork,
      tournaments,
      importedAccounts,
      database,
      () => worldRankingEvents,
    ),
    competitions: [
      new ImportBlocks(importing),
      new ImportKnockouts(importing),
      new ImportSwisses(importing),
      new ImportTeamMatches(importing),
    ],
    commentaries: new ImportCommentaries(
      unitOfWork,
      tournaments,
      commentaries,
      importedAccounts,
      database,
      commentariesByTournament,
    ),
  };
  const leftOvers = [...parts.competitions, parts.commentaries].map(
    ({ collection }) => new RefuseLeftOvers(collection, database, correcting),
  );

  // The site's roles, given as soon as their holders' accounts are brought
  // over, rather than once everything is, so that an import that stops partway
  // through the tournaments still leaves the site an administrator, without
  // whom nobody can give a role on the site. Every holder was a user of
  // croquetscores.com, so they are given once its users are imported, before
  // its tournaments.
  let withNoAccount: readonly string[] | undefined;
  const giveRoles = async (): Promise<void> => {
    console.log("Giving the site's roles");
    withNoAccount = await new GiveRoles(unitOfWork, accounts, database).give(
      ROLE_HOLDERS,
      ReadOnlyDate.from(new Date()),
    );
    for (const address of withNoAccount) {
      console.error(
        `No user was brought over as ${address}, who holds a role.`,
      );
    }
  };

  // Asked to stop once this many errors are kept, the import stops reading,
  // and goes on to say what it found (importArguments.feature).
  const stop =
    switches.stopAfterErrors === undefined
      ? undefined
      : stoppingAfter(database, switches.stopAfterErrors);
  let stopped = false;

  for (const website of config.ravenDbDatabases) {
    const documents = new RavenDbDocuments(config.ravenDbUrl, website);
    // Users before the tournaments that name them, and what no tournament
    // took once every tournament has taken what it would.
    const importers: readonly Importer<object>[] = [
      users,
      new ImportWholeTournaments(
        documents,
        parts,
        database,
        correcting,
        seeNotes,
        importErrorsNote,
        { from: switches.from, to: switches.to },
        () => today,
      ),
      ...leftOvers,
    ];
    try {
      for (const importer of importers) {
        console.log(`${website} ${importer.collection}`);
        const run = await runImporter(
          documents,
          database,
          importer,
          undefined,
          stop,
        );
        if (run.stopped) {
          stopped = true;
          break;
        }
        if (importer === users && website === ROLE_HOLDERS_SITE) {
          await giveRoles();
        }
      }
    } finally {
      documents.dispose();
    }
    if (stopped) break;
  }

  // An import not of croquetscores.com gives no role, which is said and
  // counted rather than left for an empty list of administrators to show. One
  // that stopped is not an import of any, and says nothing of it.
  const rolesNotGiven = withNoAccount === undefined && !stopped ? 1 : 0;
  if (withNoAccount === undefined && !stopped) {
    console.error(
      `The site's roles were not given, since ${ROLE_HOLDERS_SITE} was not imported.`,
    );
  }

  // Last, since nothing brought over names them, and the rankings' site is
  // the slowest thing the import asks. A list that was not read is said with
  // its code and why, which is what whoever runs the import has to see to.
  // Anything else that fails here is said and counted as one error rather
  // than ending the import, since everything before it is already kept and
  // whoever ran it is owed the count of what went wrong.
  // Said and counted as each happens, so that what was said before a failure
  // is still said, and counted, after it.
  let worldRankingErrors = 0;
  try {
    // Not asked of an import that stopped, which is looking at what it kept so
    // far, and the rankings' site is the slowest thing it asks.
    if (stopped) throw new StoppedBeforeRankings();
    let notRead = 0;
    await new ImportWorldRankingPlayerNames({
      lists: new WorldRankingWebsite(),
      players: new PostgresWorldRankingPlayers(unitOfWork),
      transactions: unitOfWork,
    }).import((report) => {
      if (report.kind === "refused") {
        notRead += 1;
        worldRankingErrors += 1;
        console.error(said(report, notRead));
      } else {
        console.log(said(report, notRead));
      }
    });
  } catch (failure) {
    if (failure instanceof StoppedBeforeRankings) {
      console.log("The world ranking players were not imported.");
    } else {
      console.error(
        "The world ranking players were not all imported.",
        failure,
      );
      worldRankingErrors += 1;
    }
  }
  // Counted from what was kept rather than added up from each collection's
  // reading, since a tournament keeps the errors of what names it itself
  // (ImportDatabase.feature). A role holder with no account, roles not given
  // at all, and a world ranking list that was not read or a failure importing
  // them, are said above and kept nowhere, so are added.
  const kept = await database.errorCount();
  const errors =
    kept + (withNoAccount?.length ?? 0) + rolesNotGiven + worldRankingErrors;
  await correcting.end();

  // How many tournaments the world rankings' lists had a say in the country of,
  // which is how whoever ran the import sees whether they found what they were
  // expected to. Said before the total, which is the last thing said.
  for (const [sport, name] of [
    ["ac", "AC"],
    ["gc", "GC"],
  ] as const) {
    const { tournaments, tookListedCountry } = parts.tournament.counted[sport];
    console.log(
      `${numbers.format(tournaments)} ${name} tournaments, ${numbers.format(tookListedCountry)} used world ranking's country`,
    );
  }

  console.log(
    stopped
      ? `Stopped importing after ${numbers.format(kept)} errors, as asked to after ${numbers.format(switches.stopAfterErrors ?? 0)}, in ${minutesAndSeconds(Date.now() - started)}.`
      : `Completed importing in ${minutesAndSeconds(Date.now() - started)}. With ${numbers.format(errors)} errors.`,
  );
} finally {
  await pool.end();
}
