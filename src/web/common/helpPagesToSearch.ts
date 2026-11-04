// The built help, listed for the index to be made from: every page of every
// language that scripts/build-help.mjs wrote. The library reads one page at a
// time from where it is asked for, and has no use for listing them, so this
// walks the folders itself.
import { readdir, readFile } from "node:fs/promises";
import { join, posix } from "node:path";

import type {
  HelpPagesToSearch,
  HelpPageToSearch,
} from "../../application/services/HelpSearchIndex.js";
import type { HelpPage } from "./helpLibrary.js";
import { helpSearchRulesOf } from "./helpSearchConfigurations.js";
import { alertKindOfPage } from "./whatsNew.js";

const jsonBelow = async (directory: string, within = ""): Promise<string[]> => {
  const entries = await readdir(join(directory, within), {
    withFileTypes: true,
  });
  const found: string[] = [];
  for (const entry of entries) {
    const path = within === "" ? entry.name : posix.join(within, entry.name);
    if (entry.isDirectory()) found.push(...(await jsonBelow(directory, path)));
    else if (entry.name.endsWith(".json")) found.push(path);
  }
  return found;
};

// Whether a file is a folder's own page, by its name and not by how it ends:
// "reindex.json" is a page of its own.
const isIndex = (file: string): boolean =>
  posix.basename(file) === "index.json";

// A page's file is named as the build wrote it: the page of a folder is the
// folder's index.json, and the first page is the language's own.
const nameOf = (file: string): string => {
  const name = file.replace(/\.json$/, "");
  if (name === "index") return "";
  return name.endsWith("/index") ? name.slice(0, -"/index".length) : name;
};

/**
 * The pages of the languages with `tags`, as `directory` holds them. A language
 * the build wrote nothing for has no pages. A help that was never built is not
 * a help with none: it cannot be read, and is said to be, so that the index
 * made from the last help that could be read is not replaced by an empty one
 * (MakeHelpSearchIndex.ts).
 */
export const helpPagesToSearchIn = (
  directory: string,
  tags: () => readonly string[],
): HelpPagesToSearch => ({
  all: async () => {
    // Fails, as reading anything that is not there does, when there is no help.
    await readdir(directory);
    const pages: HelpPageToSearch[] = [];
    for (const tag of tags()) {
      const rules = helpSearchRulesOf(tag);
      if (rules === undefined) continue;
      let files: string[];
      try {
        files = await jsonBelow(directory, tag);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw error;
      }
      // The page of a folder is written beside the folder's other pages as
      // index.json, and a page of the same name written as a file of its own
      // wins, as it does when the page is read (helpLibrary.ts). Listed in
      // that order, so that the second is skipped and not a collision.
      const ordered = [...files].sort(
        (a, b) => Number(isIndex(a)) - Number(isIndex(b)),
      );
      const seen = new Set<string>();
      for (const file of ordered) {
        const name = nameOf(file.slice(tag.length + 1));
        // What changed in a release answers no question about how to do
        // anything, and would be found for the words of every one of them.
        if (alertKindOfPage(name) !== undefined || seen.has(name)) continue;
        const page = JSON.parse(
          await readFile(join(directory, file), "utf8"),
        ) as Partial<HelpPage>;
        // Not a page of the help: nothing else is written among the pages, but
        // one file that is not should not stop the others being searched.
        if (typeof page.title !== "string") continue;
        seen.add(name);
        pages.push({
          tag,
          rules,
          name,
          title: page.title,
          // A page built before the words were kept has a title and nothing
          // else to search, which is better than none of the help.
          headings: Array.isArray(page.headings) ? page.headings : [],
          text: typeof page.text === "string" ? page.text : "",
        });
      }
    }
    return pages;
  },
});
