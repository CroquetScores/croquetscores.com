import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import {
  convertHelpPage,
  type ConvertedHelpPage,
} from "../../../../src/web/common/helpPages.js";
import type { SpecWorld } from "../../../support/world.js";

const written = new WeakMap<
  SpecWorld,
  { readonly source: string; readonly at: string }
>();
const converted = new WeakMap<SpecWorld, ConvertedHelpPage>();

// A page written with nothing said of where it is among the files is the first
// page of a language, whose links are then read from the top.
Given("help page {string}", function (this: SpecWorld, source: string) {
  written.set(this, { source, at: "index.md" });
});

Given(
  "help page {string} followed by {string}",
  function (this: SpecWorld, first: string, second: string) {
    written.set(this, { source: `${first}\n\n${second}`, at: "index.md" });
  },
);

Given(
  "help page {string} at {string}",
  function (this: SpecWorld, source: string, at: string) {
    written.set(this, { source, at });
  },
);

When("the help page is converted", function (this: SpecWorld) {
  const page = written.get(this);
  assert.ok(page !== undefined, "No help page was written.");
  converted.set(this, convertHelpPage(page.source, page.at));
});

const result = (world: SpecWorld): ConvertedHelpPage => {
  const page = converted.get(world);
  assert.ok(page !== undefined, "No help page was converted.");
  return page;
};

Then(
  "the page has the heading {string}",
  function (this: SpecWorld, heading: string) {
    assert.match(result(this).html, new RegExp(`<h\\d[^>]*>${heading}</h\\d>`));
  },
);

Then(
  "the heading {string} has the bookmark {string}",
  function (this: SpecWorld, heading: string, bookmark: string) {
    assert.match(
      result(this).html,
      new RegExp(`<h\\d id="${bookmark}">${heading}</h\\d>`),
    );
  },
);

Then(
  "the heading {string} has no bookmark",
  function (this: SpecWorld, heading: string) {
    assert.match(result(this).html, new RegExp(`<h\\d>${heading}</h\\d>`));
  },
);

Then(
  "the title of the page is {string}",
  function (this: SpecWorld, title: string) {
    assert.equal(result(this).title, title);
  },
);

Then("the page has no script", function (this: SpecWorld) {
  assert.ok(!result(this).html.includes("<script"));
});

Then("the page links to {string}", function (this: SpecWorld, to: string) {
  assert.ok(
    result(this).html.includes(`href="${to}"`),
    `The page does not link to ${to}: ${result(this).html}`,
  );
});

Then(
  "the page shows the picture {string}",
  function (this: SpecWorld, picture: string) {
    assert.ok(
      result(this).html.includes(`src="${picture}"`),
      `The page does not show ${picture}: ${result(this).html}`,
    );
  },
);

// Every language ------------------------------------------------------------------

const helpFolder = resolve(import.meta.dirname, "../../../../docs/help");

const everyLanguage = new WeakMap<SpecWorld, readonly string[]>();
const everyConverted = new WeakMap<
  SpecWorld,
  readonly { readonly language: string; readonly html: string }[]
>();

Given("the help of every language", async function (this: SpecWorld) {
  const entries = await readdir(helpFolder, { withFileTypes: true });
  everyLanguage.set(
    this,
    entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name),
  );
});

When(
  "the {string} tournament's {string} page of each is converted",
  async function (this: SpecWorld, kind: string, page: string) {
    const languages = everyLanguage.get(this) ?? [];
    assert.ok(languages.length > 0, "No language was read.");
    const converted = [];
    for (const language of languages) {
      const at = `tournament-managers/${kind}-tournament/${page}.md`;
      const source = await readFile(join(helpFolder, language, at), "utf8");
      converted.push({
        language,
        html: convertHelpPage(source, at).html,
      });
    }
    everyConverted.set(this, converted);
  },
);

Then(
  "each has the bookmark {string}",
  function (this: SpecWorld, bookmark: string) {
    for (const { language, html } of everyConverted.get(this) ?? []) {
      assert.match(html, new RegExp(`<h\\d id="${bookmark}">`), language);
    }
  },
);

// Headings and words ---------------------------------------------------------------

const headingListed = (world: SpecWorld, at: number): string | undefined =>
  result(world).headings[at];

Then(
  "the first heading listed is {string}",
  function (this: SpecWorld, heading: string) {
    assert.equal(headingListed(this, 0), heading);
  },
);

Then(
  "the second heading listed is {string}",
  function (this: SpecWorld, heading: string) {
    assert.equal(headingListed(this, 1), heading);
  },
);

