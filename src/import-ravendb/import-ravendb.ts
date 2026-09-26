// "npm run import:ravendb". Empties the site's database, then brings the
// old sites' users over into it from RavenDB.
//
// The second place, beside src/web/server.ts, where concrete implementations
// are chosen and wired: the import is put together from the same parts as the
// site, so that what it writes is what the site reads.
import { AggregateRepository } from "../application/common/AggregateRepository.js";
import { ProjectingEventStore } from "../application/common/ProjectingEventStore.js";
import { Account } from "../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import { nameAccountEvents } from "../domain/aggregates/accounts/events/accountEvents.js";
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
import { ImportDatabase } from "./ImportDatabase.js";
import { ImportUsers } from "./ImportUsers.js";
import { loadImportConfig } from "./loadImportConfig.js";
import { RavenDbDocuments } from "./RavenDbDocuments.js";
import { minutesAndSeconds, numbers, runImporter } from "./runImporter.js";

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
  // Both of the site's read models over accounts, kept in step with every
  // account brought over, as the site keeps them with every one registered.
  const eventStore = new ProjectingEventStore(
    new PostgresEventStore(
      unitOfWork,
      nameAccountEvents(new EventRegistry()),
      new AccountEventSealing(accountKeys),
    ),
    [
      new AccountsByEmailAddress(unitOfWork, emailAddresses),
      new AccountsByGoogleAccount(
        unitOfWork,
        config.accountEmailAddressHashKey,
      ),
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

  const importers = [
    new ImportUsers(unitOfWork, accounts, emailAddresses, passwords, database),
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
