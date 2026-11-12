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
    const child = spawn("git", args, {
      cwd: folder,
      // A name is a file's and never a pattern, whatever characters it has.
      env: { ...process.env, GIT_LITERAL_PATHSPECS: "1" },
    });
    let said = "";
    let complaint = "";
    // Decoded whole, so that a character split across two chunks is not lost.
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => (said += chunk));
    child.stderr.on("data", (chunk) => (complaint += chunk));
    child.on("error", reject);
    child.on("close", (code) => resolve({ code: code ?? 1, said, complaint }));
    // Git may end before it has read what it was given, which is not a failure
    // of ours: its own exit says how it went.
    child.stdin.on("error", () => undefined);
    child.stdin.end(input);
  });

const send = (email) =>
  application.emailSender.send(
    { ...email, from: config.administratorEmailAddress },
    ReadOnlyDate.from(new Date()),
  );

try {
  const outcome = await runExportTournaments(process.argv.slice(2), {
    administrator: config.administratorEmailAddress,
    workingFolder: process.cwd(),
    ask: (query) => application.mediator.query(query),
    git,
    write: (path, text) => writeFile(path, text),
    send,
    say: (line) => console.log(line),
  });
  process.exitCode = outcome.exitCode;
} catch (failure) {
  // Whatever the script did not foresee is still told to the administrator:
  // a failure nobody hears of is a run that quietly stopped.
  process.exitCode = 1;
  console.log("The export failed.");
  console.log(`Why: ${failure instanceof Error ? failure.message : failure}`);
  try {
    await send({
      to: config.administratorEmailAddress,
      subject: "WARNING: Croquet Scores tournament export FAILED",
      body: "<p>The export failed in a way it did not expect. The log on the server says why.</p>",
    });
  } catch {
    console.log("The administrator could not be told.");
  }
} finally {
  await application.server.close();
  await application.pool.end();
}
