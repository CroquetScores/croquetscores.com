// What the site answered a page opened or posted to with, so that a scenario can
// say a page is not there. Kept where the pages read without a browser keep theirs
// (looking.ts), since "the page is not found" is one step for both.
import type { WebWorld } from "./world.js";

/** Keeps what the site answered this scenario's last opening or posting with. */
export const answeredWith = (world: WebWorld, status: number): void => {
  world.looked = { body: "", status };
};

/** Opens `path` in the scenario's browser, keeping what it was answered with. */
export const openAndKeepTheAnswer = async (
  world: WebWorld,
  path: string,
): Promise<void> => {
  const response = await world.browserPage.goto(`${world.baseUrl!}${path}`);
  if (response !== null) answeredWith(world, response.status());
};

/**
 * Posts `form` to `path` from the scenario's browser, and keeps what it was
 * answered with. Posted by the page rather than by a form on it, because the page
 * with the form is the one that is not there; and by the page rather than by a
 * request of the test's own, because the session cookie is Secure, which a browser
 * sends to 127.0.0.1 and a plain request over http does not.
 */
export const postAndKeepTheAnswer = async (
  world: WebWorld,
  path: string,
  form: Readonly<Record<string, string>>,
): Promise<void> => {
  const site = new URL(world.baseUrl!);
  if (new URL(world.browserPage.url()).origin !== site.origin) {
    await world.browserPage.goto(site.href);
  }
  const status = await world.browserPage.evaluate(
    async ({ path, form }) =>
      (
        await fetch(path, {
          method: "POST",
          body: new URLSearchParams(form),
          redirect: "manual",
        })
      ).status,
    { path, form },
  );
  answeredWith(world, status);
};
