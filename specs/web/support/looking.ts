// Pages read without a browser: asked for by address, as a reader who is not
// signed in asks, and answered with what the site says. A redirect is not
// followed, so that a page that sends the reader elsewhere, to sign in say, is
// not taken for the page it sent them to.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "./world.js";

export const look = async (world: WebWorld, address: string): Promise<void> => {
  const response = await fetch(`${world.baseUrl!}${address}`, {
    headers:
      world.acceptLanguage === undefined
        ? {}
        : { "accept-language": world.acceptLanguage },
    redirect: "manual",
  });
  world.looked = { body: await response.text(), status: response.status };
};

/** What the page last looked at says. */
export const lookedAt = (world: WebWorld): string => {
  assert.ok(world.looked !== undefined, "No page was opened.");
  return world.looked.body;
};

When(
  "the help page {string} is looked at",
  async function (this: WebWorld, name: string) {
    await look(this, `/help/${name}`);
  },
);

When(
  "the page at {string} is looked at",
  async function (this: WebWorld, address: string) {
    await look(this, address);
  },
);

Then("the page is not found", function (this: WebWorld) {
  assert.ok(this.looked !== undefined, "No page was opened.");
  assert.equal(this.looked.status, 404);
});

Then("the page opens", function (this: WebWorld) {
  assert.ok(this.looked !== undefined, "No page was opened.");
  assert.equal(this.looked.status, 200);
});
