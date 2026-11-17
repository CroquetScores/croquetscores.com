import { Given, When } from "@cucumber/cucumber";
import { withScripting } from "./browser.js";
import type { SpecWorld } from "../../support/world.js";

// The admin's front door. /admin itself only sends the reader here.
const admin = "/admin/";

Given("a browser that runs scripts", async function (this: SpecWorld) {
  await withScripting(this);
});

const openAdmin = async function (this: SpecWorld): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}${admin}`);
};

Given("the admin is open", openAdmin);
When("the admin is opened", openAdmin);
