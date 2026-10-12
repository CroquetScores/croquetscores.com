// "npm run build:help". Turns the Markdown of docs/help into what the site
// reads: for each language folder, a JSON file of title and HTML for every page
// under dist/help/<language tag>/, and the pictures once under
// dist/help/images/.
//
// Each folder is named for its language's file in src/web/languages, and the
// tag is read from there rather than written down a second time here, so that
// a language added to the site is built under the tag the site asks for it by.
//
// It fails, rather than writes what it can, where a page links to a page or
// shows a picture that is not there: a reader would find that out one click
// at a time, and nobody else would.
import {
  cpSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, posix } from "node:path";

import {
  convertHelpPage,
  helpImageName,
  helpPageName,
} from "../src/web/common/helpPages.js";

const root = join(import.meta.dirname, "..");
const source = join(root, "docs", "help");
const finished = join(root, "dist", "help");
// Written beside the finished one and moved into place, so that a site starting
// while this runs reads a whole help and not half of one.
const built = join(root, "dist", "help.building");

const filesBelow = (directory, within = "") =>
  readdirSync(join(directory, within), { withFileTypes: true }).flatMap(
    (entry) => {
      const path = within === "" ? entry.name : posix.join(within, entry.name);
      return entry.isDirectory() ? filesBelow(directory, path) : [path];
    },
  );

const languageFolders = readdirSync(source, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

rmSync(built, { recursive: true, force: true });

const problems = [];

// What exists, from the English pages: every other language is held to the
// same names, since a link in a translation names a file the same way.
const english = join(source, "english");
const pagesThatExist = new Set(
  filesBelow(english)
    .filter((file) => file.endsWith(".md"))
    .map((file) => helpPageName(file)),
);
const picturesThatExist = new Set(
  filesBelow(english)
    .filter((file) => !file.endsWith(".md"))
    .map((file) => helpImageName(file)),
);

for (const folder of languageFolders) {
  const { default: language } = await import(
    `../src/web/languages/${folder}.js`
  ).then((module) => ({ default: module[folder] }));
  if (language === undefined) {
    problems.push(`docs/help/${folder} has no language of that name.`);
    continue;
  }

  for (const file of filesBelow(join(source, folder))) {
    if (!file.endsWith(".md")) continue;
    const page = convertHelpPage(
      readFileSync(join(source, folder, file), "utf8"),
      file,
    );

    for (const name of page.pagesLinkedTo) {
      if (!pagesThatExist.has(name))
        problems.push(
          `${folder}/${file} links to "${name}", which is not there.`,
        );
    }
    for (const name of page.imagesShown) {
      if (!picturesThatExist.has(name))
        problems.push(`${folder}/${file} shows "${name}", which is not there.`);
    }

    // A folder's index sits as index.json beside its other pages.
    const out = join(built, language.tag, file.replace(/\.md$/, ".json"));
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify({ title: page.title, html: page.html }));
  }
}

for (const file of filesBelow(english)) {
  if (file.endsWith(".md")) continue;
  const out = join(built, "images", helpImageName(file));
  mkdirSync(dirname(out), { recursive: true });
  cpSync(join(english, file), out);
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}

rmSync(finished, { recursive: true, force: true });
renameSync(built, finished);

console.log(
  `Built the help in ${languageFolders.length} languages into ${finished}.`,
);
