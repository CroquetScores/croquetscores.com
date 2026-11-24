// The public API's answer to what a key may do in a tournament
// (permissions.feature), asked as an app asks: plain requests, with the key
// as a bearer token. A key is made as its owner makes one, by the page that
// makes them, so that nothing of the site's code is named here.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { tournamentIdOf } from "../../site/advantage/apiScene.js";
import { answered, asked, bearer, keyMade } from "../apiOfApps.js";

// The address names the tournament by the part of its id after "tournament/".
export const permissionsOf = (tournament: string): string =>
  `/api/v1/tournaments/${tournament}/permissions`;

export const bare = (world: WebWorld, name: string): string =>
  tournamentIdOf(world, name).replace(/^tournament\//, "");

When(
  "the permissions in {string} are asked with no key",
  async function (this: WebWorld, tournament: string) {
    await asked(this, permissionsOf(bare(this, tournament)), {});
  },
);

When(
  "the permissions in {string} are asked with that key",
  async function (this: WebWorld, tournament: string) {
    await asked(
      this,
      permissionsOf(bare(this, tournament)),
      bearer(keyMade(this)),
    );
  },
);

When(
  "the permissions in {string} are asked with that key in the address",
  async function (this: WebWorld, tournament: string) {
    await asked(
      this,
      `${permissionsOf(bare(this, tournament))}?key=${keyMade(this)}`,
      {},
    );
  },
);

When(
  "the permissions in {string} are asked with the key {string}",
  async function (this: WebWorld, tournament: string, key: string) {
    await asked(this, permissionsOf(bare(this, tournament)), bearer(key));
  },
);

When(
  "the permissions in a tournament there is not are asked with that key",
  async function (this: WebWorld) {
    await asked(this, permissionsOf("not-a-tournament"), bearer(keyMade(this)));
  },
);

When(
  "the permissions in a tournament there is not are asked with the key {string}",
  async function (this: WebWorld, key: string) {
    await asked(this, permissionsOf("not-a-tournament"), bearer(key));
  },
);

Then(
  "the API says the part is {string}",
  function (this: WebWorld, part: string) {
    assert.equal(answered(this).body["part"], part);
  },
);

Then("the API says the key may write", function (this: WebWorld) {
  assert.equal(answered(this).body["mayWrite"], true);
});

Then("the API says the key may not write", function (this: WebWorld) {
  assert.equal(answered(this).body["mayWrite"], false);
});

Then("the API says the key may read", function (this: WebWorld) {
  assert.equal(answered(this).body["mayRead"], true);
});
