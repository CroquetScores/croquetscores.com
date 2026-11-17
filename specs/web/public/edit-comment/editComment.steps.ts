// A comment's own page, where the commentary's writer edits it or deletes it,
// in a real browser. What is typed into its box, and sent, is the commentary
// page's (commentary.steps.ts).
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import { withScripting } from "../../support/browser.js";
import { unmarked } from "../../support/languages.js";

// Where the page that edits the comment that said `text` is: the commentary's
// address followed by "comments", the comment id's own characters and "edit". The
// commentary's address is found by pressing its title on the tournament's list of
// commentaries, since what a title is made into is the site's to say.
const editPathOf = async (world: WebWorld, text: string): Promise<string> => {
  const [key, id] = [...world.comments].find(([each]) =>
    each.endsWith(`\u0000${text}`),
  ) ?? [undefined, undefined];
  assert.ok(key !== undefined && id !== undefined, `No comment said ${text}.`);
  const [name, title] = key.split("\u0000");
  const tournament = world.tournaments.get(name!);
  assert.ok(tournament !== undefined, `No tournament called ${name!}.`);
  // Asked for by itself and read as text, so that the reader's own page is not
  // taken elsewhere by asking.
  const list = await (
    await fetch(`${world.baseUrl!}/${tournament.address}/commentaries`, {
      headers: world.extraHeaders,
    })
  ).text();
  const href = [
    ...list.matchAll(
      /<a href="([^"]*)"><span class="commentary-listed-title">([^<]*)<\/span>/g,
    ),
  ].find(([, , listed]) => listed === title)?.[1];
  assert.ok(href !== undefined, `No commentary is called ${title!}.`);
  const own = id.slice(id.indexOf("/") + 1);
  return `${href}/comments/${own}/edit`;
};

const open = async (world: WebWorld, text: string): Promise<void> => {
  await world.browserPage.goto(
    `${world.baseUrl!}${await editPathOf(world, text)}`,
  );
};

// The page that asks before deleting it, beside the page that edits it.
const openToDelete = async (world: WebWorld, text: string): Promise<void> => {
  const path = (await editPathOf(world, text)).replace(/\/edit$/, "/delete");
  await world.browserPage.goto(`${world.baseUrl!}${path}`);
};

Given(
  "the page to delete the comment {string} is open",
  async function (this: WebWorld, text: string) {
    await openToDelete(this, text);
  },
);

When(
  "the page to delete the comment {string} is opened",
  async function (this: WebWorld, text: string) {
    await openToDelete(this, text);
  },
);

Given(
  "the page to edit the comment {string} is open with scripting on",
  async function (this: WebWorld, text: string) {
    await withScripting(this);
    await open(this, text);
  },
);

Given(
  "the page to edit the comment {string} is open",
  async function (this: WebWorld, text: string) {
    await open(this, text);
  },
);

When(
  "the page to edit the comment {string} is opened",
  async function (this: WebWorld, text: string) {
    await open(this, text);
  },
);

// Scripting is off unless a step asks for it back, so this is the same
// opening, said all the same because it is what the scenario is about.
Given(
  "the page to edit the comment {string} is open with scripting off",
  async function (this: WebWorld, text: string) {
    await open(this, text);
  },
);

Then(
  "the page to edit the comment {string} is shown",
  async function (this: WebWorld, text: string) {
    assert.equal(
      new URL(this.browserPage.url()).pathname,
      await editPathOf(this, text),
    );
    assert.equal(
      await this.browserPage.locator("main .comment-box").inputValue(),
      text,
    );
  },
);

const buttonCalled = (world: WebWorld, name: string) =>
  world.browserPage.locator("main").getByRole("button", { name, exact: true });

Then(
  /^the page (offers|does not offer) the button "(.*)"$/,
  async function (this: WebWorld, offers: string, name: string) {
    assert.equal(
      await buttonCalled(this, name).count(),
      offers === "offers" ? 1 : 0,
    );
  },
);

Then(
  "the page asks whether to delete the comment {string}",
  async function (this: WebWorld, text: string) {
    const page = this.browserPage.locator("main");
    assert.equal(
      unmarked(
        (await page.locator(".delete-question").textContent()) ?? "",
      ).trim(),
      "Delete this comment? It cannot be undone.",
    );
    assert.equal(
      unmarked(
        (await page.locator(".delete-comment").textContent()) ?? "",
      ).trim(),
      text,
    );
  },
);

When("the delete is confirmed", async function (this: WebWorld) {
  await this.browserPage.locator("main .delete-form button").click();
  await this.browserPage.waitForLoadState();
});

When("the delete is called off", async function (this: WebWorld) {
  await this.browserPage.locator("main .delete-keep a").click();
  await this.browserPage.waitForLoadState();
});
