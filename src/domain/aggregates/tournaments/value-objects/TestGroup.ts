import { charactersIn } from "../../../common/charactersIn.js";
import { Slug } from "../../../common/Slug.js";
import { ValidationError } from "../../../common/validation/ValidationError.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a test's group can break. */
export type TestGroupErrorCode = "TestGroup.TooLong";

// As long as a competition's name may be: a group is named by what the
// manager types, and is often a letter alone.
const MOST_CHARACTERS = 254;

const groups = new Validator<string, TestGroupErrorCode>({
  fields: [
    {
      field: "group",
      code: "TestGroup.TooLong",
      isBrokenBy: (given) => charactersIn(given) > MOST_CHARACTERS,
    },
  ],
});

/** The group a test is played in, as "Group A", as it was typed, trimmed. */
export class TestGroup {
  readonly #given: string;

  private constructor(given: string) {
    this.#given = given;
  }

  /**
   * The group `given`, less any whitespace at either end, or no group where
   * nothing is left: a field left blank says the test is in none. Throws
   * {@link ValidationError} naming the first rule it breaks.
   */
  static from(given: string): TestGroup | undefined {
    const trimmed = given.trim();
    if (trimmed === "") return undefined;
    groups.ensureValid(trimmed);
    return new TestGroup(trimmed);
  }

  /**
   * The slug the group's page is found at, made from its name, or nothing
   * where its name has no letter or digit in it to make one from.
   */
  get slug(): Slug | undefined {
    // Asked of the slug itself, so that what has no slug is what a slug says
    // it cannot be made from, and nothing here can come to disagree with it.
    try {
      return Slug.fromName(this.#given);
    } catch (refused) {
      if (refused instanceof ValidationError) return undefined;
      throw refused;
    }
  }

  equals(other: TestGroup | undefined): boolean {
    return other instanceof TestGroup && this.#given === other.#given;
  }

  toString(): string {
    return this.#given;
  }
}
