import { ValidationError } from "../../../common/validation/ValidationError.js";
import { Flag } from "./Flag.js";
import { flagImages } from "./flagImages.js";

/** Every rule a set of flags can break, besides those of each flag. */
export type FlagsErrorCode = "Flags.SameNameTwice";

const IMAGE = ".png";

/**
 * The flags there are, one for each image, found by name and kept in order of
 * their names.
 */
export class Flags {
  readonly #byName: ReadonlyMap<string, Flag>;
  readonly #inOrder: readonly Flag[];

  private constructor(byName: ReadonlyMap<string, Flag>) {
    this.#byName = byName;
    // Names are lower-case letters alone, so comparing them as strings is
    // alphabetical order, with no locale to disagree about it.
    this.#inOrder = [...byName.values()].sort((a, b) =>
      String(a) < String(b) ? -1 : 1,
    );
  }

  /**
   * A flag for each PNG among `relativePaths`, named for its file. Throws
   * {@link ValidationError} for the first image that cannot be a flag, or the
   * first name two images share.
   */
  static from(relativePaths: readonly string[]): Flags {
    const byName = new Map<string, Flag>();
    for (const path of relativePaths) {
      if (!path.endsWith(IMAGE)) continue;
      const file = path.slice(path.lastIndexOf("/") + 1);
      // Refused rather than passed over: a flag that silently went missing
      // would be found only by the tournament that could not fly it.
      const flag = Flag.from(file.slice(0, -IMAGE.length), path);
      if (byName.has(String(flag)))
        throw new ValidationError<FlagsErrorCode>("Flags.SameNameTwice");
      byName.set(String(flag), flag);
    }
    return new Flags(byName);
  }

  /** The flags there are: one for each image under assets/images. */
  static readonly thereAre: Flags = Flags.from(flagImages);

  /**
   * The flag named `name`, taken as a flag takes it, or nothing when no flag
   * has that name.
   */
  find(name: string): Flag | undefined {
    // Trimmed and lowered as Flag makes a name, so that "AU" finds "au". A name
    // that could never be a flag needs no refusing here: no flag has it.
    return this.#byName.get(name.trim().toLowerCase());
  }

  /** Every flag, in order of its name. */
  get all(): readonly Flag[] {
    return this.#inOrder;
  }
}
