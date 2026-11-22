import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import { boxOf, list, rows } from "../../support/tournamentLists.js";
import { ordinal } from "../../support/ordinals.js";

const visited = (world: WebWorld) => list(world, "visited tournaments");

Then(
  "the home page has no list of visited tournaments",
  async function (this: WebWorld) {
    assert.equal(await visited(this).count(), 0);
  },
);

Then(
  /^(\d+) visited tournaments? (?:is|are) listed$/,
  async function (this: WebWorld, count: string) {
    assert.equal(
      await rows(this, "visited tournaments").count(),
      Number(count),
    );
  },
);

Then(
  /^the (first|second|third|fourth|fifth) of the visited tournaments is "(.*)"$/,
  async function (this: WebWorld, which: string, name: string) {
    const row = rows(this, "visited tournaments").nth(ordinal(which));
    assert.equal(
      ((await row.locator(".tournament-name").textContent()) ?? "").trim(),
      name,
    );
  },
);

Then(
  "{string} is not among the visited tournaments",
  async function (this: WebWorld, name: string) {
    const named = rows(this, "visited tournaments").filter({
      has: this.browserPage.locator(".tournament-name", {
        hasText: new RegExp(`^${name}$`),
      }),
    });
    assert.equal(await named.count(), 0);
  },
);

When(
  /^the name of "(.*)" in the visited tournaments is pressed$/,
  async function (this: WebWorld, name: string) {
    await visited(this)
      .locator(".tournament-name", { hasText: new RegExp(`^${name}$`) })
      .click();
    await this.browserPage.waitForLoadState();
  },
);

// Where each is on the page, which is what a reader sees of the order.
Then(
  "the visited tournaments are below the filter",
  async function (this: WebWorld) {
    const filter = await boxOf(
      this.browserPage.locator("form.tournament-filter"),
    );
    const shown = await boxOf(visited(this));
    assert.ok(
      shown.y >= filter.y + filter.height,
      `They start ${String(shown.y)} pixels down.`,
    );
  },
);

Then(
  "the visited tournaments are above the recent results",
  async function (this: WebWorld) {
    const recent = await boxOf(list(this, "recent results"));
    const shown = await boxOf(visited(this));
    assert.ok(
      recent.y >= shown.y + shown.height,
      `The recent results start ${String(recent.y)} pixels down.`,
    );
  },
);

// The cookie is read from the browser, which is where the reader has it,
// rather than from what the server sent: it is what comes back that matters.
Then(
  "the cookie that remembers the visited tournaments does not name {string}",
  async function (this: WebWorld, address: string) {
    const cookies = await this.browserPage.context().cookies();
    const kept = cookies.find((cookie) => cookie.name === "visited");
    assert.ok(
      kept !== undefined,
      "No cookie remembers the visited tournaments.",
    );
    assert.ok(
      !decodeURIComponent(kept.value).includes(address),
      "The cookie names the reader.",
    );
  },
);

Given(
  "the cookie that remembers the visited tournaments is set to {string}",
  async function (this: WebWorld, value: string) {
    const url = new URL(this.baseUrl!);
    await this.browserPage.context().addCookies([
      {
        name: "visited",
        value,
        domain: url.hostname,
        path: "/",
        secure: true,
      },
    ]);
  },
);
