// A comment's own page, where the commentary's writer edits it or deletes it,
// in a real browser. What is typed into its box, and sent, is the commentary
// page's (commentary.steps.ts).
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { withScripting } from "../../support/browser.js";
import { load } from "../../../application/operations/tournaments/aRequest.js";
import { commentWritten } from "../../../application/operations/commentaries/commentaryRequests.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

// Where the page that edits the comment that said `text` is: the commentary's
// address followed by "comments", the comment id's own characters and "edit".
const editPathOf = async (world: SpecWorld, text: string): Promise<string> => {
  const written = commentWritten(world, text);
  const tournament = await load(world, written.tournament);
  const commentary = tournament.commentaries.find((each) =>
    each.id.equals(written.commentary),
  );
  assert.ok(commentary !== undefined, "The tournament has no such commentary.");
  const own = written.id.value.slice(written.id.value.indexOf("/") + 1);
  return `/${tournament.address.toString()}/commentaries/${commentary.slug.toString()}/comments/${own}/edit`;
};

const open = async (world: SpecWorld, text: string): Promise<void> => {
  await world.browserPage.goto(
    `${world.baseUrl!}${await editPathOf(world, text)}`,
  );
};

// The page that asks before deleting it, beside the page that edits it.
const openToDelete = async (world: SpecWorld, text: string): Promise<void> => {
  const path = (await editPathOf(world, text)).replace(/\/edit$/, "/delete");
  await world.browserPage.goto(`${world.baseUrl!}${path}`);
};

Given(
  "the page to delete the comment {string} is open",
  async function (this: SpecWorld, text: string) {
    await openToDelete(this, text);
  },
);

When(
  "the page to delete the comment {string} is opened",
  async function (this: SpecWorld, text: string) {
    await openToDelete(this, text);
  },
);

Given(
  "the page to edit the comment {string} is open with scripting on",
  async function (this: SpecWorld, text: string) {
    await withScripting(this);
    await open(this, text);
  },
);

Given(
  "the page to edit the comment {string} is open",
  async function (this: SpecWorld, text: string) {
    await open(this, text);
  },
);

When(
  "the page to edit the comment {string} is opened",
  async function (this: SpecWorld, text: string) {
    await open(this, text);
  },
);

// Scripting is off unless a step asks for it back, so this is the same
// opening, said all the same because it is what the scenario is about.
Given(
  "the page to edit the comment {string} is open with scripting off",
  async function (this: SpecWorld, text: string) {
    await open(this, text);
  },
);

Then(
  "the page to edit the comment {string} is shown",
  async function (this: SpecWorld, text: string) {
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

const buttonCalled = (world: SpecWorld, name: string) =>
  world.browserPage.locator("main").getByRole("button", { name, exact: true });

Then(
  /^the page (offers|does not offer) the button "(.*)"$/,
  async function (this: SpecWorld, offers: string, name: string) {
    assert.equal(
      await buttonCalled(this, name).count(),
      offers === "offers" ? 1 : 0,
    );
  },
);

Then(
  "the page asks whether to delete the comment {string}",
  async function (this: SpecWorld, text: string) {
    const page = this.browserPage.locator("main");
    assert.equal(
      unmarked(
        (await page.locator(".delete-question").textContent()) ?? "",
      ).trim(),
      words("deleteComment.question"),
    );
    assert.equal(
      unmarked(
        (await page.locator(".delete-comment").textContent()) ?? "",
      ).trim(),
      text,
    );
  },
);

When("the delete is confirmed", async function (this: SpecWorld) {
  await this.browserPage.locator("main .delete-form button").click();
  await this.browserPage.waitForLoadState();
});

When("the delete is called off", async function (this: SpecWorld) {
  await this.browserPage.locator("main .delete-keep a").click();
  await this.browserPage.waitForLoadState();
});
