// "npm run summarise:log". Reads the last day of the server's log at Warn and
// more severe, has Claude write a summary of it, and emails the summary to
// ADMINISTRATOR_EMAIL_ADDRESS (summariseLogCli.feature). Cron runs it at five
// in the morning. Run under tsx, as the package script does, since the
// application is TypeScript.
//
// ANTHROPIC_API_KEY is read here and not in the site's settings: the site never
// speaks to Claude, so a setting it had to be given or refuse to start would be
// one more way for a site to be down for a morning email. Without it the
// summary cannot be written, and the email says so.
import {
  loadConfig,
  loadEnvFile,
} from "../src/infrastructure/config/Config.js";
import { PostgresServerLog } from "../src/infrastructure/database/PostgresServerLog.js";
import { UnitOfWork } from "../src/infrastructure/database/UnitOfWork.js";
import { runSummariseLog } from "../src/infrastructure/maintenance/summariseLogCli.js";
import { ReadOnlyDate } from "../src/domain/common/ReadOnlyDate.js";
import { buildApplication } from "../src/web/server.js";

// What cannot be set up is said and ends the run cleanly. It cannot be emailed:
// the mail sender and the address to send to come from the setup that failed.
let config;
let application;
try {
  loadEnvFile();
  config = loadConfig();
  application = await buildApplication(config, { logger: false });
} catch (failure) {
  console.log("The summary could not start.");
  console.log(`Why: ${failure instanceof Error ? failure.message : failure}`);
  process.exit(1);
}

const unitOfWork = new UnitOfWork(application.pool);
const log = new PostgresServerLog(unitOfWork);

const send = (email) =>
  application.emailSender.send(
    { ...email, from: config.administratorEmailAddress },
    ReadOnlyDate.from(new Date()),
  );

const ask = async (request) => {
  const key = process.env.ANTHROPIC_API_KEY?.trim() ?? "";
  if (key === "") throw new Error("ANTHROPIC_API_KEY is not set.");
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(request),
    // A morning email that waits for ever is no email.
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) {
    // Claude says why in the body, and a limit reached and a key refused are
    // told apart only by it.
    const said = (await response.text().catch(() => "")).slice(0, 300);
    throw new Error(`Claude answered ${response.status}. ${said}`.trim());
  }
  const answer = await response.json();
  if (!Array.isArray(answer?.content)) {
    throw new Error("Claude's answer was not of the shape expected.");
  }
  return answer;
};

try {
  const outcome = await runSummariseLog({
    administrator: config.administratorEmailAddress,
    now: new Date(),
    read: (filter) => unitOfWork.inTransaction(() => log.read(filter)),
    ask,
    send,
    say: (line) => console.log(line),
  });
  process.exitCode = outcome.exitCode;
} catch (failure) {
  process.exitCode = 1;
  console.log("The summary failed.");
  console.log(`Why: ${failure instanceof Error ? failure.message : failure}`);
} finally {
  await application.server.close();
  await application.pool.end();
}
