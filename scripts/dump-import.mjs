// "npm run db:dump-import". Has pg_dump write the same two tables the backup
// does (the events and the accounts' keys) from the database DATABASE_URL
// names to import.dump in DATABASE_BACKUP_FOLDER, replacing the file of an
// earlier run. Unlike the backup it tells nobody and keeps no earlier copy: it
// is for carrying a database made on this computer, as by the import from the
// old sites, to somewhere else. Run under tsx, as the package script does.
import { rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import {
  loadConfig,
  loadEnvFile,
} from "../src/infrastructure/config/Config.js";
import { TABLES_BACKED_UP } from "../src/infrastructure/maintenance/backupCli.js";
import { runPgDump } from "../src/infrastructure/maintenance/pgDump.js";

loadEnvFile();
const config = loadConfig();

const folder = config.databaseBackupFolder;
if (folder === undefined || folder === "") {
  console.log("The folder is not named: DATABASE_BACKUP_FOLDER.");
  process.exit(1);
}
// Not made where it is not there, as the backup does not: a disk that was not
// plugged in would otherwise be written to under its name on this one.
const isAFolder = await stat(folder).then(
  (found) => found.isDirectory(),
  () => false,
);
if (!isAFolder) {
  console.log("The folder is not there.");
  process.exit(1);
}

const FILE = join(folder, "import.dump");
// Written to a name of its own and renamed, as the backup does, so that a
// dump that fails does not leave half of one under the name of a whole one,
// or take away the file of the last run.
const PARTIAL = `${FILE}.partial`;

await rm(PARTIAL, { force: true });
try {
  await runPgDump({
    address: config.databaseUrl,
    file: PARTIAL,
    tables: TABLES_BACKED_UP,
    program: config.pgDumpPath,
  });
  await rename(PARTIAL, FILE);
  console.log(`The dump is in ${FILE}.`);
} catch (failure) {
  await rm(PARTIAL, { force: true });
  console.log("The dump failed.");
  // pg_dump's words are printed without the address: it may hold a password.
  const why = failure instanceof Error ? failure.message : String(failure);
  console.log(`Why: ${why.split(config.databaseUrl).join("the database")}`);
  process.exitCode = 1;
}
