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
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, type Browser, type BrowserContext } from "playwright";

// Loaded here so that whatever loads this has already registered the hooks that
// give a scenario its database: hooks run in the order they were defined, and a
// scenario's application is built over a database that must exist by then.
import "../../infrastructure/support/database.js";
import {
  loadConfig,
  loadEnvFile,
  type Config,
} from "../../../src/infrastructure/config/Config.js";
import { CheckRefused } from "../../../src/application/services/BreachedPasswords.js";
import { ListRefused } from "../../../src/application/services/WorldRankingLists.js";
import { Website } from "../../../src/domain/common/Website.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import { siteNameFor as nameOfSite } from "../../../src/web/common/site.js";
import type { HelpLibrary } from "../../../src/web/common/helpLibrary.js";
import type { Language } from "../../../src/web/common/language.js";
import { buildApplication, type Application } from "../../../src/web/server.js";
import type { SpecWorld } from "../../support/world.js";
import { accountsThrough, oldSiteSaltForScenarios } from "./accounts.js";
import { clockFor } from "./clock.js";
import { addExampleFailures } from "./exampleFailures.js";
import { addExampleForm } from "./exampleForm.js";
import { scenarioLanguages } from "./languages.js";
import {
  googleCredentialsForScenarios,
  standInGoogleFor,
} from "../../infrastructure/support/google.js";
import { readerTheScenariosSet } from "./reader.js";
import { tournamentsThrough } from "./tournaments.js";

let browser: Browser | undefined;
let application: Application | undefined;
let baseUrl: string | undefined;

// What each scenario has deployed the site as, where it has deployed it again.
// Nothing is the build the admin was built to.
const deployedAs = new WeakMap<SpecWorld, string>();

/** Deploys the site again: from now on it names another build. */
export const deployAgain = (world: SpecWorld): void => {
  deployedAs.set(world, "built-again-by-the-scenario");
};

// Where the switch for maintenance is kept for every site a scenario here
// stands up: nowhere, so that the site is never found down because whoever runs
// the scenarios has turned access off in the file their own site reads
// (maintenance.feature is about that, in its own scenarios).
const noSwitch = join(tmpdir(), "specs-database-access-is-never-off");

// The one browser, launched by the first scenario that needs one.
const theBrowser = async (): Promise<Browser> => {
  browser ??= await chromium.launch();
  return browser;
};

