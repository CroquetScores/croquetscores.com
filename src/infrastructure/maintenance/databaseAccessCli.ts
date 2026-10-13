import {
  type DatabaseAccess,
  DatabaseAccessRefused,
  MOST_MINUTES_OFF,
} from "../../application/common/DatabaseAccess.js";

/** What the script did, and what it says of it. */
export interface DatabaseAccessOutcome {
  readonly exitCode: 0 | 1;
  readonly said: string;
}

const usage = `Usage:
  db:access off --minutes <minutes>      turn database access off
  db:access change --from-now <minutes>  move the expected return, from now
  db:access on                           turn database access on
The minutes are a whole number from 1 to ${String(MOST_MINUTES_OFF)}.`;

const failed = (said: string): DatabaseAccessOutcome => ({
  exitCode: 1,
  said,
});

// Each flag the command takes, given once, with a value after it. Anything
// else is refused, so that a flag that does nothing is never taken for one
// that did.
const flagsOf = (
  words: readonly string[],
  allowed: string,
): { value: string | undefined } | undefined => {
  let value: string | undefined;
  let given = false;
  for (let index = 0; index < words.length; index += 2) {
    if (words[index] !== allowed || given) return undefined;
    const next = words[index + 1];
    if (next === undefined) return undefined;
    given = true;
    value = next;
  }
  return { value };
};

const wholeMinutes = (text: string): number =>
  /^-?\d+(\.\d+)?$/.test(text) ? Number(text) : Number.NaN;

/**
 * The script's work, with the arguments as the command line gives them
 * (databaseAccess.feature). It uses the switch and nothing else: no database,
 * so that it works whether the database is there or not.
 */
export const runDatabaseAccess = async (
  args: readonly string[],
  access: DatabaseAccess,
  now: () => Date,
): Promise<DatabaseAccessOutcome> => {
  const [command, ...rest] = args;

  if (command === "on") {
    if (rest.length > 0) return failed(usage);
    await access.turnOn();
    return { exitCode: 0, said: "Database access is on." };
  }

  const flag = command === "off" ? "--minutes" : "--from-now";
  if (command !== "off" && command !== "change") return failed(usage);

  const flags = flagsOf(rest, flag);
  if (flags === undefined) return failed(usage);
  if (flags.value === undefined) {
    return failed(
      command === "off"
        ? "The minutes are needed: --minutes <minutes>."
        : "The minutes from now are needed: --from-now <minutes>.",
    );
  }

  const minutes = wholeMinutes(flags.value);
  try {
    if (command === "off") await access.turnOff(minutes, now());
    else await access.moveReturn(minutes, now());
  } catch (failure) {
    if (failure instanceof DatabaseAccessRefused) {
      if (failure.code === "DatabaseAccess.NotOff") {
        return failed("Database access is not off.");
      }
      return failed(
        `The minutes must be a whole number from 1 to ${String(MOST_MINUTES_OFF)}.`,
      );
    }
    throw failure;
  }
  return command === "off"
    ? {
        exitCode: 0,
        said: `Database access is off for ${String(minutes)} minutes.`,
      }
    : {
        exitCode: 0,
        said: `${String(minutes)} minutes are now expected.`,
      };
};
