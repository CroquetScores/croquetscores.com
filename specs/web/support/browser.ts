// A real browser for the scenarios tagged @browser, and the application for it
// to talk to. Both are started by the first such scenario and not before:
// Cucumber runs BeforeAll ahead of any tag filtering, so starting them there
// would make every run — including the ones that want neither — pay for them.
import { AfterAll, Before, After } from "@cucumber/cucumber";
import { chromium, type Browser } from "playwright";

import {
  loadConfig,
  loadEnvFile,
} from "../../../src/infrastructure/config/Config.js";
import { buildApplication, type Application } from "../../../src/web/server.js";
import type { SpecWorld } from "../../support/world.js";
import { addExampleForm } from "./exampleForm.js";
import { scenarioLanguages } from "./languages.js";

let browser: Browser | undefined;
let application: Application | undefined;
let baseUrl: string | undefined;

const start = async (): Promise<{ browser: Browser; baseUrl: string }> => {
  browser ??= await chromium.launch();

  if (application === undefined) {
    loadEnvFile();
    application = await buildApplication(loadConfig(), {
      logger: false,
      languages: scenarioLanguages,
    });
    addExampleForm(application);

    // Port 0 is whatever is free. A fixed one would collide with a development
    // server, and the first person to run both at once would find out the hard
    // way.
    await application.server.listen({ port: 0, host: "127.0.0.1" });
    const address = application.server.addresses()[0];
    if (address === undefined)
      throw new Error("The application is not listening.");
    baseUrl = `http://127.0.0.1:${address.port}`;
  }

  return { browser, baseUrl: baseUrl! };
};

Before({ tags: "@browser" }, async function (this: SpecWorld) {
  const started = await start();
  this.baseUrl = started.baseUrl;

  // Scripting off by default, because what these scenarios are mostly here to
  // say is that the public side does not need it. A scenario about the admin
  // SPA asks for it back.
  this.browserContext = await started.browser.newContext({
    javaScriptEnabled: false,
  });
  this.page = await this.browserContext.newPage();
});

After({ tags: "@browser" }, async function (this: SpecWorld) {
  await this.browserContext?.close();
  this.browserContext = undefined;
  this.page = undefined;
});

AfterAll(async () => {
  await browser?.close();
  browser = undefined;

  await application?.server.close();
  await application?.pool.end();
  application = undefined;
});
