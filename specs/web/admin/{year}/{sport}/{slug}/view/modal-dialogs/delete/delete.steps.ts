// The dialog an administrator deletes a tournament from (delete.feature), in a
// real browser. What was sent is read from the email queue as it was kept, so
// that it is what the site would send and not what the page says it sent.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { WebWorld } from "../../../../../../../support/world.js";
import { keptOf } from "../../../../../../../support/kept.js";
import { allEmails } from "../../../../../../../support/control.js";
import { retried } from "../../../../../../../support/tournamentPage.js";

const dialogOf = (world: WebWorld): Locator =>
  world.browserPage.locator("dialog[open]");

const messageOf = (world: WebWorld): Locator =>
  dialogOf(world).locator("#field-message");

// Given and When alike: Cucumber does not tell them apart.
When(
  "the message to the managers is changed to {string}",
  async function (this: WebWorld, message: string) {
    await messageOf(this).fill(message);
  },
);

Then(
  "the message to the managers says {string}",
  async function (this: WebWorld, said: string) {
    await messageOf(this).waitFor();
    const written = await messageOf(this).inputValue();
    assert.ok(
      written.includes(said),
      `The message says ${JSON.stringify(written)}.`,
    );
  },
);

Then(
  "the message to the managers is refused with {string}",
  async function (this: WebWorld, code: string) {
    const refusal = dialogOf(this).locator(".field-message");
    await refusal.waitFor();
    const refusedWith = (await refusal.getAttribute("data-refused")) ?? "";
    assert.ok(
      refusedWith.split(" ").includes(code),
      `The message is refused with "${refusedWith}".`,
    );
  },
);

Then(
  "the page says its managers have been emailed",
  async function (this: WebWorld) {
    await this.browserPage
      .locator("main [role=status]", {
        hasText: "Its managers have been emailed.",
      })
      .waitFor();
  },
);

// What was queued for the managers, which is all of what the scenario queues
// but for what the accounts it made were sent.
const queuedToManagers = async (): Promise<
  readonly { to: string; message: string }[]
> => {
  const emails = await allEmails();
  return emails
    .filter(
      (email) => !email.givenUp && email.kind === "Email.TournamentDeleted",
    )
    .map((email) => ({
      to: email.to ?? "",
      message: email.fill?.["message"] ?? "",
    }));
};

// Asked again for a while: the page has the answer from the API, and what the
// API queued is kept a moment before it is.
Then(
  "the email to the managers is queued for {string}",
  async function (this: WebWorld, address: string) {
    await retried(async () => {
      const queued = await queuedToManagers();
      assert.equal(
        queued.filter(({ to }) => to === address).length,
        1,
        `Nothing was queued for ${address}.`,
      );
    });
  },
);

Then(
  "the email to the managers queued for {string} says {string}",
  async function (this: WebWorld, address: string, said: string) {
    await retried(async () => {
      const queued = (await queuedToManagers()).find(
        ({ to }) => to === address,
      );
      assert.ok(queued !== undefined, `Nothing was queued for ${address}.`);
      assert.equal(queued.message, said);
    });
  },
);

Then("no email is sent to the managers", async function (this: WebWorld) {
  // After the dialog has had the time to have sent one, which it has once it
  // has either closed or said it was refused.
  await this.browserPage.waitForLoadState("networkidle");
  assert.deepEqual(await queuedToManagers(), []);
});

Then(
  /^the tournament "(.*)" is (not )?kept archived$/,
  async function (this: WebWorld, name: string, not: string | null) {
    await retried(async () => {
      const kept = await keptOf(this, name);
      assert.equal(kept.archived, not === null);
    });
  },
);
