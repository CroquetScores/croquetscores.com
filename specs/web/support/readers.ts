// Who is signed in, for the scenarios that need somebody to be. The account is
// made by the site's own control and signed in to for real, with a session the
// browser holds as it would after signing in, so that a scenario about what a
// signed-in reader sees is about a reader the site could have.
import { Given } from "@cucumber/cucumber";

import { makeAccount, sessionFor } from "./control.js";
import type { WebWorld } from "./world.js";

/** Has this scenario's browser ask as a reader signed in as `address`. */
export const signInAs = async (
  world: WebWorld,
  address: string,
  roles: readonly string[] = [],
): Promise<void> => {
  const context = world.browserContext;
  if (context === undefined) throw new Error("This scenario has no browser.");
  await makeAccount({ emailAddress: address, roles });
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
    await makeAccount({ emailAddress: address });
  },
);
