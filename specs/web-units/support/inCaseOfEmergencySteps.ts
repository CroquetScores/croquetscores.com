// The page for asking to take over the site (inCaseOfEmergency.feature), in a
// real browser. The words are read with the test locale's marks taken off,
// since what is asked is what the page says and not which phrases it came from.
import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";
import {
  anApplicationWithEmergencyContacts,
  applicationFor,
} from "./browser.js";

// Who the scenario says holds the site's passwords, kept so that what was
// queued can be asked of each. A setting of the site, read when it is built, so
// it is said before the site is served.
const contacts = new WeakMap<SpecWorld, readonly string[]>();

// One step for the application's scenarios and for this one: said to an
// application the scenario stood up it tells that, and otherwise the site the
// browser is served is made with them.
Given(
  "the emergency contacts are at {string} and {string}",
  async function (this: SpecWorld, first: string, second: string) {
    contacts.set(this, [first, second]);
    if (this.registering !== undefined) {
      this.registering.emergencyContactsAre([first, second]);
      return;
    }
    this.baseUrl = await anApplicationWithEmergencyContacts(this, [
      first,
      second,
    ]);
  },
);

// What is waiting to be sent, as the application the scenario stood up has it
// or as the site the browser was served has it: one step for both, since
// "nothing was sent" is said the same of each.
const waiting = async (
  world: SpecWorld,
): Promise<readonly { kind: string; to: string }[]> => {
  if (world.registering !== undefined) return world.registering.queued();
  const application = applicationFor(world);
  const emails = await application.unitOfWork.inTransaction(() =>
    application.emailQueue.emails(),
  );
  // Only what the page sends: the confirmation the account the scenario made
  // was queued with, as it was made, is not what is being asked about.
  return emails
    .filter(
      (email) => !email.givenUp && email.kind.startsWith("Email.Emergency"),
    )
    .map((email) => ({ kind: email.kind, to: email.to ?? "" }));
};

Then("no email is queued", async function (this: SpecWorld) {
  assert.deepEqual(await waiting(this), [], "Something is queued.");
});
