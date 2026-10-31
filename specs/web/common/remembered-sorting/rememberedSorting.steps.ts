import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { list, type List } from "../../support/tournamentLists.js";

const named =
  "(recent results|upcoming tournaments|year's tournaments|sport's tournaments|found tournaments|found competitions)";

// Where the way back is: beneath the table of the list it puts back.
const wayBack = (world: SpecWorld, name: string) =>
  list(world, name as List).locator("p.tournament-list-usual a");

When(
  new RegExp(`^the way back to the usual order of the ${named} is pressed$`),
  async function (this: SpecWorld, name: string) {
    await wayBack(this, name).click();
    await this.browserPage.waitForLoadState();
  },
);

Then(
  new RegExp(`^the ${named} offer the way back to their usual order$`),
  async function (this: SpecWorld, name: string) {
    assert.equal(await wayBack(this, name).count(), 1);
  },
);

Then(
  new RegExp(`^the ${named} offer no way back to their usual order$`),
  async function (this: SpecWorld, name: string) {
    assert.equal(await wayBack(this, name).count(), 0);
  },
);

// The cookie is read from the browser, which is where the reader has it,
// rather than from what the server sent: it is what comes back that matters.
Then(
  "the cookie that remembers the sorting does not name {string}",
  async function (this: SpecWorld, address: string) {
    const cookies = await this.browserPage.context().cookies();
    const sorting = cookies.find((cookie) => cookie.name === "sorting");
    assert.ok(sorting !== undefined, "No cookie remembers the sorting.");
    assert.ok(
      !decodeURIComponent(sorting.value).includes(address),
      "The cookie names the reader.",
    );
  },
);
