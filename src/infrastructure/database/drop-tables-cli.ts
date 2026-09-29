// "npm run db:drop-tables". Kept apart from dropTables.ts so that importing it
// never drops anything. Whatever DATABASE_URL names is emptied, with no
// question asked first, so it is for a developer's own database.
import { loadConfig, loadEnvFile } from "../config/Config.js";
import { dropTables } from "./dropTables.js";
import { createPool } from "./pool.js";

loadEnvFile();
const pool = createPool(loadConfig().databaseUrl);
try {
  await dropTables(pool);
  console.log("Every table is dropped.");
} finally {
  await pool.end();
}
