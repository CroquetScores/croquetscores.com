import { ValidationError } from "../../../common/validation/ValidationError.js";
import { Validator } from "../../../common/validation/Validator.js";
import type { Flag } from "./Flag.js";
import { asRegionCode, Region } from "./Region.js";

/** Every rule a country can break, besides those of its flag and its regions. */
export type CountryErrorCode =
  "Country.NameMissing" | "Country.SameRegionTwice";

// In order as a reader looks for a name in a list, as the countries are.
const byName = new Intl.Collator("en");

// Nothing is asked of a name but that there is one. The names of countries are
// not a shape rules can be written for.
const names = new Validator<string, CountryErrorCode>({
  fields: [
    {
      field: "name",
      code: "Country.NameMissing",
      isBrokenBy: (given) => given === "",
    },
  ],
});

/**
 * A country a tournament is played in, or a player plays for: known by its
 * code, and shown by its name and its flag.
 *
 * It is made from its flag rather than from a code, and its code is its flag's
 * name, so there is no code for a country to have that its flag does not.
 *
 * It has at least one region, so that there is always a region to put a
 * tournament in: one given none is its own one region.
 */
export class Country {
  readonly #flag: Flag;
  readonly #name: string;
  readonly #regionsByCode: ReadonlyMap<string, Region>;
  readonly #regionsInOrder: readonly Region[];

  private constructor(
    flag: Flag,
    name: string,
    regionsByCode: ReadonlyMap<string, Region>,
  ) {
    this.#flag = flag;
    this.#name = name;
    this.#regionsByCode = regionsByCode;
    this.#regionsInOrder = [...regionsByCode.values()].sort((a, b) =>
      byName.compare(a.name, b.name),
    );
  }

  /**
   * The country whose flag is `flag`, called `name` less any whitespace at
   * either end, divided into `regions`, or its own one region when none are
   * given. Throws {@link ValidationError} naming the first rule it, or one of
   * its regions, breaks.
   */
  static from(
    flag: Flag,
    name: string,
    regions: readonly (readonly [code: string, name: string])[] = [],
  ): Country {
    const trimmed = name.trim();
    names.ensureValid(trimmed);
    // A country that is not divided, or whose regions nobody has listed, is
    // coded and named as the country is, so it can be found by its own code.
    const given: readonly (readonly [string, string])[] =
      regions.length > 0 ? regions : [[String(flag), trimmed]];
    const regionsByCode = new Map<string, Region>();
    for (const [code, regionName] of given) {
      const region = Region.from(code, regionName);
      if (regionsByCode.has(region.code))
        throw new ValidationError<CountryErrorCode>("Country.SameRegionTwice");
      regionsByCode.set(region.code, region);
    }
    return new Country(flag, trimmed, regionsByCode);
  }

  /** Its code, which is its flag's name, and how it is known. */
  get code(): string {
    return String(this.#flag);
  }

  get flag(): Flag {
    return this.#flag;
  }

  /** What a reader calls it, in English. */
  get name(): string {
    return this.#name;
  }

  /** Every region it is divided into, in order of its name. */
  get regions(): readonly Region[] {
    return this.#regionsInOrder;
  }

  /**
   * The region whose code is `code`, taken as a region's code is, or nothing
   * when it has no region with that code.
   */
  findRegion(code: string): Region | undefined {
    return this.#regionsByCode.get(asRegionCode(code));
  }

  /** Two countries are the same when their codes are, whatever their names. */
  equals(other: Country | undefined): boolean {
    return other instanceof Country && this.code === other.code;
  }

  toString(): string {
    return this.#name;
  }
}
