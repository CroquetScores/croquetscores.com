// Settings are read once, here, and handed out as a typed object. Nothing else
// in the repository touches process.env: a second reader is a second answer.
// The one exception is the import from the old sites, which reads what it needs
// in src/import-ravendb/loadImportConfig.ts: settings of its own, and the
// site's two account keys, because it writes what the site will read.
import { existsSync } from "node:fs";
import { isIP } from "node:net";

import { Website } from "../../domain/common/Website.js";

/** What reCAPTCHA needs: the key the page shows, and the one only the site has. */
export interface RecaptchaKeys {
  readonly siteKey: string;
  readonly secretKey: string;
}

export interface OAuthCredentials {
  readonly clientId: string;
  readonly clientSecret: string;
}

export interface Config {
  readonly port: number;
  readonly databaseUrl: string;
  readonly sessionCookieSecret: string;
  readonly tokenSigningKey: string;
  // The site's key, which each account's own key is encrypted with, and the
  // key an email address is hashed with to find its account. The first is
  // changed by npm run db:change-site-key, which re-encrypts what it kept; set
  // to another any other way, it leaves what it kept unreadable. The second is
  // never changed: the hash it made is kept in the event that registered each
  // account, which is never rewritten, so a new one would find no account by
  // its address.
  readonly accountEncryptionKey: string;
  readonly accountEmailAddressHashKey: string;
  // The address the site's emails are sent from, the name they are sent from
  // and signed off with, and what the site is called. The last two are
  // configured rather than written into the catalogues so that a site serving
  // from this repository under another name neither signs its emails nor calls
  // itself Croquet Scores — in an email, in its header or in its footer.
  readonly emailFromAddress: string;
  readonly emailFromName: string;
  readonly siteName: string;
  // Which of the five websites this is, which says which site it serves and
  // whether it is a try website. Required rather than falling back to
  // development, because a Gateball Scores that forgot it would quietly be a
  // Croquet Scores offering croquet. Not worked out from CANONICAL_HOST, which
  // development leaves blank on purpose (SETUP.md §6.1).
  readonly website: Website;
  // Who is told when a service the site needs cannot be reached. Absent on a
  // development machine, where nobody needs telling.
  readonly administratorEmailAddress: string | undefined;
  // How many minutes the site waits between emailing the administrator that
  // it cannot reach its database. It is counted in the running site's own
  // memory, there being nowhere else to count it when the database is the
  // thing that is down.
  readonly databaseUnreachableEmailIntervalMinutes: number;
  // Where the switch that turns the site's database access off for maintenance
  // is kept, which is a file because the database cannot say whether it may be
  // asked (FileDatabaseAccess.feature). Relative to where the site is run.
  readonly databaseAccessFile: string;
  // The host this site answers to, as a browser would name it: "croquetscores.com",
  // or "localhost:3000" in development. Absent means fall back to the Host header
  // of each request, which is right on a machine nothing sits in front of and
  // wrong behind a proxy that rewrites it.
  readonly canonicalHost: string | undefined;
  // What forwards requests to the site, if anything: the proxies whose word
  // for where a request came from is believed, each an address or a range.
  // Empty on a machine nothing sits in front of, which is development and
  // which is why it is optional. What is done with it is trustedProxy.ts.
  readonly trustedProxies: readonly string[];
  // Absent until somebody pastes real credentials in. The sign-in routes that
  // need them refuse to register rather than half-working at runtime.
  readonly google: OAuthCredentials | undefined;
  readonly facebook: OAuthCredentials | undefined;
  // What the register page guards itself with. Absent in development, where
  // there are no keys to give: the page then asks nobody and takes every
  // reader for a person, which is what it did before there was a check at all.
  // It belongs on the deployment checklist beside CANONICAL_HOST, because a
  // production site without it has an open form that emails whoever it is told
  // to (TODO.md says more).
  readonly recaptcha: RecaptchaKeys | undefined;
  // The salt the old site added to every password before hashing it. Absent
  // until whoever runs the site sets it, and optional, because the site runs
  // without it: only checking a password against a hash imported from the old
  // site needs it, and without it those match nothing and importing is refused.
  readonly oldSitePasswordSalt: string | undefined;
  // Whether search engines are asked to index the site. False unless the
  // setting says so, because a site found before it was meant to be is
  // noticed by nobody, and one that is hard to find is noticed at once.
  readonly searchEnginesWelcome: boolean;
  // The website's database, which only the backup reads, from the
  // administrator's own computer (backupCli.feature). Absent everywhere else.
  readonly websiteDatabaseUrl: string | undefined;
  // Where the backup writes its copy: a database of its own, and not
  // DATABASE_URL, which on the computer it is run from may be one it works on.
  readonly backupDatabaseUrl: string | undefined;
}

