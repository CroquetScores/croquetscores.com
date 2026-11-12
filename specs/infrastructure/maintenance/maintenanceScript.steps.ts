import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { stat } from "node:fs/promises";
import { join } from "node:path";

import type { SpecWorld } from "../../support/world.js";
import {
  emailText,
  lastEmail,
  scriptOf,
  scriptsFolder,
} from "./maintenanceScript.js";

// The steps the backup's and the export's features say in the same words
// (`backupCli.feature`, `exportTournamentsCli.feature`).

Given(
  "the administrator is {string}",
  function (this: SpecWorld, address: string) {
    scriptOf(this).administrator = address;
  },
);

Given("email cannot be sent", function (this: SpecWorld) {
  scriptOf(this).emailFails = true;
});

Then("an email was sent to {string}", function (this: SpecWorld, to: string) {
  assert.equal(lastEmail(this).to, to);
});

Then(
  "the email subject is {string}",
  function (this: SpecWorld, subject: string) {
    assert.equal(lastEmail(this).subject, subject);
  },
);

Then("the email says why: {string}", function (this: SpecWorld, why: string) {
  assert.ok(emailText(this).includes(`Why: ${why}`));
});

Then(
  "the folder has the file {string}",
  async function (this: SpecWorld, name: string) {
    await assert.doesNotReject(
      stat(join(scriptsFolder(this), name)),
      `The folder does not have ${name}.`,
    );
  },
);

Then("the folder is still not there", async function (this: SpecWorld) {
  await assert.rejects(stat(scriptsFolder(this)));
});
