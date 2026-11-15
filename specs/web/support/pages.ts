// What nearly every browser scenario says first: how big the window is and
// which page is open. Here rather than beside one feature because most of them
// say it.
import { Given, When } from "@cucumber/cucumber";

import { withScripting } from "./browser.js";
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
