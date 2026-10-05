import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import type { EmailAddressHasher } from "../application/services/EmailAddressHasher.js";
import { Account } from "../domain/aggregates/accounts/Account.js";
import { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../domain/aggregates/accounts/value-objects/PersonName.js";
import type { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import type { ImportDatabase } from "./ImportDatabase.js";

// What a forgotten account is brought over as before it is forgotten, which
// nobody reads: a forgotten account is read back as "Account Forgotten" and
// an address at the site's own domain whatever it was kept as (AccountEventSealing).
const FORGOTTEN_NAME = "Account Forgotten";

/**
 * The accounts the old sites' users became, for whatever was run or written
 * by one of them: a tournament's managers and scorers
 * (ImportTournaments.feature), and a commentary's writer
 * (ImportCommentaries.feature). Here so that a user is one account wherever
 * they are named, a forgotten one among them.
 */
export class ImportedAccounts {
  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly emailAddresses: EmailAddressHasher,
    private readonly database: ImportDatabase,
  ) {}

  /**
   * The account the user `documentId` on `website` became, or where they
   * became none, the forgotten account made for them, at `at`, the first time
   * one was needed: one that holds nothing of them and that nobody can sign
   * in to. Kept in the transaction underway, with whatever needed it.
   */
  async accountOf(
    website: string,
    documentId: string,
    at: ReadOnlyDate,
  ): Promise<AccountId> {
    const imported = await this.database.findAccountOf(website, documentId);
    if (imported !== undefined) return AccountId.from(imported.accountId);
    const forgotten = await this.database.findForgottenAccountOf(
      website,
      documentId,
    );
    if (forgotten !== undefined) return AccountId.from(forgotten);

    const id = AccountId.create();
    const address = EmailAddress.from(
      `account-forgotten-${id.value.slice(id.value.indexOf("/") + 1)}@croquetscores.com`,
    );
    // Brought over and forgotten in one save, so that it is never an account
    // anybody could be sent anything at, and its key is gone with it.
    const account = Account.bringOver(
      id,
      PersonName.from(FORGOTTEN_NAME),
      address,
      this.emailAddresses.hash(address),
      "",
      at,
    );
    account.forget(at);
    await this.accounts.save(account);
    await this.database.recordForgottenUser(website, documentId, id.value);
    return id;
  }
}
