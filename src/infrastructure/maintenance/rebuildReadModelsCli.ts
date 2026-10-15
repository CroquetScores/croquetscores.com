import {
  type DatabaseAccess,
  DatabaseAccessRefused,
  MOST_MINUTES_OFF,
} from "../../application/common/DatabaseAccess.js";
import { minutesRefusalSaid } from "./databaseAccessCli.js";
import {
  A_MINUTE,
  failureSaid,
  type Rebuilding,
  rebuildSaying,
} from "./rebuildWithProgress.js";

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

// Minutes added to what is estimated to be left, when the site is told when it
// is expected back.
const IN_HAND = 5;
// How many times the streams done are to be fewer than the streams there are,
// for the estimate to be told to readers: a tenth.
const ENOUGH_TO_GO_BY = 10;
// How long the site is given to see that access is off: it reads the switch at
// most once in a second (FileDatabaseAccess.feature).
const FOR_THE_SITE_TO_NOTICE = 1000;

// How many whole minutes the page is told, which cannot be said in parts:
// rounded up, and no fewer than one, since a page that says "0 minutes" and
// goes on is worse than one that is a little long.
const wholeMinutesLeft = (milliseconds: number): number =>
  Math.max(1, Math.ceil(milliseconds / A_MINUTE));

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
  try {
    await rebuildSaying(
      rebuilding,
      { now, say },
      ({ completed, total, left, at }) => {
        // The first streams say little of the rest, so what a reader is told is
        // left as it was said until a tenth of them are done.
        if (completed * ENOUGH_TO_GO_BY < total) return;
        // What a reader is told follows what the rebuild has found out, with
        // five minutes in hand, and never more than can be said.
        const back = Math.min(
          wholeMinutesLeft(left) + IN_HAND,
          MOST_MINUTES_OFF,
        );
        return access.moveReturn(back, new Date(at)).catch((failure) => {
          // Somebody turned access on while this ran: there is no return to
          // move, and it is theirs to have turned on, so it is left on.
          if (
            failure instanceof DatabaseAccessRefused &&
            failure.code === "DatabaseAccess.NotOff"
          ) {
            return;
          }
          // Any other is not worth the rebuild, which is most of an hour's work,
          // for a figure on a page.
          if (!saidItCouldNotMove) {
            saidItCouldNotMove = true;
            say(
              `The site's expected return could not be moved: ${failureSaid(failure)}`,
            );
          }
        });
      },
    );
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
