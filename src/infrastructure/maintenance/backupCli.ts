import { BackupRefused, type Copied } from "./PostgresBackup.js";

/** How long the read models are expected to take to be made again. */
export const REBUILD_MINUTES = 20;

/** What the script copies with. */
export interface Copying {
  copy(all: boolean): Promise<Copied>;
}

export interface BackupOutcome {
  readonly exitCode: 0 | 1;
}

/** What the script is told, as its settings give it (Config.ts). */
export interface BackupSettings {
  /** Who is told how it went. */
  readonly administrator: string | undefined;
  /** The key the website's accounts' keys are sealed with. */
  readonly siteKey: string | undefined;
  readonly websiteDatabase: string | undefined;
  readonly localDatabase: string | undefined;
}

/** What the script is given of the world it runs in. */
export interface BackupWorld {
  readonly settings: BackupSettings;
  /**
   * Copies with the databases named, opened as it is asked to copy, so that
   * one that cannot be reached is a failure of the copy and not of starting.
   */
  readonly copying: (siteKey: string) => Copying;
  /** Makes the read models again, expected to take `minutes`. */
  readonly rebuild: (minutes: number) => Promise<void>;
  /** Sends the email. Throws where it cannot. */
  readonly send: (email: {
    to: string;
    subject: string;
    body: string;
  }) => Promise<void>;
  readonly now: () => Date;
  readonly say: (line: string) => void;
}

const A_MINUTE = 60 * 1000;

const plural = (count: number, one: string, many: string): string =>
  `${String(count)} ${count === 1 ? one : many}`;

// As the rebuild says how long it took: under a twentieth of a minute is not
// "0.0 minutes", which says nothing was done.
const tookSaid = (milliseconds: number): string => {
  if (milliseconds < 0.05 * A_MINUTE) return "less than 0.1 minutes";
  const minutes = milliseconds / A_MINUTE;
  return Number.isInteger(minutes)
    ? `${String(minutes)} minutes`
    : `${minutes.toFixed(1)} minutes`;
};

// Neither database's address or password is said anywhere, whatever the
// failure's own words were: a connection that is refused names where it was
// trying to reach.
const withoutAddresses = (
  text: string,
  addresses: readonly (string | undefined)[],
): string => {
  let said = text;
  for (const address of addresses) {
    if (address === undefined || address === "") continue;
    const hidden = new Set<string>([address]);
    try {
      const url = new URL(address);
      for (const part of [url.password, url.host, url.hostname, url.username]) {
        if (part !== "") hidden.add(decodeURIComponent(part));
      }
    } catch {
      // Not an address, and so said as it is.
    }
    for (const part of [...hidden].sort((a, b) => b.length - a.length)) {
      said = said.split(part).join("(a database)");
    }
  }
  return said;
};

// Text in an element needs only what would be read as markup escaped: a
// quotation mark or an apostrophe is not one there.
const escaped = (text: string): string =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * The script's work, with the arguments as the command line gives them
 * (backupCli.feature): copies what the website has and the other database has
 * not, makes the read models again, and tells the administrator how it went.
 */
export const runBackup = async (
  args: readonly string[],
  world: BackupWorld,
): Promise<BackupOutcome> => {
  const { settings, now, say } = world;
  const began = now().getTime();

  let copied: Copied = { events: 0, keys: 0 };
  const lines: string[] = [];
  const addresses = [settings.websiteDatabase, settings.localDatabase];
  const safe = (text: string): string => withoutAddresses(text, addresses);
  const siteKey = settings.siteKey;

  // What was copied is said wherever it is known, in the email and on the
  // screen alike, so that a task whose email did not come is read from its
  // output.
  const tell = (line: string): void => {
    lines.push(line);
    say(line);
  };

  const tellTheAdministrator = async (
    worked: boolean,
    paragraphs: readonly string[],
  ): Promise<BackupOutcome> => {
    const { administrator } = settings;
    if (administrator === undefined) return { exitCode: 1 };
    try {
      await world.send({
        to: administrator,
        subject: `Backup of the website's events: ${worked ? "worked" : "failed"}`,
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
      `${plural(copied.events, "event was", "events were")} copied and ${plural(copied.keys, "key was", "keys were")} copied.`,
    ]);
    // A failure, whether or not the administrator could be told of it.
    return { exitCode: 1 };
  };

  if (settings.administrator === undefined) {
    say("An administrator is needed: ADMINISTRATOR_EMAIL_ADDRESS.");
    return { exitCode: 1 };
  }
  if (args.length > 1 || (args.length === 1 && args[0] !== "--all")) {
    say("Usage: db:backup [--all]");
    return { exitCode: 1 };
  }
  const all = args.length === 1;

  if (siteKey === undefined || siteKey.trim() === "") {
    say("The site key is needed: ACCOUNT_ENCRYPTION_KEY.");
    return failed("that the site key is not named", undefined);
  }
  if (
    settings.websiteDatabase === undefined ||
    settings.websiteDatabase === ""
  ) {
    return failed("that the website's database is not named", undefined);
  }
  if (settings.websiteDatabase === settings.localDatabase) {
    say("The website and the local database are the same database.");
    return failed(
      "that the website and the local database are the same",
      undefined,
    );
  }

  try {
    copied = await world.copying(siteKey).copy(all);
  } catch (failure) {
    if (failure instanceof BackupRefused) {
      const step: Record<BackupRefused["code"], string> = {
        "Backup.WebsiteUnreachable": "reading the website's events",
        "Backup.LocalUnreachable": "reaching the local database",
        "Backup.CouldNotCopy": "copying the events",
        "Backup.SiteKeyIsNotTheWebsites":
          "that the site key is not the website's",
        "Backup.EventsDiffer": "copying the events",
        "Backup.NumberTaken": "copying the events",
      };
      // The one thing the administrator is to be able to find in it: which
      // event, as the failure says it.
      return failed(step[failure.code], failure.message);
    }
    return failed(
      "copying the events",
      failure instanceof Error ? failure.message : String(failure),
    );
  }
  tell(`Copied ${plural(copied.events, "event", "events")}.`);
  tell(`Copied ${plural(copied.keys, "key", "keys")}.`);

  try {
    await world.rebuild(REBUILD_MINUTES);
  } catch (failure) {
    return failed(
      "rebuilding the read models",
      failure instanceof Error ? failure.message : String(failure),
    );
  }
  tell("The read models were rebuilt.");

  const took = tookSaid(now().getTime() - began);
  say(`It took ${took}.`);
  return tellTheAdministrator(true, [
    "The backup worked.",
    `${plural(copied.events, "event was", "events were")} copied and ${plural(copied.keys, "key was", "keys were")} copied.`,
    "The read models were rebuilt.",
    `It took ${took}.`,
  ]);
};
