import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../../../../../support/world.js";
import { keptOf } from "../../../../../../../support/kept.js";

// A competition's page, opened at its address beneath its tournament's. Its
// tabs are laid out and chosen as the tournament's page's are, so the steps
// that read them are that page's (view.steps.ts beneath the tournament).
//
// The page is taken as open once it has drawn its heading: the competition's
// name, or what it says in its place where the reader cannot see it.
const openCompetition = async function (
  this: WebWorld,
  competition: string,
  name: string,
): Promise<void> {
  const tournament = await keptOf(this, name);
  const found = tournament.competitions.find(
    (each) => each.name === competition,
  );
  assert.ok(found !== undefined, `${name} has no competition ${competition}.`);
  await this.browserPage.goto(
    `${this.baseUrl!}/admin/${tournament.address}/competitions/${found.slug}`,
  );
  // Where the reader is sent to sign in first there is no heading of the
  // admin's to wait for, and the sign in page is what the scenario looks at.
  if (!new URL(this.browserPage.url()).pathname.startsWith("/admin/")) return;
  await this.browserPage.locator("main h1").first().waitFor();
};

// Given and When alike: Cucumber does not tell them apart.
Given(
  /^the page of the competition "([^"]*)" in "([^"]*)" is open(?:ed)?$/,
  openCompetition,
);
