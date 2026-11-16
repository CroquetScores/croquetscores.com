// What a scenario asks of the site that no page lets it ask: accounts to be
// there, a reader to be signed in, the time to be something. Spoken to the
// site's test control by address, with the token the run made up
// (src/web/testControl.ts), so that nothing of the site's code is loaded here.
import { site } from "./site.js";

// The moment what a scenario sets up is said to have been done, so that what a
// page says of how long ago it was is the same whenever the scenario is run: the
// moment the scenario has the clock read, and until it says, a usual one.
const usualMoment = "2026-10-03T10:00:00Z";
let setUpAt = usualMoment;

/** What is set up from here on is said to have been done at `moment`. */
export const settingUpAt = (moment: string): void => {
  setUpAt = moment;
};

/** The next scenario sets up as if it were the usual moment again. */
export const settingUpAtTheUsualMoment = (): void => {
  setUpAt = usualMoment;
};

export const call = async (
  method: "POST" | "DELETE",
  path: string,
  given?: object,
): Promise<Response> => {
  const body =
    given !== undefined &&
    /^\/(tournaments|competitions|commentaries)/.test(path)
      ? { at: setUpAt, ...given }
      : given;
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
  /** Whether it is one the old site had, its password kept the way the old site kept it. */
  readonly fromTheOldSite?: boolean;
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

/** An email the site has queued, as a scenario that follows its link reads it. */
export interface QueuedEmail {
  readonly to: string;
  readonly kind: string;
  readonly link?: string;
  readonly givenUp: boolean;
  /** What fills the email in, by the name its words give it. */
  readonly fill?: Readonly<Record<string, string>>;
}

/** What the site has queued for `address`, oldest first. */
export const emailsFor = async (address: string): Promise<QueuedEmail[]> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(
    `${baseUrl}/__test/emails?to=${encodeURIComponent(address)}`,
    { headers: { "x-test-control": token } },
  );
  return ((await answer.json()) as { emails: QueuedEmail[] }).emails;
};

/** How many accounts the site has for `address`: none or one. */
export const accountsFor = async (address: string): Promise<number> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(
    `${baseUrl}/__test/accounts/count?emailAddress=${encodeURIComponent(address)}`,
    { headers: { "x-test-control": token } },
  );
  return ((await answer.json()) as { count: number }).count;
};

/** Tells the site's reCAPTCHA how to judge, or that it is down. */
export const tellRecaptcha = async (said: {
  judgement?: string;
  down?: boolean;
}): Promise<void> => {
  const answer = await call("POST", "/recaptcha", said);
  if (answer.status !== 200) {
    throw new Error(`The site would not be told: ${String(answer.status)}.`);
  }
};

/** The tokens the site's reCAPTCHA has been asked to judge. */
export const tokensJudged = async (): Promise<string[]> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(`${baseUrl}/__test/recaptcha/tokens`, {
    headers: { "x-test-control": token },
  });
  return ((await answer.json()) as { tokens: string[] }).tokens;
};

/** What the site keeps of the account for `address`: its name, and whether its address is confirmed. */
export const detailsOfAccount = async (
  address: string,
): Promise<{ id: string; name: string | null; confirmed: boolean }> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(
    `${baseUrl}/__test/accounts/name?emailAddress=${encodeURIComponent(address)}`,
    { headers: { "x-test-control": token } },
  );
  if (answer.status !== 200) {
    throw new Error(`There is no account for ${address}.`);
  }
  return (await answer.json()) as {
    id: string;
    name: string | null;
    confirmed: boolean;
  };
};

/** What the site calls the account for `address`. */
export const nameOfAccount = async (address: string): Promise<string | null> =>
  (await detailsOfAccount(address)).name;

/**
 * The link in the newest email still to be sent to `address` (of `kind`, where
 * given), which is the one a reader would follow.
 */
export const latestLinkTo = async (
  address: string,
  kind?: string,
): Promise<string> => {
  const waiting = (await emailsFor(address)).filter(
    (email) => !email.givenUp && (kind === undefined || email.kind === kind),
  );
  const link = waiting[waiting.length - 1]?.link;
  if (link === undefined) {
    throw new Error(`No email carrying a link is queued for ${address}.`);
  }
  return link;
};

/** What time the site believes it is. */
export const siteNow = async (): Promise<Date> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(`${baseUrl}/__test/clock`, {
    headers: { "x-test-control": token },
  });
  return new Date(((await answer.json()) as { now: string }).now);
};

