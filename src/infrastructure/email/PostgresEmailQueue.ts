// Emails waiting to be sent, kept in Postgres in the transaction of the command
// each is about, and sent from there outside any request.
//
// An email is sent at least once, and once in all but one case: a sender that
// stops after the mail provider has taken an email and before it is taken out
// sends it again, since nothing can tell it went. Two senders at once never
// take the same email, because each takes one it can lock and passes over one
// another has locked.
import { randomUUID } from "node:crypto";

import type {
  EmailQueue,
  EmailToQueue,
} from "../../application/services/EmailQueue.js";
import type { EmailSender } from "../../application/services/EmailSender.js";
import type { EmailWriter } from "../../application/services/EmailWriter.js";
import { AccountId } from "../../domain/aggregates/accounts/value-objects/AccountId.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import {
  type AccountKeys,
  AccountKeysRefused,
} from "../encryption/AccountKeys.js";

// How many times an email is tried in all — once, and five times again —
// before it is given up.
const MOST_TRIES = 6;

// The wait before an email that failed its `tries`th time is due again: a
// minute, and each wait four times the one before, so that a provider that is
// down is not asked every few seconds, and five tries again reach nearly six
// hours, which outlasts an ordinary outage.
const waitAfter = (tries: number): number => 60_000 * 4 ** (tries - 1);

// How long an email given up is kept, to be seen, before it is taken out.
const KEPT_WHEN_GIVEN_UP = 30 * 24 * 60 * 60_000;

/** An email as the queue holds it, with what was sealed read back. */
export interface QueuedEmail {
  readonly kind: string;
  /**
   * Where it goes, or nothing when nothing can read that: its account is
   * forgotten, or what was sealed is not what the key the store has now
   * sealed.
   */
  readonly to: string | undefined;
  /** The link it carries, when it carries one and nothing stops it being read. */
  readonly link: string | undefined;
  /** When that link stops working, when the queue was told. */
  readonly linkWorksUntil: Date | undefined;
  readonly tries: number;
  readonly dueAt: Date;
  readonly lastTriedAt: Date | undefined;
  readonly givenUp: boolean;
}

// What is sealed: where an email goes, and what fills it in.
interface Sealed {
  readonly to: string;
  readonly fill: Readonly<Record<string, string>>;
}

interface Row {
  readonly id: string;
  readonly account_id: string | null;
  readonly kind: string;
  readonly language: string;
  readonly sealed: string;
  readonly link_works_until: Date | null;
  readonly due_at: Date;
  readonly tries: number;
  readonly last_tried_at: Date | null;
  readonly given_up_at: Date | null;
}

