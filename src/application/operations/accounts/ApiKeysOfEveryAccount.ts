import { Query } from "../../common/Query.js";

/**
 * One key as an administrator sees it, among every account's: whose it is, and
 * what it is called and may do and how much of the site's work it may use.
 * Never the key, which nobody has but its app.
 */
export interface ApiKeyOfAnAccount {
  /** The key's id, which is what changing its limits names it by. */
  readonly id: string;
  /** The name of the account it belongs to. */
  readonly owner: string;
  readonly label: string;
  readonly mayRead: boolean;
  readonly mayWrite: boolean;
  readonly perMinute: number;
  readonly perDay: number;
  /** When it was made, as an ISO 8601 moment. */
  readonly madeAt: string;
}

/**
 * The keys that work, of every account, in the order they were made, as the
 * account the reader is signed in to lists them. Keys revoked, and those of
 * accounts forgotten, are not among them: they work for nobody, so there is
 * nothing about them to change.
 *
 * Only an administrator can ask: anybody else is refused with
 * `Account.NotAnAdministrator`, so that nobody else learns by asking which
 * keys there are or whose.
 */
export class ApiKeysOfEveryAccount extends Query<readonly ApiKeyOfAnAccount[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
  ) {
    super();
  }
}
