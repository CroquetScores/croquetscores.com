// "npm run export:tournaments -- --folder ../croquet-scores-data". Writes the
// public tournaments of croquetscores.com and gateballscores.com to the folder,
// one JSON file each, and stages, commits and pushes what it changed, then
// emails ADMINISTRATOR_EMAIL_ADDRESS if anything failed
// (exportTournamentsCli.feature). Run under tsx, as the package script does,
// since the application is TypeScript.
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";

import {
  loadConfig,
  loadEnvFile,
} from "../src/infrastructure/config/Config.js";
import { runExportTournaments } from "../src/infrastructure/maintenance/exportTournamentsCli.js";
import { ReadOnlyDate } from "../src/domain/common/ReadOnlyDate.js";
import { buildApplication } from "../src/web/server.js";

loadEnvFile();
const config = loadConfig();
const application = await buildApplication(config, { logger: false });

const git = (folder, args, input) =>
  new Promise((resolve, reject) => {
    const child = spawn("git", args, { cwd: folder });
    let said = "";
    let complaint = "";
    child.stdout.on("data", (chunk) => (said += chunk));
    child.stderr.on("data", (chunk) => (complaint += chunk));
    child.on("error", reject);
    child.on("close", (code) => resolve({ code: code ?? 1, said, complaint }));
    // Git may end before it has read what it was given, which is not a failure
    // of ours: its own exit says how it went.
    child.stdin.on("error", () => undefined);
    child.stdin.end(input);
  });

try {
  const outcome = await runExportTournaments(process.argv.slice(2), {
    administrator: config.administratorEmailAddress,
    workingFolder: process.cwd(),
    ask: (query) => application.mediator.query(query),
    git,
    write: (path, text) => writeFile(path, text),
    send: (email) =>
      application.emailSender.send(
        { ...email, from: config.administratorEmailAddress },
        ReadOnlyDate.from(new Date()),
      ),
    say: (line) => console.log(line),
  });
  process.exitCode = outcome.exitCode;
} finally {
  await application.server.close();
  await application.pool.end();
}
