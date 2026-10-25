// The countries the world rankings' lists name, read from the files the lists
// are kept in (FileWorldRankingCountries.feature).
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  CountriesRefused,
  type WorldRankingCountries,
} from "../../application/services/WorldRankingCountries.js";
import type { WorldRankingSport } from "../../application/services/WorldRankingLists.js";
import { countryNamedInList, countryOfLetters } from "./countriesOfLists.js";

const AC_COUNTRIES = "ac-world-ranking-countries.csv";
const GC_EVENTS = "gc-world-ranking-events.csv";

// The fields of each row that is not blank, or the file and line of one with
// other than `fields`.
const rowsOf = (
  file: string,
  text: string,
  fields: number,
): readonly (readonly string[])[] =>
  text
    .split(/\r?\n/)
    .map((row, index) => [index + 1, row] as const)
    .filter(([, row]) => row.trim() !== "")
    .map(([line, row]) => {
      const split = row.split(",");
      if (split.length !== fields) {
        throw new CountriesRefused(
          "WorldRankingCountries.UnreadableRow",
          `${file} line ${String(line)}: ${String(split.length)} fields, not ${String(fields)}.`,
        );
      }
      return split;
    });

/** The text of the two files the countries are read from. */
export interface WorldRankingCountryFiles {
  readonly acCountries: string;
  readonly gcEvents: string;
}

export class FileWorldRankingCountries implements WorldRankingCountries {
  readonly #countries: Readonly<Record<WorldRankingSport, ReadonlySet<string>>>;

  private constructor(
    countries: Record<WorldRankingSport, ReadonlySet<string>>,
  ) {
    this.#countries = countries;
  }

  /** The lists the site holds, read from the folder they are kept in. */
  static async readFrom(folder: string): Promise<FileWorldRankingCountries> {
    const read = (file: string) => readFile(join(folder, file), "utf8");
    return FileWorldRankingCountries.parse({
      acCountries: await read(AC_COUNTRIES),
      gcEvents: await read(GC_EVENTS),
    });
  }

  /** Refused by the file and the line of a row that cannot be read. */
  static parse(files: WorldRankingCountryFiles): FileWorldRankingCountries {
    // The Association Croquet list lists its countries by name, in the second
    // field; the Golf Croquet list gives each event's in its fourth.
    const named = (codes: Iterable<string | undefined>): Set<string> =>
      new Set([...codes].filter((code) => code !== undefined));
    const ac = named(
      rowsOf(AC_COUNTRIES, files.acCountries, 5).map(
        (fields) => countryNamedInList(fields[1] ?? "")?.code,
      ),
    );
    const gc = named(
      rowsOf(GC_EVENTS, files.gcEvents, 10).map(
        (fields) => countryOfLetters(fields[3] ?? "")?.code,
      ),
    );
    return new FileWorldRankingCountries({ ac, gc });
  }

  countriesOf(sport: WorldRankingSport): ReadonlySet<string> {
    return this.#countries[sport];
  }
}
