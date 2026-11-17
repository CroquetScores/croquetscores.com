import { Then, When } from "@cucumber/cucumber";
import type { SpecWorld } from "../../support/world.js";

// Opening the admin at a year --------------------------------------------------

const openAdminFor = async function (
  this: SpecWorld,
  year: number,
): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}/admin/${String(year)}`);
};
When("the admin for {int} is opened", openAdminFor);

// Where the reader is ------------------------------------------------------------

// The choices after the question mark too where the address names any, since
// the list keeps what was chosen there.
Then("the address is {string}", async function (this: SpecWorld, path: string) {
  await this.browserPage.waitForURL(
    (url) =>
      (path.includes("?") ? `${url.pathname}${url.search}` : url.pathname) ===
      path,
  );
});
