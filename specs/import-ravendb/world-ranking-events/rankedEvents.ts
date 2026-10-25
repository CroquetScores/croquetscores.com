// The world rankings' lists a scenario gives, written as the files they are
// kept in and read as the import reads them, so that what is read is what the
// files hold and not what the scenario means (WorldRankingEvents.feature).
import { join } from "node:path";

import { WorldRankingEvents } from "../../../src/import-ravendb/WorldRankingEvents.js";
import type { SpecWorld } from "../../support/world.js";

interface Given {
  readonly acEvents: { name: string; written: string; country: string }[];
  readonly gcEvents: { name: string; serial: number; letters: string }[];
  /** Rows given whole, in place of the ones above. */
  acRows: string[] | undefined;
}

const givens = new WeakMap<SpecWorld, Given>();

export const givenOf = (world: SpecWorld): Given => {
  const found = givens.get(world);
  if (found !== undefined) return found;
  const made: Given = { acEvents: [], gcEvents: [], acRows: undefined };
  givens.set(world, made);
  return made;
};

/** The number of days since 1 January 1900 that Excel counts for `day`. */
export const excelSerialOf = (day: string): number =>
  Math.round(
    (Date.parse(`${day}T00:00:00Z`) - Date.UTC(1899, 11, 30)) / 86_400_000,
  );

/** The lists the scenario gave, none where it gave none. */
export const eventsGivenTo = (world: SpecWorld): WorldRankingEvents => {
  const given = givens.get(world);
  if (given === undefined) return WorldRankingEvents.none;
  const countries = [...new Set(given.acEvents.map((event) => event.country))];
  return WorldRankingEvents.parse({
    acCountries: countries
      .map((name, index) => `${String(index + 1)},${name},,,`)
      .join("\n"),
    acEvents:
      given.acRows?.join("\n") ??
      given.acEvents
        .map(
          (event, index) =>
            `${String(index + 1)},1,2012,${event.name},${event.written},2,95,1,95,${String(countries.indexOf(event.country) + 1)},18,1910,0,A`,
        )
        .join("\n"),
    gcEvents: given.gcEvents
      .map(
        (event, index) =>
          `${String(index + 1)},1,${event.name},${event.letters},${String(event.serial)},2,31,1,31,2012`,
      )
      .join("\n"),
  });
};

/** The lists the import holds, as the files in the repository are. */
export const heldEvents = (): Promise<WorldRankingEvents> =>
  WorldRankingEvents.readFrom(
    join(
      import.meta.dirname,
      "../../../src/infrastructure/world-rankings/events",
    ),
  );
