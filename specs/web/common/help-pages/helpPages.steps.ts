import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

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
