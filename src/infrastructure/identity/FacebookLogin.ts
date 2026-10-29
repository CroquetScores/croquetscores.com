// Facebook's sign-in, as OAuth 2.0: where to send a reader, and who they are
// once Facebook has sent them back with a code.
//
// Facebook sends no signed token on the web that can be checked here, as Google
// does, so the site asks. The code is exchanged for an access token over the
// back channel, from here to Facebook with the site's own secret, and the
// access token is used to ask Facebook's Graph for the reader's id, name and
// email address. What the Graph answers is believed, and nothing the reader
// could have written in their address bar. The code is what ties the answer
// to this sign-in: Facebook gives a token for it once, to the site it was made
// for, and for the return address it was asked for with.
//
// The Graph is asked with proof of the site's secret as well (the access token
// signed with it), which Facebook can be set to require, so that an access
// token taken from the site's traffic is of no use from anywhere else.
import { createHmac } from "node:crypto";

import { Refused } from "../../domain/common/Refused.js";

/** Where Facebook answers. Facebook's own, unless a scenario stands one in. */
export interface FacebookEndpoints {
  readonly authorization: string;
  readonly token: string;
  /** Where the Graph is asked who the reader is. */
  readonly me: string;
}

// The version of the Graph the site is written against, in each address.
// Facebook supports a version for about two years and then answers as the
// oldest it still supports, so it is said here, once, to be moved on by hand.
const GRAPH_VERSION = "v23.0";

export const facebooksOwnEndpoints: FacebookEndpoints = {
  authorization: `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth`,
  token: `https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`,
  me: `https://graph.facebook.com/${GRAPH_VERSION}/me`,
};

export interface FacebookCredentials {
  readonly appId: string;
  readonly appSecret: string;
}

/** Who Facebook says the reader is. */
export interface FacebookClaims {
  readonly facebookId: string;
  /** Nothing where Facebook gives none. */
  readonly emailAddress: string | undefined;
  readonly name: string;
}

/** Why Facebook's answer was not believed, or could not be had. */
export type FacebookLoginErrorCode =
  "Facebook.Unreachable" | "Facebook.Refused";

export class FacebookLoginFailed extends Refused<FacebookLoginErrorCode> {}

/** How long Facebook is waited for before it is taken to be unreachable. */
const WAIT_MILLISECONDS = 5000;

export class FacebookLogin {
  constructor(
    private readonly credentials: FacebookCredentials,
    private readonly endpoints: FacebookEndpoints = facebooksOwnEndpoints,
  ) {}

  /** Where to send a reader to sign in with Facebook. */
  whereToSend(asking: {
    readonly redirectUri: string;
    readonly state: string;
  }): string {
    const url = new URL(this.endpoints.authorization);
    url.search = new URLSearchParams({
      client_id: this.credentials.appId,
      redirect_uri: asking.redirectUri,
      response_type: "code",
      scope: "public_profile,email",
      state: asking.state,
    }).toString();
    return url.toString();
  }

  /**
   * Who the reader is, from the code Facebook sent them back with. Throws
   * `Facebook.Unreachable` when Facebook could not be asked, and
   * `Facebook.Refused` when what it answered is not to be believed.
   */
  async whoCameBack(returned: {
    readonly code: string;
    readonly redirectUri: string;
  }): Promise<FacebookClaims> {
    const accessToken = await this.#exchange(returned);
    const said = await this.#askWho(accessToken);

    const { id, name, email } = said;
    if (typeof id !== "string" || id === "") {
      throw new FacebookLoginFailed(
        "Facebook.Refused",
        "Facebook's answer names nobody.",
      );
    }
    if (typeof name !== "string" || name.trim() === "") {
      throw new FacebookLoginFailed(
        "Facebook.Refused",
        "Facebook's answer gives no name.",
      );
    }
    return {
      facebookId: id,
      emailAddress:
        typeof email === "string" && email.trim() !== "" ? email : undefined,
      name,
    };
  }

  async #exchange(returned: {
    readonly code: string;
    readonly redirectUri: string;
  }): Promise<string> {
    const response = await this.#fetch(
      this.endpoints.token,
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: returned.code,
          redirect_uri: returned.redirectUri,
          client_id: this.credentials.appId,
          client_secret: this.credentials.appSecret,
        }),
      },
      "for the token",
    );
    const body = (await response.json().catch(() => ({}))) as {
      access_token?: unknown;
    };
    // Facebook failing is Facebook being away; Facebook refusing the code is a
    // code that was not good, which is the reader's sign-in and not
    // Facebook's health.
    if (!response.ok || typeof body.access_token !== "string") {
      throw new FacebookLoginFailed(
        "Facebook.Refused",
        `Facebook did not give a token: ${response.status}.`,
      );
    }
    return body.access_token;
  }

  async #askWho(accessToken: string): Promise<Record<string, unknown>> {
    const url = new URL(this.endpoints.me);
    url.search = new URLSearchParams({
      fields: "id,name,email",
      access_token: accessToken,
      appsecret_proof: createHmac("sha256", this.credentials.appSecret)
        .update(accessToken)
        .digest("hex"),
    }).toString();
    const response = await this.#fetch(
      url.toString(),
      { method: "GET" },
      "about the reader",
    );
    if (!response.ok) {
      throw new FacebookLoginFailed(
        "Facebook.Refused",
        `Facebook would not say who the reader is: ${response.status}.`,
      );
    }
    const body: unknown = await response.json().catch(() => undefined);
    // Something that is not an answer at all is Facebook being unwell, and not
    // the sign-in being bad.
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new FacebookLoginFailed(
        "Facebook.Unreachable",
        "Facebook answered about the reader with something that is not an answer.",
      );
    }
    return body as Record<string, unknown>;
  }

  // Asks, and takes Facebook not answering, or answering with a failure of its
  // own, to be Facebook away.
  async #fetch(
    url: string,
    init: RequestInit,
    what: string,
  ): Promise<Response> {
    let response: Response;
    try {
      response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(WAIT_MILLISECONDS),
      });
    } catch {
      throw new FacebookLoginFailed(
        "Facebook.Unreachable",
        `Facebook could not be asked ${what}.`,
      );
    }
    if (response.status >= 500) {
      throw new FacebookLoginFailed(
        "Facebook.Unreachable",
        `Facebook answered ${response.status} ${what}.`,
      );
    }
    return response;
  }
}
