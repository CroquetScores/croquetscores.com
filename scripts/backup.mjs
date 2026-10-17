// "npm run db:backup". Has pg_dump write the events and the accounts' keys of
// the website's database (WEBSITE_DATABASE_URL, which is only read) to a file
// of DATABASE_BACKUP_FOLDER, named for the moment it began, and emails
// ADMINISTRATOR_EMAIL_ADDRESS how it went (backupCli.feature). Run from a
// scheduled task on the administrator's own computer. Run under tsx, as the
// package script does, since the application is TypeScript.
import {
  loadConfig,
  loadEnvFile,
} from "../src/infrastructure/config/Config.js";
import { runBackup } from "../src/infrastructure/maintenance/backupCli.js";
import { runPgDump } from "../src/infrastructure/maintenance/pgDump.js";
import { ReadOnlyDate } from "../src/domain/common/ReadOnlyDate.js";
import { buildApplication } from "../src/web/server.js";

loadEnvFile();
const config = loadConfig();
const application = await buildApplication(config, { logger: false });
try {
  const outcome = await runBackup(process.argv.slice(2), {
    settings: {
      administrator: config.administratorEmailAddress,
      websiteDatabase: config.websiteDatabaseUrl,
      folder: config.databaseBackupFolder,
      program: config.pgDumpPath,
    },
    dump: ({ database, file, tables, program }) =>
      runPgDump({ address: database, file, tables, program }),
    send: (email) =>
      application.emailSender.send(
        { ...email, from: config.administratorEmailAddress },
        ReadOnlyDate.from(new Date()),
      ),
    now: () => new Date(),
    say: (line) => console.log(line),
  });
  process.exitCode = outcome.exitCode;
} finally {
  await application.server.close();
  await application.pool.end();
}
