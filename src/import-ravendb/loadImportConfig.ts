// The import's settings, read apart from the site's. The site's loader wants
// everything a running site does — a session secret, a signing key, which
// website it is — and none of that is the import's (loadImportConfig.feature).
import { ConfigError } from "../infrastructure/config/Config.js";

export interface ImportConfig {
  // The site's database, which the import empties and fills: it begins by
  // dropping every table in it.
  readonly databaseUrl: string;
  // The same keys as the site that will be served from what the import writes,
  // or every account it brings over is sealed with a key the site does not
  // have, and hashed with one it does not look by.
  readonly accountEncryptionKey: string;
  readonly accountEmailAddressHashKey: string;
  readonly oldSitePasswordSalt: string;
  readonly ravenDbUrl: string;
  readonly ravenDbDatabases: readonly string[];
}

const defaultRavenDbUrl = "http://127.0.0.1:8080/";
const defaultRavenDbDatabases = ["croquetscores.com", "gateballscores.com"];

// Blank means not given, as it does for the site's settings: it is what .env
// holds for a key nobody has filled in.
const given = (env: NodeJS.ProcessEnv, key: string): string | undefined =>
  env[key]?.trim() || undefined;

export const loadImportConfig = (
  env: NodeJS.ProcessEnv = process.env,
): ImportConfig => {
  const required = [
    "DATABASE_URL",
    "ACCOUNT_ENCRYPTION_KEY",
    "ACCOUNT_EMAIL_ADDRESS_HASH_KEY",
    "OLD_SITE_PASSWORD_SALT",
  ];
  const missing = required.filter((key) => given(env, key) === undefined);
  if (missing.length > 0) {
    throw new ConfigError([`Missing: ${missing.join(", ")}.`]);
  }

  const databases = given(env, "RAVENDB_DATABASES")
    ?.split(",")
    .map((one) => one.trim())
    .filter((one) => one !== "");

  return {
    databaseUrl: given(env, "DATABASE_URL")!,
    // Untrimmed, as the site takes them: trimmed by one and not the other, they
    // are two keys, and the site could neither find nor open an account.
    accountEncryptionKey: env["ACCOUNT_ENCRYPTION_KEY"]!,
    accountEmailAddressHashKey: env["ACCOUNT_EMAIL_ADDRESS_HASH_KEY"]!,
    // Trimmed as the site trims it, so that the import and the site read one
    // setting as the same salt.
    oldSitePasswordSalt: given(env, "OLD_SITE_PASSWORD_SALT")!,
    ravenDbUrl: given(env, "RAVENDB_URL") ?? defaultRavenDbUrl,
    ravenDbDatabases:
      databases === undefined || databases.length === 0
        ? defaultRavenDbDatabases
        : databases,
  };
};
