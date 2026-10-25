// The world rankings' lists of the events they have ranked, for Association
// Croquet and for Golf Croquet, each with the country it was played in
// (WorldRankingEvents.feature). A tournament's time zone says little of where
// it was played, and these do.
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { Country } from "../domain/aggregates/tournaments/value-objects/Country.js";
import { ImportRefused } from "./ImportRefused.js";
import {
  countryNamedInList,
  countryOfLetters,
} from "../infrastructure/world-rankings/countriesOfLists.js";

/** The sports the world rankings keep a list for. */
export type RankedSport = "ac" | "gc";

// A day as the number of days since 1 January 1970, so that a day before and
// a day after are sums and no time zone has a say in which day it is.
type Day = number;

interface RankedEvent {
  readonly name: string;
  readonly starts: Day;
  readonly finishes: Day;
  /** None where the list's country is one the site does not have. */
  readonly country: Country | undefined;
}

const MILLISECONDS_IN_A_DAY = 86_400_000;

const dayOfDate = (
  year: number,
  month: number,
  day: number,
): Day | undefined => {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? Math.round(date.getTime() / MILLISECONDS_IN_A_DAY)
    : undefined;
};

/** The day `written` says, as `2012-01-26`. */
export const dayWritten = (written: string): Day => {
  const [year, month, day] = written.slice(0, 10).split("-").map(Number);
  const found = dayOfDate(year ?? 0, month ?? 0, day ?? 0);
  if (found === undefined) throw new Error(`${written} is no day.`);
  return found;
};

// The Association Croquet list writes the days of an event as text, in one of
// four ways, the year always last and in two digits:
//   3.1.12            one day
//   27-30.12.11       days of one month
//   3.1-5.2.12        days of two months of one year
//   30.12.11-2.1.12   days of two years
const numbers = (text: string): number[] =>
  text.split(".").map((part) => Number(part.trim()));

const daysWritten = (
  written: string,
): { starts: Day; finishes: Day } | undefined => {
  const [from, to, ...more] = written.trim().split("-");
  if (from === undefined || more.length > 0) return undefined;
  const end = numbers(to ?? from);
  const [endDay, endMonth, endYear] = end;
  if (end.length !== 3 || [...end].some(Number.isNaN)) return undefined;
  const finishes = dayOfDate(2000 + (endYear ?? 0), endMonth ?? 0, endDay ?? 0);
  if (to === undefined) {
    return finishes === undefined ? undefined : { starts: finishes, finishes };
  }
  const start = numbers(from);
  if ([...start].some(Number.isNaN)) return undefined;
  const [startDay, startMonth = endMonth, startYear = endYear] = start;
  if (start.length > 3) return undefined;
  const starts = dayOfDate(
    2000 + (startYear ?? 0),
    startMonth ?? 0,
    startDay ?? 0,
  );
  return starts === undefined || finishes === undefined
    ? undefined
    : { starts, finishes };
};

// Excel counts days from 1 January 1900 and counts a 29 February 1900 that
// never was, so for any day after February 1900 the count is of days since the
// 30th of December 1899.
const dayOfExcel = (serial: number): Day =>
  Math.round(Date.UTC(1899, 11, 30) / MILLISECONDS_IN_A_DAY) + serial;

const wordsOf = (name: string): readonly string[] =>
  name
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word !== "");

/**
 * Whether two names are of one event: at least 95% of the words of the
 * shorter are words of the longer, whatever their case and punctuation. A
 * name of one word matches only that word alone, since "Open" is in the name
 * of a great many events.
 */
export const namesMatch = (a: string, b: string): boolean => {
  const [shorter, longer] = [wordsOf(a), wordsOf(b)].sort(
    (x, y) => x.length - y.length,
  );
  if (shorter === undefined || longer === undefined) return false;
  if (shorter.length === 0) return false;
  if (shorter.length === 1) {
    return longer.length === 1 && shorter[0] === longer[0];
  }
  const found = shorter.filter((word) => longer.includes(word)).length;
  return found / shorter.length >= 0.95;
};

const unreadable = (file: string, line: number, why: string): ImportRefused =>
  new ImportRefused(
    "WorldRankingEvents.UnreadableRow",
    `${file} line ${String(line)}: ${why}`,
  );

