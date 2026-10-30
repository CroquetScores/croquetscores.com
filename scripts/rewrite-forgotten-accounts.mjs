// "npm run db:rewrite-forgotten-accounts -- --minutes 20". Rewrites what is
// kept of every account forgotten before forgetting rewrote the events that hold
// a name, an email address and a Google account (AccountKeys.feature), and
// and makes every read model again from the events as they are now, in the same
// transaction, since a read model made before holds what the events held and
// one without the other would leave the site serving it.
//
// Database access is turned off for the minutes it is expected to take and on
// again when it is done, exactly as rebuilding the read models does
// (scripts/rebuild-read-models.mjs), whose saying and whose care it shares: the
// site is down for maintenance rather than answering from events that are
// being changed. The rewriting and the rebuild are one transaction; one that
// fails leaves every event and every read model as it was. It can be run again: an
// account already rewritten is left as it was.
//
// Run under tsx, as the package script does, since the application is
// TypeScript.
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
    {
      rebuild: async (progress) => {
        const { accounts, events } =
          await application.rewriteForgottenAccountsAndRebuildReadModels(
            progress,
          );
        console.log(
          `${String(accounts)} forgotten ${accounts === 1 ? "account" : "accounts"} rewritten.`,
        );
        return events;
      },
    },
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
