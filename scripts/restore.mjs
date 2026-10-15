// "npm run db:restore -- <database name> <dump file>". Makes a database of
// that name on the Postgres DATABASE_URL names, gives it the website's tables,
// and puts into them the data of a file the backup (npm run db:backup) wrote
// (restoreCli.feature). Refuses a name that is already a database. Run under
// tsx, as the package script does, since the application is TypeScript.
import {
  loadConfig,
  loadEnvFile,
} from "../src/infrastructure/config/Config.js";
import { runRestore } from "../src/infrastructure/maintenance/restoreCli.js";
import { runPgRestore } from "../src/infrastructure/maintenance/pgRestore.js";

loadEnvFile();
const config = loadConfig();
const outcome = await runRestore(process.argv.slice(2), {
  settings: {
    databaseUrl: config.databaseUrl,
    pgDumpPath: config.pgDumpPath,
  },
  restore: (request) => runPgRestore(request),
  say: (line) => console.log(line),
});
process.exitCode = outcome.exitCode;
