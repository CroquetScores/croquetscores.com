// The dialog an administrator deletes a tournament from (delete.feature), in a
// real browser. What was sent is read from the email queue as it was kept, so
// that it is what the site would send and not what the page says it sent.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  load,
  tournamentNamed,
} from "../../../../../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import { applicationFor } from "../../../../../../../support/browser.js";
import { retried } from "../../../../../../../support/tournamentPage.js";

const dialogOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("dialog[open]");

const messageOf = (world: SpecWorld): Locator =>
  dialogOf(world).locator("#field-message");

// Given and When alike: Cucumber does not tell them apart.
When(
  "the message to the managers is changed to {string}",
  async function (this: SpecWorld, message: string) {
    await messageOf(this).fill(message);
  },
);

Then(
  "the message to the managers says {string}",
  async function (this: SpecWorld, said: string) {
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
  async function (this: SpecWorld, code: string) {
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
  async function (this: SpecWorld) {
    await this.browserPage
      .locator("main [role=status]", {
        hasText: "Its managers have been emailed.",
      })
      .waitFor();
  },
);

// What was queued for the managers, which is all of what the scenario queues
// but for what the accounts it made were sent.
const queuedToManagers = async (
  world: SpecWorld,
): Promise<readonly { to: string; message: string }[]> => {
  const application = applicationFor(world);
  const emails = await application.unitOfWork.inTransaction(() =>
    application.emailQueue.emails(),
  );
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
  async function (this: SpecWorld, address: string) {
    await retried(async () => {
      const queued = await queuedToManagers(this);
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
  async function (this: SpecWorld, address: string, said: string) {
    await retried(async () => {
      const queued = (await queuedToManagers(this)).find(
        ({ to }) => to === address,
      );
      assert.ok(queued !== undefined, `Nothing was queued for ${address}.`);
      assert.equal(queued.message, said);
    });
  },
);

Then("no email is sent to the managers", async function (this: SpecWorld) {
  // After the dialog has had the time to have sent one, which it has once it
  // has either closed or said it was refused.
  await this.browserPage.waitForLoadState("networkidle");
  assert.deepEqual(await queuedToManagers(this), []);
});

Then(
  /^the tournament "(.*)" is (not )?kept archived$/,
  async function (this: SpecWorld, name: string, not: string | null) {
    await retried(async () => {
      const kept = await load(this, tournamentNamed(this, name));
      assert.equal(kept.archived, not === null);
    });
  },
);
