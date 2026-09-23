// A real browser for the scenarios tagged @browser, and the application for it
// to talk to. Both are started by the first such scenario and not before:
// Cucumber runs BeforeAll ahead of any tag filtering, so starting them there
// would make every run — including the ones that want neither — pay for them.
//
// One application serves every scenario that only looks at pages: they keep
// nothing and read nothing kept, so sharing one is what makes them quick. A
// scenario that registers, confirms, or otherwise writes something down is
// tagged @postgres as well, and gets an application of its own over the
// database that tag gave it, listening on a port of its own, reading the clock
// that scenario sets. Two such scenarios sharing one set of tables would pass
// or fail by the order they ran in, and a scenario that has to move the clock
// cannot move one the next scenario is reading.
import { AfterAll, Before, After } from "@cucumber/cucumber";
import { chromium, type Browser, type BrowserContext } from "playwright";

// Loaded here so that whatever loads this has already registered the hooks that
// give a scenario its database: hooks run in the order they were defined, and a
// scenario's application is built over a database that must exist by then.
import "../../infrastructure/support/database.js";
import {
  loadConfig,
  loadEnvFile,
} from "../../../src/infrastructure/config/Config.js";
import { CheckRefused } from "../../../src/application/services/BreachedPasswords.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import { buildApplication, type Application } from "../../../src/web/server.js";
import type { SpecWorld } from "../../support/world.js";
import { accountsThrough, oldSiteSaltForScenarios } from "./accounts.js";
import { clockFor } from "./clock.js";
import { addExampleFailures } from "./exampleFailures.js";
import { addExampleForm } from "./exampleForm.js";
import { scenarioLanguages } from "./languages.js";
import { readerTheScenariosSet } from "./reader.js";

let browser: Browser | undefined;
let application: Application | undefined;
let baseUrl: string | undefined;

// The one browser, launched by the first scenario that needs one.
const theBrowser = async (): Promise<Browser> => {
  browser ??= await chromium.launch();
  return browser;
};

// The application every scenario without a database of its own talks to.
const theSharedOne = async (): Promise<string> => {
  if (application === undefined) {
    loadEnvFile();
    application = await buildApplication(loadConfig(), {
      logger: false,
      languages: scenarioLanguages,
      // Who a scenario's reader is, which it says with a cookie of its own:
      // there are no sessions to read without a database to keep them in.
      reader: readerTheScenariosSet,
      // This application listens, over the database in .env rather than a
      // scenario's own, and would otherwise send whatever is queued there
      // every 10 seconds for as long as the run lasts.
      sendsTheEmailQueue: false,
    });
    addExampleForm(application);
    addExampleFailures(application);

    // Port 0 is whatever is free. A fixed one would collide with a development
    // server, and the first person to run both at once would find out the hard
    // way.
    await application.server.listen({ port: 0, host: "127.0.0.1" });
    const address = application.server.addresses()[0];
    if (address === undefined)
      throw new Error("The application is not listening.");
    baseUrl = `http://127.0.0.1:${address.port}`;
  }

  return baseUrl!;
};

/**
 * An application of this scenario's own, the same as the shared one but for
 * what it is called, listening on a port of its own and closed with the
 * scenario.
 *
 * A scenario that needs one needs no database: what it looks at is what the
 * site calls itself in its bars, which is decided as a page is rendered. So it
 * is not the application a @postgres scenario gets, which is built over that
 * scenario's own tables.
 */
export const anApplicationCalled = async (
  world: SpecWorld,
  siteName: string,
): Promise<string> => {
  loadEnvFile();
  const named = await buildApplication(
    { ...loadConfig(), siteName },
    {
      logger: false,
      languages: scenarioLanguages,
      reader: readerTheScenariosSet,
      sendsTheEmailQueue: false,
    },
  );
  namedApplicationsFor(world).push(named);

  await named.server.listen({ port: 0, host: "127.0.0.1" });
  const address = named.server.addresses()[0];
  if (address === undefined) {
    throw new Error("The application called something else is not listening.");
  }
  return `http://127.0.0.1:${address.port}`;
};

// Closed after the scenario that asked for one, server and pool each on their
// own, so that a server that will not close does not leave a pool holding the
// run up until its idle connections time out.
const namedApplications = new WeakMap<SpecWorld, Application[]>();

const namedApplicationsFor = (world: SpecWorld): Application[] => {
  let held = namedApplications.get(world);
  if (held === undefined) {
    held = [];
    namedApplications.set(world, held);
  }
  return held;
};

/**
 * The application a scenario with a database of its own talks to, listening on
 * a port of its own. Nothing it keeps outlives the scenario, and the clock it
 * reads is the one the scenario sets.
 *
 * It is given no reader of its own, unlike the shared one: a scenario with a
 * database keeps real sessions, so who is signed in is whatever the session
 * cookie says, which is what these scenarios are here to find out.
 */
