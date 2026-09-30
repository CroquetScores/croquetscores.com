// Cucumber's settings, one profile to each npm script that runs scenarios.
//
// JavaScript rather than JSON so that what every profile shares is written
// once. A support folder added to one copy of the import list and missed in
// another would load the steps for some runs and not others, and the scenarios
// would fail in one script for a reason nowhere in the code.

const shared = {
  import: [
    "specs/**/*.steps.ts",
    "specs/support/**/*.ts",
    "specs/infrastructure/support/**/*.ts",
    "specs/web/support/**/*.ts",
  ],
  // Registered in each worker thread, which does not inherit the tsx the main
  // thread was started with. cucumber-loader.mjs says why it is needed.
  loader: ["./cucumber-loader.mjs"],
  // One at a time, the whole suite took twenty-four minutes; six at a time it
  // takes five. Six is the cores of the machine this is worked on, and CI asks
  // for its own number on the command line, which overrides this one.
  parallel: 6,
  formatOptions: {
    snippetInterface: "async-await",
  },
};

// Each profile writes its reports under its own name, so running one script
// does not overwrite what another last reported. The timing report is how
// long each step took, the most time first: where to look when making the
// suite faster. cucumber-timing.mjs says why it is not Cucumber's own. The
// summary is how long the run took as a whole, which the progress bar prints
// and then scrolls away.
const reports = (name) => [
  "progress-bar",
  `html:reports/${name}.html`,
  `./cucumber-timing.mjs:reports/${name}-timing.txt`,
  `summary:reports/${name}-summary.txt`,
];

const everyFeature = ["specs/**/*.feature"];

export default {
  ...shared,
  paths: everyFeature,
  format: reports("cucumber"),
};

export const nodb = {
  ...shared,
  paths: everyFeature,
  tags: "not @postgres",
  format: reports("cucumber-nodb"),
};

export const db = {
  ...shared,
  paths: everyFeature,
  tags: "@postgres",
  format: reports("cucumber-db"),
};

export const browser = {
  ...shared,
  paths: everyFeature,
  tags: "@browser",
  format: reports("cucumber-browser"),
};

// No paths: scripts/test-changed.mjs names the features to run.
export const changed = {
  ...shared,
  format: reports("cucumber-changed"),
};