// The application every scenario without a database of its own talks to.
const theSharedOne = async (): Promise<string> => {
  if (application === undefined) {
    loadEnvFile();
    application = await buildApplication(
      {
        ...loadConfig({ ...process.env, DATABASE_ACCESS_FILE: noSwitch }),
        // This application listens on 127.0.0.1, which is trusted to say which
        // website the browser addressed, as something in front of the site
        // would (trustedProxy.ts).
        trustedProxies: ["127.0.0.1"],
      },
      {
        logger: false,
        languages: scenarioLanguages,
        // Who a scenario's reader is, which it says with a cookie of its own:
        // there are no sessions to read without a database to keep them in.
        reader: readerTheScenariosSet,
        // This application listens, over the database in .env rather than a
        // scenario's own, and would otherwise send whatever is queued there
        // every 10 seconds for as long as the run lasts.
        sendsTheEmailQueue: false,
      },
    );
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
 * An application of this scenario's own that is told no proxy forwards requests
 * to it, so that a host a request says it was forwarded for is not believed.
 */
export const anApplicationBelievingNoProxy = (
  world: SpecWorld,
): Promise<string> => anApplicationWith(world, { trustedProxies: [] });

/**
 * An application of this scenario's own that has not been given Google's
 * credentials, and otherwise as {@link anApplicationCalled}.
 */
export const anApplicationWithoutGoogle = (world: SpecWorld): Promise<string> =>
  anApplicationWith(world, { google: undefined });

// Which website each scenario's browser says it is addressing, where it says
// one. Nothing is development, which is what the application is reached as.
const addressed = new WeakMap<SpecWorld, string>();

// The browser reaches the application on 127.0.0.1 and a port, which is
// development. Saying it is reaching another website is what something in front
// of the site would do: it forwards the host the reader typed, and the
// application believes it from 127.0.0.1, which it is told to trust.
const addressedAs = async (
  context: BrowserContext,
  host: string,
): Promise<void> => {
  await context.route("**/*", (route) =>
    route.continue({
      headers: {
        ...route.request().headers(),
        "x-forwarded-host": host,
      },
    }),
  );
};

/**
 * The scenario's browser addressing the host `host`, which need not be any
 * website's, from now on and in
 * any browser the scenario makes after this one, rather than the development
 * website the application is reached as. Answers where the application is.
 */
export const anApplicationServedAs = async (
  world: SpecWorld,
  host: string,
): Promise<string> => {
  addressed.set(world, host);
  if (world.browserContext !== undefined) {
    await addressedAs(world.browserContext, host);
  }
  // A scenario with no browser has no application yet, and makes the one its
  // requests are sent to.
  world.baseUrl ??= await anApplicationWith(world, {});
  return world.baseUrl;
};

/**
 * The header that has a plain request say which website it is addressing, as
 * the scenario's browser does: none for development, which is what the
 * application is reached as.
 */
export const addressingOf = (world: SpecWorld): Record<string, string> => {
  const host = addressed.get(world);
  return host === undefined ? {} : { "x-forwarded-host": host };
};

/**
 * An application of this scenario's own told who administers it, offering the
 * languages the site is served with, and otherwise as
 * {@link anApplicationCalled}.
 */
export const anApplicationAdministeredBy = (
  world: SpecWorld,
  emailAddress: string,
): Promise<string> =>
  anApplicationWith(
    world,
    { administratorEmailAddress: emailAddress },
    "its own",
  );

/**
 * An application of this scenario's own offering the languages the site is
 * served with rather than the scenarios' English and test locale, and
 * otherwise as {@link anApplicationCalled}. Given none, so that it is the
 * site's own choice that is offered and not a copy of it written down here.
 */
export const anApplicationOfferingItsOwnLanguages = (
  world: SpecWorld,
): Promise<string> => anApplicationWith(world, {}, "its own");

/**
 * An application of this scenario's own reading the help it is given instead
 * of the one the build wrote, offering the site's own languages, and otherwise
 * as {@link anApplicationCalled}.
 */
export const anApplicationWithHelp = (
  world: SpecWorld,
  help: HelpLibrary,
): Promise<string> => anApplicationWith(world, {}, "its own", help);

/**
 * An application of this scenario's own reading the help it is given, and
 * otherwise as {@link anApplicationCalled}: offering the scenarios' English and
 * test locale, for a scenario that holds the words of a page to the test locale
 * as well as giving it help of its own.
 */
export const anApplicationWithHelpInTheScenariosLanguages = (
  world: SpecWorld,
  help: HelpLibrary,
): Promise<string> => anApplicationWith(world, {}, undefined, help);

// Which languages a scenario's application offers: the scenarios', or the
// site's own. Named rather than left as undefined for the second, because an
// undefined argument takes a parameter's default, which is the first.
type Offering = readonly Language[] | "its own";

// Left out altogether for the site's own, rather than given as undefined, which
// the options' type does not allow.
const offered = (
  offering: Offering,
): { readonly languages?: readonly Language[] } =>
  offering === "its own" ? {} : { languages: offering };

// What a scenario has asked of its own application so far, so that asking for
// something more keeps what it asked for before: a site served as one website
// and then asked to offer its own languages is that website still, offering
// them, rather than whatever website the settings name.
const askedOf = new WeakMap<
  SpecWorld,
  {
    changed: Partial<Config>;
    languages: Offering | undefined;
    help: HelpLibrary | undefined;
  }
>();

const anApplicationWith = async (
  world: SpecWorld,
  asked: Partial<Config>,
  asking?: Offering,
  askingForHelp?: HelpLibrary,
): Promise<string> => {
  const before = askedOf.get(world);
  const changed = { ...before?.changed, ...asked };
  const languages = asking ?? before?.languages;
  const help = askingForHelp ?? before?.help;
  askedOf.set(world, { changed, languages, help });
  const helpGiven = help === undefined ? {} : { help };
  if (world.pool !== undefined) {
    return itsOwn(world, changed, languages ?? scenarioLanguages, help);
  }

  loadEnvFile();
  const named = await buildApplication(
    {
      ...loadConfig({ ...process.env, DATABASE_ACCESS_FILE: noSwitch }),
      // Trusted to say which website the browser addressed, as in the shared
      // application, unless a scenario says otherwise.
      trustedProxies: ["127.0.0.1"],
      ...changed,
    },
    {
      logger: false,
      ...offered(languages ?? scenarioLanguages),
      ...helpGiven,
      reader: readerTheScenariosSet,
      sendsTheEmailQueue: false,
    },
  );
  namedApplicationsFor(world).push(named);

  await named.server.listen({ port: 0, host: "127.0.0.1" });
  const address = named.server.addresses()[0];
  if (address === undefined) {
    throw new Error("The scenario's own application is not listening.");
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
 * What the site the scenario's browser is talking to is called, worked out
 * from the website it addresses rather than read off a page, so that a
 * scenario can hold a page to the name without that page having to show it
 * anywhere else first.
 */
export const siteNameFor = (world: SpecWorld): string =>
  nameOfSite(Website.addressedTo(addressed.get(world) ?? "localhost"));

/**
 * The application a scenario with a database of its own talks to, listening on
 * a port of its own. Nothing it keeps outlives the scenario, and the clock it
 * reads is the one the scenario sets.
 *
 * It is given no reader of its own, unlike the shared one: a scenario with a
 * database keeps real sessions, so who is signed in is whatever the session
 * cookie says, which is what these scenarios are here to find out.
 */
const itsOwn = async (
  world: SpecWorld,
  changed: Partial<Config> = {},
  languages: Offering = scenarioLanguages,
  help?: HelpLibrary,
): Promise<string> => {
  const databaseUrl = world.database.options.connectionString;
  if (databaseUrl === undefined) {
    throw new Error("The scenario's database has no URL.");
  }

  loadEnvFile();
  const clock = clockFor(world);
  const google = await standInGoogleFor(world);
  const scenario = await buildApplication(
    {
      ...loadConfig({ ...process.env, DATABASE_ACCESS_FILE: noSwitch }),
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
      // The scenarios' own, for the stand-in below, so that the register page
      // offers registering with Google whatever is in .env. A scenario about a
      // site without them takes them away.
      google: googleCredentialsForScenarios,
      ...changed,
    },
    {
      logger: false,
      ...offered(languages),
      ...(help === undefined ? {} : { help }),
      clock: () => new Date(clock.now.getTime()),
      // What the admin's build is called, which a scenario changes to deploy
      // the site again (newerBuild.feature).
      build: () => deployedAs.get(world),
      // Nothing is sent. What these scenarios read is what is waiting in the
      // queue, which is where a reader's link comes from.
      sendsTheEmailQueue: false,
      // Never Google, for the reason reCAPTCHA is never asked below: a stand-in
      // of the scenario's own, which says what the scenario has Google say.
      googleEndpoints: google.endpoints,
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
      // Never the rankings' own site, for the same reason: the fake the
      // scenario stands up, asked for when the import reads a list, since the
      // step standing it up comes after the application is built. With none,
      // the lists cannot be reached, as a site that is not there cannot.
      worldRankingLists: {
        playersOf: (sport) =>
          world.worldRankingLists?.playersOf(sport) ??
          Promise.reject(
            new ListRefused(
              "WorldRankingLists.Unreachable",
              "The scenario stood up no world rankings.",
            ),
          ),
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
  const now = (): ReadOnlyDate =>
    ReadOnlyDate.from(new Date(clock.now.getTime()));
  world.accountsInHand = accountsThrough(scenario, now);
  world.tournamentsInHand = tournamentsThrough(scenario, now);

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
  const another = await browser.newContext({
    javaScriptEnabled: false,
    viewport: page.viewportSize(),
    ...(world.acceptLanguage === undefined
      ? {}
      : { extraHTTPHeaders: { "accept-language": world.acceptLanguage } }),
  });
  const host = addressed.get(world);
  if (host !== undefined) await addressedAs(another, host);
  return another;
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
  const host = addressed.get(world);
  if (host !== undefined) await addressedAs(scripted, host);
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
