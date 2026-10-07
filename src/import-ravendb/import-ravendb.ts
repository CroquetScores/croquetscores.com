// "npm run import:ravendb". Empties the site's database, then brings the
// old sites over into it from RavenDB: their users, then each tournament with
// its players, its blocks, knockouts, Swisses and team matches, and its
// commentaries, and last whatever names a tournament that was not there, as
// an error. Once every site is over, the site's roles are given to whoever
// holds them.
//
// The second place, beside src/web/server.ts, where concrete implementations
// are chosen and wired: the import is put together from the same parts as the
// site, so that what it writes is what the site reads.
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
import type { CommentaryId } from "../domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { CompetitionId } from "../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../domain/aggregates/tournaments/primitives/TournamentId.js";
import { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { EventRegistry } from "../domain/common/EventRegistry.js";
import { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import { loadEnvFile } from "../infrastructure/config/Config.js";
import { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import { createPool } from "../infrastructure/database/pool.js";
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
import { TournamentsByAddress } from "../infrastructure/read-models/TournamentsByAddress.js";
import { ManagerNotesByTournament } from "../infrastructure/read-models/ManagerNotesByTournament.js";
import { CommentariesByTournament } from "../infrastructure/read-models/CommentariesByTournament.js";
import { GiveRoles, type RoleHolders } from "./GiveRoles.js";
import { ImportBlocks } from "./ImportBlocks.js";
import { ImportCommentaries } from "./ImportCommentaries.js";
import { ImportDatabase } from "./ImportDatabase.js";
import { ImportedAccounts } from "./ImportedAccounts.js";
import { ImportKnockouts } from "./ImportKnockouts.js";
import { ImportSwisses } from "./ImportSwisses.js";
import { ImportTeamMatches } from "./ImportTeamMatches.js";
import { ImportTournamentPlayers } from "./ImportTournamentPlayers.js";
import { ImportTournaments } from "./ImportTournaments.js";
import { ImportUsers } from "./ImportUsers.js";
import { ImportWholeTournaments } from "./ImportWholeTournaments.js";
import { loadImportConfig } from "./loadImportConfig.js";
import { RavenDbDocuments } from "./RavenDbDocuments.js";
import { RefuseLeftOvers } from "./RefuseLeftOvers.js";
import {
  type Importer,
  minutesAndSeconds,
  numbers,
  runImporter,
} from "./runImporter.js";

// Who holds each of the site's roles, by the addresses their users had on the
// old sites (GiveRoles.feature).
const ROLE_HOLDERS: RoleHolders = {
  administrator: ["tim@26tp.com", "croquetscores@gmail.com"],
  "world-ranking-officer": [
    "chris@butedock.com",
    "richard.bilton30@talktalk.net",
  ],
};

// Where the import writes, without the credentials that got it there.
const where = (url: string): string => {
  const parsed = new URL(url);
  return `${parsed.pathname.slice(1)} on ${parsed.hostname}:${parsed.port === "" ? "5432" : parsed.port}`;
};

loadEnvFile();
const config = loadImportConfig();
const started = Date.now();
let errors = 0;

const pool = createPool(config.databaseUrl);
try {
  const unitOfWork = new UnitOfWork(pool);
  const database = new ImportDatabase(pool, unitOfWork);

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
      new AccountEventSealing(accountKeys),
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
      new ManagerNotesByTournament(unitOfWork),
      commentariesByTournament,
    ],
  );
  const accounts = new AggregateRepository(
    eventStore,
    (id: AccountId, events) => Account.rebuiltFrom(id, events),
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
  const importing = { unitOfWork, tournaments, competitions, database };
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
    ),
    players: new ImportTournamentPlayers(unitOfWork, tournaments, database),
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
  const leftOvers = [
    parts.players,
    ...parts.competitions,
    parts.commentaries,
  ].map(({ collection }) => new RefuseLeftOvers(collection, database));

  for (const website of config.ravenDbDatabases) {
    const documents = new RavenDbDocuments(config.ravenDbUrl, website);
    // Users before the tournaments that name them, and what no tournament
    // took once every tournament has taken what it would.
    const importers: readonly Importer<object>[] = [
      users,
      new ImportWholeTournaments(documents, parts, database),
      ...leftOvers,
    ];
    try {
      for (const importer of importers) {
        console.log(`${website} ${importer.collection}`);
        errors += (await runImporter(documents, database, importer)).errors;
      }
    } finally {
      documents.dispose();
    }
  }

  // After every website, since a user of either old site may hold one, and
  // one of both is one account.
  console.log("Giving the site's roles");
  const withNoAccount = await new GiveRoles(
    unitOfWork,
    accounts,
    database,
  ).give(ROLE_HOLDERS, ReadOnlyDate.from(new Date()));
  for (const address of withNoAccount) {
    console.error(`No user was brought over as ${address}, who holds a role.`);
  }
  errors += withNoAccount.length;

  console.log(
    `Completed importing in ${minutesAndSeconds(Date.now() - started)}. With ${numbers.format(errors)} errors.`,
  );
} finally {
  await pool.end();
}
