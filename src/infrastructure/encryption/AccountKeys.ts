// Each account's own key, kept in a table of its own and encrypted there with
// the site's key, and the encryption of what is kept of an account's name and
// email address with it.
//
// A key of its own for each account is what makes the site's key cheap to
// change: only the keys are encrypted with it, so changing it re-encrypts
// those, and not a single event. An account is forgotten by rewriting what is
// personal in its events (AccountEventSealing.ts), and its key is kept, marked
// forgotten.
//
// The encryption is AES-256-GCM, which refuses what has been changed since it
// was encrypted rather than decrypting it into something else. What is
// encrypted for an account is bound to that account's id as well as its key,
// so that it cannot be read as anybody else's.
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
} from "node:crypto";

import type { Id } from "../../domain/common/Id.js";
import { Refused } from "../../domain/common/Refused.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";

/** Every reason the account key store refuses. */
export type AccountKeysErrorCode =
  | "AccountKeys.SiteKeyMissing"
  | "AccountKeys.WrongSiteKey"
  | "AccountKeys.Tampered";

export class AccountKeysRefused extends Refused<AccountKeysErrorCode> {}

// What an encryption is kept as: which way it was made, and then its nonce,
// its tag and what was encrypted, together, in base64.
const VERSION = "v1";
const NONCE_BYTES = 12;
const TAG_BYTES = 16;

// The text the mark of a site's key is made from. Anything fixed would do; the
// mark is only ever compared with another made the same way.
const MARKED = "croquet-scores:account-keys";

/**
 * The mark the site key `siteKey` makes, which every account key kept with it
 * carries, so that a key made with another is known for it without being
 * opened (AccountKeys.feature). Said here for what has to know the site key is
 * the one a database's keys were made with and has nothing to open them for.
 */
export const siteKeyMarkOf = (siteKey: string): string => {
  const key = createHash("sha256").update(siteKey).digest();
  return createHmac("sha256", key).update(MARKED).digest("hex");
};

// What is encrypted with the site's key is bound to this rather than to an
// account, so that nothing encrypted for an account can be read as the site's.
const SITE = "croquet-scores:site";

const seal = (key: Buffer, plain: Buffer, boundTo: string): Buffer => {
  const nonce = randomBytes(NONCE_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, nonce);
  cipher.setAAD(Buffer.from(boundTo));
  const sealed = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([nonce, cipher.getAuthTag(), sealed]);
};

// Throws when what is given was not sealed with this key and bound to this,
// or has been changed since.
const open = (key: Buffer, kept: Buffer, boundTo: string): Buffer => {
  const nonce = kept.subarray(0, NONCE_BYTES);
  const tag = kept.subarray(NONCE_BYTES, NONCE_BYTES + TAG_BYTES);
  const decipher = createDecipheriv("aes-256-gcm", key, nonce);
  decipher.setAAD(Buffer.from(boundTo));
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(kept.subarray(NONCE_BYTES + TAG_BYTES)),
    decipher.final(),
  ]);
};

interface KeptKey {
  readonly key: Buffer;
  readonly site_key_mark: string;
}

export class AccountKeys {
  readonly #siteKey: Buffer;
  readonly #mark: string;

  /**
   * The store, over `unitOfWork`, with `siteKey`: the setting
   * ACCOUNT_ENCRYPTION_KEY. Refused with `AccountKeys.SiteKeyMissing` without
   * one, since nothing could be kept that anybody could read again.
   */
  constructor(
    private readonly unitOfWork: UnitOfWork,
    siteKey: string | undefined,
  ) {
    if (siteKey === undefined || siteKey.trim() === "") {
      throw new AccountKeysRefused(
        "AccountKeys.SiteKeyMissing",
        "There is no site's key, ACCOUNT_ENCRYPTION_KEY, to keep account keys with.",
      );
    }
    // Hashed into the 32 bytes AES-256 takes, so that the setting may be
    // written however its maker wrote it; the one dev-setup writes is 32
    // random bytes already.
    this.#siteKey = createHash("sha256").update(siteKey).digest();
    this.#mark = siteKeyMarkOf(siteKey);
  }

