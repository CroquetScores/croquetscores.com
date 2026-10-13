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
    reader: new FileDatabaseAccess({
      ...options,
      readFile: (from: string) => {
        reads += 1;
        return readFile(from, "utf8");
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
