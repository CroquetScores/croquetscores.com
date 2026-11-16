// What stands in for Google in a scenario: a server of the run's own that plays
// Google's part in OpenID Connect, saying whatever the scenario has Google say.
//
// It answers where Google answers — the page a reader is sent to, the endpoint
// a code is exchanged at, and the keys a token is checked with — and signs what
// it says with a key made for the run. The site is told where it is, as it is
// told where Google is, and checks what it says exactly as it would check
// Google: so a scenario that passes has had its token's signature, issuer,
// audience, nonce and PKCE checked for real.
//
// It can be told to misbehave, one way at a time, so that a scenario can hold
// each of those checks to a token that fails it and nothing else.
import { Before, Given } from "@cucumber/cucumber";
import {
  createHash,
  generateKeyPairSync,
  randomUUID,
  sign,
  type KeyObject,
} from "node:crypto";
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type { AddressInfo } from "node:net";
import { strict as assert } from "node:assert";

import type { WebWorld } from "./world.js";

/** The credentials the scenarios' sites are given for Google. */
export const googleCredentialsForScenarios = {
  clientId: "the-scenarios-client",
  clientSecret: "the scenarios' client secret",
};

/** What Google says about the reader in a scenario, one thing to a step. */
interface GoogleSays {
  subject?: string;
  emailAddress?: string;
  verified?: boolean;
  /** Nothing where Google gives no name; absent where the scenario is silent. */
  name?: string | undefined;
  /** The reader will say no to Google when asked. */
  turnedDown?: boolean;
  /** Google will not answer the site. */
  unreachable?: boolean;
}

/** The one way the stand-in is to misbehave, if any. */
export interface Misbehaving {
  /** Signed with a key it does not publish, or not signed at all. */
  signing?: "unpublished" | "none";
  /** Naming another issuer than itself. */
  anotherIssuer?: boolean;
  /** Issued to another site than the one exchanging the code. */
  anotherAudience?: boolean;
  /** Expired before it is given. */
  expired?: boolean;
  /** Carrying another nonce than the one the reader was sent with, or none. */
  nonce?: "another" | "none";
  /** Naming nobody. */
  noSubject?: boolean;
  /** Hanging up on the exchange rather than answering it. */
  hangUpOnTheExchange?: boolean;
  /** Not answering for its keys, or answering with something else. */
  keys?: "no answer" | "not keys";
  /**
   * Taking a code again after it has been exchanged, as Google does not, so
   * that the site's own guard against a way back followed twice is all there
   * is to stop it.
   */
  takesCodesAgain?: boolean;
}

// What the scenario has Google say and how it is to behave: one scenario at a
// time to a worker, so one of each, emptied before every scenario.
let says: GoogleSays = {};
let misbehaving: Misbehaving = {};

Before(function () {
  says = {};
  misbehaving = {};
});

/** How the stand-in is to misbehave from now on. Nothing, until a scenario says. */
export const misbehave = (how: Misbehaving): void => {
  misbehaving = { ...misbehaving, ...how };
};

// Each thing Google says is asked for, rather than defaulted, so that a
// scenario leaving one out fails for that rather than for what a default did.
const identity = (): {
  subject: string;
  emailAddress: string;
  verified: boolean;
  name: string | undefined;
} => {
  assert.ok(says.subject !== undefined, "Google knows the reader as nobody.");
  assert.ok(says.emailAddress !== undefined, "Google gives no email address.");
  assert.ok(says.verified !== undefined, "Google says nothing of verifying.");
  assert.ok("name" in says, "Google says nothing of a name.");
  return {
    subject: says.subject,
    emailAddress: says.emailAddress,
    verified: says.verified,
    name: says.name,
  };
};

Given(
  "Google knows the reader as {string}",
  function (this: WebWorld, subject: string) {
    says.subject = subject;
  },
);

Given(
  "Google gives the email address {string}",
  function (this: WebWorld, address: string) {
    says.emailAddress = address;
  },
);

Given("Google has verified the email address", function () {
  says.verified = true;
});

Given("Google has not verified the email address", function () {
  says.verified = false;
});

Given(
  "Google calls the reader {string}",
  function (this: WebWorld, name: string) {
    says.name = name;
  },
);

Given("Google gives no name", function () {
  says.name = undefined;
});

Given("the reader will turn Google down", function () {
  says.turnedDown = true;
});

Given("Google cannot be reached", function () {
  says.unreachable = true;
});

// Keys made once for the run. The second is never published, and signs under
// the same key id as the first, so that a token signed with it is refused for
// its signature rather than for naming a key nobody has.
const published = generateKeyPairSync("rsa", { modulusLength: 2048 });
const unpublished = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = {
  ...published.publicKey.export({ format: "jwk" }),
  kid: "scenarios",
  alg: "RS256",
  use: "sig",
};

const base64url = (value: string | Buffer): string =>
  Buffer.from(value).toString("base64url");

const signed = (claims: object, key: KeyObject | undefined): string => {
  if (key === undefined) {
    return `${base64url(JSON.stringify({ alg: "none" }))}.${base64url(JSON.stringify(claims))}.`;
  }
  const unsigned = `${base64url(JSON.stringify({ alg: "RS256", kid: "scenarios" }))}.${base64url(JSON.stringify(claims))}`;
  return `${unsigned}.${base64url(sign("RSA-SHA256", Buffer.from(unsigned), key))}`;
};

// Who the code is for is asked of the scenario when the code is exchanged, not
// when it is given: a scenario about Google turning the site away never says
// who the reader is.
interface Issued {
  readonly nonce: string | undefined;
  readonly challenge: string | undefined;
}

