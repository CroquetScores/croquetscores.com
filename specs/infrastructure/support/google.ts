// What stands in for Google in a scenario: a server of the scenario's own that
// plays Google's part in OpenID Connect, saying whatever the scenario has
// Google say (specs/support/google.ts).
//
// It answers where Google answers — the page a reader is sent to, the endpoint
// a code is exchanged at, and the keys a token is checked with — and signs what
// it says with a key made for the run. The site is pointed at it and checks
// what it says exactly as it would check Google, so a scenario that passes has
// had its token's signature, issuer, audience, nonce and PKCE checked for real.
//
// It can be told to misbehave, one way at a time, so that a scenario can hold
// each of those checks to a token that fails it and nothing else
// (GoogleOpenIdConnect.feature).
//
// Here rather than beside the browser's support because the feature about
// believing Google is infrastructure's, and the browser's support may reach
// into infrastructure's where infrastructure's may not reach into the web's.
import { After } from "@cucumber/cucumber";
import { createHash, randomUUID } from "node:crypto";
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type { AddressInfo } from "node:net";

import {
  exportJWK,
  generateKeyPair,
  SignJWT,
  UnsecuredJWT,
  type CryptoKey,
  type JWK,
  type JWTPayload,
} from "jose";

import type { GoogleEndpoints } from "../../../src/infrastructure/identity/GoogleOpenIdConnect.js";
import {
  googleSaysFor,
  identitySaidFor,
  type GoogleIdentityAsSaid,
} from "../../support/google.js";
import type { SpecWorld } from "../../support/world.js";

/** The credentials the scenarios' sites are given for Google. */
export const googleCredentialsForScenarios = {
  clientId: "the-scenarios-client",
  clientSecret: "the scenarios' client secret",
};

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
}

// Keys made once for the run: making one is slow enough to notice, and a
// scenario is not about which key it is. The second is never published, and
// signs under the same key id as the first, so that a token signed with it is
// refused for its signature rather than for naming a key nobody has.
interface Keys {
  readonly published: CryptoKey;
  readonly unpublished: CryptoKey;
  readonly jwk: JWK;
}

let making: Promise<Keys> | undefined;

const theKeys = (): Promise<Keys> => {
  making ??= (async () => {
    const published = await generateKeyPair("RS256");
    const unpublished = await generateKeyPair("RS256");
    return {
      published: published.privateKey,
      unpublished: unpublished.privateKey,
      jwk: {
        ...(await exportJWK(published.publicKey)),
        kid: "scenarios",
        alg: "RS256",
      },
    };
  })();
  return making;
};

// Who the code is for is asked of the scenario when the code is exchanged, not
// when it is given: a scenario about Google turning the site away never says
// who the reader is.
interface Issued {
  readonly nonce: string | undefined;
  readonly challenge: string | undefined;
}

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

export class StandInGoogle {
  readonly #codes = new Map<string, Issued>();

  /** How it is to misbehave from now on. Nothing, until a scenario says. */
  misbehaving: Misbehaving = {};

  private constructor(
    private readonly world: SpecWorld,
    private readonly server: Server,
    readonly endpoints: GoogleEndpoints,
  ) {}

  static async start(world: SpecWorld): Promise<StandInGoogle> {
    // Made before the stand-in it answers for, which needs its port: until
    // then there is nobody to answer.
    const answering: { google?: StandInGoogle } = {};
    const server = createServer((request, response) => {
      const google = answering.google;
      if (google === undefined) {
        response.writeHead(503).end();
        return;
      }
      google.answer(request).then(
        (answer) => send(response, answer),
        (failure: unknown) => response.writeHead(500).end(String(failure)),
      );
    });
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const { port } = server.address() as AddressInfo;
    const at = `http://127.0.0.1:${port}`;
    const google = new StandInGoogle(world, server, {
      issuers: [at],
      authorization: `${at}/authorize`,
      token: `${at}/token`,
      keys: `${at}/keys`,
    });
    answering.google = google;
    return google;
  }

  /**
   * A code for whoever the scenario has Google say the reader is, made without
   * the site having sent anybody: what a page elsewhere would have to hand.
   */
  aCodeNobodyWasSentFor(): string {
    const code = randomUUID();
    this.#codes.set(code, { nonce: undefined, challenge: undefined });
    return code;
  }

