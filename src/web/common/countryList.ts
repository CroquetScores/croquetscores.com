// The countries there are, with the regions of each, as the website's form and
// the public API both say them, so that the two cannot drift apart.
import { Countries } from "../../domain/aggregates/tournaments/value-objects/Countries.js";
import type { Speaking } from "./language.js";

/**
 * Every country by its code, named and placed in order as `speaking`'s
 * language has it. A region is named as it was recorded, since there are
 * hundreds, most already in their own country's language.
 */
export const countriesSpokenIn = (speaking: Speaking) => {
  const byName = new Intl.Collator(speaking.language.tag);
  return Countries.thereAre.all
    .map((country) => ({
      code: country.code,
      name: speaking.say(`country.${country.code}`),
      regions: country.regions.map((region) => ({
        code: region.code,
        name: region.name,
      })),
    }))
    .sort((one, other) => byName.compare(one.name, other.name));
};
