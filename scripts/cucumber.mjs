// Cucumber's settings, one profile to each npm script that runs scenarios.
// Cucumber finds a configuration file in the project's root unless it is told
// otherwise, so every script that runs it says --config scripts/cucumber.mjs.
// The paths and the loader below are still from the root, where it is run.
//
// JavaScript rather than JSON so that what every profile shares is written
// once. A support folder added to one copy of the import list and missed in
// another would load the steps for some runs and not others, and the scenarios
// would fail in one script for a reason nowhere in the code.
//
// There are two families of profiles, because there are two kinds of spec and
// they must not meet. One is the in-process specs, which build the application
// and reach into the layers they describe; the other is `specs/web`, which
// starts the site as a process of its own and knows it only by its address.
// Both define steps in the same words, so loading both into one run would make
// each ambiguous. A profile `x` is the first kind and `webX` the second, and
// scripts/run-cucumber.mjs runs the two in turn.

const units = {
  import: [
    "specs/{application,domain,infrastructure,web-units}/**/*.steps.ts",
    "specs/support/**/*.ts",
    "specs/infrastructure/support/**/*.ts",
    "specs/web-units/support/**/*.ts",
  ],
  // Registered in each worker thread, which does not inherit the tsx the main
  // thread was started with. scripts/cucumber-loader.mjs says why it is needed.
  loader: ["./scripts/cucumber-loader.mjs"],
  // One at a time, the whole suite took twenty-four minutes; six at a time it
  // takes five. Six is the cores of the machine this is worked on, and CI asks
  // for its own number on the command line, which overrides this one.
  parallel: 6,
  formatOptions: {
    snippetInterface: "async-await",
  },
};

// The black-box specs load nothing outside their own folder: that is the rule
// they exist to keep (eslint.config.js holds them to it).
const web = {
  ...units,
  import: ["specs/web/**/*.ts"],
};

// Each profile writes its reports under its own name, so running one script
// does not overwrite what another last reported. The summary is how long the
// run took as a whole, which the progress bar prints and then scrolls away.
const reports = (name) => [
  "progress-bar",
  `html:reports/${name}.html`,
  `summary:reports/${name}-summary.txt`,
];

const unitFeatures = [
  "specs/{application,domain,infrastructure,web-units}/**/*.feature",
];
const webFeatures = ["specs/web/**/*.feature"];

// What differs between the profiles is the same for both families.
const kinds = {
  default: { name: "cucumber" },
  nodb: { name: "cucumber-nodb", tags: "not @postgres" },
  db: { name: "cucumber-db", tags: "@postgres" },
  browser: { name: "cucumber-browser", tags: "@browser" },
  nobrowser: { name: "cucumber-nobrowser", tags: "not @browser" },
};

const profile = (family, features, prefix, kind) => ({
  ...family,
  paths: features,
  ...(kind.tags === undefined ? {} : { tags: kind.tags }),
  format: reports(`${prefix}${kind.name}`),
});

export default profile(units, unitFeatures, "", kinds.default);
export const nodb = profile(units, unitFeatures, "", kinds.nodb);
export const db = profile(units, unitFeatures, "", kinds.db);
export const browser = profile(units, unitFeatures, "", kinds.browser);
export const nobrowser = profile(units, unitFeatures, "", kinds.nobrowser);

export const webDefault = profile(web, webFeatures, "web-", kinds.default);
export const webNodb = profile(web, webFeatures, "web-", kinds.nodb);
export const webDb = profile(web, webFeatures, "web-", kinds.db);
export const webBrowser = profile(web, webFeatures, "web-", kinds.browser);
export const webNobrowser = profile(web, webFeatures, "web-", kinds.nobrowser);

// No paths: scripts/test-changed.mjs names the features to run.
export const changed = {
  ...units,
  format: reports("cucumber-changed"),
};
export const webChanged = {
  ...web,
  format: reports("web-cucumber-changed"),
};
