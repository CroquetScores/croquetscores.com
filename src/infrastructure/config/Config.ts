// Settings are read once, here, and handed out as a typed object. Nothing else
// in the repository touches process.env: a second reader is a second answer.
import { existsSync } from "node:fs";

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
  // key an email address is hashed with to find its account. Neither is ever
  // to be made again once anything is kept with it: a new one leaves what the
  // old one kept unreadable, or unfound.
  readonly accountEncryptionKey: string;
  readonly accountEmailAddressHashKey: string;
  // The address the site's emails are sent from, the name they are sent from
  // and signed off with, and what they call the site they come from. The last
  // two are configured rather than written into the catalogues so that a site
  // serving from this repository under another name neither signs its emails
  // nor calls itself Croquet Scores.
  readonly emailFromAddress: string;
  readonly emailFromName: string;
  readonly emailFromSite: string;
  // Who is told when a service the site needs cannot be reached. Absent on a
  // development machine, where nobody needs telling.
  readonly administratorEmailAddress: string | undefined;
  // The host this site answers to, as a browser would name it: "croquetscores.com",
  // or "localhost:3000" in development. Absent means fall back to the Host header
  // of each request, which is right on a machine nothing sits in front of and
  // wrong behind a proxy that rewrites it.
  readonly canonicalHost: string | undefined;
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
    "EMAIL_FROM_SITE",
  ];
  const missing = required.filter((key) => (env[key]?.trim() ?? "") === "");
  if (missing.length > 0) problems.push(`Missing: ${missing.join(", ")}.`);

  // Every problem at once. Fixing one thing only to be told about the next is
  // a worse morning than being told about both.
  const port = readPort(env, problems);
  if (problems.length > 0) throw new ConfigError(problems);

  return {
    port,
    databaseUrl: env["DATABASE_URL"]!,
    sessionCookieSecret: env["SESSION_COOKIE_SECRET"]!,
    tokenSigningKey: env["TOKEN_SIGNING_KEY"]!,
    accountEncryptionKey: env["ACCOUNT_ENCRYPTION_KEY"]!,
    accountEmailAddressHashKey: env["ACCOUNT_EMAIL_ADDRESS_HASH_KEY"]!,
    emailFromAddress: env["EMAIL_FROM_ADDRESS"]!.trim(),
    emailFromName: env["EMAIL_FROM_NAME"]!.trim(),
    emailFromSite: env["EMAIL_FROM_SITE"]!.trim(),
    administratorEmailAddress:
      env["ADMINISTRATOR_EMAIL_ADDRESS"]?.trim() || undefined,
    canonicalHost: readCanonicalHost(env),
    recaptcha: recaptchaKeys(env),
    google: optional(env, "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"),
    facebook: optional(env, "FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET"),
    oldSitePasswordSalt: env["OLD_SITE_PASSWORD_SALT"]?.trim() || undefined,
  };
};

// Development convenience only. In every other environment the variables are
// already in the environment and there is no file to read.
export const loadEnvFile = (path = ".env"): void => {
  if (existsSync(path)) process.loadEnvFile(path);
};
