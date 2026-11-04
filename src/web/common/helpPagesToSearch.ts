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

// A page's file is named as the build wrote it: the page of a folder is the
// folder's index.json, and the first page is the language's own.
const nameOf = (file: string): string => {
  const name = file.replace(/\.json$/, "");
  if (name === "index") return "";
  return name.endsWith("/index") ? name.slice(0, -"/index".length) : name;
};

/**
 * The pages of the languages with `tags`, as `directory` holds them. A
 * language the build wrote nothing for has no pages, and a help that was never
 * built has none at all, which is not a failure: nothing else on the site needs
 * the help, and the index is made again when it is built.
 */
export const helpPagesToSearchIn = (
  directory: string,
  tags: () => readonly string[],
): HelpPagesToSearch => ({
  all: async () => {
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
      for (const file of files) {
        const name = nameOf(file.slice(tag.length + 1));
        // What changed in a release answers no question about how to do
        // anything, and would be found for the words of every one of them.
        if (alertKindOfPage(name) !== undefined) continue;
        const page = JSON.parse(
          await readFile(join(directory, file), "utf8"),
        ) as HelpPage;
        pages.push({
          tag,
          rules,
          name,
          title: page.title,
          headings: page.headings,
          text: page.text,
        });
      }
    }
    return pages;
  },
});
