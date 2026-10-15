// Copying the website's events, and the accounts' keys they are read with, to
// another Postgres (backupCli.feature). The website's database is only read.
//
// Events are found by the number the database gave each as it was kept, which
// only goes up: those numbered after the highest the other database has, and
// those within the last WINDOW numbers before it. The window is for an event
// kept after a later-numbered one, which two commands appending at once can
// leave, and which a copy that had read as far as the later number would
// otherwise never see. Asked to, every event is compared instead.
//
// An event is the same event where its stream and version are, whatever its
// number. One the other database has under the same stream and version but
// saying something else, or under a number another event has, is not copied
// over and is refused: the copy has gone its own way, and it is for somebody
// to look at, not for a backup to settle by overwriting one of them.
import type pg from "pg";

/** Why a copy was refused, as the script says it. */
export type BackupRefusedCode =
  | "Backup.WebsiteUnreachable"
  | "Backup.BackupDatabaseUnreachable"
  | "Backup.CouldNotCopy"
  | "Backup.SiteKeyIsNotTheWebsites"
  | "Backup.EventsDiffer"
  | "Backup.NumberTaken";

export class BackupRefused extends Error {
  constructor(
    readonly code: BackupRefusedCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "BackupRefused";
  }
}

/** What a copy came to. */
export interface Copied {
  readonly events: number;
  readonly keys: number;
}

/** How many numbers before the highest the other database has are looked at. */
export const WINDOW = 10_000;

// Events read from the website, and looked for in the other database, at once.
const BATCH = 2_000;

interface Row {
  readonly id: string;
  readonly stream_id: string;
  readonly version: number;
  readonly name: string;
  readonly data: unknown;
}

interface KeyRow {
  readonly account_id: string;
  readonly key: Buffer;
  readonly site_key_mark: string;
}

const same = (one: unknown, other: unknown): boolean =>
  JSON.stringify(one) === JSON.stringify(other);

export class PostgresBackup {
  /**
   * @param website The website's database, which is only read.
   * @param local The database the copy is kept in.
   * @param siteKeyMark The mark the site key makes, which every key the
   *   website has is marked with (AccountKeys.feature).
   */
  constructor(
    private readonly website: pg.Pool,
    private readonly local: pg.Pool,
    private readonly siteKeyMark: string,
  ) {}

