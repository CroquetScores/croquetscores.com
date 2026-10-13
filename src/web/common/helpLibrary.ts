// The help as the site reads it: the pages of every language that
// scripts/build-help.mjs wrote, read from disk when one is asked for. The help
// is rarely read and there are a few hundred pages, so keeping them in memory
// would cost startup time and space on every site for the sake of a few
// milliseconds on a page few readers open.
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";

export interface HelpPage {
  readonly title: string;
  readonly html: string;
  /** When a page of what's new was released, as "2026-10-13". */
  readonly released?: string | undefined;
}

export interface HelpLibrary {
  /** The page called `name` in the language with `tag`, if it has been written. */
  readonly page: (tag: string, name: string) => Promise<HelpPage | undefined>;
  /**
   * A picture, with the name {@link helpImageName} gives it, as the language
   * with `tag` has made it: the screenshots show the site in that language.
   */
  readonly image: (tag: string, name: string) => Promise<Buffer | undefined>;
}

const imagesFolder = "images";

// What a file that is not there looks like, including a name that is a folder:
// each is an answer of "there is no such page", not a fault.
const absent = new Set(["ENOENT", "EISDIR", "ENOTDIR"]);

const readIn = async (
  directory: string,
  parts: readonly string[],
): Promise<Buffer | undefined> => {
  // The names come from an address a reader typed, so one that climbs out of
  // the help's folder is refused here rather than trusted to the route.
  const base = resolve(directory);
  const file = resolve(base, ...parts);
  if (!file.startsWith(base + sep) || parts.some((p) => p.includes("\0"))) {
    return undefined;
  }
  try {
    return await readFile(file);
  } catch (error) {
    if (absent.has((error as NodeJS.ErrnoException).code ?? ""))
      return undefined;
    throw error;
  }
};

/**
 * What the build wrote under `directory`. A site that has not been built has
 * no help, and says so with pages that are not there rather than failing,
 * because nothing else on it needs the help.
 *
 * The build writes a page "a/b" as a/b.json, and the page of a folder "a" as
 * a/index.json, which is how they sit among the files they were written from.
 */
export const helpLibraryIn = (directory: string): HelpLibrary => ({
  page: async (tag, name) => {
    // The file's own name is not an address: the page of a folder is the
    // folder's, so that a page has one address and not two.
    if (name === "index" || name.endsWith("/index")) return undefined;
    const found =
      name === ""
        ? await readIn(directory, [tag, "index.json"])
        : ((await readIn(directory, [tag, `${name}.json`])) ??
          (await readIn(directory, [tag, name, "index.json"])));
    return found === undefined
      ? undefined
      : (JSON.parse(found.toString("utf8")) as HelpPage);
  },
  image: (tag, name) => readIn(directory, [imagesFolder, tag, name]),
});

/** `library` as it would be if `tag` had not written the page called `name`. */
export const helpLibraryWithout = (
  library: HelpLibrary,
  tag: string,
  name: string,
): HelpLibrary => ({
  page: (askedTag, askedName) =>
    askedTag === tag && askedName === name
      ? Promise.resolve(undefined)
      : library.page(askedTag, askedName),
  image: library.image,
});

/** `library` as it would be if `tag` had not made the picture called `name`. */
export const helpLibraryWithoutImage = (
  library: HelpLibrary,
  tag: string,
  name: string,
): HelpLibrary => ({
  page: library.page,
  image: (askedTag, askedName) =>
    askedTag === tag && askedName === name
      ? Promise.resolve(undefined)
      : library.image(askedTag, askedName),
});
