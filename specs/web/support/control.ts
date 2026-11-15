// What a scenario asks of the site that no page lets it ask: accounts to be
// there, a reader to be signed in, the time to be something. Spoken to the
// site's test control by address, with the token the run made up
// (src/web/testControl.ts), so that nothing of the site's code is loaded here.
import { site } from "./site.js";

export const call = async (
  method: "POST" | "DELETE",
  path: string,
  body?: object,
): Promise<Response> => {
  const { baseUrl, token } = await site();
  return fetch(`${baseUrl}/__test${path}`, {
    method,
    headers: {
      "x-test-control": token,
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
};

/** What an account a scenario says is there is like. Anything left out is usual. */
export interface AccountToMake {
  readonly emailAddress: string;
  readonly name?: string;
  readonly password?: string;
  /** Whether its email address was confirmed. Confirmed, unless said not. */
  readonly confirmed?: boolean;
  /** Whether it has none, as an account made by signing in with Google has. */
  readonly noPassword?: boolean;
  readonly roles?: readonly string[];
}

/** Makes an account, as the site makes one. */
export const makeAccount = async (account: AccountToMake): Promise<void> => {
  const answer = await call("POST", "/accounts", account);
  if (answer.status !== 201) {
    throw new Error(
      `The site would not make the account: ${String(answer.status)} ${await answer.text()}`,
    );
  }
};

/** A session the account can be signed in with, to be held as the session cookie. */
export const sessionFor = async (emailAddress: string): Promise<string> => {
  const answer = await call("POST", "/sessions", { emailAddress });
  if (answer.status !== 201) {
    throw new Error(
      `The site has no session for ${emailAddress}: ${String(answer.status)} ${await answer.text()}`,
    );
  }
  return ((await answer.json()) as { session: string }).session;
};

/** Sets the time the site believes it is. */
export const setTheClock = async (moment: string): Promise<void> => {
  const answer = await call("POST", "/clock", { now: moment });
  if (answer.status !== 204) {
    throw new Error(
      `The site would not set the clock: ${String(answer.status)}.`,
    );
  }
};
