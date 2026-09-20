import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type Judgement,
  JudgingRefused,
  RecaptchaReaderCheck,
} from "../../../../src/infrastructure/identity/RecaptchaReaderCheck.js";
import type { SpecWorld } from "../../../support/world.js";
import { FakeRecaptcha } from "./FakeRecaptcha.js";

/**
 * How long the scenarios' check waits for the fake. Long enough that a fake
 * answering at once on the same machine is never too late, and short enough
 * that a scenario about lateness is over quickly.
 */
const scenariosWaitMilliseconds = 500;

// What the scenarios' site sends as its secret key. It is nobody's: what
// matters is that whatever the check was given is what Google is sent.
const siteSecretKey = "the scenarios' secret key";

interface Judging {
  readonly fake: FakeRecaptcha;
  readonly check: RecaptchaReaderCheck;
  judgement?: Judgement;
  refusal?: unknown;
}

const judgings = new WeakMap<SpecWorld, Judging>();

const judgingOf = (world: SpecWorld): Judging => {
  const judging = judgings.get(world);
  assert.ok(judging !== undefined, "There is no fake of reCAPTCHA.");
  return judging;
};

const fakeOf = (world: SpecWorld): FakeRecaptcha => judgingOf(world).fake;

// The check is asked, and whatever comes back — a judgement or a refusal — is
// kept for the scenario to look at, so that a refusal fails the step that is
// about it rather than the step that asked.
const judge = async (
  world: SpecWorld,
  token: string | undefined,
): Promise<void> => {
  const judging = judgingOf(world);
  try {
    judging.judgement = await judging.check.judge(token);
  } catch (refusal) {
    judging.refusal = refusal;
  }
};

// The fake, and the check in front of it ---------------------------------------

Given("a fake of reCAPTCHA", async function (this: SpecWorld) {
  const fake = await FakeRecaptcha.start();
  judgings.set(this, {
    fake,
    check: new RecaptchaReaderCheck(
      siteSecretKey,
      fake.verifyUrl,
      scenariosWaitMilliseconds,
    ),
  });
});

After(async function (this: SpecWorld) {
  await judgings.get(this)?.fake.stop();
});

// What it answers --------------------------------------------------------------

Given(
  "reCAPTCHA scores the token {string} at {float}",
  function (this: SpecWorld, token: string, score: number) {
    fakeOf(this).scores(token, score);
  },
);

Given(
  "reCAPTCHA says the answer was for signing in",
  function (this: SpecWorld) {
    fakeOf(this).saysTheAnswerWasFor("signIn");
  },
);

Given(
  "reCAPTCHA will not accept the token {string}",
  function (this: SpecWorld, token: string) {
    fakeOf(this).willNotAccept(token);
  },
);

// Late by several times the wait rather than just over it, so that the
// scenario does not turn on how promptly a timer fires on a busy machine.
Given(
  "reCAPTCHA answers only after the check has stopped waiting",
  function (this: SpecWorld) {
    fakeOf(this).answersLateBy(scenariosWaitMilliseconds * 4);
  },
);

Given("reCAPTCHA answers with a failure", function (this: SpecWorld) {
  fakeOf(this).answersWithAFailure();
});

Given(
  "reCAPTCHA answers with something that is not one of its answers",
  function (this: SpecWorld) {
    fakeOf(this).answersWithSomethingElse();
  },
);

Given(
  "reCAPTCHA answers with a page rather than an answer",
  function (this: SpecWorld) {
    fakeOf(this).answersWithAPage();
  },
);

// The judging ------------------------------------------------------------------

When("{string} is judged", async function (this: SpecWorld, token: string) {
  await judge(this, token);
});

When("no token is judged", async function (this: SpecWorld) {
  await judge(this, undefined);
});

// What was made of the reader --------------------------------------------------

// The scenario's words are the check's own answer, so there is nothing to
// translate between what a scenario says and what is asserted.
const judgedAs = (world: SpecWorld, judgement: Judgement): void => {
  const judging = judgingOf(world);
  assert.equal(
    judging.refusal,
    undefined,
    `The judging was refused: ${String(judging.refusal)}`,
  );
  assert.equal(judging.judgement, judgement);
};

Then(
  /^the reader is judged (a person|not a person)$/,
  function (this: SpecWorld, judgement: string) {
    judgedAs(this, judgement as Judgement);
  },
);

Then("the reader has no judgement", function (this: SpecWorld) {
  judgedAs(this, "no judgement");
});

Then(
  "the judging is refused with {string}",
  function (this: SpecWorld, code: string) {
    const { refusal } = judgingOf(this);
    assert.ok(
      refusal instanceof JudgingRefused,
      `The judging was not refused: ${String(refusal)}`,
    );
    assert.equal(refusal.code, code);
  },
);

// What Google was sent ---------------------------------------------------------

// What the one request asked. Asked more than once, or not at all, is not a
// request a scenario can say anything about, so it is a failure rather than a
// pass.
const theOneAsked = (world: SpecWorld) => {
  const { asked } = fakeOf(world);
  assert.equal(asked.length, 1, `reCAPTCHA was asked ${asked.length} times.`);
  const only = asked[0];
  assert.ok(only !== undefined);
  return only;
};

Then("reCAPTCHA was sent the site's secret key", function (this: SpecWorld) {
  assert.equal(theOneAsked(this).secret, siteSecretKey);
});

Then(
  "reCAPTCHA was sent the token {string}",
  function (this: SpecWorld, token: string) {
    assert.equal(theOneAsked(this).token, token);
  },
);
