import { Given, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";
import { anApplicationServedAs } from "./browser.js";

// The button -------------------------------------------------------------------------

// Scripting is off in these scenarios unless one switches it on, so this does
// no switching: it checks, since a scenario that said so with scripting on
// would pass whatever the page does without a script. A page that sets its own
// content from a script is left empty by a browser that runs none.
Given("scripting is switched off", async function (this: SpecWorld) {
  await this.browserPage.setContent(
    '<p id="ran"></p><script>document.getElementById("ran").textContent = "yes";</script>',
  );
  assert.equal(
    await this.browserPage.locator("#ran").textContent(),
    "",
    "Scripting is on in this scenario's browser.",
  );
});

const openTryHomePage = async function (this: SpecWorld): Promise<void> {
  const base = await anApplicationServedAs(this, "try.croquetscores.com");
  await this.browserPage.goto(`${base}/`);
};
When("the try website's home page is opened", openTryHomePage);

// A browser has no way to be told it is an installed app, so the page is told
// what an installed one is: its display mode is standalone.
const openAsInstalledApp = async function (this: SpecWorld): Promise<void> {
  await this.browserContext!.addInitScript(`
    var matched = window.matchMedia.bind(window);
    window.matchMedia = function (query) {
      if (query.indexOf("display-mode: standalone") === -1) {
        return matched(query);
      }
      return {
        matches: true,
        media: query,
        addEventListener: function () {},
        removeEventListener: function () {},
        addListener: function () {},
        removeListener: function () {}
      };
    };
  `);
  await this.browserPage.goto(`${this.baseUrl!}/`);
};
When("the site is opened as an installed app", openAsInstalledApp);

// What a browser sends a page that it can install: an event the page may stop
// the browser acting on, with the means to show the prompt when it chooses.
When(
  "the browser says the site can be installed",
  async function (this: SpecWorld) {
    await this.browserPage.evaluate(`
      var offer = new Event("beforeinstallprompt", { cancelable: true });
      offer.prompt = function () {
        window.installWasAskedFor = true;
        return Promise.resolve();
      };
      // The reader's answer, which is not known until they give it.
      offer.userChoice = new Promise(function (answer) {
        window.answerInstallOffer = answer;
      });
      window.dispatchEvent(offer);
    `);
  },
);

When("the reader turns the offer down", async function (this: SpecWorld) {
  await this.browserPage.evaluate(
    `window.answerInstallOffer({ outcome: "dismissed" })`,
  );
});

// A browser that has said the site can be installed and then will not show the
// offer, as one does where the offer was already used.
When(
  "the browser says the site can be installed but will not show the offer",
  async function (this: SpecWorld) {
    await this.browserPage.evaluate(`
      var offer = new Event("beforeinstallprompt", { cancelable: true });
      offer.prompt = function () {
        throw new Error("The offer was already used.");
      };
      window.dispatchEvent(offer);
    `);
  },
);

When(
  "the browser says the site has been installed",
  async function (this: SpecWorld) {
    await this.browserPage.evaluate(
      `window.dispatchEvent(new Event("appinstalled"));`,
    );
  },
);

When("the install button is pressed", async function (this: SpecWorld) {
  await this.browserPage.locator(".install-site").click();
});
