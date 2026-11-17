// The site the scenarios talk to, started as a process of its own over a
// database of its own, and known only by its address. Nothing of the site's
// code is loaded here: what is started is a command, and what it is told is
// settings, as a person deploying it would tell it.
//
// One site and one database serve every scenario of a worker, and each
// scenario begins by telling the site to forget what the last one left
// (`forget`), since starting a site takes longer than most scenarios do. The
// control that does it exists only for a site over a database named as these
// are, and answers only to the token this makes up for the run
// (src/web/testControl.ts).
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import pg from "pg";

import { startStandInGoogle, stopStandInGoogle } from "./googleStandIn.js";

// The root of the repository, where the site's command is run from.
const root = resolve(import.meta.dirname, "..", "..", "..");
const require = createRequire(import.meta.url);

// What every database made here begins with, so that whoever finds one left
// behind knows what it was for, and so that the site will accept the control
// over it. Written out here and not read from the site: a site that changed
// the rule should fail these scenarios, which is what they are for.
const prefix = "zzz_delete_me_spec_w";

export interface RunningSite {
  readonly baseUrl: string;
  readonly token: string;
}

let starting: Promise<RunningSite> | undefined;

// What the site has written to its log, a line at a time, which a scenario about
// what is logged reads from where its own scenario began (`markTheLog`).
const logged: string[] = [];
let unfinished = "";

const keepLogged = (text: Buffer): void => {
  const lines = (unfinished + text.toString("utf8")).split("\n");
  unfinished = lines.pop() ?? "";
  logged.push(...lines.filter((line) => line.trim() !== ""));
};

/** Where in the log the next scenario begins. */
export const markTheLog = (): number => logged.length;

/** What the site has logged since `mark`. */
export const loggedSince = (mark: number): readonly string[] =>
  logged.slice(mark);
let child: ChildProcess | undefined;
let databaseName: string | undefined;
let templateName: string | undefined;
let maintenance: pg.Pool | undefined;
let folder: string | undefined;

// Where the databases are made: the one the settings name, which the specs
// borrow for the length of a run and never write to.
const serverUrl = (): URL => {
  if (existsSync(join(root, ".env"))) process.loadEnvFile(join(root, ".env"));
  const given = process.env["DATABASE_URL"];
  if (given === undefined || given.trim() === "") {
    throw new Error(
      "DATABASE_URL is not set, so there is no Postgres to make the site's database in. Run npm run db:up.",
    );
  }
  return new URL(given);
};

const urlOf = (name: string): string => {
  const url = serverUrl();
  url.pathname = `/${name}`;
  return url.toString();
};

const freePort = (): Promise<number> =>
  new Promise((done, fail) => {
    const probe = createServer();
    probe.once("error", fail);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      probe.close(() => {
        if (address === null || typeof address === "string") {
          fail(new Error("No port was free."));
        } else done(address.port);
      });
    });
  });

// A command run to the end, whose failure says what it printed.
const run = (name: string, command: string[], env: NodeJS.ProcessEnv): void => {
  const { status, stdout, stderr } = spawnSync(
    process.execPath,
    [require.resolve("tsx/cli"), ...command],
    { cwd: root, env, encoding: "utf8" },
  );
  if (status !== 0) {
    throw new Error(
      `${name} failed (${String(status)}):\n${stdout}\n${stderr}`,
    );
  }
};

const secret = (): string => randomBytes(32).toString("base64");

