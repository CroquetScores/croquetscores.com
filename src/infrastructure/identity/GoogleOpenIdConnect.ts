// Google's sign-in, as OpenID Connect: where to send a reader, and who they
// are once Google has sent them back with a code.
//
// The code is exchanged for an ID token over the back channel, from here to
// Google with the site's own secret, and the token is checked against Google's
// published keys: its signature, that Google issued it, that it was issued to
// this site, that it has not expired, and that it carries the nonce this site
// sent the reader with. Only then is anything it says believed. PKCE rides
// along as well, so that a code taken from the reader's address bar is no use
// without the verifier that stayed in their browser's cookie.
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { Refused } from "../../domain/common/Refused.js";

/** Where Google answers. Google's own, unless a scenario stands one in. */
export interface GoogleEndpoints {
  /** Every issuer Google's tokens may name. */
  readonly issuers: readonly string[];
  readonly authorization: string;
  readonly token: string;
  readonly keys: string;
}

// From Google's discovery document. Written here rather than fetched from it
// as the application starts, so that Google being down then does not stop the
// site starting; they have not changed in years, and a token that fails to
// check against them is refused rather than believed.
export const googlesOwnEndpoints: GoogleEndpoints = {
  issuers: ["https://accounts.google.com", "accounts.google.com"],
  authorization: "https://accounts.google.com/o/oauth2/v2/auth",
  token: "https://oauth2.googleapis.com/token",
  keys: "https://www.googleapis.com/oauth2/v3/certs",
};

export interface GoogleCredentials {
  readonly clientId: string;
  readonly clientSecret: string;
}

/** Who Google says the reader is. */
export interface GoogleClaims {
  readonly subject: string;
  readonly emailAddress: string;
  readonly emailAddressVerified: boolean;
  readonly name: string | undefined;
}

/** Why Google's answer was not believed, or could not be had. */
export type GoogleOpenIdConnectErrorCode =
  "Google.Unreachable" | "Google.Refused";

export class GoogleOpenIdConnectFailed extends Refused<GoogleOpenIdConnectErrorCode> {}

/** How long Google is waited for before it is taken to be unreachable. */
const WAIT_MILLISECONDS = 5000;

export class GoogleOpenIdConnect {
  readonly #keys: ReturnType<typeof createRemoteJWKSet>;

  constructor(
    private readonly credentials: GoogleCredentials,
    private readonly endpoints: GoogleEndpoints = googlesOwnEndpoints,
  ) {
    // Fetched when first needed and kept, and fetched again when a token names
    // a key it has not seen, which is how Google rotating its keys is followed.
    this.#keys = createRemoteJWKSet(new URL(endpoints.keys), {
      timeoutDuration: WAIT_MILLISECONDS,
    });
  }

  /** Where to send a reader to sign in with Google. */
  whereToSend(asking: {
    readonly redirectUri: string;
    readonly state: string;
    readonly nonce: string;
    readonly codeChallenge: string;
  }): string {
    const url = new URL(this.endpoints.authorization);
    url.search = new URLSearchParams({
      client_id: this.credentials.clientId,
      redirect_uri: asking.redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state: asking.state,
      nonce: asking.nonce,
      code_challenge: asking.codeChallenge,
      code_challenge_method: "S256",
    }).toString();
    return url.toString();
  }

  /**
   * Who the reader is, from the code Google sent them back with. Throws
   * `Google.Unreachable` when Google could not be asked, and `Google.Refused`
   * when what it answered is not to be believed.
   */
  async whoCameBack(returned: {
    readonly code: string;
    readonly codeVerifier: string;
    readonly redirectUri: string;
    readonly nonce: string;
  }): Promise<GoogleClaims> {
    const idToken = await this.#exchange(returned);

    let payload: JWTPayload;
    try {
      ({ payload } = await jwtVerify(idToken, this.#keys, {
        issuer: [...this.endpoints.issuers],
        audience: this.credentials.clientId,
      }));
    } catch (failure) {
      // The keys themselves not arriving is Google being away, not a token
      // being bad.
      if (isUnreachable(failure)) {
        throw new GoogleOpenIdConnectFailed(
          "Google.Unreachable",
          "Google's keys could not be fetched.",
        );
      }
      throw new GoogleOpenIdConnectFailed(
        "Google.Refused",
        `Google's token did not check: ${String(failure)}`,
      );
    }

    if (payload["nonce"] !== returned.nonce) {
      throw new GoogleOpenIdConnectFailed(
        "Google.Refused",
        "Google's token was not made for this sign-in.",
      );
    }
    const { sub, email } = payload;
    if (typeof sub !== "string" || typeof email !== "string") {
      throw new GoogleOpenIdConnectFailed(
        "Google.Refused",
        "Google's token names nobody.",
      );
    }
    const name = payload["name"];
    return {
      subject: sub,
      emailAddress: email,
      // Only a plain true is a yes: anything else Google might say is not.
      emailAddressVerified: payload["email_verified"] === true,
      name: typeof name === "string" && name.trim() !== "" ? name : undefined,
    };
  }

  async #exchange(returned: {
    readonly code: string;
    readonly codeVerifier: string;
    readonly redirectUri: string;
  }): Promise<string> {
    let response: Response;
    try {
      response = await fetch(this.endpoints.token, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: returned.code,
          code_verifier: returned.codeVerifier,
          redirect_uri: returned.redirectUri,
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
        }),
        signal: AbortSignal.timeout(WAIT_MILLISECONDS),
      });
    } catch {
      throw new GoogleOpenIdConnectFailed(
        "Google.Unreachable",
        "Google could not be asked for the token.",
      );
    }
    // Google failing is Google being away; Google refusing the code is a code
    // that was not good, which is the reader's sign-in and not Google's health.
    if (response.status >= 500) {
      throw new GoogleOpenIdConnectFailed(
        "Google.Unreachable",
        `Google answered ${response.status}.`,
      );
    }
    const body = (await response.json().catch(() => ({}))) as {
      id_token?: unknown;
    };
    if (!response.ok || typeof body.id_token !== "string") {
      throw new GoogleOpenIdConnectFailed(
        "Google.Refused",
        `Google did not give a token: ${response.status}.`,
      );
    }
    return body.id_token;
  }
}

// A key set that could not be had: the fetch itself failing, which is a
// TypeError; jose giving up on it, timed out or not answered with 200; or an
// answer that is not a key set at all. Each is Google being unwell rather than
// the token being bad. Anything else — no key matching the token's, or a
// signature, an issuer, an audience or an expiry that does not check — is the
// token.
const isUnreachable = (failure: unknown): boolean => {
  if (failure instanceof TypeError) return true;
  const code = (failure as { code?: unknown } | null)?.code;
  return (
    code === "ERR_JWKS_TIMEOUT" ||
    code === "ERR_JOSE_GENERIC" ||
    code === "ERR_JWKS_INVALID"
  );
};
