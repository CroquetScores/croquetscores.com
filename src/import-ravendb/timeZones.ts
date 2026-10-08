// The country each time zone the old sites' tournaments were kept in means
// (ImportTournaments.feature), by its code here. The old sites kept no country,
// and the time zone is the nearest thing to one. Every zone Windows keeps means
// the country windowsTimeZones.ts gives it, but where the old sites'
// tournaments say otherwise.
import { windowsTimeZones } from "./windowsTimeZones.js";

// Zones taken as a country other than the one they mean for the world as a
// whole. "GMT Standard Time" is Great Britain's, Ireland's and Portugal's
// alike, and "W. Europe Standard Time" is kept by much of western Europe. Each
// is taken as England's, where the old tournaments kept in it were played; a
// manager can move one played elsewhere.
const chosen: Readonly<Record<string, string>> = {
  "GMT Standard Time": "england",
  "W. Europe Standard Time": "england",
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
