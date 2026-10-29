// "npm run deploy", "npm run deploy -- my-branch" and
// "npm run deploy -- origin/my-branch", each of which may be given
// "--skip-database-update". Has the server put up a commit, from the
// administrator's own computer (deployCli.feature). Without a branch it is
// origin/main. The server's own script does the work and is given the commit
// only (deploying.md section 8); this chooses which, and checks the server
// will be able to get it. Not to be confused with deploy.sh, which is that
// script.
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";

import { loadEnvFile } from "../src/infrastructure/config/Config.js";
import { runDeploy } from "../src/infrastructure/maintenance/deployCli.js";

const git = promisify(execFile);

loadEnvFile();
const outcome = await runDeploy(process.argv.slice(2), {
  host: process.env["DEPLOY_SSH_HOST"],
  fetch: async () => {
    try {
      await git("git", ["fetch", "--quiet", "origin"]);
    } catch (failure) {
      throw new Error(String(failure.stderr ?? failure.message).trim(), {
        cause: failure,
      });
    }
  },
  resolve: async (reference) => {
    try {
      const { stdout } = await git("git", [
        "rev-parse",
        "--verify",
        "--quiet",
        `${reference}^{commit}`,
      ]);
      return stdout.trim();
    } catch {
      return undefined;
    }
  },
  onGitHub: async (commit) => {
    const { stdout } = await git("git", [
      "branch",
      "--remotes",
      "--contains",
      commit,
      "--list",
      "origin/*",
    ]);
    return stdout.trim() !== "";
  },
  // The administrator's own key, as they sign in to the server by hand
  // (server-setup.md), so the server's script is named in full: the key the
  // workflow uses runs it without being asked, and this one does not.
  deploy: (host, commit, options) =>
    new Promise((done) => {
      const child = spawn(
        "ssh",
        [
          "-o",
          "ServerAliveInterval=30",
          `deploy@${host}`,
          "/usr/local/bin/croquetscores-deploy",
          commit,
          ...(options.skipDatabaseUpdate ? ["--skip-database-update"] : []),
        ],
        { stdio: "inherit" },
      );
      child.on("error", (failure) => {
        console.error(`ssh could not be run: ${failure.message}`);
        done(1);
      });
      child.on("close", (status) => done(status ?? 1));
    }),
  say: (line) => console.log(line),
});
process.exitCode = outcome.exitCode;
