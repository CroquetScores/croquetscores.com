// Runs the scenarios in the feature files this branch has touched, and no
// others. The whole suite takes long enough that running it after every change
// holds the work up, and nearly all of what it runs has nothing to do with the
// change in front of it. CI still runs every scenario on every pull request, so
// this narrows what is run while work is in hand, not what has to pass.
import { execFileSync, spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

// What the branch is measured against. Everything here branches from main, and
// a branch's own commits are the ones main does not have.
const base = "main";

const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" })
    .split("\n")
    .filter((line) => line.length > 0);

// A change can be in any of four places, and a feature half way through being
// written is usually in the last two. Deletions are filtered out: a feature
// that is gone has nothing left to run, and a source file that is gone has
// nothing left to cover.
const changedIn = (...pathspec) =>
  new Set([
    ...git(
      "diff",
      "--name-only",
      "--diff-filter=d",
      `${base}...HEAD`,
      "--",
      ...pathspec,
    ),
    ...git(
      "diff",
      "--name-only",
      "--diff-filter=d",
      "--cached",
      "--",
      ...pathspec,
    ),
    ...git("diff", "--name-only", "--diff-filter=d", "--", ...pathspec),
    ...git("ls-files", "--others", "--exclude-standard", "--", ...pathspec),
  ]);

const changed = new Set([
  ...changedIn("*.feature"),
  // Anything named on the command line, for a change under /src that no feature
  // file changed alongside.
  ...process.argv.slice(2),
]);

if (changed.size === 0) {
  // A branch that changed something under /src and no feature file beside it is
  // the one case where running nothing must not read as passing: the scenarios
  // that cover that source file exist, and the run simply did not find them by
  // looking at what changed. AI.md says to name the feature by hand here, and
  // this is what makes that more than advice. A branch that touched neither —
  // documents, settings, this script — has genuinely nothing to run.
  const source = changedIn("src/*");
  if (source.size > 0) {
    console.error(
      `No feature file has changed against ${base}, but ${source.size} file${source.size === 1 ? " under /src has" : "s under /src have"}:`,
    );
    for (const file of [...source].sort()) console.error(`  ${file}`);
    console.error("");
    console.error(
      "Name the feature that covers the change: npm run test:changed -- specs/.../Thing.feature",
    );
    process.exit(1);
  }

  console.log(
    `No feature file has changed against ${base}, and nothing under /src has either, so there is nothing to run.`,
  );
  console.log(
    "Name one to run it anyway: npm run test:changed -- specs/.../Thing.feature",
  );
  process.exit(0);
}

const features = [...changed].sort();
console.log(
  `Running ${features.length} feature file${features.length === 1 ? "" : "s"}:`,
);
for (const feature of features) console.log(`  ${feature}`);
console.log("");

// Node is spawned against tsx's own entry point rather than the shim in
// node_modules/.bin, because the shim is a shell script with no extension that
// Windows cannot execute, and its .cmd twin cannot be spawned without a shell.
// Going straight to the entry point needs neither, so the one line runs the
// same on every platform.
const { status, error } = spawnSync(
  process.execPath,
  [
    join(root, "node_modules", "tsx", "dist", "cli.mjs"),
    join(root, "node_modules", "@cucumber", "cucumber", "bin", "cucumber.js"),
    "--profile",
    "changed",
    ...features,
  ],
  { cwd: root, stdio: "inherit" },
);

// A run that never started is not a run that failed, and saying so is the
// difference between looking at the scenarios and looking at the install.
if (error !== undefined) {
  console.error(`The scenarios could not be run: ${error.message}`);
  console.error("Check that dependencies are installed: npm install");
  process.exit(1);
}

process.exit(status ?? 1);
