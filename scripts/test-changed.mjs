// Runs the scenarios in the feature files this branch has touched, and no
// others. The whole suite takes long enough that running it after every change
// holds the work up, and nearly all of what it runs has nothing to do with the
// change in front of it. CI still runs every scenario on every pull request, so
// this narrows what is run while work is in hand, not what has to pass.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);

const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" })
    .split("\n")
    .filter((line) => line.length > 0);

const hasRef = (ref) => {
  try {
    execFileSync(
      "git",
      ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`],
      {
        cwd: root,
        stdio: "ignore",
      },
    );
    return true;
  } catch {
    return false;
  }
};

// What the branch is measured against. Everything here branches from main, and
// a branch's own commits are the ones main does not have — but the local main
// ref is only as fresh as the last fetch, and is routinely behind. Measuring
// against a stale one counts commits already on main as the branch's own,
// which was harmless while the worst of it was running a few scenarios too
// many, and is not harmless now that finding nothing to run can fail: a branch
// would be refused over source files somebody else wrote. So the remote's ref
// is preferred where there is one, and the local one is what a clone with no
// remote falls back to.
const base = hasRef("origin/main") ? "origin/main" : "main";

// A change can be in any of four places, and a feature half way through being
// written is usually in the last two. Deletions are filtered out: a feature
// that is gone has nothing left to run, and a file that is gone has nothing
// left to cover.
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

// Anything named on the command line, for a change under /src that no feature
// file changed alongside. A switch is not a feature file, and passing one on as
// though it were leaves cucumber to refuse it several lines later: it is
// refused here instead, where what is wrong with it can be said.
const named = process.argv.slice(2);
const switches = named.filter((argument) => argument.startsWith("-"));
if (switches.length > 0) {
  console.error(
    `This takes feature files to run, and nothing else. It was given ${switches.join(", ")}.`,
  );
  console.error(
    "Name a feature to run it: npm run test:changed -- specs/.../Thing.feature",
  );
  process.exit(1);
}

// A feature named by hand that is not there. Cucumber finds no scenario in it,
// says so, and answers that nothing failed, which is the one thing this script
// exists to stop: a run of nothing must not read as passing. A path with a
// line number on the end names the same file.
const missing = named.filter(
  (feature) => !existsSync(join(root, feature.replace(/:\d+$/, ""))),
);
if (missing.length > 0) {
  console.error(
    `There is no such feature file: ${missing.join(", ")}. Nothing was run.`,
  );
  process.exit(1);
}

const changed = new Set([...changedIn("*.feature"), ...named]);

const listed = (files) => {
  for (const file of [...files].sort()) console.error(`  ${file}`);
  console.error("");
};

// Code that changed with no feature file beside it is the one case where
// running nothing must not read as passing: the scenarios covering it exist,
// and the run simply did not find them by looking at what changed. Step
// definitions count as much as /src does — a branch can rewrite a steps file
// without touching the feature it belongs to, and that is a change to how the
// scenarios are carried out with nothing run to show for it. A branch that
// touched neither, such as one that only changed documents or settings, has
// genuinely nothing to run.
const code = changedIn("src/*", "specs/*.ts");

// AI.md asks for the whole suite by hand where a change reaches further than
// its own feature, and names a spec's support as exactly that: cucumber.json
// imports every support folder on every run, so there is no one feature to
// name. All three are counted, not specs/support alone — specs/web/support and
// specs/infrastructure/support are loaded just as widely, and a change to one
// of them is under no single feature either.
const reaching = [...code].filter((file) =>
  /^specs\/(.*\/)?support\//.test(file),
);

if (changed.size === 0) {
  if (reaching.length > 0) {
    console.error(
      `No feature file has changed against ${base}, and what did change is loaded by every spec:`,
    );
    listed(reaching);
    console.error(
      "This reaches further than one feature, so run the whole suite: npm test",
    );
    process.exit(1);
  }

  if (code.size > 0) {
    console.error(
      `No feature file has changed against ${base}, but ${code.size} file${code.size === 1 ? " has" : "s have"}:`,
    );
    listed(code);
    console.error(
      "Name the feature that covers the change: npm run test:changed -- specs/.../Thing.feature",
    );
    process.exit(1);
  }

  console.log(
    `No feature file has changed against ${base}, and no code has either, so there is nothing to run.`,
  );
  console.log(
    "Name one to run it anyway: npm run test:changed -- specs/.../Thing.feature",
  );
  process.exit(0);
}

// A change under a spec's support reaches every spec whether or not a feature
// changed beside it, so it is said here as well as where nothing was found to
// run. It is said rather than refused: there is a narrowed run to make, and
// what the whole suite would add is the reader's to weigh.
if (reaching.length > 0) {
  console.error("What changed under a spec's support is loaded by every spec:");
  listed(reaching);
  console.error(
    "That reaches further than the features below, so run the whole suite as well: npm test",
  );
  console.error("");
}

const features = [...changed].sort();
console.log(
  `Running ${features.length} feature file${features.length === 1 ? "" : "s"} against ${base}:`,
);
for (const feature of features) console.log(`  ${feature}`);
console.log("");

// Node is spawned against tsx's own entry point rather than the shim in
// node_modules/.bin, because the shim is a shell script with no extension that
// Windows cannot execute, and its .cmd twin cannot be spawned without a shell.
// Both entry points are resolved rather than built from a path under
// node_modules, so that a layout which is not npm's flat one — pnpm, or a
// workspace hoisting its dependencies elsewhere — finds them where they are.
// Cucumber's own bin is reached through its package.json, which is the only
// thing it exports, and names the bin so a move survives.
const tsx = require.resolve("tsx/cli");
const cucumberPackage = require.resolve("@cucumber/cucumber/package.json");
const cucumber = join(
  dirname(cucumberPackage),
  require(cucumberPackage).bin["cucumber-js"],
);

const { status, error } = spawnSync(
  process.execPath,
  [tsx, cucumber, "--profile", "changed", ...features],
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
