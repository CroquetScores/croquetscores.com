// What stands in for Facebook in a scenario: a server of the scenario's own
// that plays Facebook's part in OAuth, saying whatever the scenario has
// Facebook say (specs/support/facebook.ts).
//
// It answers where Facebook answers — the page a reader is sent to, the
// endpoint a code is exchanged at, and the Graph's question about who the
// reader is — and checks what the site sends it as Facebook would: the code,
// the app, its secret, the return address, and where it is asked to, the proof
// of the secret. The site is pointed at it, so a scenario that passes has
// been through the same asking it would make of Facebook.
//
// It can be told to misbehave, one way at a time, so that a scenario can hold
// each check to an answer that fails it and nothing else
// (FacebookLogin.feature).
//
// Here rather than beside the browser's support for the reason Google's is
// (`google.ts`).
import { After } from "@cucumber/cucumber";
import { createHmac, randomUUID } from "node:crypto";
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type { AddressInfo } from "node:net";

import type { FacebookEndpoints } from "../../../src/infrastructure/identity/FacebookLogin.js";
import {
  facebookSaysFor,
  identitySaidFor,
  type FacebookIdentityAsSaid,
} from "../../support/facebook.js";
import type { SpecWorld } from "../../support/world.js";

/** The credentials the scenarios' sites are given for Facebook. */
export const facebookCredentialsForScenarios = {
  appId: "the-scenarios-app",
  appSecret: "the scenarios' app secret",
};

/** The one way the stand-in is to misbehave, if any. */
export interface Misbehaving {
  /** Asking for proof of the site's secret in every question about a reader. */
  requiresProof?: boolean;
  /** Not accepting the proof, however it is made. */
  rejectsProof?: boolean;
  /** Not accepting the access token it gave. */
  refusesAccessToken?: boolean;
  /** Answering the exchange with nothing to use. */
  givesNoAccessToken?: boolean;
  /** Naming nobody, or not naming the reader. */
  givesNoId?: boolean;
  givesNoName?: boolean;
  /** Making the code for another site than the one exchanging it. */
  codeForAnotherSite?: boolean;
  hangsUpOnTheExchange?: boolean;
  /** Answering the exchange with something that is not an answer. */
  answersTheExchangeWithNonsense?: boolean;
  hangsUpOnTheQuestion?: boolean;
  /** Answering the question about the reader with a failure of its own. */
  answersTheQuestionWithAnError?: boolean;
  /** Answering the question about the reader with something that is not one. */
  answersTheQuestionWithNonsense?: boolean;
  /**
   * Taking a code again after it has been exchanged, as Facebook does not, so
   * that the site's own guard against a way back followed twice is all there
   * is to stop it.
   */
  takesCodesAgain?: boolean;
}

interface Issued {
  readonly clientId: string;
  readonly redirectUri: string;
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

export class StandInFacebook {
  readonly #codes = new Map<string, Issued>();
  readonly #accessTokens = new Set<string>();

  /** How it is to misbehave from now on. Nothing, until a scenario says. */
  misbehaving: Misbehaving = {};

  private constructor(
    private readonly world: SpecWorld,
    private readonly server: Server,
    readonly endpoints: FacebookEndpoints,
  ) {}

  static async start(world: SpecWorld): Promise<StandInFacebook> {
    // Made before the stand-in it answers for, which needs its port: until
    // then there is nobody to answer.
    const answering: { facebook?: StandInFacebook } = {};
    const server = createServer((request, response) => {
      const facebook = answering.facebook;
      if (facebook === undefined) {
        response.writeHead(503).end();
        return;
      }
      facebook.answer(request).then(
        (answer) => send(response, answer),
        (failure: unknown) => response.writeHead(500).end(String(failure)),
      );
    });
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const { port } = server.address() as AddressInfo;
    const at = `http://127.0.0.1:${port}`;
    const facebook = new StandInFacebook(world, server, {
      authorization: `${at}/authorize`,
      token: `${at}/token`,
      me: `${at}/me`,
    });
    answering.facebook = facebook;
    return facebook;
  }

