// Who is signed in, for the scenarios that need somebody to be. The account is
// made by the site's own control and signed in to for real, with a session the
// browser holds as it would after signing in, so that a scenario about what a
// signed-in reader sees is about a reader the site could have.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  accountOfSession,
  call,
  changeRole,
  detailsOfAccount,
  failedSignInsAs,
  makeAccount,
  sayFailedSignInsHappened,
  sessionFor,
} from "./control.js";
import { unmarked } from "./languages.js";
import { unmarkedWithin } from "./marks.js";
import { wordsFor } from "./words.js";
import type { WebWorld } from "./world.js";

/** Has this scenario's browser ask as a reader signed in as `address`. */
export const signInAs = async (
  world: WebWorld,
  address: string,
  roles: readonly string[] = [],
  makeIt = true,
): Promise<void> => {
  const context = world.browserContext;
  if (context === undefined) throw new Error("This scenario has no browser.");
  if (makeIt) await makeAccount({ emailAddress: address, roles });
  const session = await sessionFor(address);
  await context.addCookies([
    {
      name: "session",
      value: session,
      url: world.baseUrl!,
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    },
  ]);
};

Given(
  "a reader signed in as {string}",
  async function (this: WebWorld, address: string) {
    // An account the scenario made is signed in to, and one it did not is made
    // first, as signing in to one assumes.
    await signInAs(this, address, [], !this.accountNames.has(address));
  },
);

Given("nobody is signed in", async function (this: WebWorld) {
  await this.browserContext?.clearCookies({ name: "session" });
});

// An account that is there, whether or not anybody is signed in to it.
Given(
  "{string} has an account, confirmed",
  async function (this: WebWorld, address: string) {
    this.accountNames.set(address, "Sam Someone");
    await makeAccount({ emailAddress: address });
  },
);

// An account with a name and a password a scenario goes on to sign in with.
Given(
  "{string} has an account, confirmed, called {string}, with the password {string}",
  async function (
    this: WebWorld,
    address: string,
    name: string,
    password: string,
  ) {
    this.accountNames.set(address, name);
    await makeAccount({ emailAddress: address, name, password });
  },
);

Given(
  "{string} has an account, confirmed, with the password {string}",
  async function (this: WebWorld, address: string, password: string) {
    this.accountNames.set(address, "Sam Someone");
    await makeAccount({ emailAddress: address, password });
  },
);

// Signed in as the account's owner would be, which the site holds as a session.
// The password is the one the account was made with, and what is said is that the
// reader knows it: a session is what signing in with it comes to.
Given(
  "the reader has signed in as {string} with the password {string}",
  async function (this: WebWorld, address: string, password: string) {
    // An account the scenario has not made is made with that password, as signing
    // in to one assumes it is there.
    if (!this.accountNames.has(address)) {
      await makeAccount({ emailAddress: address, password });
    }
    await signInAs(this, address, [], false);
  },
);

Given(
  "the account for {string} has been forgotten",
  async function (this: WebWorld, address: string) {
    const answer = await call("POST", "/accounts/forget", {
      emailAddress: address,
    });
    if (answer.status !== 200) {
      throw new Error(
        `The site would not forget the account: ${String(answer.status)} ${await answer.text()}`,
      );
    }
  },
);

// Where the reader ended up when they were not signed in.
Then("the sign in page is shown", async function (this: WebWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, "/account/sign-in");
  const heading = unmarked(
    (await this.browserPage.locator("main h1").textContent()) ?? "",
  );
  assert.equal(heading, "Sign in");
});

// Signed out as the account menu signs a reader out, so that the session is
// ended rather than only forgotten by the browser. Posted from the page, so
// that it goes with the browser's own cookie, which a request from outside the
// browser does not send to a site served over plain http.
Given("the reader has signed out", async function (this: WebWorld) {
  // Once signing in has finished, which it has not until the browser has left
  // the sign in page.
  await this.browserPage.waitForURL(
    (url) => url.pathname !== "/account/sign-in",
  );
  const site = new URL(this.baseUrl!);
  if (new URL(this.browserPage.url()).origin !== site.origin) {
    await this.browserPage.goto(site.href);
  }
  const status = await this.browserPage.evaluate(
    async (path) =>
      (await fetch(path, { method: "POST", redirect: "manual" })).status,
    "/account/sign-out",
  );
  // A redirect not followed is answered to a script as status 0, and the
  // redirect is what signing out answers with.
  assert.equal(status, 0, `Signing out answered ${String(status)}.`);
});

// An account made by signing in with Google, which has no password.
Given(
  "{string} has an account, confirmed, with no password",
  async function (this: WebWorld, address: string) {
    this.accountNames.set(address, "Sam Someone");
    await makeAccount({ emailAddress: address, noPassword: true });
  },
);

