import { defineParameterType, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  helpLibraryIn,
  helpLibraryWithout,
  helpLibraryWithoutImage,
} from "../../../../src/web/common/helpLibrary.js";
import { languageCookie } from "../../../../src/web/common/language.js";
import { egyptian } from "../../../../src/web/languages/egyptian.js";
import { english } from "../../../../src/web/languages/english.js";
import { french } from "../../../../src/web/languages/french.js";
import { german } from "../../../../src/web/languages/german.js";
import { welsh } from "../../../../src/web/languages/welsh.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  anApplicationOfferingItsOwnLanguages,
  anApplicationWithHelp,
} from "../../support/browser.js";
import { answeredWith } from "../../support/answered.js";

const languages = {
  English: english,
  Welsh: welsh,
  French: french,
  German: german,
  "Egyptian Arabic": egyptian,
};

// Named in the words a reader would use, and unquoted, so that a step saying
// "the page is in Welsh" is not mistaken for one saying "the page is in "cy"".
defineParameterType({
  name: "helpLanguage",
  regexp: /English|Welsh|French|German|Egyptian Arabic/,
  transformer: (name: string) => languages[name as keyof typeof languages],
});

type Language = (typeof languages)[keyof typeof languages];

const dist = join(import.meta.dirname, "..", "..", "..", "..", "dist", "help");

// What the scenario's reader sends, and the site it is sent to, kept together
// since the site is made when the first page is opened and not before.
const chosen = new WeakMap<SpecWorld, Language>();
const sites = new WeakMap<SpecWorld, string>();
const answers = new WeakMap<SpecWorld, { body: string; headers: Headers }>();

const siteOf = async (world: SpecWorld): Promise<string> => {
  let site = sites.get(world);
  if (site === undefined) {
    site = await anApplicationOfferingItsOwnLanguages(world);
    sites.set(world, site);
  }
  return site;
};

const ask = async (world: SpecWorld, address: string): Promise<Response> => {
  const language = chosen.get(world);
  return fetch(`${await siteOf(world)}${address}`, {
    headers: {
      ...(world.acceptLanguage === undefined
        ? {}
        : { "accept-language": world.acceptLanguage }),
      ...(language === undefined
        ? {}
        : { cookie: `${languageCookie}=${language.tag}` }),
    },
  });
};

const open = async (world: SpecWorld, address: string): Promise<void> => {
  const response = await ask(world, address);
  answers.set(world, {
    body: await response.text(),
    headers: response.headers,
  });
  answeredWith(world, response.status);
};

Given(
  "the reader has chosen {helpLanguage}",
  function (this: SpecWorld, language: Language) {
    chosen.set(this, language);
  },
);

// The browser's own request header, and so what the site goes by where the
// reader has chosen nothing.
Given(
  "a browser that asks for {helpLanguage}",
  function (this: SpecWorld, language: Language) {
    this.acceptLanguage = language.tag;
  },
);

Given(
  "the help has no {helpLanguage} page {string}",
  async function (this: SpecWorld, language: Language, name: string) {
    const without = helpLibraryWithout(helpLibraryIn(dist), language.tag, name);
    sites.set(this, await anApplicationWithHelp(this, without));
  },
);

When("the help is opened", async function (this: SpecWorld) {
  await open(this, "/help");
});

When(
  "the help page {string} is opened",
  async function (this: SpecWorld, name: string) {
    await open(this, `/help/${name}`);
  },
);

const answer = (world: SpecWorld): { body: string; headers: Headers } => {
  const found = answers.get(world);
  assert.ok(found !== undefined, "No page was opened.");
  return found;
};

const article = (world: SpecWorld): string => {
  const found = /<article class="help"[^>]*>/.exec(answer(world).body);
  assert.ok(found !== null, "The page is not a page of the help.");
  return found[0];
};

Then(
  "the page is in {helpLanguage}",
  function (this: SpecWorld, language: Language) {
    assert.match(article(this), new RegExp(`lang="${language.tag}"`));
  },
);

Then("the page is shown from right to left", function (this: SpecWorld) {
  assert.match(answer(this).body, /<html[^>]* dir="rtl"/);
});

Then(
  "the page varies by the language the reader has chosen",
  function (this: SpecWorld) {
    const vary = answer(this).headers.get("vary") ?? "";
    assert.ok(vary.includes("Cookie"), "The page does not vary by cookie.");
    assert.ok(
      vary.includes("Accept-Language"),
      "The page does not vary by what the browser asks for.",
    );
  },
);

Then(
  "the page is the one about players in a standard tournament",
  function (this: SpecWorld) {
    assert.match(
      article(this),
      /data-page="tournament-managers\/standard-tournament\/players"/,
    );
  },
);

const everyThatLeadsSomewhere = async (
  world: SpecWorld,
  attribute: "href" | "src",
  prefix: string,
): Promise<void> => {
  const found = [
    ...answer(world).body.matchAll(new RegExp(`${attribute}="([^"]+)"`, "g")),
  ]
    .map((match) => match[1]!.replace(/&amp;/g, "&"))
    .filter((address) => address.startsWith(prefix));
  assert.ok(found.length > 0, `The page has no ${attribute} to ${prefix}.`);
  for (const address of found) {
    const response = await ask(world, address.split("#")[0]!);
    assert.equal(response.status, 200, `${address} is not there.`);
  }
};

Then(
  "every link into the help leads to a page",
  async function (this: SpecWorld) {
    await everyThatLeadsSomewhere(this, "href", "/help/");
  },
);

Then("every picture is found", async function (this: SpecWorld) {
  await everyThatLeadsSomewhere(this, "src", "/help/images/");
});

// The folders of docs/help the languages' pictures are made into.
const folders = new Map<Language, string>([
  [english, "english"],
  [welsh, "welsh"],
  [french, "french"],
  [german, "german"],
  [egyptian, "egyptian"],
]);

const pictures = new WeakMap<
  SpecWorld,
  { name: string; bytes: Buffer; headers: Headers }
>();

Given(
  "the help has no {helpLanguage} picture {string}",
  async function (this: SpecWorld, language: Language, name: string) {
    const without = helpLibraryWithoutImage(
      helpLibraryIn(dist),
      language.tag,
      name,
    );
    sites.set(this, await anApplicationWithHelp(this, without));
  },
);

When(
  "the help picture {string} is opened",
  async function (this: SpecWorld, name: string) {
    const response = await ask(this, `/help/images/${name}`);
    assert.equal(response.status, 200);
    pictures.set(this, {
      name,
      bytes: Buffer.from(await response.arrayBuffer()),
      headers: response.headers,
    });
  },
);

Then(
  "the picture is the {helpLanguage} one",
  function (this: SpecWorld, language: Language) {
    const shown = pictures.get(this);
    assert.ok(shown !== undefined, "No picture was opened.");
    const [kind, section, file] = shown.name.split("/");
    const made = readFileSync(
      join(
        dist,
        "..",
        "..",
        "docs",
        "help",
        folders.get(language)!,
        kind!,
        section!,
        "images",
        file!,
      ),
    );
    assert.ok(shown.bytes.equals(made), "The picture is not that language's.");
  },
);

Then(
  "the picture varies by the language the reader has chosen",
  function (this: SpecWorld) {
    const vary = pictures.get(this)?.headers.get("vary") ?? "";
    assert.ok(vary.includes("Cookie"));
    assert.ok(vary.includes("Accept-Language"));
  },
);
