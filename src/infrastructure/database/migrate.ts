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

// Any constant will do, so long as nothing else in this database picks the
// same one. Postgres advisory locks share a single namespace.
const migrationLock = 8_246_113;

export const migrate = async (pool: Pool): Promise<AppliedMigration[]> => {
  // Reading what has been applied and applying the rest is two steps, and
  // another migrator can arrive between them. It matters for CI and for a
  // deployment that starts more than one instance; it never bites the developer
  // who finds it. The lock is held on a session of its own for the whole run.
  const lock = await pool.connect();
  try {
    await lock.query("select pg_advisory_lock($1)", [migrationLock]);
    return await applyPending(pool);
  } finally {
    await lock.query("select pg_advisory_unlock($1)", [migrationLock]);
    lock.release();
  }
};

const applyPending = async (pool: Pool): Promise<AppliedMigration[]> => {
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
      // A rollback can fail too, usually because the connection has gone. Its
      // failure says nothing about which migration broke, so it rides along as
      // a property rather than replacing what did.
      let rollbackFailure: unknown;
      try {
        await client.query("rollback");
      } catch (failure) {
        rollbackFailure = failure;
      }

      const failed = new Error(`Migration ${name} failed.`, { cause });
      throw rollbackFailure === undefined
        ? failed
        : Object.assign(failed, { rollbackFailure });
    } finally {
      client.release();
    }
    applied.push({ name });
  }
  return applied;
};