const rowsOf = (
  file: string,
  text: string,
  fields: number,
): readonly (readonly [line: number, fields: readonly string[]])[] =>
  text
    .split(/\r?\n/)
    .map((row, index) => [index + 1, row] as const)
    .filter(([, row]) => row.trim() !== "")
    .map(([line, row]) => {
      const split = row.split(",");
      if (split.length !== fields) {
        throw unreadable(
          file,
          line,
          `${String(split.length)} fields, not ${String(fields)}.`,
        );
      }
      return [line, split] as const;
    });

/** The text of the three files the lists are kept in. */
export interface WorldRankingEventFiles {
  readonly acEvents: string;
  readonly acCountries: string;
  readonly gcEvents: string;
}

export class WorldRankingEvents {
  readonly #events: Readonly<Record<RankedSport, readonly RankedEvent[]>>;

  private constructor(events: Record<RankedSport, readonly RankedEvent[]>) {
    this.#events = events;
  }

  /** No events at all, which finds nothing. */
  static readonly none = new WorldRankingEvents({ ac: [], gc: [] });

  /** The lists the import holds, read from the folder they are kept in. */
  static async readFrom(folder: string): Promise<WorldRankingEvents> {
    const read = (file: string) => readFile(join(folder, file), "utf8");
    return WorldRankingEvents.parse({
      acEvents: await read("ac-world-ranking-events.csv"),
      acCountries: await read("ac-world-ranking-countries.csv"),
      gcEvents: await read("gc-world-ranking-events.csv"),
    });
  }

  /** Refused by the file and the line of a row that cannot be read. */
  static parse(files: WorldRankingEventFiles): WorldRankingEvents {
    const countries = new Map<number, Country | undefined>();
    for (const [line, fields] of rowsOf(
      "ac-world-ranking-countries.csv",
      files.acCountries,
      5,
    )) {
      const number = Number(fields[0]);
      if (!Number.isInteger(number)) {
        throw unreadable("ac-world-ranking-countries.csv", line, "No number.");
      }
      countries.set(number, countryNamedInList(fields[1] ?? ""));
    }

    const ac = rowsOf("ac-world-ranking-events.csv", files.acEvents, 14).map(
      ([line, fields]): RankedEvent => {
        const days = daysWritten(fields[4] ?? "");
        if (days === undefined) {
          throw unreadable(
            "ac-world-ranking-events.csv",
            line,
            `${fields[4] ?? ""} is no days.`,
          );
        }
        const number = Number(fields[9]);
        if (!Number.isInteger(number) || !countries.has(number)) {
          throw unreadable(
            "ac-world-ranking-events.csv",
            line,
            `${fields[9] ?? ""} is no country.`,
          );
        }
        return {
          name: (fields[3] ?? "").trim(),
          ...days,
          country: countries.get(number),
        };
      },
    );

    const gc = rowsOf("gc-world-ranking-events.csv", files.gcEvents, 10).map(
      ([line, fields]): RankedEvent => {
        const serial = Number(fields[4]);
        if (!Number.isInteger(serial) || serial <= 60) {
          throw unreadable(
            "gc-world-ranking-events.csv",
            line,
            `${fields[4] ?? ""} is no day.`,
          );
        }
        const starts = dayOfExcel(serial);
        return {
          name: (fields[2] ?? "").trim(),
          starts,
          finishes: starts,
          country: countryOfLetters(fields[3] ?? ""),
        };
      },
    );
    return new WorldRankingEvents({ ac, gc });
  }

  /** How many events the list of `sport` holds. */
  count(sport: RankedSport): number {
    return this.#events[sport].length;
  }

  /** The event the list of `sport` begins with. */
  first(sport: RankedSport): { name: string; country: Country | undefined } {
    const [event] = this.#events[sport];
    if (event === undefined) throw new Error(`The ${sport} list is empty.`);
    return { name: event.name, country: event.country };
  }

  /**
   * The country the list of `sport` gives the tournament called `name` played
   * from `starts` to `finishes` (days, as `2012-01-26`), or nothing where it
   * is not found. An Association Croquet event is found by the days it started
   * and finished; a Golf Croquet event gives only the day it started, in a
   * count Excel gets wrong by a day around 1900, so it is found on the day
   * before or after as well.
   */
  countryOf(
    sport: RankedSport,
    starts: string,
    finishes: string,
    name: string,
  ): Country | undefined {
    const start = dayWritten(starts);
    const finish = dayWritten(finishes);
    return this.#events[sport].find(
      (event) =>
        event.country !== undefined &&
        (sport === "ac"
          ? event.starts === start && event.finishes === finish
          : Math.abs(event.starts - start) <= 1) &&
        namesMatch(event.name, name),
    )?.country;
  }
}
