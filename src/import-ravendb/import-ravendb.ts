// "npm run import:ravendb". Empties the site's database, then brings the
// old sites over into it from RavenDB: their users, their tournaments and the
// players of each, their blocks, knockouts, Swisses and team matches, their
// commentaries, and last the order each tournament listed its competitions in.
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
import { TournamentsByAccount } from "../infrastructure/read-models/TournamentsByAccount.js";
import { TournamentsByWebsite } from "../infrastructure/read-models/TournamentsByWebsite.js";
import { TournamentsByAddress } from "../infrastructure/read-models/TournamentsByAddress.js";
import { ManagerNotesByTournament } from "../infrastructure/read-models/ManagerNotesByTournament.js";
import { CommentariesByTournament } from "../infrastructure/read-models/CommentariesByTournament.js";
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
import { loadImportConfig } from "./loadImportConfig.js";
import { RavenDbDocuments } from "./RavenDbDocuments.js";
import { OrderCompetitions } from "./OrderCompetitions.js";
import {
  type Importer,
  minutesAndSeconds,
  numbers,
  runImporter,
} from "./runImporter.js";

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
      new TournamentsByAddress(unitOfWork),
      new TournamentsByAccount(unitOfWork),
      new TournamentsByWebsite(unitOfWork),
      new ManagerNotesByTournament(unitOfWork),
      new CommentariesByTournament(unitOfWork),
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

  // In the order each needs what the one before brought over: a tournament
  // its users, its players, competitions and commentaries the tournament, and
  // the order of its competitions every competition.
  const importers: readonly Importer<object>[] = [
    new ImportUsers(unitOfWork, accounts, emailAddresses, passwords, database),
    new ImportTournaments(unitOfWork, tournaments, importedAccounts, database),
    new ImportTournamentPlayers(unitOfWork, tournaments, database),
    new ImportBlocks(importing),
    new ImportKnockouts(importing),
    new ImportSwisses(importing),
    new ImportTeamMatches(importing),
    new ImportCommentaries(
      unitOfWork,
      tournaments,
      commentaries,
      importedAccounts,
      database,
    ),
    new OrderCompetitions(unitOfWork, tournaments, database),
  ];

  for (const website of config.ravenDbDatabases) {
    const documents = new RavenDbDocuments(config.ravenDbUrl, website);
    try {
      for (const importer of importers) {
        console.log(`${website} ${importer.collection}`);
        errors += (await runImporter(documents, database, importer)).errors;
      }
    } finally {
      documents.dispose();
    }
  }

  console.log(
    `Completed importing in ${minutesAndSeconds(Date.now() - started)}. With ${numbers.format(errors)} errors.`,
  );
} finally {
  await pool.end();
}