export class PostgresEmailQueue implements EmailQueue {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly keys: AccountKeys,
    private readonly writer: EmailWriter,
    private readonly sender: EmailSender,
    /** The address every email is sent from: the site's own. */
    private readonly from: string,
  ) {}

  /**
   * Queues `email` in the transaction of the request being served. One about
   * an account that is forgotten is not queued at all: nothing is ever sent to
   * a forgotten account.
   */
  async queue(email: EmailToQueue): Promise<void> {
    const sealing: Sealed = { to: email.to, fill: email.fill };
    let sealed: string;
    if (email.account !== undefined) {
      // An account's key is made as its registering is kept, in the same
      // transaction this is queued in and before it, so an account with no key
      // here is one that has been forgotten, and nothing is ever sent to one.
      if (!(await this.keys.hasKey(email.account))) return;
      sealed = await this.keys.encrypt(email.account, JSON.stringify(sealing));
    } else {
      sealed = this.keys.encryptForSite(JSON.stringify(sealing));
    }
    await this.unitOfWork.connection().query(
      `insert into email_queue
         (id, account_id, kind, language, sealed, link_works_until, due_at)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        randomUUID(),
        email.account?.value ?? null,
        email.kind,
        email.language,
        sealed,
        email.linkWorksUntil?.toDate() ?? null,
        email.queuedAt.toDate(),
      ],
    );
  }

  /**
   * Sends every email due by `at`, each in a transaction of its own, and takes
   * out every email given up more than 30 days before it. Handed the moment
   * rather than reading a clock, since nothing below the web layer reads one.
   */
  async sendDue(at: ReadOnlyDate): Promise<void> {
    await this.unitOfWork.inTransaction(async () => {
      await this.unitOfWork
        .connection()
        .query(`delete from email_queue where given_up_at <= $1`, [
          new Date(at.toDate().getTime() - KEPT_WHEN_GIVEN_UP),
        ]);
    });
    while (await this.unitOfWork.inTransaction(() => this.#sendOne(at))) {
      // Each round sends one email, until none is due.
    }
  }

  /**
   * Every email the queue holds, what was sealed of it read back. An email
   * nothing can read is still listed, with nowhere to go: looking at the queue
   * is how such a row is found, so it is the last thing that should refuse
   * because of one.
   */
  async emails(): Promise<readonly QueuedEmail[]> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<Row>(`select * from email_queue order by due_at, id`);
    const emails: QueuedEmail[] = [];
    for (const row of rows) {
      // Only what says nobody can read the row is passed over; a database that
      // would not answer is still the caller's to hear about.
      const sealed = await this.#open(row).catch((failure: unknown) => {
        if (failure instanceof AccountKeysRefused) return undefined;
        throw failure;
      });
      emails.push({
        kind: row.kind,
        to: sealed?.to,
        link: sealed?.fill["link"],
        linkWorksUntil: row.link_works_until ?? undefined,
        tries: row.tries,
        dueAt: row.due_at,
        lastTriedAt: row.last_tried_at ?? undefined,
        givenUp: row.given_up_at !== null,
      });
    }
    return emails;
  }

  // Sends the first email due, and says whether there was one.
  async #sendOne(at: ReadOnlyDate): Promise<boolean> {
    const connection = this.unitOfWork.connection();
    const { rows } = await connection.query<Row>(
      `select * from email_queue
        where given_up_at is null and due_at <= $1
        order by due_at
        limit 1
        for update skip locked`,
      [at.toDate()],
    );
    const row = rows[0];
    if (row === undefined) return false;

    let sealed: Sealed | undefined;
    try {
      sealed = await this.#open(row);
    } catch {
      // Nothing can read what it says: it was not sealed with the key the
      // store has now, or the row has been changed since. Counted as a try
      // that failed, like any other, so that it is given up in the end.
      // Left to throw, it would stop the queue for good instead: it is the
      // soonest due, so every sending after this one would pick it first and
      // throw on it, and nothing behind it would ever go.
      await this.#failed(row, at);
      return true;
    }

    // Its account is forgotten: nobody can read where it goes, and nobody is
    // to be written to.
    if (sealed === undefined) {
      await connection.query(`delete from email_queue where id = $1`, [row.id]);
      return true;
    }

    // Its link has stopped working, so its one use is gone.
    if (
      row.link_works_until !== null &&
      at.toDate().getTime() > row.link_works_until.getTime()
    ) {
      await connection.query(
        `update email_queue set given_up_at = $2 where id = $1`,
        [row.id, at.toDate()],
      );
      return true;
    }

    try {
      const written = this.writer.write({
        kind: row.kind,
        language: row.language,
        fill: sealed.fill,
      });
      await this.sender.send(
        {
          to: sealed.to,
          from: this.from,
          subject: written.subject,
          body: written.body,
        },
        at,
      );
    } catch {
      // A writer that could not write it, or a provider that did not take it:
      // either may be put right before it is given up, so both are tried again.
      await this.#failed(row, at);
      return true;
    }

    await connection.query(`delete from email_queue where id = $1`, [row.id]);
    return true;
  }

  // Writes down that `row` failed a try at `at`: due again once its wait is
  // over, and given up once it has been tried enough times.
  async #failed(row: Row, at: ReadOnlyDate): Promise<void> {
    const tries = row.tries + 1;
    await this.unitOfWork.connection().query(
      `update email_queue
          set tries = $2, last_tried_at = $3, due_at = $4, given_up_at = $5
        where id = $1`,
      [
        row.id,
        tries,
        at.toDate(),
        new Date(at.toDate().getTime() + waitAfter(tries)),
        tries >= MOST_TRIES ? at.toDate() : null,
      ],
    );
  }

  // What was sealed of `row`, or nothing when its account is forgotten.
  async #open(row: Row): Promise<Sealed | undefined> {
    const opened =
      row.account_id === null
        ? this.keys.decryptForSite(row.sealed)
        : await this.keys.decrypt(AccountId.from(row.account_id), row.sealed);
    return opened === undefined ? undefined : (JSON.parse(opened) as Sealed);
  }
}
