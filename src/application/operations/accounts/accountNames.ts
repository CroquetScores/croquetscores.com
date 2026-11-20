/**
 * What accounts are called, as a page that names who wrote something asks it.
 * The application names what it asks; the infrastructure keeps the answer
 * (AccountNames.feature).
 */
export interface AccountNames {
  /**
   * What each of `accounts` is called, by the account's id. An account with no
   * name to be read is left out: one not yet confirmed has none, and one
   * forgotten has had its name taken away.
   */
  of(accounts: readonly string[]): Promise<ReadonlyMap<string, string>>;
}