  /** Copies what the other database has not, or nothing at all. */
  async copy(all: boolean): Promise<Copied> {
    const reading = await this.#connect(
      this.website,
      "Backup.WebsiteUnreachable",
    );
    try {
      const writing = await this.#connect(
        this.local,
        "Backup.BackupDatabaseUnreachable",
      );
      try {
        return await this.#copyBetween(reading, writing, all);
      } finally {
        writing.release();
      }
    } finally {
      reading.release();
    }
  }

  async #connect(
    pool: pg.Pool,
    code: "Backup.WebsiteUnreachable" | "Backup.BackupDatabaseUnreachable",
  ): Promise<pg.PoolClient> {
    try {
      return await pool.connect();
    } catch (cause) {
      throw new BackupRefused(
        code,
        cause instanceof Error ? cause.message : String(cause),
        { cause },
      );
    }
  }

  async #copyBetween(
    reading: pg.PoolClient,
    writing: pg.PoolClient,
    all: boolean,
  ): Promise<Copied> {
    // Read first and written after, in one transaction of the other database:
    // whatever goes wrong leaves it as it was.
    const keysOfTheWebsite = await this.#read(() =>
      reading.query<KeyRow>(
        `select account_id, key, site_key_mark from account_keys`,
      ),
    );
    for (const { site_key_mark } of keysOfTheWebsite.rows) {
      if (site_key_mark !== this.siteKeyMark) {
        throw new BackupRefused(
          "Backup.SiteKeyIsNotTheWebsites",
          "The site key is not the one the website's account keys are sealed with.",
        );
      }
    }

    await writing.query("begin");
    try {
      const events = await this.#copyEvents(reading, writing, all);
      const keys = await this.#copyKeys(writing, keysOfTheWebsite.rows);
      await writing.query("commit");
      return { events, keys };
    } catch (failure) {
      await writing.query("rollback").catch(() => undefined);
      if (failure instanceof BackupRefused) throw failure;
      throw new BackupRefused(
        "Backup.CouldNotCopy",
        failure instanceof Error ? failure.message : String(failure),
        { cause: failure },
      );
    }
  }

  // A read of the website that cannot be done is the website being gone, not a
  // copy that could not be made.
  async #read<T>(read: () => Promise<T>): Promise<T> {
    try {
      return await read();
    } catch (cause) {
      throw new BackupRefused(
        "Backup.WebsiteUnreachable",
        cause instanceof Error ? cause.message : String(cause),
        { cause },
      );
    }
  }

  async #copyEvents(
    reading: pg.PoolClient,
    writing: pg.PoolClient,
    all: boolean,
  ): Promise<number> {
    const {
      rows: [highest],
    } = await writing.query<{ highest: string }>(
      `select coalesce(max(id), 0)::text as highest from events`,
    );
    // Numbers are 64 bits, which a JavaScript number is not wholly: they stay
    // text between the two databases.
    const from = all
      ? 0n
      : BigInt(Math.max(0, Number(highest?.highest ?? "0") - WINDOW));

    let after = from === 0n ? -1n : from - 1n;
    let copied = 0;
    for (;;) {
      const batch = await this.#read(() =>
        reading.query<Row>(
          `select id::text as id, stream_id, version, name, data
             from events
            where id > $1
            order by id
            limit $2`,
          [after.toString(), BATCH],
        ),
      );
      if (batch.rows.length === 0) break;
      const last = batch.rows[batch.rows.length - 1];
      after = BigInt(last?.id ?? after.toString());

      const { rows: there } = await writing.query<Row>(
        `select e.id::text as id, e.stream_id, e.version, e.name, e.data
           from unnest($1::text[], $2::int[]) as wanted(stream_id, version)
           join events e on e.stream_id = wanted.stream_id
                        and e.version = wanted.version`,
        [
          batch.rows.map((row) => row.stream_id),
          batch.rows.map((row) => row.version),
        ],
      );
      const found = new Map(
        there.map((row) => [`${row.stream_id}\n${String(row.version)}`, row]),
      );

      for (const row of batch.rows) {
        const have = found.get(`${row.stream_id}\n${String(row.version)}`);
        if (have !== undefined) {
          if (have.name !== row.name || !same(have.data, row.data)) {
            throw new BackupRefused(
              "Backup.EventsDiffer",
              `The event ${String(row.version)} of the stream ${row.stream_id} is not the same in both databases.`,
            );
          }
          continue;
        }
        try {
          await writing.query(
            `insert into events (id, stream_id, version, name, data)
             overriding system value
             values ($1, $2, $3, $4, $5)`,
            [row.id, row.stream_id, row.version, row.name, row.data],
          );
        } catch (failure) {
          // The number is another event's, which is a copy gone its own way.
          if (
            (failure as { code?: unknown }).code === "23505" &&
            (failure as { constraint?: unknown }).constraint !==
              "one_event_per_version"
          ) {
            throw new BackupRefused(
              "Backup.NumberTaken",
              `The number ${row.id} is another event's in the copy.`,
              { cause: failure },
            );
          }
          throw failure;
        }
        copied += 1;
      }
    }

    // Numbers the copy gives its own events go on from the highest it has.
    if (copied > 0) {
      await writing.query(
        `select setval(pg_get_serial_sequence('events', 'id'),
                       (select max(id) from events))`,
      );
    }
    return copied;
  }

  // The copy's keys made the website's: added, replaced where they differ, and
  // taken away where the website no longer has them, which is how an account
  // forgotten there is forgotten here.
  async #copyKeys(
    writing: pg.PoolClient,
    website: readonly KeyRow[],
  ): Promise<number> {
    const { rows: here } = await writing.query<KeyRow>(
      `select account_id, key, site_key_mark from account_keys`,
    );
    const have = new Map(here.map((row) => [row.account_id, row]));
    let copied = 0;

    for (const row of website) {
      const was = have.get(row.account_id);
      if (
        was !== undefined &&
        was.site_key_mark === row.site_key_mark &&
        Buffer.compare(was.key, row.key) === 0
      ) {
        continue;
      }
      await writing.query(
        `insert into account_keys (account_id, key, site_key_mark)
         values ($1, $2, $3)
         on conflict (account_id) do update
           set key = excluded.key, site_key_mark = excluded.site_key_mark`,
        [row.account_id, row.key, row.site_key_mark],
      );
      copied += 1;
    }

    const kept = new Set(website.map((row) => row.account_id));
    const gone = here
      .map((row) => row.account_id)
      .filter((account) => !kept.has(account));
    if (gone.length > 0) {
      await writing.query(
        `delete from account_keys where account_id = any($1::text[])`,
        [gone],
      );
    }
    return copied;
  }
}
