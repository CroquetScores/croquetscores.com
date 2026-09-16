// Numbered .sql files, applied in filename order, each in the same transaction
// as the row recording that it ran. A migration that fails leaves no trace of
// having been attempted.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Pool } from "pg";

// Migrations are read from source and run through tsx, by "npm run db:migrate"
// and by the spec harness. Nothing runs them from dist, so there is no build
// step copying .sql files into it.
const migrationsDirectory = join(import.meta.dirname, "migrations");

export interface AppliedMigration {
  readonly name: string;
}

const ensureMigrationsTable = async (pool: Pool): Promise<void> => {
  await pool.query(`
    create table if not exists schema_migrations (
        name       text        primary key,
        applied_at timestamptz not null default now()
    )
  `);
};

export const migrate = async (pool: Pool): Promise<AppliedMigration[]> => {
  await ensureMigrationsTable(pool);

  const files = (await readdir(migrationsDirectory))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  const { rows } = await pool.query<{ name: string }>(
    "select name from schema_migrations",
  );
  const alreadyApplied = new Set(rows.map((row) => row.name));

  const applied: AppliedMigration[] = [];
  for (const name of files) {
    if (alreadyApplied.has(name)) continue;

    const sql = await readFile(join(migrationsDirectory, name), "utf8");
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query("insert into schema_migrations (name) values ($1)", [
        name,
      ]);
      await client.query("commit");
    } catch (cause) {
      await client.query("rollback");
      throw new Error(`Migration ${name} failed.`, { cause });
    } finally {
      client.release();
    }
    applied.push({ name });
  }
  return applied;
};
