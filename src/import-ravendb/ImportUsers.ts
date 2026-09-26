import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import type { EmailAddressHasher } from "../application/services/EmailAddressHasher.js";
import { Account } from "../domain/aggregates/accounts/Account.js";
import { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../domain/aggregates/accounts/value-objects/PersonName.js";
import { charactersIn } from "../domain/common/charactersIn.js";
import { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import type { ImportedPasswordHasher } from "../infrastructure/identity/ImportedPasswordHasher.js";
import type { ImportDatabase } from "./ImportDatabase.js";
import type { User } from "./ravendb-models/User.js";
import type { Importer, ReadDocument } from "./runImporter.js";

/** Shorter than this, a name is refused. `PersonName` says why. */
const FEWEST_CHARACTERS = 3;

const TOO_SHORT = " (name must be 3 characters or more)";

/**
 * A name the old sites accepted, changed only as far as it must be to be
 * accepted here: one shorter than 3 characters says so, which also makes it
 * long enough. A name with none is left with none, and refused.
 */
export const nameToImport = (name: string): string => {
  const trimmed = name.trim();
  return trimmed !== "" && charactersIn(trimmed) < FEWEST_CHARACTERS
    ? trimmed + TOO_SHORT
    : trimmed;
};

// Newtonsoft wrote a DateTime with no zone, and a moment written with none is
// read as the machine's local time. The old sites kept their moments in UTC,
// so one without a zone is read as UTC, wherever the import runs.
const hasAZone = /(?:Z|[+-]\d\d:\d\d)$/;
const momentOf = (written: string): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(hasAZone.test(written) ? written : `${written}Z`));

/**
 * Brings every user who confirmed their email address over as an account, and
 * keeps which account each became (ImportUsers.feature).
 *
 * A user at an address already imported is kept as the account already made
 * and not brought over again. The look and the bringing over are in one
 * transaction with the record of it, so an account is never left unrecorded,
 * nor a record left of an account that was not kept.
 */
export class ImportUsers implements Importer<User> {
  readonly collection = "Users";

  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly emailAddresses: EmailAddressHasher,
    private readonly passwords: ImportedPasswordHasher,
    private readonly database: ImportDatabase,
  ) {}

  async importDocument({
    website,
    id,
    document,
  }: ReadDocument<User>): Promise<void> {
    const confirmedAt = document.ConfirmedAt;
    if (confirmedAt === null) return;

    await this.unitOfWork.inTransaction(async () => {
      // Read before it is looked for, so that it is looked for in the form the
      // site will compare it in.
      const address = EmailAddress.from(document.EmailAddress);
      const already = await this.database.findImportedAccount(address);
      if (already !== undefined) {
        await this.database.recordImportedUser(website, id, already, address);
        return;
      }

      const name = PersonName.from(nameToImport(document.Name));
      const account = Account.bringOver(
        AccountId.create(),
        name,
        address,
        this.emailAddresses.hash(address),
        await this.passwords.import(document.Password),
        momentOf(confirmedAt),
      );
      await this.accounts.save(account);
      await this.database.recordImportedUser(
        website,
        id,
        account.id.value,
        address,
      );
    });
  }
}
