// "npm run db:migrate". Kept apart from migrate.ts so that importing the runner
// never starts one.
import { loadConfig, loadEnvFile } from "../config/Config.js";
import { migrate } from "./migrate.js";
import { createPool } from "./pool.js";

loadEnvFile();
const pool = createPool(loadConfig().databaseUrl);
try {
  const applied = await migrate(pool);
  console.log(
    applied.length === 0
      ? "Database is up to date."
      : `Applied: ${applied.map((migration) => migration.name).join(", ")}`,
  );
} finally {
  await pool.end();
}