const start = async (): Promise<RunningSite> => {
  maintenance = new pg.Pool({
    connectionString: serverUrl().toString(),
    max: 2,
  });
  const suffix = `${String(process.pid)}_${randomBytes(4).toString("hex")}`;

  // The schema is made once and copied, which takes a fraction of the time
  // that making it again does.
  templateName = `${prefix}${suffix}_t`;
  await maintenance.query(`create database "${templateName}"`);
  run("The migration", ["src/infrastructure/database/migrate-cli.ts"], {
    ...process.env,
    DATABASE_URL: urlOf(templateName),
  });

  databaseName = `${prefix}${suffix}`;
  await maintenance.query(
    `create database "${databaseName}" template "${templateName}"`,
  );

  folder = mkdtempSync(join(tmpdir(), "web-spec-site-"));
  const token = randomBytes(16).toString("hex");
  siteEnvironment = {
    ...process.env,
    DATABASE_URL: urlOf(databaseName),
    DATABASE_ACCESS_FILE: join(folder, ".database-access"),
    TEST_CONTROL_TOKEN: token,
    // Written out here and not read from the site: what an account brought
    // over from the old site was hashed with, in the site's hands.
    OLD_SITE_PASSWORD_SALT: "the old site's site-wide salt",
    // The browser reaches the site on 127.0.0.1, which is trusted to say
    // which website it addressed, as something in front of the site would.
    TRUSTED_PROXY: "127.0.0.1",
    ADMINISTRATOR_EMAIL_ADDRESS: "administrator@example.com",
    ADMINISTRATOR_EMAIL_FROM_NAME: "The administrator",
    SESSION_COOKIE_SECRET: secret(),
    TOKEN_SIGNING_KEY: secret(),
    ACCOUNT_ENCRYPTION_KEY: secret(),
    ACCOUNT_EMAIL_ADDRESS_HASH_KEY: secret(),
    // Nothing here is sent anywhere: a site with no mail server writes
    // what it would send to a file.
    SMTP_HOST: "",
    SMTP_PORT: "",
    SMTP_USER_NAME: "",
    SMTP_PASSWORD: "",
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    // Where Google answers, which a scenario about Google makes use of by
    // giving the site credentials (googleStandIn.ts).
    TEST_GOOGLE_ADDRESS: await startStandInGoogle(),
    FACEBOOK_APP_ID: "",
    FACEBOOK_APP_SECRET: "",
  };
  const running = await spawnSite({});
  child = running.child;
  return { baseUrl: running.baseUrl, token };
};

// What every site of a run is given, kept so that a site started with settings of
// its own over the same database is given the same keys: what is kept in the
// database is sealed with them.
let siteEnvironment: NodeJS.ProcessEnv = {};

/**
 * Starts a site over the run's database, told `settings` besides what it is
 * always told. The port is found free and then let go of before the site
 * listens on it, so that another worker's site, finding ports at the same
 * moment, can be given the same one; the site that loses says so and stops, and
 * is started again on another.
 */
const spawnSite = async (
  settings: Readonly<Record<string, string>>,
): Promise<{ child: ChildProcess; baseUrl: string }> => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await spawnSiteOnAFreePort(settings);
    } catch (failure) {
      const taken =
        failure instanceof Error && failure.message.includes("EADDRINUSE");
      if (!taken || attempt === 5) throw failure;
    }
  }
};

const spawnSiteOnAFreePort = async (
  settings: Readonly<Record<string, string>>,
): Promise<{ child: ChildProcess; baseUrl: string }> => {
  const port = await freePort();
  const spawned = spawn(
    process.execPath,
    [require.resolve("tsx/cli"), "src/web/server.ts"],
    {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...siteEnvironment, ...settings, PORT: String(port) },
    },
  );
  // What this site has said, kept apart from the run's log so that a site that
  // does not start can be asked what it was doing.
  const said: string[] = [];
  const keep = (text: Buffer): void => {
    keepLogged(text);
    said.push(
      ...text
        .toString()
        .split("\n")
        .filter((line) => line.trim() !== ""),
    );
  };
  spawned.stdout.on("data", keep);
  spawned.stderr.on("data", keep);
  const baseUrl = `http://127.0.0.1:${String(port)}`;
  await ready(baseUrl, spawned, said);
  return { child: spawned, baseUrl };
};