const itsOwn = async (world: SpecWorld): Promise<string> => {
  const databaseUrl = world.database.options.connectionString;
  if (databaseUrl === undefined) {
    throw new Error("The scenario's database has no URL.");
  }

  loadEnvFile();
  const clock = clockFor(world);
  const scenario = await buildApplication(
    {
      ...loadConfig(),
      databaseUrl,
      // The scenarios' own, so that an account brought over from the old site
      // can be made and signed in to whether or not whoever runs them has the
      // real salt in their .env.
      oldSitePasswordSalt: oldSiteSaltForScenarios,
      // Somebody to tell when a service cannot be reached, so that a scenario
      // can see they were told.
      administratorEmailAddress: administratorForScenarios,
      // This application listens on 127.0.0.1, so every scenario's browser
      // reaches it from there, and saying that address is trusted is what lets
      // a scenario ask from another IP address the way something in front of
      // the site would say it. Configured rather than handed to the builder,
      // because the setting is the only way the site is told (trustedProxy.ts).
      trustedProxies: ["127.0.0.1"],
    },
    {
      logger: false,
      languages: scenarioLanguages,
      clock: () => new Date(clock.now.getTime()),
      // Nothing is sent. What these scenarios read is what is waiting in the
      // queue, which is where a reader's link comes from.
      sendsTheEmailQueue: false,
      // Never the real service: a spec run has no business asking Have I Been
      // Pwned about a password, and what it would answer is not what any of
      // these scenarios is about. A scenario that is about a breached password
      // belongs with confirming, which can put one there.
      // Answers that nothing is breached unless the scenario has taken it down,
      // when it refuses as the real one does when Have I Been Pwned does not
      // answer.
      breachedPasswords: {
        isBreached: () =>
          down.get(world)?.has("Have I Been Pwned") === true
            ? Promise.reject(
                new CheckRefused(
                  "BreachedPasswords.Unreachable",
                  "The scenario has taken Have I Been Pwned down.",
                ),
              )
            : Promise.resolve(false),
      },
      // Never Google: a spec run has no business asking it, and a scenario
      // about being judged has to say what the judgement was. It judges a
      // person unless the scenario says otherwise, and a form carrying no
      // token is unjudged here exactly as it would be there.
      readerCheck: {
        // A key of the scenarios' own, so that the page asks for Google's
        // script, and the scenario's browser is handed a stand-in for it.
        siteKey: recaptchaSiteKeyForScenarios,
        judge: (token) => {
          if (token !== undefined) tokensJudgedBy(world).push(token);
          if (down.get(world)?.has("reCAPTCHA") === true) {
            return Promise.reject(
              new Error("The scenario has taken reCAPTCHA down."),
            );
          }
          if (token === undefined || token.trim() === "") {
            return Promise.resolve("no judgement" as const);
          }
          return Promise.resolve(judgements.get(world) ?? "a person");
        },
      },
    },
  );
  applications.set(world, scenario);
  world.accountsInHand = accountsThrough(scenario, () =>
    ReadOnlyDate.from(new Date(clock.now.getTime())),
  );

  // Closed with the scenario's database, before it is dropped, rather than by a
  // hook of its own that might run either side of the drop. The server and the
  // pool each on their own, so that the server failing to close does not leave
  // the pool open, holding the run up until its idle connections time out.
  world.closeBeforeDropping.push(
    () => {
      applications.delete(world);
      return scenario.server.close();
    },
    () => scenario.pool.end(),
  );

  await scenario.server.listen({ port: 0, host: "127.0.0.1" });
  const address = scenario.server.addresses()[0];
  if (address === undefined) {
    throw new Error("The scenario's application is not listening.");
  }
  return `http://127.0.0.1:${address.port}`;
};

const applications = new WeakMap<SpecWorld, Application>();

/** Who the scenarios' application tells when a service cannot be reached. */
export const administratorForScenarios = "administrator@example.com";

// The services a scenario has taken down, by the names the administrator is
// told.
const down = new WeakMap<SpecWorld, Set<string>>();

/** Takes `service` down for this scenario, or brings it back up. */
export const serviceIsDown = (
  world: SpecWorld,
  service: "reCAPTCHA" | "Have I Been Pwned",
  isDown: boolean,
): void => {
  const services = down.get(world) ?? new Set<string>();
  if (isDown) services.add(service);
  else services.delete(service);
  down.set(world, services);
};

/** The site key the scenarios' register page asks Google's script with. */
const recaptchaSiteKeyForScenarios = "the scenarios' reCAPTCHA site key";

