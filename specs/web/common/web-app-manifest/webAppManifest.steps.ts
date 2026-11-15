import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";

import type { SpecWorld } from "../../../support/world.js";
import { anApplicationServedAs } from "../../support/browser.js";
import { askFor, pageAsked } from "../../support/publicPages.js";

// The folder of the site's pictures each website's are in, by the name the
// scenarios call the website.
const picturesOf: Readonly<Record<string, string>> = {
  "Croquet Scores": "croquet-scores",
  "Gateball Scores": "gateball-scores",
};

const languages: Readonly<Record<string, string>> = {
  Welsh: "cy",
  German: "de",
};

// The colours are read from the stylesheet and not written again here, so that
// a manifest that says one thing while the site is drawn in another is a
// failure and not two copies that agree because both were forgotten.
const stylesheet = readFileSync(
  new URL("../../../../assets/site.css", import.meta.url),
  "utf8",
);

const token = (name: string): { light: string; dark: string } => {
  const found = new RegExp(
    `${name}:\\s*light-dark\\(\\s*(#[0-9a-fA-F]+),\\s*(#[0-9a-fA-F]+)\\s*\\)`,
  ).exec(stylesheet);
  assert.ok(found !== null, `The stylesheet has no ${name} for both.`);
  return { light: found[1]!.toLowerCase(), dark: found[2]!.toLowerCase() };
};

// What the reader asked for in, kept for the manifest to be asked for in.
const asked = new WeakMap<SpecWorld, string>();

const manifestOf = (world: SpecWorld): Record<string, unknown> =>
  JSON.parse(pageAsked(world).body) as Record<string, unknown>;

const iconsOf = (
  world: SpecWorld,
): { src: string; sizes: string; type: string }[] => {
  const { icons } = manifestOf(world);
  assert.ok(Array.isArray(icons), "The manifest names no icons.");
  return icons as { src: string; sizes: string; type: string }[];
};

// Reading the markup of the page last asked for, as the canonical link's steps
// do: what is read is what the site sends and not what a browser makes of it.
const manifestLinks = (world: SpecWorld): string[] =>
  [
    ...pageAsked(world).body.matchAll(/<link rel="manifest" href="([^"]*)"/g),
  ].map((found) => found[1]!);

const linkTo = (world: SpecWorld, rel: string): string | undefined =>
  new RegExp(`<link rel="${rel}"[^>]*href="([^"]*)"`).exec(
    pageAsked(world).body,
  )?.[1];

const themeColour = (world: SpecWorld, scheme: string): string | undefined =>
  new RegExp(
    `<meta name="theme-color" content="([^"]*)" media="\\(prefers-color-scheme: ${scheme}\\)"`,
  )
    .exec(pageAsked(world).body)?.[1]
    ?.toLowerCase();

const folder = (site: string): string => {
  const found = picturesOf[site];
  assert.ok(found !== undefined, `There is no site called ${site}.`);
  return found;
};

Given(
  /^the reader asked for (Welsh|German)$/,
  function (this: SpecWorld, language: string) {
    asked.set(this, languages[language]!);
  },
);

When(
  "the manifest is asked for at {string}",
  async function (this: SpecWorld, address: string) {
    await askFor(this, "/manifest.webmanifest", address, asked.get(this));
  },
);

When(
  "the manifest it links to is asked for at {string}",
  async function (this: SpecWorld, address: string) {
    const [link] = manifestLinks(this);
    assert.ok(link !== undefined, "The page links to no manifest.");
    await askFor(this, link, address);
  },
);

// What a manifest says ----------------------------------------------------------

Then("the app's name is {string}", function (this: SpecWorld, name: string) {
  assert.equal(manifestOf(this).name, name);
});

Then(
  "the app's short name is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(manifestOf(this).short_name, name);
  },
);

Then("its kind is a web app manifest", function (this: SpecWorld) {
  assert.match(
    pageAsked(this).headers.get("content-type") ?? "",
    /^application\/manifest\+json/,
  );
});

Then("the answer does not vary by cookie", function (this: SpecWorld) {
  assert.doesNotMatch(pageAsked(this).headers.get("vary") ?? "", /cookie/i);
});

Then("there is no manifest", function (this: SpecWorld) {
  assert.equal(pageAsked(this).status, 404);
});

Then("the app starts at the home page", function (this: SpecWorld) {
  assert.equal(manifestOf(this).start_url, "/");
});

Then("the app's scope is the whole website", function (this: SpecWorld) {
  assert.equal(manifestOf(this).scope, "/");
});

Then("the app is shown in a window of its own", function (this: SpecWorld) {
  assert.equal(manifestOf(this).display, "standalone");
});

Then(
  "the app's identity is the home page's address",
  function (this: SpecWorld) {
    assert.equal(manifestOf(this).id, "/");
  },
);

Then(
  "the app's theme colour is the green of the bars",
  function (this: SpecWorld) {
    assert.equal(
      String(manifestOf(this).theme_color).toLowerCase(),
      token("--accent").light,
    );
  },
);

Then(
  "the app's background colour is the green of the page",
  function (this: SpecWorld) {
    assert.equal(
      String(manifestOf(this).background_color).toLowerCase(),
      token("--surface").light,
    );
  },
);

