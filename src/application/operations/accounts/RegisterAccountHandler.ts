import { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/value-objects/AccountId.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../../../domain/aggregates/accounts/value-objects/PersonName.js";
import { Password } from "../../../domain/aggregates/accounts/value-objects/Password.js";
import { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { RequestInvalid } from "../../common/ValidationBehaviour.js";
import type { BreachedPasswords } from "../../services/BreachedPasswords.js";
import type { LinkPurpose, Links } from "../../services/Links.js";
import type { EmailAddressHasher } from "../../services/EmailAddressHasher.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { EmailsWritten } from "../../services/EmailsWritten.js";
import type { HandledRequests } from "../../services/HandledRequests.js";
import type { PasswordHasher } from "../../services/PasswordHasher.js";
import { RegisterAccount } from "./RegisterAccount.js";

/** What registering asks of where accounts are found by their address. */
export interface AccountsByAddress {
  /**
   * Reserves `address` for `account`, and says who holds it afterwards: the
   * account given when this registration reserved it, and whoever already held
   * it when it did not. Always somebody.
   *
   * Reserving rather than looking and then writing, because between a look
   * that found nothing and the writing that followed it another registration
   * can have taken the address, and then both would make an account for it.
   */
  reserve(address: EmailAddress, account: AccountId): Promise<AccountId>;
}

// What registering writes, and what link each carries: the purpose the link is
// made for, or nothing where the email carries none of registering's own. Said
// here, once, rather than worked out from the kind's name where the email is
// queued, so that the next kind added has to say what it carries.
//
// The purpose rather than a yes or no, because the purpose is signed into the
// link and a link made for one thing is refused for another. A kind added with
// only "it has a link" would be given whatever purpose the last one used, and
// the email would point its reader at the wrong page.
const emails: Readonly<Record<Kind, { readonly link?: LinkPurpose }>> = {
  "Email.ConfirmAddress": { link: "confirm-email-address" },
  "Email.ConfirmAddressAgain": { link: "confirm-email-address" },
  "Email.AlreadyRegistered": {},
};

type Kind =
  | "Email.ConfirmAddress"
  | "Email.ConfirmAddressAgain"
  | "Email.AlreadyRegistered";

/** How long a link to confirm an address works. Confirming says why. */
const LINK_WORKS_FOR_HOURS = 24;

/** How many emails registering may fill an account's inbox with, per hour. */
const EMAILS_AN_HOUR = 3;

const AN_HOUR = 60 * 60 * 1000;

const shiftedBy = (moment: ReadOnlyDate, milliseconds: number): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(moment.toDate().getTime() + milliseconds));

/**
 * Registering an account.
 *
 * Everything it does happens in one transaction: the account's events, the
 * email queued about them, the record of having written to the account, and
 * the request id that says this registration has been carried out. Either all
 * of it is kept or none is, so an account is never left without its email, nor
 * an email sent about an account that was not recorded.
 *
 * The shape of the work is the same whoever the address belongs to, and in the
 * same order, because the answer must not say. The password is hashed before
 * anything is looked up and whatever is found, since hashing is slow on
 * purpose and an answer that came back sooner would say the address was
 * registered.
 */
export class RegisterAccountHandler extends CommandHandler<
  RegisterAccount,
  void
> {
  readonly handles: RequestType<RegisterAccount> = RegisterAccount;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly byAddress: AccountsByAddress,
    private readonly addresses: EmailAddressHasher,
    private readonly passwords: PasswordHasher,
    private readonly breached: BreachedPasswords,
    private readonly queue: EmailQueue,
    private readonly written: EmailsWritten,
    private readonly handled: HandledRequests,
    private readonly links: Links,
  ) {
    super();
  }

  async handle(command: RegisterAccount): Promise<void> {
    // Claimed before anything is done, so that a retry arriving while the
    // first is still in flight waits on its row and then finds it taken,
    // rather than both of them registering.
    if (!(await this.handled.claim(command.requestId, command.requestedAt))) {
      return;
    }

    const name = PersonName.from(command.name);
    const address = EmailAddress.from(command.emailAddress);
    const password = Password.from(command.password);

    // Refused as a broken rule, and not by the validator, because asking
    // whether a password has been breached is a request over the network and
    // a validator answers without waiting. It is asked after the rules that
    // need nobody asked, so a password that was never going to be allowed
    // costs no request; and before the password is hashed, so a breached one
    // costs no hash either. A refusal here is a visible answer whatever the
    // address, so nothing about its timing says anything about the address.
    if (await this.breached.isBreached(password.reveal())) {
      throw new RequestInvalid(command, [
        { code: "Password.Breached", fields: ["password"] },
      ]);
    }

    // Hashed before the address is looked at, and whatever is found: hashing
    // is slow on purpose, and an answer that came back sooner for a registered
    // address would say it was one.
    const passwordHash = await this.passwords.hash(password.reveal());

    // The id is minted before the address is reserved, because it is what the
    // reservation is made in the name of: whoever the reservation comes back
    // naming is whoever holds the address, and this registration made the
    // account only if that is the id it just minted.
    const id = AccountId.create();
    const holder = await this.byAddress.reserve(address, id);

    if (holder.equals(id)) {
      await this.registerNew(command, id, name, address, passwordHash);
      return;
    }
    await this.writeToTheAccount(command, holder);
  }

  // A new account, and the link that confirms it. Nothing is counted against
  // the limit before this, because an account nobody had cannot have been
  // written to; the email is counted after it, so the next registration for
  // the address counts this one.
  private async registerNew(
    command: RegisterAccount,
    id: AccountId,
    name: PersonName,
    address: EmailAddress,
    passwordHash: string,
  ): Promise<void> {
    const account = Account.register(
      id,
      name,
      address,
      this.addresses.hash(address),
      passwordHash,
      command.requestedAt,
    );
    await this.accounts.save(account);
    await this.write(command, id, address, "Email.ConfirmAddress");
  }

  // An address somebody already has. Nothing about the account changes —
  // neither its name nor its password, whatever this registration typed —
  // and the only thing that happens is that its owner is written to.
  private async writeToTheAccount(
    command: RegisterAccount,
    id: AccountId,
  ): Promise<void> {
    const account = await this.accounts.load(id);
    // The read model found it, so its stream is there; a stream that has gone
    // between the two is a broken database rather than something to tell
    // whoever registered.
    if (account === undefined) {
      throw new Error(`The account ${id.value} has no events.`);
    }

    const since = shiftedBy(command.requestedAt, -AN_HOUR);
    if ((await this.written.countSince(id, since)) >= EMAILS_AN_HOUR) return;

    // To the address the account holds, never the one this registration typed:
    // an address differing only in case is the same address, but not every
    // mail host thinks so, and the owner may not read the casing a stranger
    // used.
    await this.write(
      command,
      id,
      account.emailAddress,
      account.confirmed
        ? "Email.AlreadyRegistered"
        : "Email.ConfirmAddressAgain",
    );
  }

  // Queues one email and counts it. A link is made for the kinds that say
  // they carry one; what each kind is made of is the writer's to say.
  private async write(
    command: RegisterAccount,
    account: AccountId,
    to: EmailAddress,
    kind: Kind,
  ): Promise<void> {
    const purpose = emails[kind].link;
    const until = shiftedBy(
      command.requestedAt,
      LINK_WORKS_FOR_HOURS * AN_HOUR,
    );

    await this.queue.queue({
      kind,
      to: to.toString(),
      account,
      language: command.language,
      fill:
        purpose === undefined
          ? {}
          : { link: this.links.make(purpose, account, until) },
      ...(purpose === undefined ? {} : { linkWorksUntil: until }),
      queuedAt: command.requestedAt,
    });
    await this.written.record(account, kind, command.requestedAt);
  }
}
