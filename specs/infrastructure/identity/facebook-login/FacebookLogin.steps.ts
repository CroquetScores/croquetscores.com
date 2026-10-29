import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { randomBytes } from "node:crypto";

import {
  FacebookLogin,
  type FacebookClaims,
} from "../../../../src/infrastructure/identity/FacebookLogin.js";
import type { SpecWorld } from "../../../support/world.js";
import { rememberWhoCameBack } from "../whoCameBack.js";
import {
  facebookCredentialsForScenarios,
  standInFacebookFor,
  type Misbehaving,
  type StandInFacebook,
} from "../../support/facebook.js";

// Where the reader is sent back to. Nothing listens there: the stand-in only
// writes it into where it sends the reader, and the code is read from that.
const REDIRECT_URI = "http://127.0.0.1/auth/facebook/callback";

interface Believing {
  readonly facebook: StandInFacebook;
  readonly client: FacebookLogin;
  code?: string;
  cameBack?: FacebookClaims | undefined;
}

const believing = new WeakMap<SpecWorld, Believing>();

const believingOf = (world: SpecWorld): Believing => {
  const found = believing.get(world);
  assert.ok(found !== undefined, "There is no fake of Facebook.");
  return found;
};

const aSecret = (): string => randomBytes(32).toString("base64url");

Given("a fake of Facebook", async function (this: SpecWorld) {
  const facebook = await standInFacebookFor(this);
  believing.set(this, {
    facebook,
    client: new FacebookLogin(
      facebookCredentialsForScenarios,
      facebook.endpoints,
    ),
  });
});

// Sent as the site sends a reader, and brought back as Facebook brings them:
// the place the stand-in sends the reader to is asked for, and the code read
// from where it says to go back to.
Given("the reader has been sent to Facebook", async function (this: SpecWorld) {
  const those = believingOf(this);
  const where = those.client.whereToSend({
    redirectUri: REDIRECT_URI,
    state: aSecret(),
  });
  const response = await fetch(where, { redirect: "manual" });
  const back = new URL(response.headers.get("location") ?? "");
  const code = back.searchParams.get("code");
  assert.ok(code !== null, `Facebook sent the reader back to ${back.href}.`);
  those.code = code;
});

// One misbehaviour to a step, each the one thing wrong with what follows.
// Said to the scenario's own stand-in, whether or not the scenario is about
// believing Facebook, so that a browser scenario can say the same things.
const misbehave = async (world: SpecWorld, how: Misbehaving): Promise<void> => {
  const facebook = await standInFacebookFor(world);
  facebook.misbehaving = { ...facebook.misbehaving, ...how };
};

Given(
  "Facebook requires proof of the site's secret",
  async function (this: SpecWorld) {
    await misbehave(this, { requiresProof: true });
  },
);

Given(
  "Facebook will not accept the site's proof",
  async function (this: SpecWorld) {
    await misbehave(this, { rejectsProof: true });
  },
);

Given(
  "Facebook will refuse the access token it gave",
  async function (this: SpecWorld) {
    await misbehave(this, { refusesAccessToken: true });
  },
);

Given(
  "Facebook will give no access token for the code",
  async function (this: SpecWorld) {
    await misbehave(this, { givesNoAccessToken: true });
  },
);

Given(
  "Facebook will name no id for the reader",
  async function (this: SpecWorld) {
    await misbehave(this, { givesNoId: true });
  },
);

Given(
  "Facebook will give no name for the reader",
  async function (this: SpecWorld) {
    await misbehave(this, { givesNoName: true });
  },
);

Given(
  "Facebook made the code for another site",
  async function (this: SpecWorld) {
    await misbehave(this, { codeForAnotherSite: true });
  },
);

Given(
  "Facebook will hang up on the exchange",
  async function (this: SpecWorld) {
    await misbehave(this, { hangsUpOnTheExchange: true });
  },
);

Given(
  "Facebook will hang up on the question about the reader",
  async function (this: SpecWorld) {
    await misbehave(this, { hangsUpOnTheQuestion: true });
  },
);

Given(
  "Facebook will answer the question about the reader with a server error",
  async function (this: SpecWorld) {
    await misbehave(this, { answersTheQuestionWithAnError: true });
  },
);

Given(
  "Facebook will answer the question about the reader with something that is not an answer",
  async function (this: SpecWorld) {
    await misbehave(this, { answersTheQuestionWithNonsense: true });
  },
);

const whoCameBack = (
  world: SpecWorld,
  redirectUri = REDIRECT_URI,
): Promise<FacebookClaims> => {
  const { client, code } = believingOf(world);
  assert.ok(code !== undefined, "Nobody has been sent to Facebook.");
  return client.whoCameBack({ code, redirectUri });
};

// Whatever came of it is kept for the scenario rather than thrown: most of
// these scenarios are about how it is refused.
const ask = async (world: SpecWorld, redirectUri?: string): Promise<void> => {
  const those = believingOf(world);
  those.cameBack = undefined;
  world.failure = undefined;
  rememberWhoCameBack(world, undefined);
  try {
    those.cameBack = await whoCameBack(world, redirectUri);
    rememberWhoCameBack(world, those.cameBack);
  } catch (failure) {
    world.failure = failure;
  }
};

When("who came back from Facebook is asked", async function (this: SpecWorld) {
  await ask(this);
});

When(
  "who came back from Facebook is asked again with the same code",
  async function (this: SpecWorld) {
    await ask(this);
  },
);

When(
  "who came back from Facebook is asked with another return address",
  async function (this: SpecWorld) {
    await ask(this, "http://127.0.0.1/somewhere/else");
  },
);

// Something the scenario builds on, so a refusal here is a scenario that is
// wrong about what it stands on, and is thrown.
Given(
  "who came back from Facebook has been asked",
  async function (this: SpecWorld) {
    await whoCameBack(this);
  },
);

const cameBackOf = (world: SpecWorld): FacebookClaims => {
  const cameBack = believingOf(world).cameBack;
  assert.ok(
    cameBack !== undefined,
    `Nobody came back: ${String(world.failure)}`,
  );
  return cameBack;
};

Then(
  "the reader is known to Facebook as {string}",
  function (this: SpecWorld, facebookId: string) {
    assert.equal(cameBackOf(this).facebookId, facebookId);
  },
);

Then("the reader has no email address", function (this: SpecWorld) {
  assert.equal(cameBackOf(this).emailAddress, undefined);
});
