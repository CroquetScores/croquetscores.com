import { Given } from "@cucumber/cucumber";
import type { SpecWorld } from "../../support/world.js";

Given(
  "the page at {string} is open",
  async function (this: SpecWorld, path: string) {
    await this.browserPage.goto(`${this.baseUrl!}${path}`);
  },
);
