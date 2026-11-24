// The old /api/v0 address (movedFromV0.feature), asked as an app asks, but not
// followed, so that what the site said about where to go can be seen.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";

const answers = new WeakMap<WebWorld, Response>();

const answerOf = (world: WebWorld): Response => {
  const answer = answers.get(world);
  assert.ok(answer !== undefined, "Nothing has been asked.");
  return answer;
};

When(
  "{string} is asked without following where it is sent",
  async function (this: WebWorld, path: string) {
    answers.set(
      this,
      await fetch(`${this.baseUrl!}${path}`, { redirect: "manual" }),
    );
  },
);

When(
  "{string} is posted without following where it is sent",
  async function (this: WebWorld, path: string) {
    answers.set(
      this,
      await fetch(`${this.baseUrl!}${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
        redirect: "manual",
      }),
    );
  },
);

When(
  "{string} is asked by a browser's preflight",
  async function (this: WebWorld, path: string) {
    answers.set(
      this,
      await fetch(`${this.baseUrl!}${path}`, {
        method: "OPTIONS",
        redirect: "manual",
      }),
    );
  },
);

// 308 and not 301 or 302, which a client may answer by asking again with GET.
Then(
  "the answer is a redirect that keeps the method",
  function (this: WebWorld) {
    assert.equal(answerOf(this).status, 308);
  },
);

Then("the answer is not a redirect", function (this: WebWorld) {
  assert.equal(answerOf(this).headers.get("location"), null);
});

Then("it is sent to {string}", function (this: WebWorld, path: string) {
  assert.equal(answerOf(this).headers.get("location"), path);
});
