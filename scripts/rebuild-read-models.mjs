// "npm run db:rebuild-read-models". Makes every read model again from every
// event kept, in one transaction, so that a rebuild that fails leaves them as
// they were. Whatever DATABASE_URL names is rebuilt, and nothing is asked first.
//
// It goes through the application the site is put together as, rather than
// putting the read models together a second time here: a list kept in two
// places is a read model one of them forgets, and the rebuild would then leave
// it as it was and say nothing. Run under tsx, as the package script does,
// since the application is TypeScript.
//
// Stop the site first if it is running. A command that appends while the
// rebuild is reading would be waited for, but it would not be in what was read,
// and its events would be missing from the read models until the next rebuild.
import {
  loadConfig,
  loadEnvFile,
} from "../src/infrastructure/config/Config.js";
import { buildApplication } from "../src/web/server.js";

loadEnvFile();
const application = await buildApplication(loadConfig(), { logger: false });
try {
  const events = await application.rebuildReadModels();
  console.log(`Every read model is made again from ${events} events.`);
} finally {
  await application.server.close();
  await application.pool.end();
}
