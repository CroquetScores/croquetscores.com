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
// that is gone has nothing left to run.
const changed = new Set([
  ...git(
    "diff",
    "--name-only",
    "--diff-filter=d",
    `${base}...HEAD`,
    "--",
    "*.feature",
  ),
  ...git(
    "diff",
    "--name-only",
    "--diff-filter=d",
    "--cached",
    "--",
    "*.feature",
  ),
  ...git("diff", "--name-only", "--diff-filter=d", "--", "*.feature"),
  ...git("ls-files", "--others", "--exclude-standard", "--", "*.feature"),
  // Anything named on the command line, for a change under /src that no feature
  // file changed alongside.
  ...process.argv.slice(2),
]);

if (changed.size === 0) {
  console.log(
    `No feature file has changed against ${base}, so there is nothing to run.`,
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

const { status } = spawnSync(
  join(root, "node_modules", ".bin", "tsx"),
  [
    join(root, "node_modules", "@cucumber", "cucumber", "bin", "cucumber.js"),
    "--profile",
    "changed",
    ...features,
  ],
  { cwd: root, stdio: "inherit" },
);

process.exit(status ?? 1);