// Signed in through the form, as a reader signs in: from the sign in page, which
// a scenario that has not opened it opens.
When(
  "the reader signs in as {string} with the password {string}",
  async function (this: WebWorld, address: string, password: string) {
    const page = this.browserPage;
    if (new URL(page.url()).pathname !== "/account/sign-in") {
      await page.goto(`${this.baseUrl!}/account/sign-in`);
    }
    await page.fill('section.dialog input[name="emailAddress"]', address);
    await page.fill('section.dialog input[name="password"]', password);
    await page.click('section.dialog button[type="submit"]');
    await page.waitForLoadState();
  },
);

// An account that has registered and not yet followed the link it was sent.
Given(
  "{string} has an account, not confirmed",
  async function (this: WebWorld, address: string) {
    this.accountNames.set(address, "Sam Someone");
    await makeAccount({ emailAddress: address, confirmed: false });
  },
);

// Said by more than one page: the sign in page says it above its fields, and the
// new confirmation link page says it as the whole of what it has to say.
Then("the reader is told to try again later", async function (this: WebWorld) {
  const content = unmarked(
    (await this.browserPage.locator("main").textContent()) ?? "",
  );
  const said = [
    wordsFor("signIn.tryAgainLater"),
    wordsFor("newConfirmationLink.tooMany.explanation"),
    wordsFor("forgotPassword.tryAgainLater"),
    wordsFor("registrationsSuspended.tryAgainLater"),
  ];
  assert.ok(
    said.some((each) => content.includes(each)),
    "No page says to try again later.",
  );
});

// An account the old site had, brought over with its password kept the old way.
Given(
  "{string} has an account brought over from the old site, with the password {string}",
  async function (this: WebWorld, address: string, password: string) {
    this.accountNames.set(address, "Sam Someone");
    await makeAccount({
      emailAddress: address,
      password,
      fromTheOldSite: true,
    });
  },
);

// What has failed before, written where the page counts it, at a few minutes ago
// so that it is inside the hour whatever moment the scenario is at.
Given(
  "signing in as {string} has failed {int} times in the last hour",
  async function (this: WebWorld, address: string, times: number) {
    await sayFailedSignInsHappened({ emailAddress: address }, times, 5);
  },
);

Given(
  "this IP address has failed to sign in {int} times in the last hour",
  async function (this: WebWorld, times: number) {
    await sayFailedSignInsHappened({ ipAddress: "127.0.0.1" }, times, 5);
  },
);

Then(
  /^signing in as "([^"]*)" has been counted (\d+) times?$/,
  async function (this: WebWorld, address: string, times: string) {
    assert.equal(await failedSignInsAs(address), Number(times));
  },
);

// The account the browser's session cookie signs in to, which the site says.
Then(
  "the reader is signed in to the account for {string}",
  async function (this: WebWorld, address: string) {
    const cookie = (await this.browserContext?.cookies())?.find(
      (each) => each.name === "session",
    );
    assert.ok(cookie !== undefined, "The browser holds no session.");
    assert.equal(
      await accountOfSession(cookie.value),
      (await detailsOfAccount(address)).id,
    );
  },
);

Given(
  "{string} has been given the role {string}",
  async function (this: WebWorld, address: string, role: string) {
    await changeRole(address, roleCalled(role), false);
  },
);

Given(
  "{string} has had the role {string} taken away",
  async function (this: WebWorld, address: string, role: string) {
    await changeRole(address, roleCalled(role), true);
  },
);

// A role as a feature names it, "Administrator" or "World Ranking Officer", and as
// the account keeps it.
const roleCalled = (name: string): string =>
  name.toLowerCase().replaceAll(" ", "-");

// The sign in page, as a reader opens it from a link or by typing its address.
const openSignIn = async function (this: WebWorld): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}/account/sign-in`);
};

Given("the sign in page is open", openSignIn);
When("the sign in page is opened", openSignIn);

Then(
  "the page links to the forgot password page once",
  async function (this: WebWorld) {
    assert.equal(
      await this.browserPage
        .locator('main a[href="/account/forgot-password"]')
        .count(),
      1,
    );
  },
);

// Accounts said in the words the navigation's features say them in.
Given(
  "an account for {string}, confirmed",
  async function (this: WebWorld, address: string) {
    this.accountNames.set(address, "Sam Someone");
    await makeAccount({ emailAddress: address });
  },
);

Given(
  "an account for {string}, confirmed, with no password",
  async function (this: WebWorld, address: string) {
    this.accountNames.set(address, "Sam Someone");
    await makeAccount({ emailAddress: address, noPassword: true });
  },
);

Then(
  "the last item in the header navigation is the account menu",
  async function (this: WebWorld) {
    const last =
      (await this.browserPage
        .locator("header .site-bar-inner > *")
        .last()
        .getAttribute("class")) ?? "";
    assert.ok(
      last.includes("account-menu"),
      `The header's last item is ${last}.`,
    );
  },
);

Then(
  "every word in the navigation is in the test locale",
  async function (this: WebWorld) {
    const stray = await unmarkedWithin(this, "header .menu-links", []);
    assert.deepEqual(stray, [], "Words in the navigation came from elsewhere.");
  },
);