export class ConfigError extends Error {
  constructor(problems: readonly string[]) {
    super(
      `Configuration is unusable. ${problems.join(" ")} ` +
        `Run "npm run dev:setup" for a development .env, or set these in the environment.`,
    );
    this.name = "ConfigError";
  }
}

const optional = (
  env: NodeJS.ProcessEnv,
  idKey: string,
  secretKey: string,
): OAuthCredentials | undefined => {
  const clientId = env[idKey]?.trim() ?? "";
  const clientSecret = env[secretKey]?.trim() ?? "";
  if (clientId === "" || clientSecret === "") return undefined;
  return { clientId, clientSecret };
};

// Written as a host, but a whole address is what people reach for, so one is
// accepted and reduced to its host and port.
// Both or neither: a site key with no secret cannot judge anybody, and a
// secret with no site key has nothing to judge.
const recaptchaKeys = (env: NodeJS.ProcessEnv): RecaptchaKeys | undefined => {
  const siteKey = env["RECAPTCHA_SITE_KEY"]?.trim() ?? "";
  const secretKey = env["RECAPTCHA_SECRET_KEY"]?.trim() ?? "";
  if (siteKey === "" || secretKey === "") return undefined;
  return { siteKey, secretKey };
};

const readCanonicalHost = (env: NodeJS.ProcessEnv): string | undefined => {
  const raw = env["CANONICAL_HOST"]?.trim() ?? "";
  if (raw === "") return undefined;
  // "localhost:3000" parses as a URL with a scheme and no host, so a host is
  // only taken when there is one.
  try {
    const host = new URL(raw).host;
    if (host !== "") return host.toLowerCase();
  } catch {
    // Not an address. It is a host, then.
  }
  return raw.replace(/\/+$/, "").toLowerCase();
};

// An address, or a range written as an address and how many of its leading
// bits are fixed: 10.0.0.0/8, 2001:db8::/32. The names some libraries take for
// well-known ranges — loopback, linklocal — are not accepted, because a
// deployment's proxy has an address and a name would only ever be a way of
// trusting more than was meant.
//
// A range has to fix at least one bit. /0 is every address there is, which is
// the answer this setting exists to make impossible: it would believe a
// forwarded address from whatever could reach the site, and so from everybody.
// Fastify refuses it too, so accepting it here would only move the refusal to
// where it is a startup crash naming no setting.
const addressOrRange = (named: string): boolean => {
  const [address, prefix, ...rest] = named.split("/");
  if (address === undefined || rest.length > 0) return false;

  const family = isIP(address);
  if (family === 0) return false;
  if (prefix === undefined) return true;
  if (!/^[0-9]{1,3}$/.test(prefix)) return false;
  const bits = Number(prefix);
  return bits >= 1 && bits <= (family === 4 ? 32 : 128);
};

// Blank is a site with nothing in front of it, which believes nobody. Anything
// else has to name proxies: a misspelling left to mean nothing would leave a
// deployment counting every reader as its proxy, and the first anybody would
// know of it is readers told to try again later for something none of them had
// done.
const readTrustedProxies = (
  env: NodeJS.ProcessEnv,
  problems: string[],
): readonly string[] => {
  const raw = env["TRUSTED_PROXY"]?.trim() ?? "";
  if (raw === "") return [];

  const named = raw
    .split(",")
    .map((one) => one.trim())
    .filter((one) => one !== "");
  if (named.length === 0) {
    problems.push("TRUSTED_PROXY names no proxy.");
    return [];
  }

  const wrong = named.filter((one) => !addressOrRange(one));
  if (wrong.length > 0) {
    problems.push(
      `TRUSTED_PROXY must be IP addresses or ranges such as "10.0.0.0/8", ` +
        `separated by commas, not ${wrong.map((one) => JSON.stringify(one)).join(", ")}.`,
    );
  }
  return named;
};

// Blank is left to the list of what is missing, so that it is said once.
const readWebsite = (
  env: NodeJS.ProcessEnv,
  problems: string[],
): Website | undefined => {
  const raw = env["WEBSITE"]?.trim() ?? "";
  if (raw === "") return undefined;
  try {
    return Website.from(raw);
  } catch {
    problems.push(
      `WEBSITE must be one of ${Website.all.map((one) => one.host).join(", ")}, ` +
        `not ${JSON.stringify(raw)}.`,
    );
    return undefined;
  }
};

// Yes or no and nothing else, because a misspelling left to mean one of them
// would have to mean the one that lets the site be found, or else a site that
// was meant to be would never be.
const readSearchEnginesWelcome = (
  env: NodeJS.ProcessEnv,
  problems: string[],
): boolean => {
  const key = "SEARCH_ENGINES_WELCOME";
  const raw = env[key]?.trim().toLowerCase() ?? "";
  if (raw === "" || raw === "false") return false;
  if (raw === "true") return true;
  problems.push(
    `${key} must be true or false, not ${JSON.stringify(env[key]?.trim())}.`,
  );
  return false;
};

