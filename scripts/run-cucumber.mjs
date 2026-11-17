// Runs one kind of scenario twice: the in-process specs, and then the black-box
// ones in `specs/web`. They are two runs because they define steps in the same
// words and cannot be loaded together (scripts/cucumber.mjs says why). The
// second is run even when the first fails, so that one report says everything
// that is wrong, and the exit status is the worse of the two.
//
//   node scripts/run-cucumber.mjs nodb --parallel 2 --shard 1/4
//
// The first word is the kind of run: default, nodb, db, browser or nobrowser,
// or changed or changed-browser, which are given feature files to run and send
// each to the family it belongs to, running a family only if it was given one.
// Whatever else follows is handed to Cucumber for each run.
import { spawnSync } from "node:child_process";
import { appendFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);

const [kind = "default", ...rest] = process.argv.slice(2);
const kinds = [
  "default",
  "nodb",
  "db",
  "browser",
  "nobrowser",
  "changed",
  "changed-browser",
];
if (!kinds.includes(kind)) {
  console.error(`The first word is one of ${kinds.join(", ")}, not ${kind}.`);
  process.exit(1);
}

// Node is spawned against tsx's own entry point, for the reason in
// scripts/test-changed.mjs.
const tsx = require.resolve("tsx/cli");
const cucumberPackage = require.resolve("@cucumber/cucumber/package.json");
const cucumber = join(
  dirname(cucumberPackage),
  require(cucumberPackage).bin["cucumber-js"],
);

const changed = kind.startsWith("changed");
const features = rest.filter((argument) => argument.endsWith(".feature"));
const options = rest.filter((argument) => !argument.endsWith(".feature"));
const isWeb = (feature) =>
  feature.replaceAll("\\", "/").startsWith("specs/web/");

// The profile and the arguments of each run. A kind of run over every feature
// has Cucumber find them; a changed one names them, and the browser kind of it
// only the scenarios that are browser ones.
const runs = changed
  ? [
      {
        profile: "changed",
        arguments: [
          ...options,
          ...(kind === "changed-browser" ? ["--tags", "@browser"] : []),
          ...features.filter((feature) => !isWeb(feature)),
        ],
        wanted: features.some((feature) => !isWeb(feature)),
      },
      {
        profile: "webChanged",
        arguments: [
          ...options,
          ...(kind === "changed-browser" ? ["--tags", "@browser"] : []),
          ...features.filter(isWeb),
        ],
        wanted: features.some(isWeb),
      },
    ]
  : [
      { profile: kind, arguments: rest, wanted: true },
      {
        profile: `web${kind[0].toUpperCase()}${kind.slice(1)}`,
        arguments: rest,
        wanted: true,
      },
    ];

// Cucumber registers the loader in scripts/cucumber.mjs with module.register(),
// which Node deprecates (DEP0205), and it does so in the main thread and again in
// every worker, so each run printed the warning seven times over. Cucumber is at
// its latest release and has no other way to hand a worker tsx, so that warning,
// and only that one, is turned off, in NODE_OPTIONS so that the workers have it
// too. Remove this when Cucumber moves to module.registerHooks().
const quietedEnvironment = {
  ...process.env,
  NODE_OPTIONS:
    `${process.env.NODE_OPTIONS ?? ""} --disable-warning=DEP0205`.trim(),
};

// How long a run took, as a person reads it.
const taken = (milliseconds) => {
  const seconds = Math.round(milliseconds / 1000);
  return seconds < 60
    ? `${seconds}s`
    : `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
};

// Where a profile writes its HTML report, read from the profile itself so that
// the name is said once, in scripts/cucumber.mjs.
const profiles = await import("./cucumber.mjs");
const reportOf = (profile) =>
  (profiles[profile] ?? profiles.default).format
    .find((format) => format.startsWith("html:"))
    ?.slice("html:".length);

const results = [];
const started = Date.now();
let worst = 0;
for (const { profile, arguments: given, wanted } of runs) {
  if (!wanted) continue;
  const began = Date.now();
  const { status, error } = spawnSync(
    process.execPath,
    [
      tsx,
      cucumber,
      "--config",
      "scripts/cucumber.mjs",
      "--profile",
      profile,
      ...given,
    ],
    { cwd: root, stdio: "inherit", env: quietedEnvironment },
  );
  if (error !== undefined) {
    console.error(`The scenarios could not be run: ${error.message}`);
    process.exit(1);
  }
  worst = Math.max(worst, status ?? 1);
  results.push({
    // The in-process specs and the black-box ones, which the profile's name
    // tells apart.
    family: profile.startsWith("web") ? "web" : "in-process",
    passed: status === 0,
    time: Date.now() - began,
    report: reportOf(profile),
  });
}

// What was run, whether it passed, and how long it took, said at the end where
// the progress bar leaves off, and kept in reports/test-times.txt so that runs
// can be compared. A failure says where its report is.
const lines = results.map(
  ({ family, passed, time, report }) =>
    `  ${family.padEnd(10)}  ${passed ? "passed" : "FAILED"}  ${taken(time).padStart(8)}` +
    (passed || report === undefined ? "" : `  report: ${report}`),
);
const total = `Total ${taken(Date.now() - started)}: ${worst === 0 ? "passed" : "FAILED"}`;
console.log(`\n${[...lines, total].join("\n")}`);
try {
  mkdirSync(join(root, "reports"), { recursive: true });
  appendFileSync(
    join(root, "reports", "test-times.txt"),
    `${new Date().toISOString()}  ${kind}  ${results
      .map(
        ({ family, passed, time }) =>
          `${family} ${passed ? "passed" : "FAILED"} ${taken(time)}`,
      )
      .join(", ")}  ${total}\n`,
  );
} catch {
  // Keeping the times is a convenience, and never what fails a run.
}
process.exit(worst);