Then(
  "the text of the page is {string}",
  function (this: SpecWorld, text: string) {
    assert.equal(result(this).text, text);
  },
);

Then(
  "the text of the page says {string}",
  function (this: SpecWorld, words: string) {
    assert.ok(result(this).text.includes(words), result(this).text);
  },
);

Then(
  "the text of the page does not say {string}",
  function (this: SpecWorld, words: string) {
    assert.ok(!result(this).text.includes(words), result(this).text);
  },
);

// The first page of every language ------------------------------------------------

// The list that follows the heading with the bookmark `id`, as the stylesheet
// finds it, as the HTML between that list's tags.
const listAfter = (html: string, id: string): string => {
  const found = new RegExp(
    `<h2 id="${id}">[\\s\\S]*?</h2>\\s*<ul>([\\s\\S]*?)</ul>`,
  ).exec(html);
  assert.ok(found !== null, `There is no list after the bookmark ${id}.`);
  return found[1] ?? "";
};

const hrefsIn = (html: string): string[] =>
  [...html.matchAll(/<a href="([^"]*)"/g)].map((each) => each[1] ?? "");

When("the first page of each is converted", async function (this: SpecWorld) {
  const languages = everyLanguage.get(this) ?? [];
  assert.ok(languages.length > 0, "No language was read.");
  const converted = [];
  for (const language of languages) {
    const source = await readFile(
      join(helpFolder, language, "index.md"),
      "utf8",
    );
    converted.push({
      language,
      html: convertHelpPage(source, "index.md").html,
    });
  }
  everyConverted.set(this, converted);
});

When(
  "the page {string} of each is converted",
  async function (this: SpecWorld, page: string) {
    const languages = everyLanguage.get(this) ?? [];
    assert.ok(languages.length > 0, "No language was read.");
    const converted = [];
    for (const language of languages) {
      const at = `${page}.md`;
      const source = await readFile(join(helpFolder, language, at), "utf8");
      converted.push({ language, html: convertHelpPage(source, at).html });
    }
    everyConverted.set(this, converted);
  },
);

Then(
  "each has {int} popular questions",
  function (this: SpecWorld, count: number) {
    for (const { language, html } of everyConverted.get(this) ?? []) {
      assert.equal(
        hrefsIn(listAfter(html, "popular-questions")).length,
        count,
        language,
      );
    }
  },
);

const places = ["first", "second", "third", "fourth", "fifth"];

Then(
  "the {word} popular question of each leads to {string}",
  function (this: SpecWorld, number: string, address: string) {
    const at = places.indexOf(number);
    assert.ok(at !== -1, `There is no ${number} question.`);
    for (const { language, html } of everyConverted.get(this) ?? []) {
      assert.equal(
        hrefsIn(listAfter(html, "popular-questions"))[at],
        address,
        language,
      );
    }
  },
);

Then("each has {int} subjects", function (this: SpecWorld, count: number) {
  for (const { language, html } of everyConverted.get(this) ?? []) {
    assert.equal(hrefsIn(listAfter(html, "subjects")).length, count, language);
  }
});

Then(
  "each has a subject leading to {string}",
  function (this: SpecWorld, address: string) {
    for (const { language, html } of everyConverted.get(this) ?? []) {
      assert.ok(
        hrefsIn(listAfter(html, "subjects")).includes(address),
        `${language} has no subject leading to ${address}.`,
      );
    }
  },
);

// A card is a title and, in a paragraph of its own beneath, its words: a list
// item of two paragraphs.
Then(
  "each subject of each has words under its title",
  function (this: SpecWorld) {
    for (const { language, html } of everyConverted.get(this) ?? []) {
      const items = [
        ...listAfter(html, "subjects").matchAll(/<li>([\s\S]*?)<\/li>/g),
      ];
      assert.equal(items.length, 4, language);
      for (const item of items) {
        const paragraphs = [...(item[1] ?? "").matchAll(/<p>([\s\S]*?)<\/p>/g)];
        assert.equal(paragraphs.length, 2, `${language}: ${item[1]}`);
        assert.ok((paragraphs[1]?.[1] ?? "").trim().length > 0, language);
      }
    }
  },
);

// Nothing between the title and the first section: the sentence that said what
// the help was for is not on the page.
Then(
  "each has the popular questions straight after its title",
  function (this: SpecWorld) {
    for (const { language, html } of everyConverted.get(this) ?? []) {
      assert.match(
        html,
        /^<h1>[^<]*<\/h1>\s*<h2 id="popular-questions">/,
        language,
      );
    }
  },
);
