// What is done to a tournament by asking (tournamentActions.feature), asked as
// the website's page or an app asks: a plain request with no body, signed in
// by a session, a key or neither, as the scenario chose.
import { Then, When } from "@cucumber/cucumber";

import type { WebWorld } from "../../../support/world.js";
import { bare } from "../permissions/permissions.steps.js";
import { answered, told } from "../apiOfApps.js";
import { strict as assert } from "node:assert";

// The tournament by the part of its id after "tournament/".
const addressOf = (world: WebWorld, name: string, action: string): string =>
  `/api/v0/tournaments/${bare(world, name)}/${action}`;

When(
  /^the tournament "([^"]*)" is (archived|restored)$/,
  async function (this: WebWorld, name: string, done: string) {
    await told(
      this,
      "POST",
      addressOf(this, name, done === "archived" ? "archive" : "restore"),
    );
  },
);

When(
  "a tournament with a malformed id is archived",
  async function (this: WebWorld) {
    await told(this, "POST", "/api/v0/tournaments/not-a-tournament/archive");
  },
);

When(
  /^the tournament "([^"]*)" is (archived|restored) at the address it was at$/,
  async function (this: WebWorld, name: string, done: string) {
    await told(
      this,
      "POST",
      `/api/site/tournaments/${bare(this, name)}/${done === "archived" ? "archive" : "restore"}`,
    );
  },
);

When(
  "the notable status of the tournament {string} is removed",
  async function (this: WebWorld, name: string) {
    await told(this, "POST", addressOf(this, name, "remove-notable-status"));
  },
);

When(
  "the notable status of the tournament {string} is removed at the address it was at",
  async function (this: WebWorld, name: string) {
    await told(
      this,
      "POST",
      `/api/site/tournaments/${bare(this, name)}/remove-notable-status`,
    );
  },
);

Then("the tournament read says it is not national", function (this: WebWorld) {
  assert.equal(answered(this).body["national"], false);
});

When(
  /^the tournament "([^"]*)" is deleted with the words "([^"]*)" and (archived|not archived)$/,
  async function (
    this: WebWorld,
    name: string,
    message: string,
    archived: string,
  ) {
    await told(this, "POST", addressOf(this, name, "delete"), {
      message,
      archive: archived === "archived",
    });
  },
);

When(
  "the tournament {string} is deleted at the address it was at",
  async function (this: WebWorld, name: string) {
    await told(
      this,
      "POST",
      `/api/site/tournaments/${bare(this, name)}/delete`,
      {
        message: "This was a test.",
        archive: true,
      },
    );
  },
);
