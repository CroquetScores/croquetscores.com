// Run by Claude Code when it is about to say it has finished
// (.claude/settings.json). AI.md §6 asks for the typecheck and the lint to
// pass before anything is called done, and a request can be forgotten where
// this cannot: if either fails, Claude Code is told what they said and does
// not stop.
//
// Only where the code is not what it was the last time both passed. Answering
// a question changes nothing, and running both after every answer would cost
// most of a minute for no reason, as would running them again for a tree that
// already has uncommitted code in it which they have already passed. What
// passed is remembered as a fingerprint of the changed code files, in git's own
// folder, where nothing is committed or has to be ignored.
//
// Once only. When Claude Code has already been sent back by this check it says
// so (`stop_hook_active`), and a second refusal on the same turn could go on
// for ever over something it cannot fix, such as a lint rule it was told to
// leave alone; it is let finish, and the failure is still in what it was told.
//
// The scenarios are not run here: they take far too long, and the person at
// the keyboard decides whether they are (AI.md §6).
//
// Anything it cannot work out, such as git not being there, lets Claude Code
// finish: a check that stops work over its own trouble is worse than none.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Said from the project and not from wherever the hook happened to start,
// where git and npm would answer for the wrong folder.
const project = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

let again = false;
try {
  again = JSON.parse(readFileSync(0, "utf8"))?.stop_hook_active === true;
} catch {
  // Nothing readable on standard input is the same as being asked the first time.
}
if (again) process.exit(0);

const git = (...args) =>
  spawnSync("git", args, { cwd: project, encoding: "utf8" });

// Every file git sees as changed or new, with NUL between them so that a path
// with a space or a letter outside ASCII is whole and not quoted. A rename or a
// copy is followed by the path it came from, which is not a file of its own.
const status = git("status", "--porcelain=v1", "-z", "--untracked-files=all");
if (status.error || status.status !== 0 || typeof status.stdout !== "string") {
  process.exit(0);
}
const entries = status.stdout.split("\0").filter((entry) => entry !== "");
const changed = [];
for (let at = 0; at < entries.length; at += 1) {
  const entry = entries[at];
  const how = entry.slice(0, 2);
  changed.push({ how, path: entry.slice(3) });
  if (how.includes("R") || how.includes("C")) at += 1;
}
const code = changed.filter(({ path }) =>
  /\.(?:ts|tsx|js|mjs|cjs)$/.test(path),
);
if (code.length === 0) process.exit(0);

// What the code is: which files, how git sees each, and what is in each.
const print = createHash("sha1");
for (const { how, path } of code.sort((a, b) => a.path.localeCompare(b.path))) {
  let content = "gone";
  try {
    content = createHash("sha1")
      .update(readFileSync(resolve(project, path)))
      .digest("hex");
  } catch {
    // A deleted file has no content, and that is part of what it is.
  }
  print.update(`${how} ${path} ${content}\n`);
}
const fingerprint = print.digest("hex");

const remembered = resolve(
  project,
  git("rev-parse", "--git-path", "claude-stop-check").stdout.trim(),
);
try {
  if (readFileSync(remembered, "utf8") === fingerprint) process.exit(0);
} catch {
  // Never passed here, which is the same as the code having changed.
}

for (const script of ["typecheck", "lint"]) {
  // A shell, because npm is a script on Windows and cannot be run without one.
  const run = spawnSync(`npm run ${script}`, {
    cwd: project,
    encoding: "utf8",
    shell: true,
  });
  if (run.status !== 0) {
    const said = `${run.stdout}${run.stderr}`.trim().split("\n");
    console.error(
      `npm run ${script} fails, and AI.md §6 asks for it to pass before anything is called done. The end of what it said:\n\n${said.slice(-60).join("\n")}`,
    );
    process.exit(2);
  }
}

try {
  writeFileSync(remembered, fingerprint);
} catch {
  // Not remembered is only a check made again next time.
}
