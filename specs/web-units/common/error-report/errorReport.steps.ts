import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { builtFor, logOf, mount, senderOf } from "../../support/application.js";
import { unmarked } from "../../support/languages.js";

// Under /api/ is answered as the API and anything else as a page, so which of
// the two a route is decides only where it is.
const pagePath = "/example-failure";
const apiPath = "/api/example-failure";

const failing = (
  world: SpecWorld,
  method: "GET",
  url: string,
  message: string,
): void => {
  mount(world, (application) => {
    application.server.get(url, () => {
      throw new Error(message);
    });
  });
  builtFor(world).route = { method, url };
};

Given("an example page that fails", function (this: SpecWorld) {
  failing(this, "GET", pagePath, "The example page failed.");
});

Given(
  "an example page that fails with the words {string}",
  function (this: SpecWorld, words: string) {
    failing(this, "GET", pagePath, words);
  },
);

Given("an example API route that fails", function (this: SpecWorld) {
  failing(this, "GET", apiPath, "The example route failed.");
});

When(
  "the example page is asked for with {string} after the question mark",
  async function (this: SpecWorld, query: string) {
    const scenario = builtFor(this);
    scenario.response = await scenario.application.server.inject({
      method: "GET",
      url: `${pagePath}?${query}`,
    });
  },
);

const emailTo = (world: SpecWorld, address: string) => {
  const email = senderOf(world).sent.find((each) => each.to === address);
  assert.ok(email !== undefined, `${address} was sent nothing.`);
  return email;
};

// The email goes after the answer, so what is looked at waits for it.
const toldFor = async (world: SpecWorld, address: string) => {
  await builtFor(world).application.administratorTold();
  return emailTo(world, address);
};

Then(
  "the email sent to {string} says the site failed",
  async function (this: SpecWorld, address: string) {
    assert.match(unmarked((await toldFor(this, address)).subject), /failed/i);
  },
);

Then(
  "the email sent to {string} does not say the site failed",
  async function (this: SpecWorld, address: string) {
    assert.doesNotMatch(
      unmarked((await toldFor(this, address)).subject),
      /failed/i,
    );
  },
);

Then(
  "the email sent to {string} names the address asked for",
  async function (this: SpecWorld, address: string) {
    assert.ok((await toldFor(this, address)).body.includes(pagePath));
  },
);

Then(
  "the email sent to {string} does not name {string}",
  async function (this: SpecWorld, address: string, words: string) {
    assert.ok(!(await toldFor(this, address)).body.includes(words));
  },
);

// Found in what the reader was shown, which is the only place the scenario can
// see the reference: a page prints it, and an API route answers with it.
Then(
  "the email sent to {string} gives the reference the reader was given",
  async function (this: SpecWorld, address: string) {
    const body = builtFor(this).response?.body ?? "";
    const reference =
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.exec(
        body,
      )?.[0];
    assert.ok(reference !== undefined, "The reader was given no reference.");
    assert.ok((await toldFor(this, address)).body.includes(reference));
  },
);

Then(
  "the log says {string} {int} times",
  async function (this: SpecWorld, code: string, times: number) {
    await builtFor(this).application.administratorTold();
    assert.equal(
      logOf(this).filter((line) => line.includes(code)).length,
      times,
    );
  },
);