Then(
  "the app's icons are those of {string}",
  function (this: SpecWorld, site: string) {
    const icons = iconsOf(this);
    assert.ok(icons.length > 0, "The manifest names no icons.");
    for (const { src } of icons) {
      assert.ok(
        src.includes(`/app-icons/${folder(site)}/`),
        `${src} is not one of ${site}'s.`,
      );
    }
  },
);

Then(
  "the app has an icon of {int} pixels",
  function (this: SpecWorld, pixels: number) {
    const sizes = `${String(pixels)}x${String(pixels)}`;
    assert.ok(
      iconsOf(this).some((icon) => icon.sizes === sizes),
      `The manifest names no icon of ${String(pixels)} pixels.`,
    );
  },
);

// The icons are the manifest's, and asking for one replaces the answer that
// named them, so they are kept from it and asked for in turn.
const named = new WeakMap<SpecWorld, { src: string; type: string }[]>();

When("each icon it names is asked for", function (this: SpecWorld) {
  named.set(this, iconsOf(this));
});

Then("each icon is given", async function (this: SpecWorld) {
  const icons = named.get(this);
  assert.ok(icons !== undefined && icons.length > 0, "No icon was named.");
  for (const { src, type } of icons) {
    const answer = await askFor(this, src, "croquetscores.com");
    assert.equal(answer.status, 200, `${src} was not given.`);
    assert.equal(answer.headers.get("content-type"), type);
  }
});

// What a page says of the manifest ------------------------------------------------

Then("it links to the manifest", function (this: SpecWorld) {
  assert.ok(manifestLinks(this).length > 0, "The page links to no manifest.");
});

Then("it does not link to the manifest", function (this: SpecWorld) {
  assert.deepEqual(manifestLinks(this), []);
});

Then("it has one link to the manifest", function (this: SpecWorld) {
  assert.equal(manifestLinks(this).length, 1);
});

Then(
  "its tab picture is that of {string}",
  function (this: SpecWorld, site: string) {
    const link = linkTo(this, "icon");
    assert.ok(link !== undefined, "The page names no picture for a tab.");
    assert.ok(link.includes(`/app-icons/${folder(site)}/`), link);
  },
);

Then(
  "its home screen picture is that of {string}",
  function (this: SpecWorld, site: string) {
    const link = linkTo(this, "apple-touch-icon");
    assert.ok(link !== undefined, "The page names no home screen picture.");
    assert.ok(link.includes(`/app-icons/${folder(site)}/`), link);
  },
);

Then("it names no home screen picture", function (this: SpecWorld) {
  assert.equal(linkTo(this, "apple-touch-icon"), undefined);
});

Then(
  "its theme colour for light is the green of the bars",
  function (this: SpecWorld) {
    assert.equal(themeColour(this, "light"), token("--accent").light);
  },
);

Then(
  "its theme colour for dark is the black of the bars",
  function (this: SpecWorld) {
    assert.equal(themeColour(this, "dark"), token("--accent").dark);
  },
);

// How long it is kept ---------------------------------------------------------------

Then("the answer may be kept by a shared cache", function (this: SpecWorld) {
  const control = pageAsked(this).headers.get("cache-control") ?? "";
  assert.match(control, /\bpublic\b/);
  assert.doesNotMatch(control, /\b(private|no-store|no-cache)\b/);
});

Then("the answer may be kept for a day", function (this: SpecWorld) {
  assert.match(
    pageAsked(this).headers.get("cache-control") ?? "",
    /max-age=86400\b/,
  );
});

Then("it does not name the manifest", function (this: SpecWorld) {
  const answer = pageAsked(this);
  assert.equal(answer.status, 200, "The sitemap was not given.");
  assert.ok(!answer.body.includes("manifest"), "The sitemap names it.");
});

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

Given("the terms of use page is open", async function (this: SpecWorld) {
  await this.browserPage.goto(`${this.baseUrl!}/terms-of-use`);
});

const openTryHomePage = async function (this: SpecWorld): Promise<void> {
  const base = await anApplicationServedAs(this, "try.croquetscores.com");
  await this.browserPage.goto(`${base}/`);
};

Given("the try website's home page is open", openTryHomePage);
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

Given("the site is open as an installed app", openAsInstalledApp);
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

When(
  "the browser says the site has been installed",
  async function (this: SpecWorld) {
    await this.browserPage.evaluate(
      `window.dispatchEvent(new Event("appinstalled"));`,
    );
  },
);

Then("the page open links to the manifest", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.locator('link[rel="manifest"]').count(),
    1,
  );
});

When("the install button is pressed", async function (this: SpecWorld) {
  await this.browserPage.locator(".install-site").click();
});

Then("the install button is shown", async function (this: SpecWorld) {
  await this.browserPage.locator(".install-site").waitFor({ state: "visible" });
});

Then("the install button is not shown", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.locator(".install-site").isVisible(),
    false,
  );
});

Then(
  "the install button is at least {int} pixels tall",
  async function (this: SpecWorld, pixels: number) {
    const box = await this.browserPage.locator(".install-site").boundingBox();
    assert.ok(box !== null, "The install button is not on the page.");
    assert.ok(box.height >= pixels, `It is ${String(box.height)} pixels tall.`);
  },
);

Then(
  "the browser is asked to install the site",
  async function (this: SpecWorld) {
    assert.equal(
      await this.browserPage.evaluate(`window.installWasAskedFor === true`),
      true,
    );
  },
);
