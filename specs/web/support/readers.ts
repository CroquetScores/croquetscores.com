// Who is signed in, for the scenarios that need somebody to be. The account is
// made by the site's own control and signed in to for real, with a session the
// browser holds as it would after signing in, so that a scenario about what a
// signed-in reader sees is about a reader the site could have.
import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { call, makeAccount, sessionFor } from "./control.js";
import { unmarked } from "./languages.js";
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
    await signInAs(this, address);
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
