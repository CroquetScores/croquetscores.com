// What stands in for Google in a browser scenario: a server of the scenario's
// own that plays Google's part in OpenID Connect, saying whatever the scenario
// has Google say (specs/support/google.ts).
//
// It answers where Google answers — the page a reader is sent to, the endpoint
// a code is exchanged at, and the keys a token is checked with — and signs what
// it says with a key made for the run. The site is pointed at it and checks
// what it says exactly as it would check Google, so a scenario that passes has
// had its token's signature, issuer, audience, nonce and PKCE checked for real.
//
// The reader's browser is sent to it and comes straight back: there is nothing
// to sign in to, only an answer to give.
import { createHash, randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type Server } from "node:http";
import type { AddressInfo } from "node:net";

import {
  exportJWK,
  generateKeyPair,
  SignJWT,
  type CryptoKey,
  type JWK,
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

// One key for the run: making one is slow enough to notice, and a scenario is
// not about which key it is.
let signing: Promise<{ privateKey: CryptoKey; jwk: JWK }> | undefined;

const theKey = (): Promise<{ privateKey: CryptoKey; jwk: JWK }> => {
  signing ??= (async () => {
    const { privateKey, publicKey } = await generateKeyPair("RS256");
    return {
      privateKey,
      jwk: { ...(await exportJWK(publicKey)), kid: "scenarios", alg: "RS256" },
    };
  })();
  return signing;
};

// Who the code is for is asked of the scenario when the code is exchanged, not
// when it is given: a scenario about Google turning the site away never says
// who the reader is.
interface Issued {
  readonly nonce: string | undefined;
  readonly challenge: string | undefined;
}

const bodyOf = (request: IncomingMessage): Promise<URLSearchParams> =>
  new Promise((resolve, reject) => {
    let text = "";
    request.setEncoding("utf8");
    request.on("data", (chunk: string) => (text += chunk));
    request.on("end", () => resolve(new URLSearchParams(text)));
    request.on("error", reject);
  });

export class StandInGoogle {
  readonly #codes = new Map<string, Issued>();

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
        ({ status, headers, body }) =>
          response.writeHead(status, headers).end(body),
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

  stop(): Promise<void> {
    return new Promise((resolve) => this.server.close(() => resolve()));
  }

  async answer(request: IncomingMessage): Promise<{
    status: number;
    headers: Record<string, string>;
    body: string;
  }> {
    const url = new URL(request.url ?? "/", this.endpoints.issuers[0]);
    const says = googleSaysFor(this.world);

    if (url.pathname === "/keys") {
      return json(200, { keys: [(await theKey()).jwk] });
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

  async #tokenFor(issued: Issued): Promise<string> {
    const identity: GoogleIdentityAsSaid = identitySaidFor(this.world);
    const { privateKey } = await theKey();
    return new SignJWT({
      email: identity.emailAddress,
      email_verified: identity.verified,
      ...(identity.name === undefined ? {} : { name: identity.name }),
      ...(issued.nonce === undefined ? {} : { nonce: issued.nonce }),
    })
      .setProtectedHeader({ alg: "RS256", kid: "scenarios" })
      .setIssuer(this.endpoints.issuers[0] ?? "")
      .setAudience(googleCredentialsForScenarios.clientId)
      .setSubject(identity.subject)
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(privateKey);
  }
}

const json = (
  status: number,
  body: unknown,
): { status: number; headers: Record<string, string>; body: string } => ({
  status,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

const standing = new WeakMap<SpecWorld, StandInGoogle>();

/**
 * The scenario's stand-in for Google, started the first time it is asked for
 * and stopped with the scenario's database, before the drop.
 */
export const standInGoogleFor = async (
  world: SpecWorld,
): Promise<StandInGoogle> => {
  const found = standing.get(world);
  if (found !== undefined) return found;
  const google = await StandInGoogle.start(world);
  standing.set(world, google);
  world.closeBeforeDropping.push(() => google.stop());
  return google;
};
