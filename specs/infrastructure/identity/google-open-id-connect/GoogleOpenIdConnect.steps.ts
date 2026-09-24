import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { createHash, randomBytes } from "node:crypto";

import {
  GoogleOpenIdConnect,
  type GoogleClaims,
} from "../../../../src/infrastructure/identity/GoogleOpenIdConnect.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  googleCredentialsForScenarios,
  standInGoogleFor,
  type Misbehaving,
  type StandInGoogle,
} from "../../support/google.js";

// Where the reader is sent back to. Nothing listens there: the stand-in only
// writes it into where it sends the reader, and the code is read from that.
const REDIRECT_URI = "http://127.0.0.1/auth/google/callback";

interface Sent {
  code: string;
  codeVerifier: string;
  readonly nonce: string;
}

interface Believing {
  readonly google: StandInGoogle;
  readonly client: GoogleOpenIdConnect;
  sent?: Sent;
  cameBack?: GoogleClaims | undefined;
}

const believing = new WeakMap<SpecWorld, Believing>();

const believingOf = (world: SpecWorld): Believing => {
  const found = believing.get(world);
  assert.ok(found !== undefined, "There is no fake of Google.");
  return found;
};

const aSecret = (): string => randomBytes(32).toString("base64url");

Given("a fake of Google", async function (this: SpecWorld) {
  const google = await standInGoogleFor(this);
  believing.set(this, {
    google,
    client: new GoogleOpenIdConnect(
      googleCredentialsForScenarios,
      google.endpoints,
    ),
  });
});

// Sent as the site sends a reader, and brought back as Google brings them: the
// place the stand-in sends the reader to is asked for, and the code read from
// where it says to go back to.
Given("the reader has been sent to Google", async function (this: SpecWorld) {
  const those = believingOf(this);
  const sent = {
    codeVerifier: aSecret(),
    nonce: aSecret(),
  };
  const where = those.client.whereToSend({
    redirectUri: REDIRECT_URI,
    state: aSecret(),
    nonce: sent.nonce,
    codeChallenge: createHash("sha256")
      .update(sent.codeVerifier)
      .digest("base64url"),
  });
  const response = await fetch(where, { redirect: "manual" });
  const back = new URL(response.headers.get("location") ?? "");
  const code = back.searchParams.get("code");
  assert.ok(code !== null, `Google sent the reader back to ${back.href}.`);
  those.sent = { ...sent, code };
});

Given(
  "the verifier the reader was sent with is lost",
  function (this: SpecWorld) {
    const sent = believingOf(this).sent;
    assert.ok(sent !== undefined, "Nobody has been sent to Google.");
    sent.codeVerifier = aSecret();
  },
);

// One misbehaviour to a step, each the one thing wrong with what follows.
const misbehave = (world: SpecWorld, how: Misbehaving): void => {
  const { google } = believingOf(world);
  google.misbehaving = { ...google.misbehaving, ...how };
};

Given(
  "Google will sign the token with a key it does not publish",
  function (this: SpecWorld) {
    misbehave(this, { signing: "unpublished" });
  },
);

Given("Google will not sign the token", function (this: SpecWorld) {
  misbehave(this, { signing: "none" });
});

Given(
  "Google will name another issuer in the token",
  function (this: SpecWorld) {
    misbehave(this, { anotherIssuer: true });
  },
);

Given(
  "Google will issue the token to another site",
  function (this: SpecWorld) {
    misbehave(this, { anotherAudience: true });
  },
);

Given(
  "Google will issue the token already expired",
  function (this: SpecWorld) {
    misbehave(this, { expired: true });
  },
);

Given("Google will put another nonce in the token", function (this: SpecWorld) {
  misbehave(this, { nonce: "another" });
});

Given("Google will put no nonce in the token", function (this: SpecWorld) {
  misbehave(this, { nonce: "none" });
});

Given("Google will name no subject in the token", function (this: SpecWorld) {
  misbehave(this, { noSubject: true });
});

Given("Google will hang up on the exchange", function (this: SpecWorld) {
  misbehave(this, { hangUpOnTheExchange: true });
});

Given("Google will not answer for its keys", function (this: SpecWorld) {
  misbehave(this, { keys: "no answer" });
});

Given(
  "Google will answer for its keys with something that is not keys",
  function (this: SpecWorld) {
    misbehave(this, { keys: "not keys" });
  },
);

const whoCameBack = (world: SpecWorld): Promise<GoogleClaims> => {
  const { client, sent } = believingOf(world);
  assert.ok(sent !== undefined, "Nobody has been sent to Google.");
  return client.whoCameBack({
    code: sent.code,
    codeVerifier: sent.codeVerifier,
    redirectUri: REDIRECT_URI,
    nonce: sent.nonce,
  });
};

// Whatever came of it is kept for the scenario rather than thrown: most of
// these scenarios are about how it is refused.
const ask = async (world: SpecWorld): Promise<void> => {
  const those = believingOf(world);
  those.cameBack = undefined;
  world.failure = undefined;
  try {
    those.cameBack = await whoCameBack(world);
  } catch (failure) {
    world.failure = failure;
  }
};

When("who came back from Google is asked", async function (this: SpecWorld) {
  await ask(this);
});

When(
  "who came back from Google is asked again with the same code",
  async function (this: SpecWorld) {
    await ask(this);
  },
);

// Something the scenario builds on, so a refusal here is a scenario that is
// wrong about what it stands on, and is thrown.
Given(
  "who came back from Google has been asked",
  async function (this: SpecWorld) {
    await whoCameBack(this);
  },
);

const cameBackOf = (world: SpecWorld): GoogleClaims => {
  const cameBack = believingOf(world).cameBack;
  assert.ok(
    cameBack !== undefined,
    `Nobody came back: ${String(world.failure)}`,
  );
  return cameBack;
};

Then(
  "the reader is known to Google as {string}",
  function (this: SpecWorld, subject: string) {
    assert.equal(cameBackOf(this).subject, subject);
  },
);

Then(
  "the reader's email address is {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(cameBackOf(this).emailAddress, address);
  },
);

Then(
  "the reader's email address is said to be verified",
  function (this: SpecWorld) {
    assert.equal(cameBackOf(this).emailAddressVerified, true);
  },
);

Then(
  "the reader's email address is said not to be verified",
  function (this: SpecWorld) {
    assert.equal(cameBackOf(this).emailAddressVerified, false);
  },
);

Then("the reader is called {string}", function (this: SpecWorld, name: string) {
  assert.equal(cameBackOf(this).name, name);
});

Then("the reader has no name", function (this: SpecWorld) {
  assert.equal(cameBackOf(this).name, undefined);
});