const defaultPort = 3000;

// A blank value is what .env holds for a key nobody has filled in, so it means
// absent rather than zero. Left to Number(), "" is 0, which binds an arbitrary
// port and leaves a process that looks healthy and answers nothing.
const readPort = (env: NodeJS.ProcessEnv, problems: string[]): number => {
  const raw = env["PORT"]?.trim() ?? "";
  if (raw === "") return defaultPort;

  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    problems.push(
      `PORT must be a whole number between 1 and 65535, not ${JSON.stringify(raw)}.`,
    );
    return defaultPort;
  }
  return port;
};

const defaultDatabaseUnreachableEmailIntervalMinutes = 30;

// Blank means nobody has filled it in, so the default, and not none: a minute
// count of zero would email the administrator for every request that failed.
// Anything that is not a whole number of minutes stops the site starting
// rather than quietly meaning the default, since whoever wrote "5m" wanted
// five.
const readDatabaseUnreachableEmailIntervalMinutes = (
  env: NodeJS.ProcessEnv,
  problems: string[],
): number => {
  const key = "DATABASE_UNREACHABLE_EMAIL_INTERVAL_MINUTES";
  const raw = env[key]?.trim() ?? "";
  if (raw === "") return defaultDatabaseUnreachableEmailIntervalMinutes;

  const minutes = Number(raw);
  if (!/^\d+$/.test(raw) || !Number.isSafeInteger(minutes) || minutes < 1) {
    problems.push(
      `${key} must be a whole number of minutes, one or more, not ${JSON.stringify(raw)}.`,
    );
    return defaultDatabaseUnreachableEmailIntervalMinutes;
  }
  return minutes;
};

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): Config => {
  const problems: string[] = [];

  const required = [
    "DATABASE_URL",
    "SESSION_COOKIE_SECRET",
    "TOKEN_SIGNING_KEY",
    "ACCOUNT_ENCRYPTION_KEY",
    "ACCOUNT_EMAIL_ADDRESS_HASH_KEY",
    "EMAIL_FROM_ADDRESS",
    "EMAIL_FROM_NAME",
    "SITE_NAME",
    "WEBSITE",
  ];
  const missing = required.filter((key) => (env[key]?.trim() ?? "") === "");
  if (missing.length > 0) problems.push(`Missing: ${missing.join(", ")}.`);

  // Every problem at once. Fixing one thing only to be told about the next is
  // a worse morning than being told about both.
  const port = readPort(env, problems);
  const trustedProxies = readTrustedProxies(env, problems);
  const website = readWebsite(env, problems);
  const searchEnginesWelcome = readSearchEnginesWelcome(env, problems);
  const databaseUnreachableEmailIntervalMinutes =
    readDatabaseUnreachableEmailIntervalMinutes(env, problems);
  if (problems.length > 0 || website === undefined)
    throw new ConfigError(problems);

  return {
    port,
    databaseUrl: env["DATABASE_URL"]!,
    sessionCookieSecret: env["SESSION_COOKIE_SECRET"]!,
    tokenSigningKey: env["TOKEN_SIGNING_KEY"]!,
    accountEncryptionKey: env["ACCOUNT_ENCRYPTION_KEY"]!,
    accountEmailAddressHashKey: env["ACCOUNT_EMAIL_ADDRESS_HASH_KEY"]!,
    emailFromAddress: env["EMAIL_FROM_ADDRESS"]!.trim(),
    emailFromName: env["EMAIL_FROM_NAME"]!.trim(),
    siteName: env["SITE_NAME"]!.trim(),
    website,
    administratorEmailAddress:
      env["ADMINISTRATOR_EMAIL_ADDRESS"]?.trim() || undefined,
    databaseUnreachableEmailIntervalMinutes,
    databaseAccessFile:
      env["DATABASE_ACCESS_FILE"]?.trim() || ".database-access",
    canonicalHost: readCanonicalHost(env),
    trustedProxies,
    recaptcha: recaptchaKeys(env),
    google: optional(env, "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"),
    facebook: optional(env, "FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET"),
    oldSitePasswordSalt: env["OLD_SITE_PASSWORD_SALT"]?.trim() || undefined,
    searchEnginesWelcome,
    websiteDatabaseUrl: env["WEBSITE_DATABASE_URL"]?.trim() || undefined,
    backupDatabaseUrl: env["BACKUP_DATABASE_URL"]?.trim() || undefined,
  };
};

// Development convenience only. In every other environment the variables are
// already in the environment and there is no file to read.
export const loadEnvFile = (path = ".env"): void => {
  if (existsSync(path)) process.loadEnvFile(path);
};
