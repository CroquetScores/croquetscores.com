import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { HelpPagesToSearch } from "../../../../src/application/services/HelpSearchIndex.js";
import { languageCookie } from "../../../../src/web/common/language.js";
import type { SpecWorld } from "../../../support/world.js";
import { languageOf } from "../../common/help-search/helpFolders.js";
import { pagesOf } from "../../common/help-search/pagesWritten.js";
import { keepResults, type Found } from "../../common/help-search/results.js";
import {
  anApplicationWithSearchableHelp,
  siteNameFor,
  withScripting,
} from "../../support/browser.js";
import { signInAs } from "../../support/reader.js";

// What a scenario has said of the reader and the question, and what the last
// asking was answered with. Held here and not on the world, which every spec
// in the repository shares, for something only these scenarios have.
interface Scene {
  tag: string | undefined;
  signedIn: boolean;
  question: string | undefined;
  /** The body as sent, where the scenario sends one that is not a question. */
  body: unknown;
  site: string | undefined;
  status: number | undefined;
  error: string | undefined;
}

const scenes = new WeakMap<SpecWorld, Scene>();

const sceneOf = (world: SpecWorld): Scene => {
  const scene = scenes.get(world);
  assert.ok(scene !== undefined, "No site with help pages was named.");
  return scene;
};

Given("a site with help pages", function (this: SpecWorld) {
  scenes.set(this, {
    tag: undefined,
    signedIn: false,
    question: undefined,
    body: undefined,
    site: undefined,
    status: undefined,
    error: undefined,
  });
});

// Made when the first thing is asked of it, and not before, so that the pages
// the scenario writes are all written before the site reads them.
const siteOf = async (world: SpecWorld): Promise<string> => {
  const scene = sceneOf(world);
  if (scene.site !== undefined) return scene.site;
  const pages: HelpPagesToSearch = {
    all: () => Promise.resolve([...pagesOf(world)]),
  };
  scene.site = await anApplicationWithSearchableHelp(world, pages);
  world.baseUrl = scene.site;
  return scene.site;
};

// The readers ---------------------------------------------------------------------

Given("a(n) {word} reader", async function (this: SpecWorld, folder: string) {
  sceneOf(this).tag = (await languageOf(folder)).tag;
});

Given(
  "an {word} reader who is not signed in",
  async function (this: SpecWorld, folder: string) {
    sceneOf(this).tag = (await languageOf(folder)).tag;
  },
);

Given(
  "an {word} reader who is signed in",
  async function (this: SpecWorld, folder: string) {
    const scene = sceneOf(this);
    scene.tag = (await languageOf(folder)).tag;
    scene.signedIn = true;
  },
);

// The questions -------------------------------------------------------------------

Given(
  "the reader's question {string}",
  function (this: SpecWorld, question: string) {
    sceneOf(this).question = question;
  },
);

Given(
  "a question of {int} characters",
  function (this: SpecWorld, length: number) {
    sceneOf(this).question = "a".repeat(length);
  },
);

Given("a request that says nothing of a question", function (this: SpecWorld) {
  sceneOf(this).body = {};
});

// A reader signed in is asked as by their own browser, which holds the cookie
// of their session; any other is asked as a program would, sending only the
// language it reads.
const post = async (world: SpecWorld, body: unknown): Promise<Response> => {
  const scene = sceneOf(world);
  const site = await siteOf(world);
  if (scene.signedIn) {
    await signInAs(world, "reader@example.com");
    const answer = await world.browserContext!.request.post(
      `${site}/api/site/help/search`,
      {
        data: body,
        headers:
          scene.tag === undefined ? {} : { "accept-language": scene.tag },
      },
    );
    return new Response(await answer.text(), { status: answer.status() });
  }
  return fetch(`${site}/api/site/help/search`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(scene.tag === undefined ? {} : { "accept-language": scene.tag }),
    },
    body: JSON.stringify(body),
  });
};

const keepAnswer = async (
  world: SpecWorld,
  answer: Response,
): Promise<void> => {
  const scene = sceneOf(world);
  scene.status = answer.status;
  const body = (await answer.json().catch(() => ({}))) as {
    results?: Found[];
    error?: string;
  };
  scene.error = body.error;
  if (body.results !== undefined) keepResults(world, body.results);
};

const ask = async (world: SpecWorld, body: unknown): Promise<void> => {
  await keepAnswer(world, await post(world, body));
};

When("the question is asked", async function (this: SpecWorld) {
  const scene = sceneOf(this);
  assert.ok(scene.question !== undefined, "No question was put.");
  await ask(this, { query: scene.question });
});

When("the request is sent", async function (this: SpecWorld) {
  await ask(this, sceneOf(this).body);
});

// One more than the site allows, which is the limit it says it has.
When(
  "the question is asked more often than is allowed",
  async function (this: SpecWorld) {
    const scene = sceneOf(this);
    assert.ok(scene.question !== undefined, "No question was put.");
    for (let asked = 0; asked < 61; asked++) {
      await ask(this, { query: scene.question });
    }
  },
);

When(
  "the question is asked {int} times",
  async function (this: SpecWorld, times: number) {
    const scene = sceneOf(this);
    assert.ok(scene.question !== undefined, "No question was put.");
    for (let asked = 0; asked < times; asked++) {
      await ask(this, { query: scene.question });
    }
  },
);

Then(
  "the question is refused with {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(sceneOf(this).status, 400);
    assert.equal(sceneOf(this).error, code);
  },
);

Then(
  "the request is refused with {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(sceneOf(this).status, 400);
    assert.equal(sceneOf(this).error, code);
  },
);

Then("the next question is told to wait", function (this: SpecWorld) {
  assert.equal(sceneOf(this).status, 429);
});

