// What is done to a tournament by asking (tournamentActions.feature), asked as
// the website's page or an app asks: a plain request with no body, signed in
// by a session, a key or neither, as the scenario chose.
import { When } from "@cucumber/cucumber";

import type { WebWorld } from "../../../support/world.js";
import { bare } from "../permissions/permissions.steps.js";
import { told } from "../apiOfApps.js";

// The tournament by the part of its id after "tournament/".
const addressOf = (world: WebWorld, name: string, action: string): string =>
  `/api/v1/tournaments/${bare(world, name)}/${action}`;

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
    await told(this, "POST", "/api/v1/tournaments/not-a-tournament/archive");
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

// Asked where the website's own pages ask them, which an app is not offered
// (administratorActions.feature has them where they are).
When(
  "the notable status of the tournament {string} is removed through the API",
  async function (this: WebWorld, name: string) {
    await told(this, "POST", addressOf(this, name, "remove-notable-status"));
  },
);

When(
  "the tournament {string} is deleted through the API",
  async function (this: WebWorld, name: string) {
    await told(this, "POST", addressOf(this, name, "delete"), {
      message: "This was a test.",
      archive: true,
    });
  },
);
