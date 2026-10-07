import { charactersIn } from "../../../common/charactersIn.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a world ranking name can break. */
export type WorldRankingNameErrorCode =
  "WorldRankingName.TooShort" | "WorldRankingName.TooLong";

// As long as a person's name may be (PersonName.ts), since it is one: refused
// with codes of its own, so that a form can tell it from the player's name.
const FEWEST_CHARACTERS = 3;
const MOST_CHARACTERS = 254;

const names = new Validator<string, WorldRankingNameErrorCode>({
  fields: [
    {
      field: "worldRankingName",
      code: "WorldRankingName.TooShort",
      isBrokenBy: (given) => charactersIn(given) < FEWEST_CHARACTERS,
    },
    {
      field: "worldRankingName",
      code: "WorldRankingName.TooLong",
      isBrokenBy: (given) => charactersIn(given) > MOST_CHARACTERS,
    },
  ],
});

/**
 * The name a player is known by in the world rankings, as it was given,
 * trimmed (WorldRankingName.feature).
 */
export class WorldRankingName {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * The world ranking name `given`, less any whitespace at either end, or
   * none where nothing is left: a field left blank says the player is known
   * in the rankings by their name. Throws {@link ValidationError} naming the
   * first rule it breaks.
   */
  static from(given: string): WorldRankingName | undefined {
    const trimmed = given.trim();
    if (trimmed === "") return undefined;
    names.ensureValid(trimmed);
    return new WorldRankingName(trimmed);
  }

  equals(other: WorldRankingName | undefined): boolean {
    return other instanceof WorldRankingName && this.#given === other.#given;
  }

  toString(): string {
    return this.#given;
  }
}
