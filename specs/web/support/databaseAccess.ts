// Whether the site may use its database, as an administrator sets it and as the
// scenarios say it is: told to the site through its control, which writes the
// switch the site keeps outside its database, and read back from it.
import { After, Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { call } from "./control.js";
import { site } from "./site.js";

const said = async (body: object): Promise<void> => {
  const answer = await call("POST", "/database-access", body);
  assert.equal(answer.status, 200, await answer.text());
};

Given(
  /^database access is turned off for (-?[\d.]+) minutes$/,
  async function (minutes: string) {
    await said({ off: true, minutes: Number(minutes) });
  },
);

Given(
  /^database access is turned off for (-?[\d.]+) minutes with the words "([^"]*)"$/,
  async function (minutes: string, words: string) {
    await said({ off: true, minutes: Number(minutes), words });
  },
);

Given(
  /^database access is turned off for (\d+) minutes with (\d+) characters of words$/,
  async function (minutes: string, count: string) {
    await said({
      off: true,
      minutes: Number(minutes),
      words: "w".repeat(Number(count)),
    });
  },
);

Given(
  /^the expected return is moved to (-?[\d.]+) minutes from now$/,
  async function (minutes: string) {
    await said({ move: true, minutes: Number(minutes) });
  },
);

Given(
  /^the expected return is moved to (-?[\d.]+) minutes from now with the words "([^"]*)"$/,
  async function (minutes: string, words: string) {
    await said({ move: true, minutes: Number(minutes), words });
  },
);

Given("database access is turned on", async function () {
  await said({ off: false });
});

const stateOf = async (): Promise<{ off: boolean; words?: string }> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(`${baseUrl}/__test/database-access`, {
    headers: { "x-test-control": token },
  });
  return (await answer.json()) as { off: boolean; words?: string };
};

// Asked again for a while, since the site reads the switch once in a second.
const eventuallyIs = async (off: boolean): Promise<void> => {
  const until = Date.now() + 3000;
  for (;;) {
    if ((await stateOf()).off === off) return;
    if (Date.now() > until) assert.equal((await stateOf()).off, off);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

Then(/^database access is (on|off)$/, async function (which: string) {
  await eventuallyIs(which === "off");
});

// What a reader is told is what the switch was given to say, kept with it.
const retried = async (check: () => Promise<void>): Promise<void> => {
  const until = Date.now() + 3000;
  for (;;) {
    try {
      await check();
      return;
    } catch (failure) {
      if (Date.now() > until) throw failure;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

Then("readers are told {string}", async function (words: string) {
  await retried(async () => {
    assert.equal((await stateOf()).words, words);
  });
});

Then("readers are told the usual sentence", async function () {
  await retried(async () => {
    const state = await stateOf();
    assert.ok(state.off, "Database access is on.");
    assert.equal(state.words, undefined);
  });
});

// Access is on again when a scenario is over, whatever it did, so that the
// next scenario finds the site as it left it.
After(async function () {
  const { baseUrl, token } = await site();
  await fetch(`${baseUrl}/__test/database-access`, {
    method: "POST",
    headers: { "x-test-control": token, "content-type": "application/json" },
    body: JSON.stringify({ off: false }),
  });
});
