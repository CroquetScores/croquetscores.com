// Making a Postgres container, kept for the long run
// (postgresContainerCli.feature). For whatever wants a Postgres of its own on
// this computer, and not for any one thing.

/** What Docker answered a command with. */
export interface DockerAnswer {
  readonly exitCode: number;
  readonly output: string;
}

/** Docker could not be reached at all: not installed, or not running. */
export class DockerUnavailable extends Error {
  constructor(cause?: unknown) {
    super("Docker could not be reached.", { cause });
    this.name = "DockerUnavailable";
  }
}

/** What the script asks of Docker. */
export interface Docker {
  /** The name of every container there is, running or not. */
  containers(): Promise<readonly string[]>;
  /**
   * Runs `docker` with `args`, with `environment` added to its own. Where the
   * arguments name a variable without a value, as "-e POSTGRES_PASSWORD",
   * Docker reads it from there, which is how a password is given without being
   * on a command line anybody can read.
   */
  run(
    args: readonly string[],
    environment: Readonly<Record<string, string>>,
  ): Promise<DockerAnswer>;
  /** Whether the Postgres of the container takes connections as `username`. */
  ready(name: string, username: string): Promise<boolean>;
}

export interface CreateContainerOutcome {
  readonly exitCode: 0 | 1;
}

/** What the script is given of the world it runs in. */
export interface CreateContainerWorld {
  /** Waits that long, so that a scenario need not. */
  readonly wait: (milliseconds: number) => Promise<void>;
  /** Says a line. */
  readonly say: (line: string) => void;
}

// The image the site is developed against (compose.yaml), so that what is kept
// in it is kept by the Postgres the site's migrations are written for.
const IMAGE = "postgres:17-alpine";
// Postgres takes a few seconds to be ready on a computer that has not run it
// before, and a minute is long enough to say something is wrong.
const TRIES = 30;
const BETWEEN_TRIES = 2000;

const FLAGS = ["--name", "--username", "--password", "--port"] as const;
type Flag = (typeof FLAGS)[number];

const usage =
  "Usage: db:create-container --name <name> --username <username> --password <password> --port <port>";

// What Docker takes as a container's name.
const containerName = /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/;
// A name Postgres takes without quoting it, which is how it is written into
// the address.
const userName = /^[A-Za-z_][A-Za-z0-9_]*$/;

// Each flag given once, with a value. Anything else is refused, so that a flag
// that does nothing is never taken for one that did.
const flagsOf = (args: readonly string[]): Map<Flag, string> | undefined => {
  const given = new Map<Flag, string>();
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index] as Flag | undefined;
    if (flag === undefined || !FLAGS.includes(flag) || given.has(flag)) {
      return undefined;
    }
    given.set(flag, args[index + 1] ?? "");
  }
  return given;
};

/**
 * The script's work, with the arguments as the command line gives them
 * (postgresContainerCli.feature): makes the container, waits for Postgres to
 * take connections, and says the address to reach it by.
 */
export const runCreateContainer = async (
  args: readonly string[],
  docker: Docker,
  world: CreateContainerWorld,
): Promise<CreateContainerOutcome> => {
  const { say, wait } = world;
  const refuse = (...lines: string[]): CreateContainerOutcome => {
    for (const line of lines) say(line);
    return { exitCode: 1 };
  };

  const given = flagsOf(args);
  if (given === undefined) return refuse(usage);

  const missing: string[] = [];
  for (const [flag, what] of [
    ["--name", "The name is needed: --name <name>."],
    ["--username", "The username is needed: --username <username>."],
    ["--password", "The password is needed: --password <password>."],
    ["--port", "The port is needed: --port <port>."],
  ] as const) {
    if ((given.get(flag) ?? "") === "") missing.push(what);
  }
  if (missing.length > 0) return refuse(...missing, usage);

  const name = given.get("--name") ?? "";
  const username = given.get("--username") ?? "";
  const password = given.get("--password") ?? "";
  const portText = given.get("--port") ?? "";

  if (!containerName.test(name)) {
    return refuse(
      "The name is not one Docker takes: letters, digits, underscores, dots and hyphens, beginning with a letter or digit.",
    );
  }
  if (!userName.test(username)) {
    return refuse(
      "The username is not one to use unquoted: letters, digits and underscores, not beginning with a digit.",
    );
  }
  // Written out as digits: Number accepts what no port is written as, such as
  // "0x1F90" and "1e3".
  const port = /^[0-9]+$/.test(portText) ? Number(portText) : Number.NaN;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return refuse("The port is a whole number from 1 to 65535.");
  }

  // Said without the password, wherever it came from: what Docker says of its
  // own failure may name what it was given.
  const safe = (text: string): string =>
    text.split(password).join("(the password)");

  try {
    if ((await docker.containers()).includes(name)) {
      return refuse(
        `There is a container called ${name} already. It is left as it is.`,
      );
    }

    const made = await docker.run(
      [
        "run",
        "--detach",
        "--name",
        name,
        "--restart",
        "unless-stopped",
        // This computer only: a database of everything the website knows is
        // not for the network.
        "--publish",
        `127.0.0.1:${String(port)}:5432`,
        // A volume of its own, so that removing the container and making it
        // again does not lose what was kept.
        "--volume",
        `${name}-data:/var/lib/postgresql/data`,
        "--env",
        `POSTGRES_USER=${username}`,
        "--env",
        `POSTGRES_DB=${username}`,
        "--env",
        "POSTGRES_PASSWORD",
        IMAGE,
      ],
      { POSTGRES_PASSWORD: password },
    );
    if (made.exitCode !== 0) {
      return refuse(
        "Docker could not make the container.",
        safe(made.output.trim()),
      );
    }
    say(`Made the container ${name}.`);

    for (let attempt = 1; ; attempt += 1) {
      if (await docker.ready(name, username)) break;
      if (attempt >= TRIES) {
        return refuse(
          "Postgres was not ready after a minute, and the container is left.",
          `See why with: docker logs ${name}`,
        );
      }
      await wait(BETWEEN_TRIES);
    }
    say("Postgres is ready.");
  } catch (failure) {
    if (failure instanceof DockerUnavailable) {
      return refuse(
        "Docker could not be reached. Is it installed, and running?",
      );
    }
    throw failure;
  }

  const address = `postgres://${username}:${encodeURIComponent(password)}@127.0.0.1:${String(port)}/${username}`;
  say(`The address is: ${address}`);
  say(
    "It is empty. To give it the site's tables, set DATABASE_URL to the address and run npm run db:migrate.",
  );
  return { exitCode: 0 };
};
