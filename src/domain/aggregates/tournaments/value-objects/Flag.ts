import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a flag can break. */
export type FlagErrorCode =
  | "Flag.Missing"
  | "Flag.NotLetters"
  | "Flag.PathMissing"
  | "Flag.PathOutsideImages";

interface Candidate {
  readonly name: string;
  readonly relativePath: string;
}

// A browser takes a backslash in an address for a slash, so a path is split on
// either: "..\au.png" climbs out of the folder of images just as "../au.png"
// does.
const segmentsOf = (path: string): string[] => path.split(/[/\\]/);

const flags = new Validator<Candidate, FlagErrorCode>({
  fields: [
    {
      field: "name",
      code: "Flag.Missing",
      isBrokenBy: ({ name }) => name === "",
    },
    {
      field: "name",
      code: "Flag.NotLetters",
      isBrokenBy: ({ name }) => name !== "" && !/^[a-z]+$/.test(name),
    },
    {
      field: "relativePath",
      code: "Flag.PathMissing",
      isBrokenBy: ({ relativePath }) => relativePath === "",
    },
    {
      // A path beginning at the root has an empty first segment, so one test
      // refuses both ways out of the folder.
      field: "relativePath",
      code: "Flag.PathOutsideImages",
      isBrokenBy: ({ relativePath }) =>
        relativePath !== "" &&
        segmentsOf(relativePath).some(
          (segment, index) =>
            segment === ".." || (index === 0 && segment === ""),
        ),
    },
  ],
});

/**
 * The flag a tournament flies: known by its name, and shown by the image at its
 * relative path.
 *
 * Which flags there are is not for this to say; it says only what a flag's name
 * and path must be. Two flags are the same flag when their names are, since the
 * path says where a flag is kept rather than which flag it is.
 */
export class Flag {
  readonly #name: string;
  readonly #relativePath: string;

  private constructor(name: string, relativePath: string) {
    this.#name = name;
    this.#relativePath = relativePath;
  }

  /**
   * The flag named `name`, less any whitespace at either end and in lower case,
   * whose image is at `relativePath` from the folder of images. Throws
   * {@link ValidationError} naming the first rule it breaks.
   */
  static from(name: string, relativePath: string): Flag {
    // "AU" and " au " are the name somebody meant, written a little
    // differently, so they are made that name before it is asked of. The path
    // is left as it is: it comes from where the image is kept, not from
    // anybody's typing.
    const candidate = { name: name.trim().toLowerCase(), relativePath };
    flags.ensureValid(candidate);
    return new Flag(candidate.name, candidate.relativePath);
  }

  /** Where its image is, from the folder of images, as it was given. */
  get relativePath(): string {
    return this.#relativePath;
  }

  equals(other: Flag | undefined): boolean {
    return other instanceof Flag && this.#name === other.#name;
  }

  /** Its name, which is how it is known. */
  toString(): string {
    return this.#name;
  }
}