// What stands in for Google's script in a scenario's browser. Its token says
// whether it was asked for before or after the reader typed anything, which is
// what a scenario about when the token is asked for looks at.
const recaptchaScriptForScenarios = `
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

// The scenarios whose browser does not load Google's script, as a browser that
// blocks it does not.
const withoutRecaptchaScript = new WeakSet<SpecWorld>();

/** Has this scenario's browser fail to load Google's script. */
export const recaptchaScriptDoesNotLoad = (world: SpecWorld): void => {
  withoutRecaptchaScript.add(world);
};

// Every token the scenario's reCAPTCHA was asked to judge, in order.
const tokensJudged = new WeakMap<SpecWorld, string[]>();

const tokensJudgedBy = (world: SpecWorld): string[] => {
  let judged = tokensJudged.get(world);
  if (judged === undefined) {
    judged = [];
    tokensJudged.set(world, judged);
  }
  return judged;
};

/** The tokens this scenario's reCAPTCHA has been asked to judge. */
export const tokensJudgedFor = (world: SpecWorld): readonly string[] =>
  tokensJudgedBy(world);

// What the scenario's reCAPTCHA says about its reader, when it says anything.
const judgements = new WeakMap<SpecWorld, "a person" | "not a person">();

/** Has this scenario's reCAPTCHA judge its reader `judgement`. */
export const recaptchaJudges = (
  world: SpecWorld,
  judgement: "a person" | "not a person",
): void => {
  judgements.set(world, judgement);
};

/** The application this scenario is talking to, for a step that has to ask it. */
export const applicationFor = (world: SpecWorld): Application => {
  const found = applications.get(world);
  if (found === undefined) {
    throw new Error(
      "This scenario has no application of its own. Tag it @postgres as well as @browser.",
    );
  }
  return found;
};

Before({ tags: "@browser" }, async function (this: SpecWorld) {
  const started = await theBrowser();
  // The @postgres hooks run first — they are loaded first — so a scenario with
  // a database of its own already has it by now.
  this.baseUrl =
    this.pool === undefined ? await theSharedOne() : await itsOwn(this);

  // Scripting off by default, because what these scenarios are mostly here to
  // say is that the public side does not need it. A scenario about the admin
  // SPA asks for it back.
  this.browserContext = await started.newContext({
    javaScriptEnabled: false,
  });
  this.page = await this.browserContext.newPage();
});

// Each of them closed whatever the one before it did: a server that will not
// close would otherwise leave every application after it listening, with its
// pool open, for the rest of the run. What a teardown has to say is nothing
// the scenario's own verdict should be overturned by, as the database's
// teardown says (specs/infrastructure/support/database.ts).
After({ tags: "@browser" }, async function (this: SpecWorld) {
  const held = namedApplications.get(this) ?? [];
  namedApplications.delete(this);

  for (const named of held) {
    for (const close of [() => named.server.close(), () => named.pool.end()]) {
      try {
        await close();
      } catch {
        // Nothing to say, and nothing that saying it would improve.
      }
    }
  }
});

/**
 * Another browser, with cookies of its own: what a scenario means by another
 * device. It is asked for everything the scenario asked of the first but what
 * it was given to keep, since keeping nothing is the point of it.
 */
export const anotherBrowser = async (
  world: SpecWorld,
): Promise<BrowserContext> => {
  const page = world.browserPage;
  if (browser === undefined) throw new Error("No browser is running.");
  return browser.newContext({
    javaScriptEnabled: false,
    viewport: page.viewportSize(),
    ...(world.acceptLanguage === undefined
      ? {}
      : { extraHTTPHeaders: { "accept-language": world.acceptLanguage } }),
  });
};

/**
 * Makes the scenario's browser one with scripting switched on, for a page that
 * cannot be used without it. A browser's scripting is fixed when it is made, so
 * this makes another, asked everything the scenario asked of the first — its
 * width, its colour scheme, its languages and whatever it was given to keep —
 * and closes the first.
 */
export const withScripting = async (world: SpecWorld): Promise<void> => {
  const context = world.browserContext;
  const page = world.page;
  if (context === undefined || page === undefined || browser === undefined) {
    throw new Error(
      "This scenario has no browser. Tag it @browser if it needs one.",
    );
  }

  const scripted = await browser.newContext({
    javaScriptEnabled: true,
    viewport: page.viewportSize(),
    ...(world.colourScheme === undefined
      ? {}
      : { colorScheme: world.colourScheme }),
    ...(world.acceptLanguage === undefined
      ? {}
      : { extraHTTPHeaders: { "accept-language": world.acceptLanguage } }),
  });
  // The cookies the scenario has the first browser keep are as much a part of
  // what it asked for as its width is: the theme it chose, and the reader it is
  // signed in as. Without this a scenario that signs in and then switches to
  // scripting is silently signed out, and reads as though the page were wrong.
  await scripted.addCookies(await context.cookies());
  // Never Google's script, for the reason the scenarios' application never
  // asks Google: a stand-in the scenario can see into, or nothing at all.
  await scripted.route("https://www.google.com/recaptcha/**", (route) =>
    withoutRecaptchaScript.has(world)
      ? route.abort()
      : route.fulfill({
          contentType: "text/javascript",
          body: recaptchaScriptForScenarios,
        }),
  );

  world.browserContext = scripted;
  world.page = await scripted.newPage();
  await context.close();
};

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
