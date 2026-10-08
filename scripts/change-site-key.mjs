// "npm run db:change-site-key", with the new key in NEW_ACCOUNT_ENCRYPTION_KEY
// and the key the site is using now in ACCOUNT_ENCRYPTION_KEY, as it is for the
// site. Re-encrypts every account's key, and every email waiting with no
// account, with the new key, in one transaction, so that a change that fails
// leaves every key as it was. It rewrites no event.
//
// The new key comes from the environment and not from an argument, which would
// be kept in the shell's history and shown to anyone listing processes.
//
// Stop the site first, and afterwards set ACCOUNT_ENCRYPTION_KEY to the new key
// before starting it: a site started with the old one is refused every
// account's key as another site's. ACCOUNT_EMAIL_ADDRESS_HASH_KEY is not
// changed this way, and is never changed (SETUP.md, section 7.6).
import {
  loadConfig,
  loadEnvFile,
} from "../src/infrastructure/config/Config.js";
import { buildApplication } from "../src/web/server.js";

loadEnvFile();
const newKey = process.env["NEW_ACCOUNT_ENCRYPTION_KEY"];
if (newKey === undefined || newKey.trim() === "") {
  console.error(
    "Set NEW_ACCOUNT_ENCRYPTION_KEY to the key to change to. Nothing was changed.",
  );
  process.exit(1);
}

const application = await buildApplication(loadConfig(), { logger: false });
try {
  await application.changeSiteKey(newKey);
  console.log(
    "Every account's key is encrypted with the new key. Set ACCOUNT_ENCRYPTION_KEY to it before the site is started again.",
  );
} finally {
  await application.server.close();
  await application.pool.end();
}
