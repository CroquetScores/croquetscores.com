// "npm run ssh". Signs in to the server from the administrator's own computer,
// at the address the deploy script uses (sshCli.feature).
import { spawn } from "node:child_process";

import { loadEnvFile } from "../src/infrastructure/config/Config.js";
import { runSsh } from "../src/infrastructure/maintenance/sshCli.js";

loadEnvFile();
const outcome = await runSsh({
  host: process.env["DEPLOY_SSH_HOST"],
  // The administrator's own key, as they sign in by hand. The stay-alive is
  // the deploy script's too, so that a long quiet session is not dropped.
  signIn: (account, host) =>
    new Promise((done) => {
      const child = spawn(
        "ssh",
        ["-o", "ServerAliveInterval=30", `${account}@${host}`],
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
