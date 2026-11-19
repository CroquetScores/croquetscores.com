// The API keys page of the administrator (apiKeys.feature), in a real browser.
// A key is named as the page heads it, by its account's name and its label,
// which is how a reader finds one among many.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { sessionFor } from "../../../support/control.js";
import { unmarked } from "../../../support/languages.js";
import { wordsFor } from "../../../support/words.js";
import type { WebWorld } from "../../../support/world.js";

const page = "/admin/administrator/api-keys";

const open = async function (this: WebWorld): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}${page}`);
};

Given("the API keys administrator page is open", open);
When("the API keys administrator page is opened", open);

// Made as its owner makes one, by the page that makes them, so that nothing of
// the site's code is named here: a reader's own session and the form's own
// fields, sent as a browser sends them.
const makeKey = async (
  world: WebWorld,
  address: string,
  label: string,
  write: boolean,
): Promise<void> => {
  const session = await sessionFor(address);
  const answer = await fetch(`${world.baseUrl!}/account/api-keys/new`, {
    method: "POST",
    headers: {
      cookie: `session=${session}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ label, ...(write ? { write: "on" } : {}) }),
  });
  assert.equal(
    answer.status,
    200,
    `The site would not make the key: ${String(answer.status)}.`,
  );
};

Given(
  "{string} has made a key labelled {string}",
  async function (this: WebWorld, address: string, label: string) {
    await makeKey(this, address, label, false);
  },
);

Given(
  "{string} has made a key labelled {string} that may write",
  async function (this: WebWorld, address: string, label: string) {
    await makeKey(this, address, label, true);
  },
);

// A key as a feature names it, "Sam Someone: CroquetUniverse": its account's
// name, then its label. It is the row of the account's table with that label.
const keyCalled = (world: WebWorld, heading: string): Locator => {
  const [owner = "", ...label] = heading.split(": ");
  return world.browserPage
    .locator("section[data-owner]")
    .filter({ has: world.browserPage.locator("h2", { hasText: owner }) })
    .locator("tr[data-key]")
    .filter({
      has: world.browserPage.locator("[data-label]", {
        hasText: label.join(": "),
      }),
    });
};

const field = (world: WebWorld, heading: string, name: string): Locator =>
  keyCalled(world, heading).locator(`input[name="${name}"]`);

Then("the page says no keys work", async function (this: WebWorld) {
  const said = await this.browserPage.locator("[data-none]").textContent();
  assert.equal(unmarked(said ?? ""), wordsFor("admin.apiKeys.none"));
});

Then(
  "the key {string} is on the page",
  async function (this: WebWorld, heading: string) {
    await keyCalled(this, heading).waitFor();
    assert.equal(await keyCalled(this, heading).count(), 1);
  },
);

const scopeOf = async (world: WebWorld, heading: string): Promise<string> =>
  (await keyCalled(world, heading)
    .locator("[data-scope]")
    .getAttribute("data-scope")) ?? "";

Then(
  "the key {string} may only read",
  async function (this: WebWorld, heading: string) {
    assert.equal(await scopeOf(this, heading), "read");
  },
);

Then(
  "the key {string} may read and write",
  async function (this: WebWorld, heading: string) {
    assert.equal(await scopeOf(this, heading), "write");
  },
);

Then(
  "the requests a minute of the key {string} are {string}",
  async function (this: WebWorld, heading: string, value: string) {
    await keyCalled(this, heading).waitFor();
    assert.equal(await field(this, heading, "perMinute").inputValue(), value);
  },
);

Then(
  "the requests a day of the key {string} are {string}",
  async function (this: WebWorld, heading: string, value: string) {
    await keyCalled(this, heading).waitFor();
    assert.equal(await field(this, heading, "perDay").inputValue(), value);
  },
);

Given(
  "{string} is typed for the requests a minute of the key {string}",
  async function (this: WebWorld, value: string, heading: string) {
    await field(this, heading, "perMinute").fill(value);
  },
);

Given(
  "{string} is typed for the requests a day of the key {string}",
  async function (this: WebWorld, value: string, heading: string) {
    await field(this, heading, "perDay").fill(value);
  },
);

When(
  "Save is pressed for the key {string}",
  async function (this: WebWorld, heading: string) {
    const answered = this.browserPage.waitForResponse(
      "**/api/site/api-keys/limits",
    );
    await keyCalled(this, heading).locator('button[type="submit"]').click();
    await answered;
  },
);

Then(
  "the key {string} is refused with {string}",
  async function (this: WebWorld, heading: string, code: string) {
    const message = keyCalled(this, heading).locator(
      `.field-message[data-refused~="${code}"]`,
    );
    await message.waitFor();
    assert.equal(await message.count(), 1);
  },
);

Then(
  "the page says it was refused with {string}",
  async function (this: WebWorld, code: string) {
    const said = this.browserPage.locator(".people-refused");
    await said.waitFor();
    assert.equal(await said.getAttribute("data-refused"), code);
  },
);

Then(
  "the page has {int} heading for accounts",
  async function (this: WebWorld, count: number) {
    await this.browserPage.locator("section[data-owner]").first().waitFor();
    assert.equal(
      await this.browserPage.locator("section[data-owner] h2").count(),
      count,
    );
  },
);

Then(
  "the page has {int} headings for accounts",
  async function (this: WebWorld, count: number) {
    await this.browserPage.locator("section[data-owner]").first().waitFor();
    assert.equal(
      await this.browserPage.locator("section[data-owner] h2").count(),
      count,
    );
  },
);
