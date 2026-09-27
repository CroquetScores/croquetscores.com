import { ValidationError } from "../../../common/validation/ValidationError.js";
import { Country } from "./Country.js";
import { countryNames } from "./countryNames.js";
import { countryRegions } from "./countryRegions.js";
import { Flags } from "./Flags.js";

/** Every rule a set of countries can break, besides those of each country. */
export type CountriesErrorCode =
  | "Countries.NoFlag"
  | "Countries.SameCodeTwice"
  | "Countries.RegionsForNoCountry";

type RegionsOfCountries = readonly (readonly [
  country: string,
  regions: readonly (readonly [code: string, name: string])[],
])[];

// Taken as a flag's name is, so that regions given for "AU" are Australia's.
const asCountryCode = (code: string): string => code.trim().toLowerCase();

// In order as a reader looks for a name in a list, so that the Åland Islands
// come among the countries beginning with A rather than after Zimbabwe, as
// comparing the names character by character would put them.
const byName = new Intl.Collator("en");

/**
 * The countries there are, one for each name given, each made from its flag,
 * found by code and kept in order of their names.
 */
export class Countries {
  readonly #byCode: ReadonlyMap<string, Country>;
  readonly #inOrder: readonly Country[];

  private constructor(byCode: ReadonlyMap<string, Country>) {
    this.#byCode = byCode;
    this.#inOrder = [...byCode.values()].sort((a, b) =>
      byName.compare(a.name, b.name),
    );
  }

  /**
   * A country for each of `names`, made from the flag among `flags` its code
   * names and divided into the regions `regions` gives for that code. Throws
   * {@link ValidationError} for the first code no flag has, the first code
   * named twice, the first regions given for a code no country has, or the
   * first name or region that cannot be a country's.
   */
  static from(
    flags: Flags,
    names: readonly (readonly [code: string, name: string])[],
    regions: RegionsOfCountries = [],
  ): Countries {
    // Regions given for one country more than once are put together, so that
    // two with one code among them are refused as the country refuses them.
    const regionsByCode = new Map<string, (readonly [string, string])[]>();
    for (const [code, given] of regions) {
      const key = asCountryCode(code);
      regionsByCode.set(key, [...(regionsByCode.get(key) ?? []), ...given]);
    }
    const byCode = new Map<string, Country>();
    for (const [code, name] of names) {
      // Every country has a flag, so a code no flag has would be a country
      // nobody could see the flag of.
      const flag = flags.find(code);
      if (flag === undefined)
        throw new ValidationError<CountriesErrorCode>("Countries.NoFlag");
      const country = Country.from(
        flag,
        name,
        regionsByCode.get(String(flag)) ?? [],
      );
      if (byCode.has(country.code))
        throw new ValidationError<CountriesErrorCode>(
          "Countries.SameCodeTwice",
        );
      byCode.set(country.code, country);
    }
    // Regions for a code no country has would be regions nobody could find.
    for (const code of regionsByCode.keys())
      if (!byCode.has(code))
        throw new ValidationError<CountriesErrorCode>(
          "Countries.RegionsForNoCountry",
        );
    return new Countries(byCode);
  }

  /**
   * The countries there are: one for every flag there is, each divided into the regions the old site gave it.
   */
  static readonly thereAre: Countries = Countries.from(
    Flags.thereAre,
    countryNames,
    countryRegions,
  );

  /**
   * The country whose code is `code`, taken as a flag's name is, or nothing
   * when no country has that code.
   */
  find(code: string): Country | undefined {
    // Trimmed and lowered as a flag's name is, so that "AU" finds Australia.
    return this.#byCode.get(asCountryCode(code));
  }

  /** Every country, in order of its name. */
  get all(): readonly Country[] {
    return this.#inOrder;
  }
}
