import {
  type DatabaseAccess,
  DatabaseAccessRefused,
  MOST_MINUTES_OFF,
} from "../../application/common/DatabaseAccess.js";
import type { RebuildProgress } from "../../application/common/RebuildProgress.js";
import { minutesRefusalSaid } from "./databaseAccessCli.js";

/** What the script makes the read models again with, and how many events it read. */
export interface Rebuilding {
  rebuild(progress: RebuildProgress): Promise<number>;
}

export interface RebuildReadModelsOutcome {
  readonly exitCode: 0 | 1;
}

/** What the script is given of the world it runs in. */
export interface RebuildReadModelsWorld {
  readonly now: () => Date;
  /** Waits that long, so that a scenario need not. */
  readonly wait: (milliseconds: number) => Promise<void>;
  /** Says a line. */
  readonly say: (line: string) => void;
}

const AN_UPDATE_EVERY = 10 * 1000;
// Minutes added to what is estimated to be left, when the site is told when it
// is expected back.
const IN_HAND = 5;
// How many times the streams done are to be fewer than the streams there are,
// for the estimate to be told to readers: a tenth.
const ENOUGH_TO_GO_BY = 10;
const A_MINUTE = 60 * 1000;
// How long the site is given to see that access is off: it reads the switch at
// most once in a second (FileDatabaseAccess.feature).
const FOR_THE_SITE_TO_NOTICE = 1000;
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

// How many whole minutes the page is told, which cannot be said in parts:
// rounded up, and no fewer than one, since a page that says "0 minutes" and
// goes on is worse than one that is a little long.
const wholeMinutesLeft = (milliseconds: number): number =>
  Math.max(1, Math.ceil(milliseconds / A_MINUTE));

const tookSaid = (milliseconds: number): string =>
  milliseconds < UNDER_A_TENTH
    ? "less than 0.1 minutes"
    : `${(milliseconds / A_MINUTE).toFixed(1)} minutes`;

/**
 * The script's work, with the arguments as the command line gives them
 * (rebuildReadModelsCli.feature): turns database access off for the minutes
 * the rebuild is expected to take, makes the read models again saying how far
 * it has got, says how long it took, and turns access on.
 */
export const runRebuildReadModels = async (
  args: readonly string[],
  access: DatabaseAccess,
  rebuilding: Rebuilding,
  world: RebuildReadModelsWorld,
): Promise<RebuildReadModelsOutcome> => {
  const { now, wait, say } = world;
  const refuse = (line: string): RebuildReadModelsOutcome => {
    say(line);
    return { exitCode: 1 };
  };

  if (args.length === 0) {
    return refuse("The minutes are needed: --minutes <minutes>.");
  }
  if (args.length !== 2 || args[0] !== "--minutes") {
    return refuse("Usage: db:rebuild-read-models --minutes <minutes>");
  }
  // What is not a number is not a whole number, which the switch says.
  const minutes = args[1]?.trim() === "" ? Number.NaN : Number(args[1]);

  // Turned off only where it is on, in one step with looking, so that somebody
  // else's maintenance is not ended by this one finishing, nor two begun at
  // once both let.
  try {
    await access.turnOffIfOn(minutes, now());
  } catch (failure) {
    if (failure instanceof DatabaseAccessRefused) {
      return refuse(
        failure.code === "DatabaseAccess.AlreadyOff"
          ? "Database access is already off."
          : minutesRefusalSaid(failure.code),
      );
    }
    throw failure;
  }
  say(`Database access is off for ${String(minutes)} minutes.`);
  await wait(FOR_THE_SITE_TO_NOTICE);

  // What a reader is told is a convenience: it is said once that it could not
  // be moved and the rebuild goes on.
  let saidItCouldNotMove = false;
  let total = 0;
  let began = now().getTime();
  let lastUpdate = began;
  try {
    const events = await rebuilding.rebuild({
      streams: (count) => {
        total = count;
        say(
          `There ${count === 1 ? "is" : "are"} ${streamsSaid(count)} in the event store.`,
        );
        began = now().getTime();
        lastUpdate = began;
      },
      streamDone: async (completed) => {
        // Not when everything is done: the next line says how long it took.
        if (completed >= total) return;
        const at = now().getTime();
        if (at - lastUpdate < AN_UPDATE_EVERY) return;
        lastUpdate = at;
        const left = ((at - began) / completed) * (total - completed);
        say(
          `${commas(completed)} of ${commas(total)} streams completed, approximately ${minutesLeftSaid(left)} minutes to complete.`,
        );
        // The first streams say little of the rest, so what a reader is told
        // is left as it was said until a tenth of them are done.
        if (completed * ENOUGH_TO_GO_BY < total) return;
        // What a reader is told follows what the rebuild has found out, with
        // five minutes in hand, and never more than can be said.
        const back = Math.min(
          wholeMinutesLeft(left) + IN_HAND,
          MOST_MINUTES_OFF,
        );
        try {
          await access.moveReturn(back, new Date(at));
        } catch (failure) {
          // Somebody turned access on while this ran: there is no return to
          // move, and it is theirs to have turned on, so it is left on.
          if (
            failure instanceof DatabaseAccessRefused &&
            failure.code === "DatabaseAccess.NotOff"
          ) {
            return;
          }
          // Any other is not worth the rebuild, which is most of an hour's
          // work, for a figure on a page.
          if (!saidItCouldNotMove) {
            saidItCouldNotMove = true;
            say(
              `The site's expected return could not be moved: ${failureSaid(failure)}`,
            );
          }
        }
      },
    });
    const took = now().getTime() - began;
    say(`Every read model is made again from ${commas(events)} events.`);
    say(`The rebuild took ${tookSaid(took)}.`);
  } catch (failure) {
    // Every read model is as it was, being one transaction, so the site is
    // safe to serve and is not left down by a failure nobody is watching.
    say(`The rebuild failed: ${failureSaid(failure)}`);
    await turnedOn(access, say);
    return { exitCode: 1 };
  }

  // The rebuild is done and committed, so a failure to turn access on is the
  // one thing the administrator must be told, and how to put right.
  return { exitCode: (await turnedOn(access, say)) ? 0 : 1 };
};

const failureSaid = (failure: unknown): string =>
  failure instanceof Error ? failure.message : String(failure);

// Turns access on and says so, or says it could not be and how to, rather than
// stopping with a trace over the one fact that matters.
const turnedOn = async (
  access: DatabaseAccess,
  say: (line: string) => void,
): Promise<boolean> => {
  try {
    await access.turnOn();
  } catch (failure) {
    say(
      `Database access could not be turned on: ${failureSaid(failure)} Turn it on with: npm run db:access -- on`,
    );
    return false;
  }
  say("Database access is on.");
  return true;
};
