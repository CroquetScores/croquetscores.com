import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { DatabaseAccessState } from "../../../src/application/common/DatabaseAccess.js";
import { FileDatabaseAccess } from "../../../src/infrastructure/maintenance/FileDatabaseAccess.js";
import type { SpecWorld } from "../../support/world.js";

// What the features of the switch and of the script share: a file of the
// scenario's own, a switch that reads it as the site does and another that
// writes it as the script does, and what was read and logged. Two switches,
// so that what the reader has remembered is not cleared by the writer
// writing, as the site's is not by a script in another process.

const startsAt = new Date("2026-10-13T10:00:00Z");

export interface AccessInHand {
  readonly path: string;
  readonly reader: FileDatabaseAccess;
  readonly writer: FileDatabaseAccess;
  readonly faults: unknown[];
  /** How many times the file was read for the reader. */
  reads: () => number;
  /** What the reader last read. */
  state: DatabaseAccessState | undefined;
  /** Holds the next reading of the file for the reader after it has read it. */
  hold: () => void;
  /** Lets a held reading go, and waits for it to be done. */
  release: () => Promise<void>;
}

const inHand = new WeakMap<SpecWorld, AccessInHand>();

/** The moment the scenario said it is, or the one it starts at. */
export const momentIn = (world: SpecWorld): Date => world.moment ?? startsAt;

/** A file of the scenario's own, which is not there until something writes it. */
export const aFileThatIsNotThere = (world: SpecWorld): AccessInHand => {
  const directory = mkdtempSync(join(tmpdir(), "database-access-"));
  world.closeBeforeDropping.push(() => {
    rmSync(directory, { recursive: true, force: true });
    return Promise.resolve();
  });
  const path = join(directory, ".database-access");
  const faults: unknown[] = [];
  let reads = 0;
  // A reading that has read the file and is waiting to say so, which is how a
  // change is made while one is in flight.
  let gate: Promise<void> | undefined;
  let open: (() => void) | undefined;
  let held: Promise<unknown> | undefined;
  const options = {
    path,
    now: () => momentIn(world),
    log: { error: (details: unknown) => void faults.push(details) },
  };
  const found: AccessInHand = {
    path,
    faults,
    reads: () => reads,
    state: undefined,
    hold: () => {
      gate = new Promise<void>((resolve) => {
        open = resolve;
      });
      // Begun and not waited for: it is in flight, and is the reading the
      // scenario then makes a change under.
      held = found.reader.current();
      // Let it get as far as reading the file before the change is made.
      held.catch(() => undefined);
    },
    release: async () => {
      open?.();
      await held;
    },
    reader: new FileDatabaseAccess({
      ...options,
      readFile: async (from: string) => {
        reads += 1;
        // What the file said, or why it could not be read, either of which is
        // held the same way: the reading is waiting to say it.
        const read = readFile(from, "utf8").then(
          (text) => ({ text }),
          (failure: NodeJS.ErrnoException) => ({ failure }),
        );
        const result = await read;
        const waits = gate;
        gate = undefined;
        if (waits !== undefined) await waits;
        if ("failure" in result) return Promise.reject(result.failure);
        return result.text;
      },
    }),
    writer: new FileDatabaseAccess(options),
  };
  inHand.set(world, found);
  return found;
};

export const accessInHand = (world: SpecWorld): AccessInHand => {
  const found = inHand.get(world);
  if (found === undefined) throw new Error("There is no database access file.");
  return found;
};

/** Writes `text` to the scenario's file as it is, for a file that is wrong. */
export const holding = (world: SpecWorld, text: string): void => {
  writeFileSync(accessInHand(world).path, text);
};
