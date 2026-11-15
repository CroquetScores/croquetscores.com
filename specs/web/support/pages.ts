// What nearly every browser scenario says first: how big the window is and
// which page is open. Here rather than beside one feature because most of them
// say it.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { withScripting } from "./browser.js";
import { setTheClock } from "./control.js";
import { unmarked } from "./languages.js";
import type { WebWorld } from "./world.js";

Given(
  "a viewport {int} pixels wide",
  async function (this: WebWorld, width: number) {
    // The height is not what these scenarios are about, so it is the same for
    // all of them and says nothing.
    await this.browserPage.setViewportSize({ width, height: 800 });
  },
);

Given(
  "a viewport {int} pixels wide and {int} pixels tall",
  async function (this: WebWorld, width: number, height: number) {
    await this.browserPage.setViewportSize({ width, height });
  },
);

const openHomePage = async function (this: WebWorld): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}/`);
};

Given("the home page is open", openHomePage);
When("the home page is opened", openHomePage);

Given("scripting is switched on", async function (this: WebWorld) {
  await withScripting(this);
});

// Registering needs scripting, so a scenario that means to use the register
// page switches it on first; one that opens it without is sent away from it.
const openRegister = async function (this: WebWorld): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}/account/register`);
};

const openRegisterWithScripting = async function (
  this: WebWorld,
): Promise<void> {
  await withScripting(this);
  await openRegister.call(this);
};

Given("the register page is open with scripting on", openRegisterWithScripting);
When(
  "the register page is opened with scripting on",
  openRegisterWithScripting,
);
Given("the register page is open", openRegister);
When("the register page is opened", openRegister);

// The admin's front door. /admin itself only sends the reader here.
const openAdmin = async function (this: WebWorld): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}/admin/`);
};

Given("the admin is open", openAdmin);
When("the admin is opened", openAdmin);

Given("a browser that runs scripts", async function (this: WebWorld) {
  await withScripting(this);
});

// What time the site believes it is, which the scenario moves and nothing else
// does.
Given(
  "the server's clock reads {string}",
  async function (this: WebWorld, moment: string) {
    await setTheClock(moment);
  },
);

const openAt = async function (this: WebWorld, path: string): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}${path}`);
};

Given("the page at {string} is open", openAt);
When("the page at {string} is opened", openAt);

// Whether the page is the address it should be, which a page that goes on to
// change its own address, by what the reader chooses in it, has to be asked
// until it has. The choices after the question mark too where the address
// names any, since the page keeps what was chosen there.
Then("the address is {string}", async function (this: WebWorld, path: string) {
  await this.browserPage.waitForURL(
    (url) =>
      (path.includes("?") ? `${url.pathname}${url.search}` : url.pathname) ===
      path,
  );
});

// What the page says, with the test locale's marks taken off so that it reads
// as its language does.
Then("the page says {string}", async function (this: WebWorld, words: string) {
  const shown = unmarked(await this.browserPage.locator("main").innerText());
  assert.ok(shown.includes(words), `The page says ${JSON.stringify(shown)}.`);
});

// In place of what was asked for, by the refusal's code: the words beside it
// are only its words. Asked again for a while, since the page says it once the
// site has answered.
Then(
  "the page is refused with {string}",
  async function (this: WebWorld, code: string) {
    const refused = this.browserPage.locator("main .page-refused");
    await refused.waitFor();
    assert.equal(await refused.getAttribute("data-refused"), code);
  },
);

Then(
  "the page does not say {string}",
  async function (this: WebWorld, words: string) {
    const shown = unmarked(await this.browserPage.locator("main").innerText());
    assert.ok(
      !shown.includes(words),
      `The page says ${JSON.stringify(shown)}.`,
    );
  },
);
