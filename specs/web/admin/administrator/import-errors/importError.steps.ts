// The page where an administrator reads what the import said of one document
// (importError.feature), in a real browser. A message is read a line at a
// time, as the page lays it out.
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../support/world.js";

// Retried for three seconds, which leaves a step time to fail with what it
// found rather than with Cucumber's word that it took too long.
export const eventually = async (check: () => Promise<void>): Promise<void> => {
  const until = Date.now() + 3000;
  for (;;) {
    try {
      await check();
      return;
    } catch (failure) {
      if (Date.now() > until) throw failure;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const messages = (world: SpecWorld): Locator =>
  world.browserPage.locator("main pre.import-error-message");

const lineOf = async (
  world: SpecWorld,
  message: number,
  line: number,
): Promise<string | undefined> =>
  (await messages(world).nth(message).innerText({ timeout: 100 })).split("\n")[
    line
  ];

Then(
  "the document id shown is {string}",
  async function (this: SpecWorld, documentId: string) {
    await eventually(async () => {
      assert.equal(
        await this.browserPage
          .locator("main .import-error-document-id")
          .innerText({ timeout: 100 }),
        documentId,
      );
    });
  },
);

Then(
  "the message's first line is {string}",
  async function (this: SpecWorld, line: string) {
    await eventually(async () => {
      assert.equal(await lineOf(this, 0, 0), line);
    });
  },
);

Then(
  "the message's second line is {string}",
  async function (this: SpecWorld, line: string) {
    await eventually(async () => {
      assert.equal(await lineOf(this, 0, 1), line);
    });
  },
);

Then(
  "the second message's first line is {string}",
  async function (this: SpecWorld, line: string) {
    await eventually(async () => {
      assert.equal(await lineOf(this, 1, 0), line);
    });
  },
);

// Said by the code the page was answered with, which is the contract, rather
// than by its words.
Then(
  "the page says the document is not found",
  async function (this: SpecWorld) {
    await eventually(async () => {
      assert.equal(
        await this.browserPage
          .locator("main [data-refused]")
          .getAttribute("data-refused", { timeout: 100 }),
        "ImportErrorKept.NotFound",
      );
    });
  },
);

// The tournament the document is of --------------------------------------------

const shownIn = async (
  world: SpecWorld,
  selector: string,
  expected: string,
): Promise<void> => {
  await eventually(async () => {
    assert.equal(
      await world.browserPage
        .locator(`main ${selector}`)
        .innerText({ timeout: 100 }),
      expected,
    );
  });
};

const leadsTo = async (
  world: SpecWorld,
  selector: string,
  href: string,
): Promise<void> => {
  await eventually(async () => {
    assert.equal(
      await world.browserPage
        .locator(`main ${selector}`)
        .getAttribute("href", { timeout: 100 }),
      href,
    );
  });
};

Then(
  "the tournament shown is {string}",
  async function (this: SpecWorld, name: string) {
    await shownIn(this, ".import-error-tournament", name);
  },
);

Then(
  "the competition shown is {string}",
  async function (this: SpecWorld, name: string) {
    await shownIn(this, ".import-error-competition", name);
  },
);

// This site's address is wherever the scenario's site is served from.
const thisSite = (world: SpecWorld, path: string): string =>
  `${new URL(world.browserPage.url()).origin}${path}`;

Then(
  "the new site address shown is this site's {string}",
  async function (this: SpecWorld, path: string) {
    await shownIn(this, ".import-error-new-site a", thisSite(this, path));
  },
);

Then(
  "the new site address leads to this site's {string}",
  async function (this: SpecWorld, path: string) {
    await leadsTo(this, ".import-error-new-site a", thisSite(this, path));
  },
);

Then(
  "the old site address shown is {string}",
  async function (this: SpecWorld, address: string) {
    await shownIn(this, ".import-error-old-site a", address);
  },
);

Then(
  "the old site address leads to {string}",
  async function (this: SpecWorld, href: string) {
    await leadsTo(this, ".import-error-old-site a", href);
  },
);

// Asked once the document's id is shown, so that the page has been drawn.
Then("no tournament is shown", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.locator("main .import-error-tournament").count(),
    0,
  );
  assert.equal(
    await this.browserPage
      .locator("main .import-error-new-site, main .import-error-old-site")
      .count(),
    0,
  );
});