  // Every connection closed first: whatever asked the stand-in may keep one
  // open to ask again, and a server waits for those before it closes.
  stop(): Promise<void> {
    this.server.closeAllConnections();
    return new Promise((resolve) => this.server.close(() => resolve()));
  }

  async answer(request: IncomingMessage): Promise<Answer | typeof HANG_UP> {
    const url = new URL(request.url ?? "/", this.endpoints.issuers[0]);
    const says = googleSaysFor(this.world);

    if (url.pathname === "/keys") {
      if (this.misbehaving.keys === "no answer") return HANG_UP;
      if (this.misbehaving.keys === "not keys") {
        return json(200, { these: "are not keys" });
      }
      return json(200, { keys: [(await theKeys()).jwk] });
    }

    if (url.pathname === "/authorize") {
      const back = new URL(url.searchParams.get("redirect_uri") ?? "");
      back.searchParams.set("state", url.searchParams.get("state") ?? "");
      if (says.turnedDown === true) {
        back.searchParams.set("error", "access_denied");
      } else {
        const code = randomUUID();
        this.#codes.set(code, {
          nonce: url.searchParams.get("nonce") ?? undefined,
          challenge: url.searchParams.get("code_challenge") ?? undefined,
        });
        back.searchParams.set("code", code);
      }
      return { status: 302, headers: { location: back.toString() }, body: "" };
    }

    if (url.pathname === "/token" && request.method === "POST") {
      if (this.misbehaving.hangUpOnTheExchange === true) return HANG_UP;
      // Google being away, as the site sees it: the back channel fails.
      if (says.unreachable === true) return json(503, {});

      const form = await bodyOf(request);
      const code = form.get("code") ?? "";
      const issued = this.#codes.get(code);
      // A code is good once, as Google's is.
      this.#codes.delete(code);
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
        id_token: await this.#tokenFor(issued),
      });
    }

    return json(404, {});
  }

  // A good token, with the one thing about it changed that the scenario has
  // it misbehave by, and nothing else.
  async #tokenFor(issued: Issued): Promise<string> {
    const identity: GoogleIdentityAsSaid = identitySaidFor(this.world);
    const wrong = this.misbehaving;
    const now = Math.floor(Date.now() / 1000);
    const nonce =
      wrong.nonce === "another"
        ? randomUUID()
        : wrong.nonce === "none"
          ? undefined
          : issued.nonce;

    const claims: JWTPayload = {
      iss:
        wrong.anotherIssuer === true
          ? "https://somebody-else.example"
          : (this.endpoints.issuers[0] ?? ""),
      aud:
        wrong.anotherAudience === true
          ? "another-sites-client"
          : googleCredentialsForScenarios.clientId,
      ...(wrong.noSubject === true ? {} : { sub: identity.subject }),
      iat: wrong.expired === true ? now - 2 * HOUR_SECONDS : now,
      exp: wrong.expired === true ? now - HOUR_SECONDS : now + 5 * 60,
      email: identity.emailAddress,
      email_verified: identity.verified,
      ...(identity.name === undefined ? {} : { name: identity.name }),
      ...(nonce === undefined ? {} : { nonce }),
    };

    if (wrong.signing === "none") return new UnsecuredJWT(claims).encode();
    const keys = await theKeys();
    return new SignJWT(claims)
      .setProtectedHeader({ alg: "RS256", kid: "scenarios" })
      .sign(
        wrong.signing === "unpublished" ? keys.unpublished : keys.published,
      );
  }
}

const send = (
  response: ServerResponse,
  answer: Answer | typeof HANG_UP,
): void => {
  if (answer === HANG_UP) {
    response.socket?.destroy();
    return;
  }
  response.writeHead(answer.status, answer.headers).end(answer.body);
};

const standing = new WeakMap<SpecWorld, StandInGoogle>();

/**
 * The scenario's stand-in for Google, started the first time it is asked for
 * and stopped when the scenario is over.
 */
export const standInGoogleFor = async (
  world: SpecWorld,
): Promise<StandInGoogle> => {
  const found = standing.get(world);
  if (found !== undefined) return found;
  const google = await StandInGoogle.start(world);
  standing.set(world, google);
  return google;
};

// Stopped by a hook of its own rather than with the scenario's database,
// since a scenario about believing Google has no database to be stopped with.
After(async function (this: SpecWorld) {
  const google = standing.get(this);
  if (google === undefined) return;
  standing.delete(this);
  await google.stop();
});
