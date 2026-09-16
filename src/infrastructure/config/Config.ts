// Settings are read once, here, and handed out as a typed object. Nothing else
// in the repository touches process.env: a second reader is a second answer.
import { existsSync } from "node:fs";

export interface OAuthCredentials {
  readonly clientId: string;
  readonly clientSecret: string;
}

export interface Config {
  readonly port: number;
  readonly databaseUrl: string;
  readonly sessionCookieSecret: string;
  readonly tokenSigningKey: string;
  // Absent until somebody pastes real credentials in. The sign-in routes that
  // need them refuse to register rather than half-working at runtime.
  readonly google: OAuthCredentials | undefined;
  readonly facebook: OAuthCredentials | undefined;
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
    google: optional(env, "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"),
    facebook: optional(env, "FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET"),
  };
};

// Development convenience only. In every other environment the variables are
// already in the environment and there is no file to read.
export const loadEnvFile = (path = ".env"): void => {
  if (existsSync(path)) process.loadEnvFile(path);
};
