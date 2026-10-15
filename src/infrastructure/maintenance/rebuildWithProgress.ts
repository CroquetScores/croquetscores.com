// What the two rebuilds of read models say of themselves, said once
// (rebuildReadModelsCli.feature, rebuildBackupReadModelsCli.feature): how many
// streams there are, how far it has got every 10 seconds, how many events it
// made them from, and how long it took.
//
// What differs is what each does beside saying so, which the one that has a
// site to tell hooks in at an update: the site's moves when it is expected
// back, and the backup's has nobody to tell.
import type { RebuildProgress } from "../../application/common/RebuildProgress.js";

/** What the script makes the read models again with, and how many events it read. */
export interface Rebuilding {
  rebuild(progress: RebuildProgress): Promise<number>;
}

/** What a rebuild is given of the world it runs in. */
export interface RebuildSaying {
  readonly now: () => Date;
  /** Says a line. */
  readonly say: (line: string) => void;
}

/** How far a rebuild has got, as of an update. */
export interface RebuildUpdate {
  readonly completed: number;
  readonly total: number;
  /** How long the streams left are estimated to take, in milliseconds. */
  readonly left: number;
  /** The moment of the update, in milliseconds. */
  readonly at: number;
}

const AN_UPDATE_EVERY = 10 * 1000;
export const A_MINUTE = 60 * 1000;
// Under a twentieth of a minute is not "0.0 minutes", which says nothing was
// done.
const UNDER_A_TENTH = 0.05 * A_MINUTE;

const commas = (count: number): string => count.toLocaleString("en-US");

const streamsSaid = (count: number): string =>
  `${commas(count)} stream${count === 1 ? "" : "s"}`;

// Minutes, to three decimal places and with commas, as the estimate is said.
const minutesLeftSaid = (milliseconds: number): string =>
  (milliseconds / A_MINUTE).toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

const tookSaid = (milliseconds: number): string =>
  milliseconds < UNDER_A_TENTH
    ? "less than 0.1 minutes"
    : `${(milliseconds / A_MINUTE).toFixed(1)} minutes`;

export const failureSaid = (failure: unknown): string =>
  failure instanceof Error ? failure.message : String(failure);

/**
 * Makes the read models again with `rebuilding`, saying how far it has got and
 * how long it took. A failure is thrown, for the caller to say what it means
 * for what else it did: the rebuild is one transaction, so every read model is
 * as it was.
 *
 * An update is said every 10 seconds, counted from the last or from when the
 * streams were counted, as the stream being done when it falls due is
 * finished and not interrupted. None is said once everything is done: the line
 * after it says how long it took. `onUpdate` is told of each one said, after
 * it is said, and what it answers is waited for.
 */
export const rebuildSaying = async (
  rebuilding: Rebuilding,
  { now, say }: RebuildSaying,
  onUpdate?: (update: RebuildUpdate) => void | Promise<void>,
): Promise<void> => {
  let total = 0;
  let began = now().getTime();
  let lastUpdate = began;

  const events = await rebuilding.rebuild({
    streams: (count) => {
      total = count;
      say(
        `There ${count === 1 ? "is" : "are"} ${streamsSaid(count)} in the event store.`,
      );
      began = now().getTime();
      lastUpdate = began;
    },
    streamDone: (completed) => {
      // Not when everything is done: the next line says how long it took.
      if (completed >= total) return;
      const at = now().getTime();
      if (at - lastUpdate < AN_UPDATE_EVERY) return;
      lastUpdate = at;
      const left = ((at - began) / completed) * (total - completed);
      say(
        `${commas(completed)} of ${commas(total)} streams completed, approximately ${minutesLeftSaid(left)} minutes to complete.`,
      );
      return onUpdate?.({ completed, total, left, at });
    },
  });
  say(`Every read model is made again from ${commas(events)} events.`);
  say(`The rebuild took ${tookSaid(now().getTime() - began)}.`);
};