// The panel ---------------------------------------------------------------------

const panel = ".help-search";

const openTheHelp = async (world: SpecWorld): Promise<void> => {
  const scene = sceneOf(world);
  const site = await siteOf(world);
  if (scene.tag !== undefined) {
    await world.browserContext!.addCookies([
      {
        name: languageCookie,
        value: scene.tag,
        domain: new URL(site).hostname,
        path: "/",
      },
    ]);
  }
  await world.browserPage.goto(`${site}/help`);
};

When("the first page of the help is read", async function (this: SpecWorld) {
  await openTheHelp(this);
});

Then(
  "the page has a panel called {string}",
  async function (this: SpecWorld, name: string) {
    assert.equal(await this.browserPage.locator(panel).count(), 1);
    assert.equal(
      (
        await this.browserPage
          .locator(`${panel} .help-search-title`)
          .innerText()
      ).trim(),
      name,
    );
  },
);

Then(
  "the panel comes before the page's first heading",
  async function (this: SpecWorld) {
    // Where each is on the page, since the page is laid out top to bottom.
    const panelBox = await this.browserPage.locator(panel).boundingBox();
    const headingBox = await this.browserPage
      .locator("article.help h1, article.help h2")
      .first()
      .boundingBox();
    const before =
      panelBox !== null && headingBox !== null && panelBox.y < headingBox.y;
    assert.ok(before, "The panel is not before the first heading.");
  },
);

// Scripting is a property of a browser made, so the typing makes one that has
// it and opens the help again in it.
When(
  "{string} is typed in the panel",
  async function (this: SpecWorld, typed: string) {
    await withScripting(this);
    await openTheHelp(this);
    await this.browserPage.locator("#help-search-field").fill(typed);
  },
);

Then(
  "the panel shows the result {string}",
  async function (this: SpecWorld, title: string) {
    const shown = this.browserPage.locator(
      `${panel} .help-search-result-title`,
      { hasText: title },
    );
    await shown.first().waitFor({ timeout: 5000 });
    assert.ok((await shown.count()) >= 1);
  },
);

Then(
  "the panel is called by the Swedish words",
  async function (this: SpecWorld) {
    const { swedish } =
      await import("../../../../src/web/languages/swedish.js");
    const wanted = swedish.words["helpSearch.title"]!.replace(
      "{siteName}",
      siteNameFor(this),
    );
    assert.equal(
      (
        await this.browserPage
          .locator(`${panel} .help-search-title`)
          .innerText()
      ).trim(),
      wanted,
    );
  },
);

// Without scripting ---------------------------------------------------------------

const formAnswer = new WeakMap<SpecWorld, string>();

When(
  "{string} is asked of the help as a form",
  async function (this: SpecWorld, typed: string) {
    const scene = sceneOf(this);
    const site = await siteOf(this);
    const answer = await fetch(
      `${site}/help?question=${encodeURIComponent(typed)}`,
      {
        headers:
          scene.tag === undefined ? {} : { "accept-language": scene.tag },
      },
    );
    formAnswer.set(this, await answer.text());
  },
);

// One more than the site allows, asked the way a page without scripting asks.
const askAsAForm = async (
  world: SpecWorld,
  address: string,
  times: number,
): Promise<void> => {
  const scene = sceneOf(world);
  const site = await siteOf(world);
  for (let asked = 0; asked < times; asked++) {
    const answer = await fetch(`${site}${address}`, {
      headers: scene.tag === undefined ? {} : { "accept-language": scene.tag },
    });
    await answer.text();
    scene.status = answer.status;
  }
};

When(
  "the question is asked by the form more often than is allowed",
  async function (this: SpecWorld) {
    const scene = sceneOf(this);
    assert.ok(scene.question !== undefined, "No question was put.");
    await askAsAForm(
      this,
      `/help?question=${encodeURIComponent(scene.question)}`,
      61,
    );
  },
);

When(
  "the question is asked by the form {int} times",
  async function (this: SpecWorld, times: number) {
    const scene = sceneOf(this);
    assert.ok(scene.question !== undefined, "No question was put.");
    await askAsAForm(
      this,
      `/help?question=${encodeURIComponent(scene.question)}`,
      times,
    );
  },
);

When(
  "the help is opened more often than the questions are allowed",
  async function (this: SpecWorld) {
    await askAsAForm(this, "/help", 61);
  },
);

Then("the next opening is not told to wait", function (this: SpecWorld) {
  assert.equal(sceneOf(this).status, 200);
});

Then(
  "the page shows the result {string}",
  function (this: SpecWorld, title: string) {
    const page = formAnswer.get(this);
    assert.ok(page !== undefined, "The help was not asked.");
    assert.ok(
      page.includes(`<span class="help-search-result-title">${title}</span>`),
      "The page does not show the result.",
    );
  },
);

// Read from the result in the page, by its title, since a string handed to an
// element is not given it.
Then(
  "the words of the result {string} are black",
  async function (this: SpecWorld, title: string) {
    await this.browserPage
      .locator(`${panel} .help-search-result-title`, { hasText: title })
      .first()
      .waitFor({ timeout: 5000 });
    const read = await this.browserPage.evaluate(
      `(() => { const result = [...document.querySelectorAll(${JSON.stringify(`${panel} .help-search-results li`)})].find((each) => each.querySelector(".help-search-result-title")?.textContent === ${JSON.stringify(title)}); return result === undefined ? undefined : getComputedStyle(result.querySelector(".help-search-snippet")).color; })()`,
    );
    assert.equal(typeof read, "string", `There is no result called ${title}.`);
    assert.equal(read, "rgb(0, 0, 0)");
  },
);
