// The site's country for each way the world rankings' lists write one
// (FileWorldRankingCountries.feature, WorldRankingEvents.feature): the
// Association Croquet list by name, as it keeps them, and the Golf Croquet list
// by the three letters used for a country in sport.
import { Countries } from "../../domain/aggregates/tournaments/value-objects/Countries.js";
import type { Country } from "../../domain/aggregates/tournaments/value-objects/Country.js";
import { oldFlagOf } from "./oldSites.js";

// The names of countries the Association Croquet list gives in its own words.
const acCountryAliases: Readonly<Record<string, string>> = {
  "czech rep": "cz",
  usa: "us",
  bosnia: "ba",
  russia: "ru",
  palestine: "ps",
  iran: "ir",
};

/** The country the Association Croquet list calls `name`, if the site has it. */
export const countryNamedInList = (name: string): Country | undefined => {
  const lower = name.trim().toLowerCase();
  const alias = acCountryAliases[lower];
  if (alias !== undefined) return Countries.thereAre.find(alias);
  return Countries.thereAre.all.find(
    (country) => country.name.toLowerCase() === lower,
  );
};

/** The country the Golf Croquet list gives as `letters`, if the site has it. */
export const countryOfLetters = (letters: string): Country | undefined => {
  const flag = oldFlagOf(letters.trim());
  return flag === undefined ? undefined : Countries.thereAre.find(flag);
};
