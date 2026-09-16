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
  constructor(missing: readonly string[]) {
    super(
      `Configuration is incomplete. Missing: ${missing.join(", ")}. ` +
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

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): Config => {
  const required = [
    "DATABASE_URL",
    "SESSION_COOKIE_SECRET",
    "TOKEN_SIGNING_KEY",
  ];
  const missing = required.filter((key) => (env[key]?.trim() ?? "") === "");
  if (missing.length > 0) throw new ConfigError(missing);

  return {
    port: Number(env["PORT"] ?? 3000),
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
