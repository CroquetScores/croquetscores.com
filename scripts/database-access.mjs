// "npm run db:access -- off --minutes 30", "-- change --from-now 45" and
// "-- on". Turns the site's database access off for maintenance, moves when it
// is expected back, and turns it on again (databaseAccess.feature).
//
// It writes the switch the running site reads, and nothing else: it does not
// stop the site and does not touch the database, so it works whether the
// database is there or not. Run under tsx, as the package script does.
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

import { loadEnvFile } from "../src/infrastructure/config/Config.js";
import { FileDatabaseAccess } from "../src/infrastructure/maintenance/FileDatabaseAccess.js";
import { runDatabaseAccess } from "../src/infrastructure/maintenance/databaseAccessCli.js";

loadEnvFile();
const access = new FileDatabaseAccess({
  // The site's own folder's where it is not absolute, as the site reads it,
  // whichever folder this is run from.
  path: resolve(
    fileURLToPath(new URL("..", import.meta.url)),
    process.env["DATABASE_ACCESS_FILE"]?.trim() || ".database-access",
  ),
  now: () => new Date(),
  log: { error: (details, message) => console.error(message, details) },
});

const outcome = await runDatabaseAccess(
  process.argv.slice(2),
  access,
  () => new Date(),
);
(outcome.exitCode === 0 ? console.log : console.error)(outcome.said);
process.exitCode = outcome.exitCode;