// A site a scenario started with settings of its own, which is the one the
// scenario talks to until it ends.
let another:
  | {
      child: ChildProcess;
      running: RunningSite;
      settings: Readonly<Record<string, string>>;
    }
  | undefined;

/**
 * A site told `settings`, as a deployment is told its settings by the
 * environment, over the same database as the run's other site. It is the site the
 * scenario's control calls go to until the scenario ends (`endAnotherSite`).
 */
export const siteTold = async (
  settings: Readonly<Record<string, string>>,
): Promise<RunningSite> => {
  const { token } = await site();
  // What an earlier step of the scenario told its site is told still: the
  // scenario says one setting at a time, and has one site.
  const told = { ...another?.settings, ...settings };
  await endAnotherSite();
  const started = await spawnSite(told);
  another = {
    child: started.child,
    running: { baseUrl: started.baseUrl, token },
    settings: told,
  };
  return another.running;
};

/** Stops the site a scenario started for itself, if it did. */
export const endAnotherSite = async (): Promise<void> => {
  const ending = another;
  another = undefined;
  if (ending === undefined || ending.child.exitCode !== null) return;
  await new Promise<void>((done) => {
    ending.child.once("exit", () => done());
    ending.child.kill();
    setTimeout(done, 10_000);
  });
};

// Asked until it answers, since a site that is still starting refuses the
// connection. A site that stops instead is said so, rather than waited for.
const ready = async (
  baseUrl: string,
  launched: ChildProcess,
  said: readonly string[],
): Promise<void> => {
  // What the site last said, which is what there is to go on where it neither
  // answers nor stops.
  const lately = (): string =>
    said.length === 0
      ? "It has said nothing."
      : `It last said:\n${said.slice(-15).join("\n")}`;
  const until = Date.now() + 120_000;
  for (;;) {
    if (launched.exitCode !== null) {
      throw new Error(
        `The site stopped with code ${String(launched.exitCode)}. ${lately()}`,
      );
    }
    try {
      await fetch(`${baseUrl}/`);
      return;
    } catch {
      if (Date.now() > until) {
        throw new Error(`The site did not start. ${lately()}`);
      }
      await new Promise((later) => setTimeout(later, 250));
    }
  }
};

/** The site, started by the first scenario that asks and the same for the rest. */
export const site = (): Promise<RunningSite> => {
  if (another !== undefined) return Promise.resolve(another.running);
  starting ??= start();
  return starting;
};

/** Tells the site to forget what the last scenario left, and its clock too. */
export const forget = async (): Promise<void> => {
  const { baseUrl, token } = await site();
  // Asked again a few times: a request the last scenario's browser left in flight
  // can hold a table the reset needs, and is over in a moment.
  for (let attempt = 1; ; attempt++) {
    const answer = await fetch(`${baseUrl}/__test/reset`, {
      method: "POST",
      headers: { "x-test-control": token },
    });
    if (answer.status === 204) return;
    if (attempt === 5) {
      throw new Error(
        `The site would not forget: ${String(answer.status)} ${await answer.text()}`,
      );
    }
    await new Promise((later) => setTimeout(later, 300));
  }
};

/** Stops the site and drops its database, whatever state the run ended in. */
export const stop = async (): Promise<void> => {
  await endAnotherSite();
  await stopStandInGoogle();
  const running = child;
  child = undefined;
  if (running !== undefined && running.exitCode === null) {
    await new Promise<void>((done) => {
      running.once("exit", () => done());
      running.kill();
      setTimeout(done, 10_000);
    });
  }
  if (maintenance !== undefined) {
    for (const name of [databaseName, templateName]) {
      if (name !== undefined) {
        try {
          await maintenance.query(
            `drop database if exists "${name}" with (force)`,
          );
        } catch {
          // Left behind, and named so that it is known for what it is.
        }
      }
    }
    await maintenance.end();
  }
  if (folder !== undefined) rmSync(folder, { recursive: true, force: true });
  maintenance = databaseName = templateName = folder = undefined;
  starting = undefined;
};
