// Never Google's script in a scenario's browser: a stand-in the scenario can see
// into, or nothing at all. Its token says whether it was asked for before or
// after the reader typed anything, which is what a scenario about when the token
// is asked for looks at. What the site makes of the token is the site's, told by
// the control (control.ts).
import { Given } from "@cucumber/cucumber";
import type { BrowserContext } from "playwright";

import { call, tellRecaptcha } from "./control.js";
import type { WebWorld } from "./world.js";

const script = `
window.grecaptcha = {
  ready: function (then) { then(); },
  execute: function () {
    var typed = document.getElementsByName("emailAddress")[0];
    return Promise.resolve(
      typed && typed.value !== ""
        ? "a token asked for once the form was filled in"
        : "a token asked for before anything was typed"
    );
  }
};`;

/** Takes a service the site asks down, or brings it back. */
export const takeDown = async (
  service: "reCAPTCHA" | "Have I Been Pwned",
  down: boolean,
): Promise<void> => {
  const answer = await call("POST", "/services", { service, down });
  if (answer.status !== 200) {
    throw new Error(`The site would not be told: ${String(answer.status)}.`);
  }
};

/** Has `context` hand the page the stand-in for Google's script, or none. */
export const standInForRecaptcha = async (
  context: BrowserContext,
  world: WebWorld,
): Promise<void> => {
  await context.route("https://www.google.com/recaptcha/**", (route) =>
    world.recaptchaBlocked
      ? route.abort()
      : route.fulfill({ contentType: "text/javascript", body: script }),
  );
};

Given("reCAPTCHA judges the reader not a person", async function () {
  await tellRecaptcha({ judgement: "not a person" });
});
