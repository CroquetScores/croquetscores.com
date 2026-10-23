import {
  link,
  mkdir,
  readFile,
  rename,
  unlink,
  writeFile,
} from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

import {
  type DatabaseAccess,
  DatabaseAccessRefused,
  type DatabaseAccessState,
  MOST_MINUTES_OFF,
  MOST_WORDS,
} from "../../application/common/DatabaseAccess.js";

const A_MINUTE = 60 * 1000;
const A_SECOND = 1000;

/** What a fault in the file is logged with. */
export interface FaultLog {
  error(details: unknown, message: string): void;
}

export interface FileDatabaseAccessOptions {
  /** Where the switch is kept. */
  readonly path: string;
  /** The moment it is now, which is what the file is read by the second of. */
  readonly now: () => Date;
  readonly log: FaultLog;
  /** How the file is read, given so that a scenario can count the readings. */
  readonly readFile?: (path: string) => Promise<string>;
}

const on: DatabaseAccessState = { off: false };
const besidePath = (path: string): string =>
  `${path}.${String(process.pid)}.${randomUUID()}.tmp`;

// A whole number of minutes from 1 to the most, said as the code that says
// which rule it broke.
const ensureMinutes = (minutes: number): void => {
  if (typeof minutes !== "number" || !Number.isInteger(minutes)) {
    throw new DatabaseAccessRefused(
      "DatabaseAccess.MinutesNotWhole",
      "The minutes must be a whole number.",
    );
  }
  if (minutes < 1 || minutes > MOST_MINUTES_OFF) {
    throw new DatabaseAccessRefused(
      "DatabaseAccess.MinutesOutOfRange",
      `The minutes must be from 1 to ${String(MOST_MINUTES_OFF)}.`,
    );
  }
};

// Words that are not too long, and none where they are only spaces, which
// would leave a reader a page with a blank where the sentence was.
const ensureWords = (words: string | undefined): string | undefined => {
  const trimmed = words?.trim();
  if (trimmed !== undefined && trimmed.length > MOST_WORDS) {
    throw new DatabaseAccessRefused(
      "DatabaseAccess.WordsTooLong",
      `The words must be no more than ${String(MOST_WORDS)} characters.`,
    );
  }
  return trimmed === "" ? undefined : trimmed;
};

/**
 * Database access kept in a file the site reads without its database
 * (FileDatabaseAccess.feature).
 *
 * A file that cannot be read as what it should be is access on, and is logged
 * as a fault: a switch that failed shut would take the site down for a typing
 * mistake in a file nobody is watching, and a site that is down on purpose is
 * one somebody is watching. It is written whole to a file of its own and then
 * moved into place, so that a site reading it while it is written reads the
 * old one or the new one and never half of either.
 */
export class FileDatabaseAccess implements DatabaseAccess {
  readonly #options: FileDatabaseAccessOptions;
  #cached:
    { readonly at: number; readonly state: DatabaseAccessState } | undefined;
  #reading: Promise<DatabaseAccessState> | undefined;
  // Changed by every write, so that a reading begun before one is not kept
  // after it as though it were what is there.
  #generation = 0;
  // The fault last logged, so that the same one is not logged again at every
  // reading, which is once a second for as long as it is there.
  #lastFault: string | undefined;

  constructor(options: FileDatabaseAccessOptions) {
    this.#options = options;
  }

  async current(): Promise<DatabaseAccessState> {
    const now = this.#options.now().getTime();
    const cached = this.#cached;
    // Within the second either side, so that a clock that steps back does not
    // keep what it read for as long as it is behind.
    if (cached !== undefined && Math.abs(now - cached.at) < A_SECOND) {
      return cached.state;
    }
    const generation = this.#generation;
    const reading =
      this.#reading ??
      this.#read().finally(() => {
        // Only its own: a later reading is not for this to clear.
        if (this.#reading === reading) this.#reading = undefined;
      });
    this.#reading = reading;
    const state = await reading;
    // Not kept where a change was made while it was being read.
    if (generation === this.#generation) this.#cached = { at: now, state };
    return state;
  }

  async turnOff(minutes: number, at: Date, words?: string): Promise<void> {
    ensureMinutes(minutes);
    const kept = ensureWords(words);
    await this.#write(at, new Date(at.getTime() + minutes * A_MINUTE), kept);
  }

