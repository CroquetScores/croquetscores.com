// Which version of the website a build is (buildVersion.feature): the number of
// commits on main, worked out when the site is built and written down beside
// the build for the site to read as it starts.
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";

// What git says, or nothing where it could not be asked or would not say: no
// git, no repository, or a repository with nothing in it. Each of them is a
// build that cannot know its version, which is not a failure of the build.
const gitSays = (
  folder: string,
  args: readonly string[],
): string | undefined => {
  try {
    return execFileSync("git", args, {
      cwd: folder,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return undefined;
  }
};

/**
 * The number of commits on the line of history `folder` is at the end of, or
 * nothing where that cannot be known.
 *
 * Counted along the first parent only, so that a merge counts once however
 * many commits it brought in: it is the number of times main moved. A squash
 * merge is one commit, so for this repository that is the number of pull
 * requests merged. Counted from where the folder is rather than from a branch
 * of a name, since a server has a commit checked out and not a branch.
 *
 * A history cut short, as a build in CI has it to be quick, gives nothing. A
 * number that was small and wrong would be taken for the real one.
 */
export const versionOfHistory = (folder: string): number | undefined => {
  if (gitSays(folder, ["rev-parse", "--is-shallow-repository"]) !== "false") {
    return undefined;
  }
  const counted = gitSays(folder, [
    "rev-list",
    "--count",
    "--first-parent",
    "HEAD",
  ]);
  if (counted === undefined || !/^[0-9]+$/.test(counted)) return undefined;
  const version = Number(counted);
  return version > 0 ? version : undefined;
};

/**
 * Writes `version` into `file`, or takes the file away where there is none, so
 * that a build that cannot know its version does not leave the last build's
 * behind to be read as its own.
 *
 * Written under another name and moved into place, so that the site starting
 * while a build is under way reads a whole file or none.
 */
export const writeBuiltVersion = (
  file: string,
  version: number | undefined,
): void => {
  if (version === undefined) {
    rmSync(file, { force: true });
    return;
  }
  mkdirSync(dirname(file), { recursive: true });
  const writing = `${file}.writing-${String(process.pid)}`;
  writeFileSync(writing, `${JSON.stringify({ version })}\n`);
  renameSync(writing, file);
};

/**
 * The version `file` names, or nothing where there is no such file or it does
 * not name one. Nothing is thrown: a site that cannot tell its version is a
 * site without one, not a site that does not start.
 */
export const readBuiltVersion = (file: string): number | undefined => {
  try {
    const written: unknown = JSON.parse(readFileSync(file, "utf8"));
    if (typeof written !== "object" || written === null) return undefined;
    const { version } = written as { readonly version?: unknown };
    return typeof version === "number" &&
      Number.isInteger(version) &&
      version > 0
      ? version
      : undefined;
  } catch {
    return undefined;
  }
};
