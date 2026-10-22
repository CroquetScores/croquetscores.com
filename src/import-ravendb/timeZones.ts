// The country each time zone the old sites' tournaments were kept in means
// (ImportTournaments.feature), by its code here. The old sites kept no country,
// and the time zone is the nearest thing to one. Every zone Windows keeps means
// the country windowsTimeZones.ts gives it, but where the old sites'
// tournaments say otherwise.
import { windowsTimeZones } from "./windowsTimeZones.js";

// Zones taken as a country other than the one they mean for the world as a
// whole. "GMT Standard Time" is Great Britain's, Ireland's and Portugal's
// alike, and "W. Europe Standard Time" is kept by much of western Europe. The
// first is taken as England's, where the old tournaments kept in it were
// played, and the second as Spain's; a manager can move one played elsewhere.
//
// Three zones that mean no country are taken as one all the same, since the
// old sites' tournaments were kept in them: "UTC" and "Dateline Standard Time"
// as England's, and "UTC+13" as New Zealand's.
const chosen: Readonly<Record<string, string>> = {
  "GMT Standard Time": "england",
  "W. Europe Standard Time": "es",
  UTC: "england",
  "Dateline Standard Time": "england",
  "UTC+13": "nz",
};

// Time zones read as another, which the old sites' managers chose for
// tournaments played where the other is kept. The old sites offered every time
// zone of the machine they ran on, and some managers on the Pacific coast of
// the United States chose Mexico's, which keeps the same hours.
const readAs: Readonly<Record<string, string>> = {
  "Pacific Standard Time (Mexico)": "Pacific Standard Time",
};

/** The code of the country `timeZone` means, or nothing where the import does not know it. */
export const countryOfTimeZone = (timeZone: string): string | undefined => {
  const read = readAs[timeZone] ?? timeZone;
  return chosen[read] ?? windowsTimeZones[read];
};

/** Where a tournament kept in a time zone is: its country, and its region where the import gives it one. */
export interface PlaceOfTimeZone {
  readonly country: string;
  readonly region?: string | undefined;
}

// The one time zone the import does not take at its word: a tournament kept in
// China's is in Western Australia, which keeps the same hours. The only time
// zone given a region, since a time zone does not otherwise say which of a
// country's regions a tournament was in (ImportTournaments.feature).
const placedAs: Readonly<Record<string, PlaceOfTimeZone>> = {
  "China Standard Time": { country: "au", region: "wa" },
};

/** The place `timeZone` means, or nothing where the import does not know it. */
export const placeOfTimeZone = (
  timeZone: string,
): PlaceOfTimeZone | undefined => {
  const read = readAs[timeZone] ?? timeZone;
  const placed = placedAs[read];
  if (placed !== undefined) return placed;
  const country = countryOfTimeZone(timeZone);
  return country === undefined ? undefined : { country };
};
