import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import {
  type DatabaseAccess,
  DatabaseAccessRefused,
  type DatabaseAccessState,
  MOST_MINUTES_OFF,
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
    this.#reading ??= this.#read().finally(() => {
      this.#reading = undefined;
    });
    const state = await this.#reading;
    this.#cached = { at: now, state };
    return state;
  }

  async turnOff(minutes: number, at: Date): Promise<void> {
    ensureMinutes(minutes);
    await this.#write(at, new Date(at.getTime() + minutes * A_MINUTE));
  }

  async moveReturn(minutes: number, at: Date): Promise<void> {
    ensureMinutes(minutes);
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
    );
  }

  async turnOn(): Promise<void> {
    try {
      await unlink(this.#options.path);
    } catch (failure) {
      if ((failure as NodeJS.ErrnoException).code !== "ENOENT") throw failure;
    }
    this.#cached = undefined;
  }

  async #write(turnedOffAt: Date, expectedBackAt: Date): Promise<void> {
    const { path } = this.#options;
    await mkdir(dirname(path), { recursive: true });
    // Beside it, so that the move is within one directory and is atomic.
    const beside = `${path}.${String(process.pid)}.tmp`;
    await writeFile(
      beside,
      JSON.stringify({
        turnedOffAt: turnedOffAt.toISOString(),
        expectedBackAt: expectedBackAt.toISOString(),
      }),
    );
    await rename(beside, path);
    this.#cached = undefined;
  }

  async #read(): Promise<DatabaseAccessState> {
    const { path, log } = this.#options;
    let text: string;
    try {
      text = await (this.#options.readFile ?? defaultRead)(path);
    } catch (failure) {
      if ((failure as NodeJS.ErrnoException).code === "ENOENT") return on;
      log.error(failure, "Could not read the database access file.");
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
      return { off: true, turnedOffAt, expectedBackAt };
    } catch (failure) {
      log.error(
        failure,
        "The database access file is not what it should be, so access is on.",
      );
      return on;
    }
  }
}

const defaultRead = (path: string): Promise<string> => readFile(path, "utf8");