  /** Makes `account` a key of its own. */
  async makeFor(account: Id): Promise<void> {
    const key = randomBytes(32);
    await this.unitOfWork.connection().query(
      `insert into account_keys (account_id, key, site_key_mark)
         values ($1, $2, $3)`,
      [account.value, seal(this.#siteKey, key, account.value), this.#mark],
    );
  }

  /** `text` encrypted with `account`'s key, and bound to the account. */
  async encrypt(account: Id, text: string): Promise<string> {
    const key = await this.#keyOf(account);
    if (key === undefined) {
      throw new Error(`${account.value} has no key to encrypt with.`);
    }
    const sealed = seal(key, Buffer.from(text, "utf8"), account.value);
    return `${VERSION}.${sealed.toString("base64")}`;
  }

  /** Makes `account` a key of its own, unless it has one already. */
  async ensureFor(account: Id): Promise<void> {
    if ((await this.#keyOf(account)) === undefined) await this.makeFor(account);
  }

  /**
   * What `kept` was encrypted from, or nothing when `account` has no key,
   * which is an account forgotten before forgetting kept the key. Refused with
   * `AccountKeys.Tampered` when it was not encrypted for this account, or has
   * been changed since.
   */
  async decrypt(account: Id, kept: string): Promise<string | undefined> {
    const key = await this.#keyOf(account);
    if (key === undefined) return undefined;
    return this.#decryptWith(key, account, kept);
  }

  #decryptWith(key: Buffer, account: Id, kept: string): string {
    const [version, body] = kept.split(".");
    try {
      if (version !== VERSION || body === undefined) {
        throw new Error("not kept by this store");
      }
      return open(key, Buffer.from(body, "base64"), account.value).toString(
        "utf8",
      );
    } catch (cause) {
      throw new AccountKeysRefused(
        "AccountKeys.Tampered",
        `What is kept for ${account.value} cannot be read with its key: it has been changed, or is not its own.`,
        cause,
      );
    }
  }

  /**
   * Whether `account` has a key and is not forgotten: whether anything may
   * still be kept of it or sent to it. An account with no key is false, as one
   * forgotten before forgetting kept the key is, and is not an error: nothing
   * is sent to it. Read as every other read of the table
   * is, through the mark of the site's key, so that another site's key is one
   * refusal everywhere rather than this saying yes and the next thing refusing.
   */
  async isInUse(account: Id): Promise<boolean> {
    return (await this.#rowOf(account))?.forgotten === false;
  }

  /**
   * `text` encrypted with `account`'s key, or nothing when the account is not in
   * use (see {@link isInUse}). One look at the key where asking and then
   * encrypting is two.
   */
  async encryptIfInUse(account: Id, text: string): Promise<string | undefined> {
    const row = await this.#rowOf(account);
    if (row === undefined || row.forgotten) return undefined;
    const sealed = seal(row.key, Buffer.from(text, "utf8"), account.value);
    return `${VERSION}.${sealed.toString("base64")}`;
  }

  /**
   * What `kept` was encrypted from, or nothing when the account is not in use.
   * Refused as {@link decrypt} is.
   */
  async decryptIfInUse(account: Id, kept: string): Promise<string | undefined> {
    const row = await this.#rowOf(account);
    if (row === undefined || row.forgotten) return undefined;
    return this.#decryptWith(row.key, account, kept);
  }

  /**
   * `text` encrypted with the site's key, for what has no account to be kept
   * with: an email to an address nobody registered, or to the administrator.
   */
  encryptForSite(text: string): string {
    const sealed = seal(this.#siteKey, Buffer.from(text, "utf8"), SITE);
    return `${VERSION}.${sealed.toString("base64")}`;
  }

  /**
   * What `kept` was encrypted from with the site's key. Refused with
   * `AccountKeys.Tampered` when it cannot be read with it.
   */
  decryptForSite(kept: string): string {
    const [version, body] = kept.split(".");
    try {
      if (version !== VERSION || body === undefined) {
        throw new Error("not kept by this store");
      }
      return open(this.#siteKey, Buffer.from(body, "base64"), SITE).toString(
        "utf8",
      );
    } catch (cause) {
      throw new AccountKeysRefused(
        "AccountKeys.Tampered",
        "What was kept with the site's key cannot be read with it.",
        cause,
      );
    }
  }

  /** Marks `account`'s key forgotten, and keeps it. */
  async forget(account: Id): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`update account_keys set forgotten = true where account_id = $1`, [
        account.value,
      ]);
  }

  /**
   * Re-encrypts every account's key with `newSiteKey`, and every email waiting
   * in the queue with no account to belong to, and nothing else: not one
   * event. The store goes on using the key it was made with; one made with the
   * new key reads what this one kept.
   */
  async changeSiteKey(newSiteKey: string): Promise<void> {
    const next = new AccountKeys(this.unitOfWork, newSiteKey);
    const connection = this.unitOfWork.connection();
    const { rows } = await connection.query<KeptKey & { account_id: string }>(
      `select account_id, key, site_key_mark from account_keys`,
    );
    for (const row of rows) {
      const key = this.#unwrap(row.account_id, row);
      await connection.query(
        `update account_keys set key = $2, site_key_mark = $3
          where account_id = $1`,
        [row.account_id, seal(next.#siteKey, key, row.account_id), next.#mark],
      );
    }
    const emails = await connection.query<{ id: string; sealed: string }>(
      `select id, sealed from email_queue where account_id is null`,
    );
    for (const email of emails.rows) {
      await connection.query(
        `update email_queue set sealed = $2 where id = $1`,
        [email.id, next.encryptForSite(this.decryptForSite(email.sealed))],
      );
    }
  }

  async #keyOf(account: Id): Promise<Buffer | undefined> {
    return (await this.#rowOf(account))?.key;
  }

  async #rowOf(
    account: Id,
  ): Promise<{ key: Buffer; forgotten: boolean } | undefined> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<KeptKey & { forgotten: boolean }>(
        `select key, site_key_mark, forgotten from account_keys
          where account_id = $1`,
        [account.value],
      );
    const row = rows[0];
    return row === undefined
      ? undefined
      : {
          key: this.#unwrap(account.value, row),
          forgotten: row.forgotten,
        };
  }

  // The mark is checked before anything is decrypted, because AES-GCM refuses
  // a wrong key exactly as it refuses changed data, and cannot say which.
  #unwrap(account: string, row: KeptKey): Buffer {
    if (row.site_key_mark !== this.#mark) {
      throw new AccountKeysRefused(
        "AccountKeys.WrongSiteKey",
        "The account keys were kept with another site's key than this one.",
      );
    }
    try {
      return open(this.#siteKey, row.key, account);
    } catch (cause) {
      throw new AccountKeysRefused(
        "AccountKeys.Tampered",
        `The key kept for ${account} has been changed, or is not its own.`,
        cause,
      );
    }
  }
}