  /**
   * A code for whoever the scenario has Facebook say the reader is, made
   * without the site having sent anybody: what a page elsewhere would have to
   * hand.
   */
  aCodeNobodyWasSentFor(redirectUri: string): string {
    const code = randomUUID();
    this.#codes.set(code, {
      clientId: facebookCredentialsForScenarios.appId,
      redirectUri,
    });
    return code;
  }

  // Every connection closed first: whatever asked the stand-in may keep one
  // open to ask again, and a server waits for those before it closes.
  stop(): Promise<void> {
    this.server.closeAllConnections();
    return new Promise((resolve) => this.server.close(() => resolve()));
  }

  async answer(request: IncomingMessage): Promise<Answer | typeof HANG_UP> {
    const url = new URL(request.url ?? "/", this.endpoints.authorization);
    const says = facebookSaysFor(this.world);

    if (url.pathname === "/authorize") {
      const back = new URL(url.searchParams.get("redirect_uri") ?? "");
      back.searchParams.set("state", url.searchParams.get("state") ?? "");
      if (says.turnedDown === true) {
        back.searchParams.set("error", "access_denied");
      } else {
        const code = randomUUID();
        this.#codes.set(code, {
          clientId: url.searchParams.get("client_id") ?? "",
          redirectUri: url.searchParams.get("redirect_uri") ?? "",
        });
        back.searchParams.set("code", code);
      }
      return { status: 302, headers: { location: back.toString() }, body: "" };
    }

    if (url.pathname === "/token" && request.method === "POST") {
      if (this.misbehaving.hangsUpOnTheExchange === true) return HANG_UP;
      // Facebook being away, as the site sees it: the back channel fails.
      if (says.unreachable === true) return json(503, {});

      const form = await bodyOf(request);
      const code = form.get("code") ?? "";
      const issued = this.#codes.get(code);
      // A code is good once, as Facebook's is, unless the scenario says not.
      if (this.misbehaving.takesCodesAgain !== true) this.#codes.delete(code);
      if (
        issued === undefined ||
        // Said when the code is exchanged and not when it is made, since a
        // scenario says it after the reader has been sent.
        this.misbehaving.codeForAnotherSite === true ||
        issued.clientId !== facebookCredentialsForScenarios.appId ||
        form.get("client_id") !== facebookCredentialsForScenarios.appId ||
        form.get("client_secret") !==
          facebookCredentialsForScenarios.appSecret ||
        form.get("redirect_uri") !== issued.redirectUri
      ) {
        return json(400, { error: { message: "invalid code", code: 100 } });
      }
      if (this.misbehaving.answersTheExchangeWithNonsense === true) {
        return { status: 200, headers: {}, body: "this is not an answer" };
      }
      if (this.misbehaving.givesNoAccessToken === true) return json(200, {});
      const accessToken = randomUUID();
      this.#accessTokens.add(accessToken);
      return json(200, {
        access_token: accessToken,
        token_type: "bearer",
        expires_in: 5183944,
      });
    }

    if (url.pathname === "/me" && request.method === "GET") {
      if (this.misbehaving.hangsUpOnTheQuestion === true) return HANG_UP;
      if (this.misbehaving.answersTheQuestionWithAnError === true) {
        return json(500, { error: { message: "an unexpected error" } });
      }
      if (this.misbehaving.answersTheQuestionWithNonsense === true) {
        return { status: 200, headers: {}, body: "this is not an answer" };
      }
      const token = url.searchParams.get("access_token") ?? "";
      if (
        this.misbehaving.refusesAccessToken === true ||
        !this.#accessTokens.has(token)
      ) {
        return json(400, { error: { message: "invalid token", code: 190 } });
      }
      if (this.misbehaving.requiresProof === true) {
        const proof = createHmac(
          "sha256",
          facebookCredentialsForScenarios.appSecret,
        )
          .update(token)
          .digest("hex");
        if (
          this.misbehaving.rejectsProof === true ||
          url.searchParams.get("appsecret_proof") !== proof
        ) {
          return json(400, { error: { message: "bad proof", code: 100 } });
        }
      }
      const identity: FacebookIdentityAsSaid = identitySaidFor(this.world);
      return json(200, {
        ...(this.misbehaving.givesNoId === true
          ? {}
          : { id: identity.facebookId }),
        ...(this.misbehaving.givesNoName === true
          ? {}
          : { name: identity.name }),
        ...(identity.emailAddress === undefined
          ? {}
          : { email: identity.emailAddress }),
      });
    }

    return json(404, {});
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

const standing = new WeakMap<SpecWorld, StandInFacebook>();

/**
 * The scenario's stand-in for Facebook, started the first time it is asked
 * for and stopped when the scenario is over.
 */
export const standInFacebookFor = async (
  world: SpecWorld,
): Promise<StandInFacebook> => {
  const found = standing.get(world);
  if (found !== undefined) return found;
  const facebook = await StandInFacebook.start(world);
  standing.set(world, facebook);
  return facebook;
};

// Stopped by a hook of its own rather than with the scenario's database,
// since a scenario about believing Facebook has no database to be stopped
// with.
After(async function (this: SpecWorld) {
  const facebook = standing.get(this);
  if (facebook === undefined) return;
  standing.delete(this);
  await facebook.stop();
});
