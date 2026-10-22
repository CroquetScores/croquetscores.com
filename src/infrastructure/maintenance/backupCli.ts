import { rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { withoutAddress } from "./withoutAddress.js";

export interface BackupOutcome {
  readonly exitCode: 0 | 1;
}

/**
 * The tables the backup is of, and no other: the events, and the keys of the
 * accounts that their personal parts are sealed with (backupCli.feature).
 */
export const TABLES_BACKED_UP: readonly string[] = ["events", "account_keys"];

/** What the script is told, as its settings give it (Config.ts). */
export interface BackupSettings {
  /** Who is told how it went. */
  readonly administrator: string;
  /** The website's database, which is only read. */
  readonly websiteDatabase: string | undefined;
  /** The folder the copies are kept in. */
  readonly folder: string | undefined;
  /** The program that dumps, where it is not pg_dump of the computer's own. */
  readonly program: string | undefined;
}

/** What the script is given of the world it runs in. */
export interface BackupWorld {
  readonly settings: BackupSettings;
  /**
   * Has `tables` of the website's database `database` dumped into `file`,
   * by `program`. Throws, with what went wrong as its message, where it could
   * not (pgDump.feature).
   */
  readonly dump: (request: {
    readonly database: string;
    readonly file: string;
    readonly tables: readonly string[];
    readonly program: string | undefined;
  }) => Promise<void>;
  /** Sends the email. Throws where it cannot. */
  readonly send: (email: {
    to: string;
    subject: string;
    body: string;
  }) => Promise<void>;
  readonly now: () => Date;
  readonly say: (line: string) => void;
}

/**
 * The port on this computer that the SSH tunnel to the website's database is
 * opened on (backup-and-restore.md).
 */
const TUNNELS_PORT = "55432";

// The address is a setting in the file that development uses too, where it is
// easily left naming a database on this computer. That backup would succeed
// every night and be of nothing, so only the tunnel's port is dumped from.
// The port rather than the database's name, because the port is what the
// tunnel is and a name is only what somebody called it.
const isThroughTheTunnel = (address: string): boolean => {
  try {
    const { hostname, port } = new URL(address);
    return (
      port === TUNNELS_PORT &&
      (hostname === "127.0.0.1" || hostname === "localhost")
    );
  } catch {
    return false;
  }
};

const A_MINUTE = 60 * 1000;

// Under a twentieth of a minute is not "0.0 minutes", which says nothing was
// done.
const tookSaid = (milliseconds: number): string => {
  if (milliseconds < 0.05 * A_MINUTE) return "less than 0.1 minutes";
  const minutes = milliseconds / A_MINUTE;
  return Number.isInteger(minutes)
    ? `${String(minutes)} minutes`
    : `${minutes.toFixed(1)} minutes`;
};

const twoDigits = (number: number): string => String(number).padStart(2, "0");

/**
 * What a dump made at `moment` is called, as 2026-10-13-10-00-00.dump. In UTC,
 * so that the names sort in the order the files were made whatever the
 * computer's own time does (backupCli.feature).
 */
export const dumpNameOf = (moment: Date): string =>
  [
    String(moment.getUTCFullYear()).padStart(4, "0"),
    twoDigits(moment.getUTCMonth() + 1),
    twoDigits(moment.getUTCDate()),
    twoDigits(moment.getUTCHours()),
    twoDigits(moment.getUTCMinutes()),
    twoDigits(moment.getUTCSeconds()),
  ].join("-") + ".dump";

// Text in an element needs only what would be read as markup escaped: a
// quotation mark or an apostrophe is not one there.
const escaped = (text: string): string =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const exists = async (path: string): Promise<boolean> => {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
};

const isAFolder = async (path: string): Promise<boolean> => {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
};

/**
 * The script's work, with the arguments as the command line gives them
 * (backupCli.feature): has the events and the accounts' keys of the website's
 * database dumped to a file of the folder, named for the moment it began, and
 * tells the administrator how it went.
 */
export const runBackup = async (
  args: readonly string[],
  world: BackupWorld,
): Promise<BackupOutcome> => {
  const { settings, now, say } = world;
  const began = now();
  const safe = (text: string): string =>
    withoutAddress(text, settings.websiteDatabase);

  const tellTheAdministrator = async (
    worked: boolean,
    paragraphs: readonly string[],
  ): Promise<BackupOutcome> => {
    const { administrator } = settings;
    try {
      await world.send({
        to: administrator,
        // A failure says WARNING first, so that it stands out in an inbox
        // among the successes, which arrive every day and are only skimmed.
        subject: worked
          ? "Croquet Scores database backup worked"
          : "WARNING: Croquet Scores database backup FAILED",
        body: paragraphs.map((each) => `<p>${escaped(each)}</p>`).join("\n"),
      });
    } catch (failure) {
      say(
        `The administrator could not be told: ${safe(failure instanceof Error ? failure.message : String(failure))}`,
      );
      return { exitCode: 1 };
    }
    return { exitCode: worked ? 0 : 1 };
  };

  const failed = async (
    step: string,
    why: string | undefined,
  ): Promise<BackupOutcome> => {
    say("The backup failed.");
    say(`The failure was ${step}.`);
    const reason = why === undefined ? undefined : safe(why);
    if (reason !== undefined) say(`Why: ${reason}`);
    await tellTheAdministrator(false, [
      "The backup failed.",
      `The failure was ${step}.`,
      ...(reason === undefined ? [] : [`Why: ${reason}`]),
    ]);
    // A failure, whether or not the administrator could be told of it.
    return { exitCode: 1 };
  };

  if (args.length > 0) {
    say("Usage: db:backup");
    return { exitCode: 1 };
  }
  const { websiteDatabase, folder } = settings;
  if (websiteDatabase === undefined || websiteDatabase === "") {
    return failed("that the website's database is not named", undefined);
  }
  if (!isThroughTheTunnel(websiteDatabase)) {
    return failed(
      "that the website's database is not reached through the tunnel",
      undefined,
    );
  }
  if (folder === undefined || folder === "") {
    return failed("that the folder is not named", undefined);
  }
  // Not made where it is not there: a backup written to a folder that was
  // made for it under the wrong drive's name, as a disk that was not plugged
  // in, is a backup nobody will look for there.
  if (!(await isAFolder(folder))) {
    return failed("that the folder is not there", undefined);
  }

  const name = dumpNameOf(began);
  const file = join(folder, name);
  // A name of its own while it is made, so that the folder never holds half a
  // copy under the name of a whole one.
  const partial = `${file}.partial`;

  if (await exists(file)) {
    return failed(
      `making the dump, since a file of that name was already there: ${name}`,
      undefined,
    );
  }

  try {
    await rm(partial, { force: true });
    await world.dump({
      database: websiteDatabase,
      file: partial,
      tables: TABLES_BACKED_UP,
      program: settings.program,
    });
    await rename(partial, file);
  } catch (failure) {
    await rm(partial, { force: true });
    return failed(
      "making the dump",
      failure instanceof Error ? failure.message : String(failure),
    );
  }

  const { size } = await stat(file);
  const took = tookSaid(now().getTime() - began.getTime());
  // What was written is said wherever it is known, in the email and on the
  // screen alike, so that a task whose email did not come is read from its
  // output.
  say("The backup worked.");
  say(`The file is called ${name}.`);
  say(`The file is ${String(size)} bytes.`);
  say(`It took ${took}.`);
  return tellTheAdministrator(true, [
    "The backup worked.",
    `The file is called ${name}.`,
    `The file is ${String(size)} bytes.`,
    `It took ${took}.`,
  ]);
};
