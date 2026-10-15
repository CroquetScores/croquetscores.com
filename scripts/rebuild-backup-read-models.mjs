// "npm run db:rebuild-backup-read-models". Makes every read model of the
// backup database (BACKUP_DATABASE_URL) again from every event kept there, in
// one transaction, so that a rebuild that fails leaves them as they were
// (rebuildBackupReadModelsCli.feature). Run by the backup after it has copied
// the events, and by hand where that rebuild failed.
//
// It is the site's rebuild (scripts/rebuild-read-models.mjs) of another
// database, and unlike it does not turn database access off: nothing serves
// readers from the backup database, and the switch is the site's own.
import {
  loadConfig,
  loadEnvFile,
} from "../src/infrastructure/config/Config.js";
import { runRebuildBackupReadModels } from "../src/infrastructure/maintenance/rebuildBackupReadModelsCli.js";
import { buildApplication } from "../src/web/server.js";

loadEnvFile();
const config = loadConfig();
const backupDatabase = config.backupDatabaseUrl;
// Refused before anything is opened, so that a missing setting is said and is
// not the connection to DATABASE_URL, which is not what is rebuilt, failing.
if (backupDatabase === undefined) {
  const outcome = await runRebuildBackupReadModels(
    process.argv.slice(2),
    undefined,
    { rebuild: () => Promise.resolve(0) },
    { now: () => new Date(), say: (line) => console.log(line) },
  );
  process.exitCode = outcome.exitCode;
} else {
  // The application the site is put together as, over the backup database in
  // place of the site's own, so that its read models are the site's, and not a
  // list kept a second time.
  const application = await buildApplication(
    { ...config, databaseUrl: backupDatabase },
    { logger: false },
  );
  try {
    const outcome = await runRebuildBackupReadModels(
      process.argv.slice(2),
      backupDatabase,
      { rebuild: (progress) => application.rebuildReadModels(progress) },
      { now: () => new Date(), say: (line) => console.log(line) },
    );
    process.exitCode = outcome.exitCode;
  } finally {
    await application.server.close();
    await application.pool.end();
  }
}
