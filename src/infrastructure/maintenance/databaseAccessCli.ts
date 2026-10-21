import {
  type DatabaseAccess,
  DatabaseAccessRefused,
  MOST_MINUTES_OFF,
  MOST_WORDS,
} from "../../application/common/DatabaseAccess.js";

/** What the script did, and what it says of it. */
export interface DatabaseAccessOutcome {
  readonly exitCode: 0 | 1;
  readonly said: string;
}

const usage = `Usage:
  db:access off --minutes <minutes> [--text <words>]
                                         turn database access off
  db:access change --from-now <minutes> [--text <words>]
                                         move the expected return, from now
  db:access on                           turn database access on
The minutes are a whole number from 1 to ${String(MOST_MINUTES_OFF)}. The
words are what readers are told in place of the usual sentence, up to
${String(MOST_WORDS)} characters, and are the whole of what follows --text.`;

const failed = (said: string): DatabaseAccessOutcome => ({
  exitCode: 1,
  said,
});

// Each flag the command takes, given once, with a value after it. Anything
// else is refused, so that a flag that does nothing is never taken for one
// that did. The words are the whole of what follows --text, so that they need
// no quoting, and are last.
const flagsOf = (
  words: readonly string[],
  allowed: string,
): { value: string | undefined; text: string | undefined } | undefined => {
  let value: string | undefined;
  let text: string | undefined;
  let given = false;
  let index = 0;
  for (; index < words.length; index += 2) {
    if (words[index] === "--text") {
      if (text !== undefined) return undefined;
      text = words.slice(index + 1).join(" ");
      break;
    }
    if (words[index] !== allowed || given) return undefined;
    // The flag with nothing after it is a flag given and no value, which is
    // the same as the flag not being given: the minutes are needed.
    given = true;
    value = words[index + 1];
  }
  return { value, text };
};

// What is not a number is not a whole number, which is the switch's to say
// (FileDatabaseAccess.feature), so the rules are in one place.
const minutesOf = (text: string): number =>
  text.trim() === "" ? Number.NaN : Number(text);

/** What is said to an administrator of minutes the switch refused. */
export const minutesRefusalSaid = (code: string): string =>
  code === "DatabaseAccess.MinutesNotWhole"
    ? "The minutes must be a whole number."
    : code === "DatabaseAccess.WordsTooLong"
      ? `The words must be no more than ${String(MOST_WORDS)} characters.`
      : `The minutes must be from 1 to ${String(MOST_MINUTES_OFF)}.`;

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

  const minutes = minutesOf(flags.value);
  try {
    if (command === "off") await access.turnOff(minutes, now(), flags.text);
    else await access.moveReturn(minutes, now(), flags.text);
  } catch (failure) {
    if (failure instanceof DatabaseAccessRefused) {
      if (failure.code === "DatabaseAccess.NotOff") {
        return failed("Database access is not off.");
      }
      return failed(minutesRefusalSaid(failure.code));
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
