import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  loadConfig,
  loadEnvFile,
} from "../../../../src/infrastructure/config/Config.js";
import {
  SmtpEmailSender,
  type SmtpSettings,
} from "../../../../src/infrastructure/email/SmtpEmailSender.js";
import type { SpecWorld } from "../../../support/world.js";

// What the scenario has: the settings the site would send with, and how the
// test email ended. Kept here rather than on the world, which may name nothing
// from infrastructure.
interface TestEmail {
  smtp: SmtpSettings;
  from: string;
  failure: Error | undefined;
  sent: boolean;
}

const testEmails = new WeakMap<SpecWorld, TestEmail>();

const testEmailOf = (world: SpecWorld): TestEmail => {
  const testEmail = testEmails.get(world);
  assert.ok(testEmail !== undefined, "The SMTP settings were not read.");
  return testEmail;
};

Given("the SMTP settings in the .env file", function (this: SpecWorld) {
  loadEnvFile();
  // The real settings, read as the site reads them, so that what this finds
  // wrong is what the site would find wrong.
  const config = loadConfig();
  assert.ok(
    config.smtp !== undefined,
    "SMTP_HOST, SMTP_PORT, SMTP_USER_NAME and SMTP_PASSWORD are not all set in .env.",
  );
  testEmails.set(this, {
    smtp: config.smtp,
    from: config.administratorEmailAddress,
    failure: undefined,
    sent: false,
  });
});

When(
  "a test email is sent to {string} through the mail server",
  async function (this: SpecWorld, to: string) {
    const testEmail = testEmailOf(this);
    try {
      await new SmtpEmailSender(testEmail.smtp).send({
        to,
        from: testEmail.from,
        subject: "A test email from the SMTP sender",
        body: "<p>This is a test of the SMTP settings, sent by <code>brevoDelivery.feature</code>. Nothing needs doing.</p>",
      });
      testEmail.sent = true;
    } catch (error) {
      testEmail.failure = error as Error;
    }
  },
);

Then("the mail server takes the test email", function (this: SpecWorld) {
  const testEmail = testEmailOf(this);
  assert.equal(
    testEmail.failure,
    undefined,
    `The mail server did not take it: ${testEmail.failure?.message ?? ""}`,
  );
  assert.ok(testEmail.sent, "The test email was not sent.");
});
