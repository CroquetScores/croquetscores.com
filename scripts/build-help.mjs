// "npm run build:help". Turns the Markdown of docs/help into what the site
// reads: for each language folder, a JSON file of title and HTML for every page
// under dist/help/<language tag>/, and each language's pictures under
// dist/help/images/<language tag>/.
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
  existsSync,
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
// Written beside the finished one, in a directory of this run's own so that two
// runs at once (two test scripts started together, or a build under a running
// site) cannot delete each other's half-written tree, and then moved into
// place. The move is two renames, so there is an instant with no help; a
// request in it answers 404, which a reader's next click puts right.
const built = join(root, "dist", `help.building-${process.pid}`);
const replaced = join(root, "dist", `help.replaced-${process.pid}`);

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
    // A picture is kept under the language that made it, since it shows the
    // site in that language. A language with none of its own is shown English's.
    if (!file.endsWith(".md")) {
      const picture = join(built, "images", language.tag, helpImageName(file));
      mkdirSync(dirname(picture), { recursive: true });
      cpSync(join(source, folder, file), picture);
      continue;
    }
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

    if (page.title === "") {
      problems.push(`${folder}/${file} has no heading to be called by.`);
    }

    // The English page of what's new is what the alert goes by
    // (whatsNew.ts), so one that does not say when it was released would
    // silently never be announced.
    if (
      folder === "english" &&
      /(^|\/)whats-new\.md$/.test(file) &&
      page.released === undefined
    ) {
      problems.push(
        `${folder}/${file} does not say when it was released, by a heading "## Released 2026-10-13".`,
      );
    }

    // A folder's index sits as index.json beside its other pages.
    const out = join(built, language.tag, file.replace(/\.md$/, ".json"));
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(
      out,
      JSON.stringify({
        title: page.title,
        html: page.html,
        released: page.released,
      }),
    );
  }
}

if (problems.length > 0) {
  // The tree written so far is not kept: the help that was there stays, and
  // nothing is left behind to be mistaken for it.
  rmSync(built, { recursive: true, force: true });
  console.error(problems.join("\n"));
  process.exit(1);
}

if (existsSync(finished)) renameSync(finished, replaced);
renameSync(built, finished);
rmSync(replaced, { recursive: true, force: true });

console.log(
  `Built the help in ${languageFolders.length} languages into ${finished}.`,
);
