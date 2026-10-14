// "npm run db:rebuild-read-models -- --minutes 20". Makes every read model
// again from every event kept, in one transaction, so that a rebuild that fails
// leaves them as they were (rebuildReadModelsCli.feature).
//
// Database access is turned off for the minutes it is expected to take and on
// again when it is done, so the site is down for maintenance rather than
// answering from read models that are about to change, and the site need not
// be stopped. It says how many streams there are, how far it has got every 10
// seconds, and how long it took. Whatever DATABASE_URL names is rebuilt, and
// nothing is asked first.
//
// It goes through the application the site is put together as, rather than
// putting the read models together a second time here: a list kept in two
// places is a read model one of them forgets, and the rebuild would then leave
// it as it was and say nothing. Run under tsx, as the package script does,
// since the application is TypeScript.
import { setTimeout as waiting } from "node:timers/promises";

import {
  loadConfig,
  loadEnvFile,
} from "../src/infrastructure/config/Config.js";
import { runRebuildReadModels } from "../src/infrastructure/maintenance/rebuildReadModelsCli.js";
import { buildApplication } from "../src/web/server.js";

loadEnvFile();
const application = await buildApplication(loadConfig(), { logger: false });
try {
  const outcome = await runRebuildReadModels(
    process.argv.slice(2),
    application.databaseAccess,
    { rebuild: (progress) => application.rebuildReadModels(progress) },
    {
      now: () => new Date(),
      wait: (milliseconds) => waiting(milliseconds),
      say: (line) => console.log(line),
    },
  );
  process.exitCode = outcome.exitCode;
} finally {
  await application.server.close();
  await application.pool.end();
}