const codes = new Map<string, Issued>();

interface Answer {
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly body: string;
}

/** Nothing said: the connection is dropped, as a service that hangs up does. */
const HANG_UP = Symbol("hang up");

const bodyOf = (request: IncomingMessage): Promise<URLSearchParams> =>
  new Promise((resolve, reject) => {
    let text = "";
    request.setEncoding("utf8");
    request.on("data", (chunk: string) => (text += chunk));
    request.on("end", () => resolve(new URLSearchParams(text)));
    request.on("error", reject);
  });

const json = (status: number, body: unknown): Answer => ({
  status,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

const HOUR_SECONDS = 60 * 60;

/** A code for whoever the scenario has Google say the reader is, made without the site having sent anybody. */
export const aCodeNobodyWasSentFor = (): string => {
  const code = randomUUID();
  codes.set(code, { nonce: undefined, challenge: undefined });
  return code;
};

// A good token, with the one thing about it changed that the scenario has it
// misbehave by, and nothing else.
const tokenFor = (issued: Issued, issuer: string): string => {
  const who = identity();
  const wrong = misbehaving;
  const now = Math.floor(Date.now() / 1000);
  const nonce =
    wrong.nonce === "another"
      ? randomUUID()
      : wrong.nonce === "none"
        ? undefined
        : issued.nonce;
  const claims = {
    iss:
      wrong.anotherIssuer === true ? "https://somebody-else.example" : issuer,
    aud:
      wrong.anotherAudience === true
        ? "another-sites-client"
        : googleCredentialsForScenarios.clientId,
    ...(wrong.noSubject === true ? {} : { sub: who.subject }),
    iat: wrong.expired === true ? now - 2 * HOUR_SECONDS : now,
    exp: wrong.expired === true ? now - HOUR_SECONDS : now + 5 * 60,
    email: who.emailAddress,
    email_verified: who.verified,
    ...(who.name === undefined ? {} : { name: who.name }),
    ...(nonce === undefined ? {} : { nonce }),
  };
  return signed(
    claims,
    wrong.signing === "none"
      ? undefined
      : wrong.signing === "unpublished"
        ? unpublished.privateKey
        : published.privateKey,
  );
};

const answer = async (
  request: IncomingMessage,
  at: string,
): Promise<Answer | typeof HANG_UP> => {
  const url = new URL(request.url ?? "/", at);

  if (url.pathname === "/keys") {
    if (misbehaving.keys === "no answer") return HANG_UP;
    if (misbehaving.keys === "not keys") {
      return json(200, { these: "are not keys" });
    }
    return json(200, { keys: [jwk] });
  }

  if (url.pathname === "/authorize") {
    const back = new URL(url.searchParams.get("redirect_uri") ?? "");
    back.searchParams.set("state", url.searchParams.get("state") ?? "");
    if (says.turnedDown === true) {
      back.searchParams.set("error", "access_denied");
    } else {
      const code = randomUUID();
      codes.set(code, {
        nonce: url.searchParams.get("nonce") ?? undefined,
        challenge: url.searchParams.get("code_challenge") ?? undefined,
      });
      back.searchParams.set("code", code);
    }
    return { status: 302, headers: { location: back.toString() }, body: "" };
  }

  if (url.pathname === "/token" && request.method === "POST") {
    if (misbehaving.hangUpOnTheExchange === true) return HANG_UP;
    // Google being away, as the site sees it: the back channel fails.
    if (says.unreachable === true) return json(503, {});

    const form = await bodyOf(request);
    const code = form.get("code") ?? "";
    const issued = codes.get(code);
    // A code is good once, as Google's is, unless the scenario says not.
    if (misbehaving.takesCodesAgain !== true) codes.delete(code);
    const verifier = form.get("code_verifier") ?? "";
    if (
      issued === undefined ||
      form.get("client_id") !== googleCredentialsForScenarios.clientId ||
      form.get("client_secret") !==
        googleCredentialsForScenarios.clientSecret ||
      issued.challenge === undefined ||
      createHash("sha256").update(verifier).digest("base64url") !==
        issued.challenge
    ) {
      return json(400, { error: "invalid_grant" });
    }
    return json(200, {
      access_token: randomUUID(),
      token_type: "Bearer",
      expires_in: 3600,
      id_token: tokenFor(issued, at),
    });
  }

  return json(404, {});
};

const send = (
  response: ServerResponse,
  said: Answer | typeof HANG_UP,
): void => {
  if (said === HANG_UP) {
    response.socket?.destroy();
    return;
  }
  response.writeHead(said.status, said.headers).end(said.body);
};

let standingIn: { server: Server; at: string } | undefined;

/** Starts the stand-in for the run, if it is not started, and says where it answers. */
export const startStandInGoogle = async (): Promise<string> => {
  if (standingIn !== undefined) return standingIn.at;
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const at = `http://127.0.0.1:${String((server.address() as AddressInfo).port)}`;
  server.on("request", (request, response) => {
    answer(request, at).then(
      (said) => send(response, said),
      (failure: unknown) => response.writeHead(500).end(String(failure)),
    );
  });
  standingIn = { server, at };
  return at;
};

/** Stops the stand-in, with the run. */
export const stopStandInGoogle = async (): Promise<void> => {
  const stopping = standingIn;
  standingIn = undefined;
  if (stopping === undefined) return;
  stopping.server.closeAllConnections();
  await new Promise<void>((resolve) => stopping.server.close(() => resolve()));
};