/** Says the site wrote `times` emails of `kind` to the account for `address`, `minutesAgo`. */
export const sayEmailsWereWritten = async (
  address: string,
  kind: string,
  times: number,
  minutesAgo: number,
): Promise<void> => {
  const answer = await call("POST", "/emails/written", {
    emailAddress: address,
    kind,
    times,
    minutesAgo,
  });
  if (answer.status !== 200) {
    throw new Error(`The site would not be told: ${String(answer.status)}.`);
  }
};

/** Says `times` askings for a way back in came from `ipAddress`, `minutesAgo`. */
export const sayWaysBackWereAsked = async (
  ipAddress: string,
  times: number,
  minutesAgo: number,
): Promise<void> => {
  const answer = await call("POST", "/askings", {
    ipAddress,
    times,
    minutesAgo,
  });
  if (answer.status !== 200) {
    throw new Error(`The site would not be told: ${String(answer.status)}.`);
  }
};

/** Asks for a way back in as the forgot password page does. */
export const askForAWayBack = async (address: string): Promise<void> => {
  const answer = await call("POST", "/accounts/way-back", {
    emailAddress: address,
  });
  if (answer.status !== 200) {
    throw new Error(`The site would not send one: ${String(answer.status)}.`);
  }
};

/** Whether `password` is the account's, and whether it was kept an old way. */
export const checkPasswordOf = async (
  address: string,
  password: string,
): Promise<{ matches: boolean; remake: boolean }> => {
  const answer = await call("POST", "/accounts/password", {
    emailAddress: address,
    password,
  });
  return (await answer.json()) as { matches: boolean; remake: boolean };
};

/** How many sessions the site holds for the account for `address`. */
export const sessionsOf = async (address: string): Promise<number> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(
    `${baseUrl}/__test/accounts/sessions?emailAddress=${encodeURIComponent(address)}`,
    { headers: { "x-test-control": token } },
  );
  return ((await answer.json()) as { count: number }).count;
};

/** Asks the account for `address` to forget itself, as its page does: the link is emailed. */
export const askToForget = async (address: string): Promise<void> => {
  const answer = await call("POST", "/accounts/ask-to-forget", {
    emailAddress: address,
  });
  if (answer.status !== 200) {
    throw new Error(`The site would not ask: ${String(answer.status)}.`);
  }
};

/** How many sessions the site holds for the account with this id. */
export const sessionsOfId = async (accountId: string): Promise<number> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(
    `${baseUrl}/__test/accounts/sessions?accountId=${encodeURIComponent(accountId)}`,
    { headers: { "x-test-control": token } },
  );
  return ((await answer.json()) as { count: number }).count;
};

/** Says `times` sign ins as `address` failed, `minutesAgo` by the site's clock. */
export const sayFailedSignInsHappened = async (
  who: { readonly emailAddress: string } | { readonly ipAddress: string },
  times: number,
  minutesAgo: number,
): Promise<void> => {
  const answer = await call("POST", "/signins/failed", {
    ...who,
    times,
    minutesAgo,
  });
  if (answer.status !== 200) {
    throw new Error(`The site would not be told: ${String(answer.status)}.`);
  }
};

/** How many sign ins as `address` the site has counted as failed. */
export const failedSignInsAs = async (address: string): Promise<number> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(
    `${baseUrl}/__test/signins/failed?emailAddress=${encodeURIComponent(address)}`,
    { headers: { "x-test-control": token } },
  );
  return ((await answer.json()) as { count: number }).count;
};

/** The id of the account the session cookie `cookie` belongs to, if any. */
export const accountOfSession = async (
  cookie: string,
): Promise<string | undefined> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(
    `${baseUrl}/__test/sessions/account?cookie=${encodeURIComponent(cookie)}`,
    { headers: { "x-test-control": token } },
  );
  return (
    ((await answer.json()) as { accountId: string | null }).accountId ??
    undefined
  );
};

/** Gives the account a role, or takes it away. */
export const changeRole = async (
  address: string,
  role: string,
  taken: boolean,
): Promise<void> => {
  const answer = await call("POST", "/accounts/role", {
    emailAddress: address,
    role,
    taken,
  });
  if (answer.status !== 200) {
    throw new Error(
      `The site would not change the role: ${String(answer.status)}.`,
    );
  }
};

/** Whether any row of what the site keeps of its sessions holds `cookie`. */
export const sessionsHold = async (cookie: string): Promise<boolean> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(
    `${baseUrl}/__test/sessions/holds?cookie=${encodeURIComponent(cookie)}`,
    { headers: { "x-test-control": token } },
  );
  return ((await answer.json()) as { holds: boolean }).holds;
};
