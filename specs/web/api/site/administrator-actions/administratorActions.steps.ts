// What an administrator asks of the website's own interface about a tournament
// (administratorActions.feature), asked as the admin's pages ask: a plain
// request with the session the administrator holds, and the key the scenario
// chose to send where it is about a key being no use.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { answered, told } from "../../v0/apiOfApps.js";
import { bare } from "../../v0/permissions/permissions.steps.js";

const addressOf = (world: WebWorld, name: string, action: string): string =>
  `/api/site/tournaments/${bare(world, name)}/${action}`;

When(
  "the notable status of the tournament {string} is removed from the website",
  async function (this: WebWorld, name: string) {
    await told(this, "POST", addressOf(this, name, "remove-notable-status"));
  },
);

// What the administrator has decided to send, kept beside the world rather
// than on it, which every scenario in specs/web shares.
interface Judgement {
  message: string;
  archive: boolean;
}
const judgements = new WeakMap<WebWorld, Judgement>();
const judgementOf = (world: WebWorld): Judgement => {
  let judgement = judgements.get(world);
  if (judgement === undefined) {
    judgement = { message: "", archive: false };
    judgements.set(world, judgement);
  }
  return judgement;
};

Given(
  "the words {string} are written to the managers",
  function (this: WebWorld, words: string) {
    judgementOf(this).message = words;
  },
);

Given("nothing is written to the managers", function (this: WebWorld) {
  judgementOf(this).message = "";
});

Given(
  /^the tournament is (to be archived|not to be archived)$/,
  function (this: WebWorld, which: string) {
    judgementOf(this).archive = which === "to be archived";
  },
);

When(
  "the tournament {string} is deleted from the website",
  async function (this: WebWorld, name: string) {
    await told(this, "POST", addressOf(this, name, "delete"), {
      ...judgementOf(this),
    });
  },
);

Then("the tournament read says it is not national", function (this: WebWorld) {
  assert.equal(answered(this).body["national"], false);
});

// The website's own interface says a refusal as `error`, where the public API
// says it as `code`, and says nothing of a key since it does not read one.
Then("the website says the reader is not signed in", function (this: WebWorld) {
  assert.equal(answered(this).status, 401);
  assert.equal(answered(this).body["error"], "NotSignedIn");
});

Then(
  "the website refuses it with {string}",
  function (this: WebWorld, code: string) {
    assert.equal(
      answered(this).status,
      422,
      JSON.stringify(answered(this).body),
    );
    assert.equal(answered(this).body["error"], code);
  },
);
