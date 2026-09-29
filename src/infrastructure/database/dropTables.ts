// Drops every table in the database, in every schema but Postgres's own. The
// migration runner never drops anything, and must not, so this is kept apart
// from it and reached only by what means to start again from nothing: an
// import, and "npm run db:drop-tables".
import type { Pool } from "pg";

export const dropTables = async (pool: Pool): Promise<void> => {
  const { rows } = await pool.query<{
    schemaname: string;
    tablename: string;
  }>(
    `select schemaname, tablename from pg_tables
     where schemaname not in ('pg_catalog', 'information_schema')
       and not starts_with(schemaname, 'pg_')`,
  );
  // One statement, so that no table is left waiting on another's foreign key
  // and none is dropped while the others stay.
  if (rows.length > 0) {
    await pool.query(
      `drop table ${rows
        .map(({ schemaname, tablename }) =>
          [schemaname, tablename].map(quoted).join("."),
        )
        .join(", ")} cascade`,
    );
  }
};

const quoted = (name: string): string => `"${name.replaceAll('"', '""')}"`;
