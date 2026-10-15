// "npm run db:backup" or "npm run db:backup -- --all". Copies the events and the
// accounts' keys the website has and this computer's database has not, makes
// this database's read models again, and emails ADMINISTRATOR_EMAIL_ADDRESS how
// it went (backupCli.feature). Run from a scheduled task on the administrator's
// own computer, with BACKUP_DATABASE_URL naming where the copy is written and
// WEBSITE_DATABASE_URL the website's database, which is only read. Run under tsx, as the package script
// does, since the application is TypeScript.
import { spawn } from "node:child_process";

import {
  loadConfig,
  loadEnvFile,
} from "../src/infrastructure/config/Config.js";
import { createPool } from "../src/infrastructure/database/pool.js";
import { siteKeyMarkOf } from "../src/infrastructure/encryption/AccountKeys.js";
import { runBackup } from "../src/infrastructure/maintenance/backupCli.js";
import { PostgresBackup } from "../src/infrastructure/maintenance/PostgresBackup.js";
import { ReadOnlyDate } from "../src/domain/common/ReadOnlyDate.js";
import { buildApplication } from "../src/web/server.js";

// Run as the package script is, so that the rebuild is the one the
// administrator would run by hand, with its own words and its own switch.
// Of the backup database, which is what the rebuild rebuilds whatever
// DATABASE_URL is: it is given that as its own, and a setting already in the
// environment is not replaced by the file the rebuild reads.
const rebuild = (minutes, database) =>
  new Promise((resolve, reject) => {
    const child = spawn(
      "npm",
      ["run", "db:rebuild-read-models", "--", "--minutes", String(minutes)],
      {
        shell: true,
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, DATABASE_URL: database },
      },
    );
    let said = "";
    child.stdout.on("data", (chunk) => {
      said += chunk;
      process.stdout.write(chunk);
    });
    child.stderr.on("data", (chunk) => {
      said += chunk;
      process.stderr.write(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(
            new Error(
              `The rebuild exited with ${String(code)}: ${said.trim().split("\n").slice(-3).join(" ")}`,
            ),
          ),
    );
  });

loadEnvFile();
const config = loadConfig();
const application = await buildApplication(config, { logger: false });
const pools = [];
try {
  const outcome = await runBackup(process.argv.slice(2), {
    settings: {
      administrator: config.administratorEmailAddress,
      siteKey: config.accountEncryptionKey,
      websiteDatabase: config.websiteDatabaseUrl,
      backupDatabase: config.backupDatabaseUrl,
    },
    copying: (siteKey) => {
      const website = createPool(config.websiteDatabaseUrl);
      const backup = createPool(config.backupDatabaseUrl);
      pools.push(website, backup);
      return new PostgresBackup(website, backup, siteKeyMarkOf(siteKey));
    },
    rebuild,
    send: (email) =>
      application.emailSender.send(
        { ...email, from: config.emailFromAddress },
        ReadOnlyDate.from(new Date()),
      ),
    now: () => new Date(),
    say: (line) => console.log(line),
  });
  process.exitCode = outcome.exitCode;
} finally {
  await Promise.all(pools.map((pool) => pool.end()));
  await application.server.close();
  await application.pool.end();
}