  async turnOffIfOn(minutes: number, at: Date, words?: string): Promise<void> {
    ensureMinutes(minutes);
    const kept = ensureWords(words);
    const { path } = this.#options;
    await mkdir(dirname(path), { recursive: true });
    const beside = besidePath(path);
    try {
      await writeFile(
        beside,
        JSON.stringify({
          turnedOffAt: at.toISOString(),
          expectedBackAt: new Date(
            at.getTime() + minutes * A_MINUTE,
          ).toISOString(),
          ...(kept === undefined ? {} : { words: kept }),
        }),
      );
      try {
        // Made as a link, which is refused where the file is there, in the one
        // step that decides: two that begin at once are not both let.
        await link(beside, path);
      } catch (failure) {
        if ((failure as NodeJS.ErrnoException).code !== "EEXIST") throw failure;
        // There is a file. A file that is access off is somebody's
        // maintenance. One that cannot be read as that is access on, as the
        // site reads it, and is replaced.
        if ((await this.#read()).off) {
          throw new DatabaseAccessRefused(
            "DatabaseAccess.AlreadyOff",
            "Database access is off already.",
          );
        }
        await rename(beside, path);
      }
    } finally {
      await unlink(beside).catch(() => undefined);
    }
    this.#changed();
  }

  async moveReturn(minutes: number, at: Date, words?: string): Promise<void> {
    ensureMinutes(minutes);
    const given = words === undefined ? undefined : (ensureWords(words) ?? "");
    // Read afresh: what is moved is what is there, not what was there a
    // moment ago.
    const state = await this.#read();
    if (!state.off) {
      throw new DatabaseAccessRefused(
        "DatabaseAccess.NotOff",
        "Database access is not off.",
      );
    }
    await this.#write(
      state.turnedOffAt,
      new Date(at.getTime() + minutes * A_MINUTE),
      given === undefined ? state.words : given === "" ? undefined : given,
    );
  }

  async turnOn(): Promise<void> {
    try {
      await unlink(this.#options.path);
    } catch (failure) {
      if ((failure as NodeJS.ErrnoException).code !== "ENOENT") throw failure;
    }
    this.#changed();
  }

  // What was read before now is not what is there.
  #changed(): void {
    this.#generation += 1;
    this.#reading = undefined;
    this.#cached = undefined;
  }

  async #write(
    turnedOffAt: Date,
    expectedBackAt: Date,
    words: string | undefined,
  ): Promise<void> {
    const { path } = this.#options;
    await mkdir(dirname(path), { recursive: true });
    // Beside it, so that the move is within one directory and is atomic.
    const beside = besidePath(path);
    try {
      await writeFile(
        beside,
        JSON.stringify({
          turnedOffAt: turnedOffAt.toISOString(),
          expectedBackAt: expectedBackAt.toISOString(),
          ...(words === undefined ? {} : { words }),
        }),
      );
      await rename(beside, path);
    } catch (failure) {
      // Not left to be found beside it, one for every process that tried.
      await unlink(beside).catch(() => undefined);
      throw failure;
    }
    this.#changed();
  }

  async #read(): Promise<DatabaseAccessState> {
    const { path } = this.#options;
    let text: string;
    try {
      text = await (this.#options.readFile ?? defaultRead)(path);
    } catch (failure) {
      if ((failure as NodeJS.ErrnoException).code === "ENOENT") {
        this.#lastFault = undefined;
        return on;
      }
      this.#fault(failure, "Could not read the database access file.");
      return on;
    }
    try {
      const written = JSON.parse(text) as Record<string, unknown>;
      const turnedOffAt = new Date(String(written["turnedOffAt"]));
      const expectedBackAt = new Date(String(written["expectedBackAt"]));
      if (
        typeof written["turnedOffAt"] !== "string" ||
        typeof written["expectedBackAt"] !== "string" ||
        Number.isNaN(turnedOffAt.getTime()) ||
        Number.isNaN(expectedBackAt.getTime())
      ) {
        throw new Error("The file does not say when access was turned off.");
      }
      // Words that are not text are a fault like any other part of the file.
      const words = written["words"];
      if (words !== undefined && typeof words !== "string") {
        throw new Error("The words in the file are not text.");
      }
      this.#lastFault = undefined;
      return {
        off: true,
        turnedOffAt,
        expectedBackAt,
        ...(words === undefined || words === "" ? {} : { words }),
      };
    } catch (failure) {
      this.#fault(
        failure,
        "The database access file is not what it should be, so access is on.",
      );
      return on;
    }
  }

  #fault(failure: unknown, message: string): void {
    const key = `${message} ${failure instanceof Error ? failure.message : String(failure)}`;
    if (key === this.#lastFault) return;
    this.#lastFault = key;
    this.#options.log.error(failure, message);
  }
}

const defaultRead = (path: string): Promise<string> => readFile(path, "utf8");
