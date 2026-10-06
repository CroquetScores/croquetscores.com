// What stands behind "the application's registering": the operation, with the
// event store and read model the accounts support keeps and the Postgres email
// queue, all behind a mediator with the behaviours the application gives a
// command — validation, then a transaction.
//
// Here rather than beside the feature because the feature is the
// application's, and an application spec may name nothing from infrastructure.
// It puts a plain shape on the world (specs/support/registering.ts) and the
// steps ask only that.
import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";

import { AggregateRepository } from "../../../src/application/common/AggregateRepository.js";
import { Mediator } from "../../../src/application/common/Mediator.js";
import { ProjectingEventStore } from "../../../src/application/common/ProjectingEventStore.js";
import { ValidationBehaviour } from "../../../src/application/common/ValidationBehaviour.js";
import { RegisterAccountHandler } from "../../../src/application/operations/accounts/RegisterAccountHandler.js";
import { RegisterAccountValidator } from "../../../src/application/operations/accounts/RegisterAccountValidator.js";
import type { RegisterAccount } from "../../../src/application/operations/accounts/RegisterAccount.js";
import type { Projection } from "../../../src/application/common/Projection.js";
import { Account } from "../../../src/domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../src/domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../../../src/domain/aggregates/accounts/value-objects/PersonName.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import { PostgresHandledRequests } from "../../../src/infrastructure/database/PostgresHandledRequests.js";
import { PostgresEmailsWritten } from "../../../src/infrastructure/email/PostgresEmailsWritten.js";
import { SignedLinks } from "../../../src/infrastructure/identity/SignedLinks.js";
import { ConfirmEmailAddressHandler } from "../../../src/application/operations/accounts/ConfirmEmailAddressHandler.js";
import { ConfirmEmailAddressValidator } from "../../../src/application/operations/accounts/ConfirmEmailAddressValidator.js";
import { ResetPasswordHandler } from "../../../src/application/operations/accounts/ResetPasswordHandler.js";
import { AskToForgetAccountHandler } from "../../../src/application/operations/accounts/AskToForgetAccountHandler.js";
import { AskToSetPasswordHandler } from "../../../src/application/operations/accounts/AskToSetPasswordHandler.js";
import type { AskToForgetAccount } from "../../../src/application/operations/accounts/AskToForgetAccount.js";
import type { AskToSetPassword } from "../../../src/application/operations/accounts/AskToSetPassword.js";
import { ForgetAccountHandler } from "../../../src/application/operations/accounts/ForgetAccountHandler.js";
import type { ChangeName } from "../../../src/application/operations/accounts/ChangeName.js";
import type {
  AccountProfile,
  Profile,
} from "../../../src/application/operations/accounts/AccountProfile.js";
import { AccountProfileHandler } from "../../../src/application/operations/accounts/AccountProfileHandler.js";
import { ChangeNameHandler } from "../../../src/application/operations/accounts/ChangeNameHandler.js";
import type { ChangePassword } from "../../../src/application/operations/accounts/ChangePassword.js";
import { ChangePasswordHandler } from "../../../src/application/operations/accounts/ChangePasswordHandler.js";
import type { AskToChangeEmailAddress } from "../../../src/application/operations/accounts/AskToChangeEmailAddress.js";
import { AskToChangeEmailAddressHandler } from "../../../src/application/operations/accounts/AskToChangeEmailAddressHandler.js";
import { AskToChangeEmailAddressValidator } from "../../../src/application/operations/accounts/AskToChangeEmailAddressValidator.js";
import type { ChangeEmailAddress } from "../../../src/application/operations/accounts/ChangeEmailAddress.js";
import { ChangeEmailAddressHandler } from "../../../src/application/operations/accounts/ChangeEmailAddressHandler.js";
import type {
  MovingLinkWorth,
  WhatAMovingLinkIsWorth,
} from "../../../src/application/operations/accounts/WhatAMovingLinkIsWorth.js";
import { WhatAMovingLinkIsWorthHandler } from "../../../src/application/operations/accounts/WhatAMovingLinkIsWorthHandler.js";
import { ChangePasswordValidator } from "../../../src/application/operations/accounts/ChangePasswordValidator.js";
import { ChangeNameValidator } from "../../../src/application/operations/accounts/ChangeNameValidator.js";
import type { ForgetAccount } from "../../../src/application/operations/accounts/ForgetAccount.js";
import { ReportUnreachableServiceHandler } from "../../../src/application/operations/accounts/ReportUnreachableServiceHandler.js";
import type { ReportUnreachableService } from "../../../src/application/operations/accounts/ReportUnreachableService.js";
import { SetNewPasswordHandler } from "../../../src/application/operations/accounts/SetNewPasswordHandler.js";
import { SetNewPasswordValidator } from "../../../src/application/operations/accounts/SetNewPasswordValidator.js";
import type { SetNewPassword } from "../../../src/application/operations/accounts/SetNewPassword.js";
import { ResetPasswordValidator } from "../../../src/application/operations/accounts/ResetPasswordValidator.js";
import type { ResetPassword } from "../../../src/application/operations/accounts/ResetPassword.js";
import { SendConfirmationLinkAgainHandler } from "../../../src/application/operations/accounts/SendConfirmationLinkAgainHandler.js";
import { SignInHandler } from "../../../src/application/operations/accounts/SignInHandler.js";
import {
  type AccountsByGoogleAccount,
  SignInWithGoogleHandler,
} from "../../../src/application/operations/accounts/SignInWithGoogleHandler.js";
import type { SignInWithGoogle } from "../../../src/application/operations/accounts/SignInWithGoogle.js";
import type { SignIn } from "../../../src/application/operations/accounts/SignIn.js";
import type { SendConfirmationLinkAgain } from "../../../src/application/operations/accounts/SendConfirmationLinkAgain.js";
import { WhatASetNewPasswordLinkIsWorthHandler } from "../../../src/application/operations/accounts/WhatASetNewPasswordLinkIsWorthHandler.js";
import { WhatAConfirmationLinkIsWorthHandler } from "../../../src/application/operations/accounts/WhatAConfirmationLinkIsWorthHandler.js";
import type { WhatAConfirmationLinkIsWorth } from "../../../src/application/operations/accounts/WhatAConfirmationLinkIsWorth.js";
import type { ConfirmationLinkWorth } from "../../../src/application/operations/accounts/confirmationLinks.js";
import type { ConfirmEmailAddress } from "../../../src/application/operations/accounts/ConfirmEmailAddress.js";
import type { BreachedPasswords } from "../../../src/application/services/BreachedPasswords.js";
import type {
  PasswordCheck,
  PasswordHasher,
} from "../../../src/application/services/PasswordHasher.js";
import { ReadOnlyTransactionBehaviour } from "../../../src/infrastructure/database/ReadOnlyTransactionBehaviour.js";
import { TransactionBehaviour } from "../../../src/infrastructure/database/TransactionBehaviour.js";
import type { AccountAsGiven } from "../../support/accounts.js";
import type { Registering, SeenEmail } from "../../support/registering.js";
import type { SpecWorld } from "../../support/world.js";
import { aSiteKey, keepAccounts, readBack } from "./accounts.js";
import { alterLink } from "./links.js";
import { queueingOf } from "./emailQueue.js";
import { unitOfWorkOf } from "./transactions.js";
import { aFakeOfHaveIBeenPwned } from "./breachedPasswords.js";
import { emailWriter } from "../../../src/web/common/emailWriter.js";
import { scenarioLanguages } from "../../web/support/languages.js";

/** Where the scenarios' site answers, which its links are made with. */
const SITE_ADDRESS = "https://croquetscores.com";

/** A projection that fails the append it is given, when a scenario says to. */
class RefusingProjection implements Projection {
  refusing = false;

  project(): Promise<void> {
    if (this.refusing) {
      return Promise.reject(new Error("The account could not be recorded."));
    }
    return Promise.resolve();
  }
}

// An account a scenario says exists, made only when something needs it, so
// that it is made at the moment the scenario has named by then.
interface Pending {
  address: string;
  as: AccountAsGiven;
}

// What an account a scenario says is confirmed was confirmed as. Registering
// changes neither, and the scenarios ask only that nothing more was recorded.
const CONFIRMED_AS = "Sam Someone";
const CONFIRMED_WITH = "stand-in$password-hash";

// The writer the site writes with, given the address the scenarios' links are
// made with. Named here, where naming the web layer is allowed, so that the
// application's feature can ask where an email points without naming it.
const writesEmails = emailWriter(scenarioLanguages, {
  address: SITE_ADDRESS,
  fromName: "Croquet Scores",
  siteName: "Croquet Scores",
});

/**
 * A hasher that answers at once. The site's own is slow on purpose, and what
 * these scenarios are about is what is kept rather than what it cost. It
 * hashes rather than keeping the password, so that asking whether anything
 * kept contains the password is asking something.
 */
class QuickHasher implements PasswordHasher {
  /** How many times a password has been checked against a hash, or against none. */
  checks = 0;

  hash(password: string): Promise<string> {
    return Promise.resolve(digestOf(password));
  }

  check(password: string, hash: string | undefined): Promise<PasswordCheck> {
    this.checks += 1;
    // An old site's hash is checked its own way and marked to be made again,
    // as the site's own hasher does with one; anything else is checked the way
    // this makes them.
    if (hash !== undefined && hash.startsWith(OLD_SITE)) {
      const matches = hash === theOldSiteHashOf(password);
      return Promise.resolve({ matches, remake: matches });
    }
    return Promise.resolve({
      matches: hash !== undefined && hash === digestOf(password),
      remake: false,
    });
  }
}

const digestOf = (password: string): string =>
  `sha256$${createHash("sha256").update(password).digest("hex")}`;

const OLD_SITE = "old$";

// A hash of the old site's making, told apart from one of ours by its shape,
// so that a scenario can say an account came over with its old password and
// signing in can find that it did.
const theOldSiteHashOf = (password: string): string =>
  `${OLD_SITE}${createHash("sha256").update(password).digest("hex")}`;

export const standUpRegistering = (world: SpecWorld): Registering => {
  const unitOfWork = unitOfWorkOf(world);
  const accounts = keepAccounts(world, aSiteKey());
  const { queue } = queueingOf(world);

  const refusing = new RefusingProjection();
  const store = new ProjectingEventStore(accounts.store, [
    accounts.readModel,
    accounts.byGoogleAccount,
    refusing,
  ]);
  // Wrapped rather than handed over as it is: a static passed on its own is a
  // method separated from what it was declared on.
  const repository = new AggregateRepository(store, (id, events) =>
    Account.rebuiltFrom(id, events),
  );
  const now = (): ReadOnlyDate => {
    assert.ok(world.moment !== undefined, "No moment has been named.");
    return ReadOnlyDate.from(world.moment);
  };
  const written = new PostgresEmailsWritten(unitOfWork);
  const links = new SignedLinks(SITE_ADDRESS, "a signing key");

  const hasher = new QuickHasher();
  // On the world as well, so that a scenario can ask whether a hash was made
  // from a password without knowing how this one makes them.
  world.passwordHasher = hasher;
  // Asked for when it is used rather than held now, because what stands the
  // check up is a step of its own and may not have run yet.
  const breached: BreachedPasswords = {
    isBreached: (password) => {
      const check = world.breachedPasswords;
      assert.ok(check !== undefined, "There is no breached password check.");
      return check.isBreached(password);
    },
  };

  const mediator = new Mediator();
  const validation = new ValidationBehaviour();
  mediator.addCommandBehaviour(validation);
  mediator.addCommandBehaviour(new TransactionBehaviour(unitOfWork));
  validation.register(new RegisterAccountValidator());
  mediator.handleCommand(
    new RegisterAccountHandler(
      repository,
      accounts.readModel,
      accounts.hasher,
      queue,
      written,
      new PostgresHandledRequests(unitOfWork),
      links,
    ),
  );
  validation.register(new ConfirmEmailAddressValidator());
  mediator.handleCommand(
    new ConfirmEmailAddressHandler(
      repository,
      links,
      hasher,
      new PostgresHandledRequests(unitOfWork),
      unitOfWork,
      breached,
    ),
  );
  mediator.handleCommand(
    new SignInHandler(repository, accounts.readModel, hasher),
  );
  // Told to miss once, a scenario can stand where the second of two signings
  // in at once stands: it looked for the Google account before the first had
  // linked it. Missing is all that request saw, and one connection cannot run
  // two requests side by side to see it for real.
  let missNextLookup = false;
  // Told to forget once, a scenario can stand where a signing in stands that
  // found its account and then waited its turn while the account was being
  // forgotten: the account is forgotten before the signing in is sent, in a
  // request of its own, and the signing in is told what it would have found
  // before, which is all that request saw.
  let forgetNextFound = false;
  let foundBeforeForgetting: AccountId | undefined;
  const byGoogleAccount: AccountsByGoogleAccount = {
    find: (subject) => {
      if (missNextLookup) {
        missNextLookup = false;
        return Promise.resolve(undefined);
      }
      if (foundBeforeForgetting !== undefined) {
        const found = foundBeforeForgetting;
        foundBeforeForgetting = undefined;
        return Promise.resolve(found);
      }
      return accounts.byGoogleAccount.find(subject);
    },
  };
  mediator.handleCommand(
    new SignInWithGoogleHandler(
      repository,
      accounts.readModel,
      byGoogleAccount,
      accounts.hasher,
    ),
  );
  mediator.handleCommand(
    new SendConfirmationLinkAgainHandler(
      repository,
      queue,
      written,
      new PostgresHandledRequests(unitOfWork),
      links,
    ),
  );
  validation.register(new ResetPasswordValidator());
  mediator.handleCommand(
    new ResetPasswordHandler(
      repository,
      accounts.readModel,
      accounts.hasher,
      queue,
      written,
      new PostgresHandledRequests(unitOfWork),
      links,
    ),
  );
  mediator.handleCommand(
    new AskToForgetAccountHandler(repository, queue, links),
  );
  mediator.handleCommand(
    new AskToSetPasswordHandler(
      repository,
      queue,
      written,
      new PostgresHandledRequests(unitOfWork),
      links,
    ),
  );
  mediator.handleCommand(new ForgetAccountHandler(repository, links));
  validation.register(new ChangeNameValidator());
  mediator.handleCommand(new ChangeNameHandler(repository));
  mediator.handleQuery(new AccountProfileHandler(repository));
  validation.register(new AskToChangeEmailAddressValidator());
  mediator.handleCommand(
    new AskToChangeEmailAddressHandler(
      repository,
      accounts.readModel,
      accounts.hasher,
      hasher,
      queue,
      written,
      links,
    ),
  );
  mediator.handleQuery(new WhatAMovingLinkIsWorthHandler(repository, links));
  mediator.handleCommand(
    new ChangeEmailAddressHandler(repository, accounts.hasher, queue, links),
  );
  validation.register(new ChangePasswordValidator());
  mediator.handleCommand(
    new ChangePasswordHandler(repository, hasher, queue, unitOfWork, breached),
  );
  validation.register(new SetNewPasswordValidator());
  mediator.handleCommand(
    new SetNewPasswordHandler(
      repository,
      links,
      hasher,
      new PostgresHandledRequests(unitOfWork),
      unitOfWork,
      breached,
    ),
  );
  // A query changes nothing, so it is given a transaction it cannot write in,
  // as the application gives one.
  mediator.addQueryBehaviour(validation);
  mediator.addQueryBehaviour(new ReadOnlyTransactionBehaviour(unitOfWork));
  mediator.handleQuery(
    new WhatAConfirmationLinkIsWorthHandler(repository, links),
  );
  mediator.handleQuery(
    new WhatASetNewPasswordLinkIsWorthHandler(
      repository,
      links,
      new PostgresHandledRequests(unitOfWork),
    ),
  );

  world.mediator = mediator;
  world.validation = validation;

  // Every account the scenario has said is already there and that has not been
  // made yet, in the order it said them. A list rather than one, because a
  // scenario naming two accounts is naming two: the second overwriting the
  // first would leave an address the scenario said had an account with none,
  // and the scenario would pass or fail for a reason nobody wrote down.
  const pending: Pending[] = [];

  const idFor = async (address: string): Promise<AccountId> => {
    const found = await world.asARequest(() =>
      accounts.readModel.find(EmailAddress.from(address)),
    );
    assert.ok(found !== undefined, `No account for ${address}.`);
    return found;
  };

  const accountFor = async (address: string): Promise<Account | undefined> => {
    await settle();
    const found = await world.asARequest(() =>
      accounts.readModel.find(EmailAddress.from(address)),
    );
    return found === undefined ? undefined : readBack(world, found);
  };

  // Whatever the scenario said exists, made now. Called before anything reads
  // an account and before a registration is sent.
  //
  // The making is kept, so that registrations sent at once all wait for the
  // one account rather than the first making it while the rest, finding
  // nothing left to make, run ahead and race it for its address.
  let settling: Promise<void> = Promise.resolve();

  const settle = (): Promise<void> => {
    for (const making of pending.splice(0)) {
      settling = settling.then(() => make(making));
    }
    return settling;
  };

  const make = async ({ address, as }: Pending): Promise<void> => {
    const at = EmailAddress.from(address);
    // Brought over rather than registered, because an account from the old
    // site never registered here: it arrives with the name and the password
    // hash it had there, and confirmed.
    if (as.fromTheOldSite === true) {
      const brought = Account.bringOver(
        AccountId.create(),
        PersonName.from(CONFIRMED_AS),
        at,
        accounts.hasher.hash(at),
        theOldSiteHashOf(as.password ?? CONFIRMED_WITH),
        now(),
      );
      await world.keepAccount?.(brought);
      return;
    }

    const account = Account.register(
      AccountId.create(),
      at,
      accounts.hasher.hash(at),
      now(),
    );
    if (as.confirmed) {
      // Hashed the way this scenario's hasher hashes, so that a password the
      // scenario named is one that signing in can check.
      account.confirm(
        PersonName.from(as.name ?? CONFIRMED_AS),
        as.noPassword === true
          ? undefined
          : as.password === undefined
            ? CONFIRMED_WITH
            : digestOf(as.password),
        now(),
      );
    }
    await world.keepAccount?.(account);
  };

  return {
    async confirm(command: ConfirmEmailAddress): Promise<void> {
      await settle();
      await mediator.send(command);
    },

    async signIn(command: SignIn): Promise<AccountId> {
      await settle();
      return mediator.send(command);
    },

    passwordsChecked: () => hasher.checks,

    isTheOldSitesHash: (hash) => hash?.startsWith(OLD_SITE) === true,

    async signInWithGoogle(command: SignInWithGoogle): Promise<AccountId> {
      await settle();
      if (forgetNextFound) {
        forgetNextFound = false;
        const found = await world.asARequest(() =>
          accounts.byGoogleAccount.find(command.subject),
        );
        assert.ok(found !== undefined, `No account for ${command.subject}.`);
        const account = await readBack(world, found);
        account.forget(now());
        await world.keepAccount?.(account);
        foundBeforeForgetting = found;
      }
      return mediator.send(command);
    },

    lookForGoogleAccountTooEarly() {
      missNextLookup = true;
    },

    forgetAccountOnceFoundByGoogle() {
      forgetNextFound = true;
    },

    async linkToGoogle(address, subject) {
      await settle();
      const account = await readBack(world, await idFor(address));
      account.linkGoogleAccount(subject, now());
      await world.keepAccount?.(account);
    },

    async askToSetPassword(command: AskToSetPassword): Promise<void> {
      await settle();
      await mediator.send(command);
    },

    async askToForget(command: AskToForgetAccount): Promise<void> {
      await settle();
      await mediator.send(command);
    },

    async profile(query: AccountProfile): Promise<Profile | undefined> {
      await settle();
      return mediator.query(query);
    },

    async askToMove(command: AskToChangeEmailAddress): Promise<void> {
      await settle();
      await mediator.send(command);
    },

    async worthOfMovingLink(
      query: WhatAMovingLinkIsWorth,
    ): Promise<MovingLinkWorth> {
      await settle();
      return mediator.query(query);
    },

    async moveWithLink(command: ChangeEmailAddress): Promise<AccountId> {
      await settle();
      return mediator.send(command);
    },

    async changePassword(command: ChangePassword): Promise<AccountId> {
      await settle();
      return mediator.send(command);
    },

    async changeName(command: ChangeName): Promise<AccountId> {
      await settle();
      return mediator.send(command);
    },

    async forgetWithLink(command: ForgetAccount): Promise<AccountId> {
      await settle();
      return mediator.send(command);
    },

    // Registered when the scenario says who the administrator is, since that
    // is what the handler is made with, as the site's is made with its config.
    tellsAdministrator(address) {
      mediator.handleCommand(
        new ReportUnreachableServiceHandler(queue, written, address),
      );
    },

    async report(command: ReportUnreachableService): Promise<void> {
      await mediator.send(command);
    },

    async setNewPassword(command: SetNewPassword): Promise<AccountId> {
      await settle();
      return mediator.send(command);
    },

    async resetPassword(command: ResetPassword): Promise<void> {
      await settle();
      await mediator.send(command);
    },

    async sendAgain(command: SendConfirmationLinkAgain): Promise<void> {
      await settle();
      await mediator.send(command);
    },

    async worthOf(
      query: WhatAConfirmationLinkIsWorth,
    ): Promise<ConfirmationLinkWorth> {
      // Whatever the scenario said exists is made first: an account it only
      // said it had is not there for the link to name until it is.
      await settle();
      return mediator.query(query);
    },

    // Read out of the queue, as a reader reads it out of their mail.
    async linkEmailedTo(address, nth = 1) {
      const emails = await world.asARequest(() => queue.emails());
      const waiting = emails.filter(
        (email) => !email.givenUp && email.to === address,
      );
      const only = waiting[nth - 1];
      assert.ok(
        only !== undefined,
        `${waiting.length} emails are queued for ${address}.`,
      );
      assert.ok(only.link !== undefined, "The email carries no link.");
      return only.link;
    },

    altered: alterLink,

    async aLinkToConfirm(address) {
      await settle();
      const id = await idFor(address);
      return links.make(
        "confirm-email-address",
        id,
        ReadOnlyDate.from(new Date(now().toDate().getTime() + 86400000)),
      );
    },

    async aLinkToForget(address) {
      // Whatever the scenario said exists is made first: an account it only
      // said it had is not there to be looked up until it is.
      await settle();
      const id = await idFor(address);
      // A day, like the link registering sends: how long it works is not what
      // the scenario using it is about, only what it is for.
      return links.make(
        "confirm-forgetting",
        id,
        ReadOnlyDate.from(new Date(now().toDate().getTime() + 86400000)),
      );
    },

    async everythingKeptFor(address) {
      // Whatever the scenario said exists is made first: an account it only
      // said it had is not there to be looked up until it is.
      await settle();
      const id = await idFor(address);
      const { rows } = await world.database.query<{ row: string }>(
        `select e::text as row from events e where stream_id = $1`,
        [id.value],
      );
      return rows.map(({ row }) => row).join("\n");
    },

    async forget(address) {
      // Whatever the scenario said exists is made first: an account it only
      // said it had is not there to be looked up until it is.
      await settle();
      const id = await idFor(address);
      const account = await readBack(world, id);
      account.forget(now());
      await world.keepAccount?.(account);
    },

    // Kept straight to the store, as forgetting is above, since no command
    // gives a role yet. Given by an account of nobody's, as the role's event
    // records whoever gave it and the scenario does not say.
    async giveRole(address, role) {
      await settle();
      const account = await readBack(world, await idFor(address));
      account.addRole(role, AccountId.create(), now());
      await world.keepAccount?.(account);
    },

    async takeRole(address, role) {
      await settle();
      const account = await readBack(world, await idFor(address));
      account.removeRole(role, AccountId.create(), now());
      await world.keepAccount?.(account);
    },

    async send(command: RegisterAccount): Promise<void> {
      await settle();
      await mediator.send(command);
    },
    giveAnAccount(address, as) {
      pending.push({ address, as });
      return Promise.resolve();
    },
    async wroteTo(address, kind, times) {
      await settle();
      const id = await idFor(address);
      // A few minutes ago, so that they are inside the hour whatever the
      // scenario's moment is.
      const at = ReadOnlyDate.from(
        new Date(now().toDate().getTime() - 5 * 60 * 1000),
      );
      for (let each = 0; each < times; each++) {
        await world.asARequest(() => written.record({ account: id }, kind, at));
      }
    },
    async wroteToAddress(address, kind, times) {
      await settle();
      const at = ReadOnlyDate.from(
        new Date(now().toDate().getTime() - 5 * 60 * 1000),
      );
      const whom = {
        emailAddressHash: accounts.hasher.hash(EmailAddress.from(address)),
      };
      for (let each = 0; each < times; each++) {
        await world.asARequest(() => written.record(whom, kind, at));
      }
    },
    accountFor,
    async accountsFor(address) {
      await settle();
      const { rows } = await world.database.query<{ accounts: string }>(
        `select count(*) as accounts
           from accounts_by_email_address
          where email_address_hash = $1`,
        [accounts.hasher.hash(EmailAddress.from(address))],
      );
      return Number(rows[0]?.accounts ?? 0);
    },
    // Read back from the queue itself, so that what was rolled back is not
    // seen, and what the queue chose not to keep is not seen either.
    async queued(): Promise<readonly SeenEmail[]> {
      const emails = await world.asARequest(() => queue.emails());
      return emails
        .filter((email) => !email.givenUp)
        .map((email) => ({
          kind: email.kind,
          to: email.to ?? "",
          link: email.link,
          worksUntil: email.linkWorksUntil,
        }));
    },
    async writtenFor(address) {
      const emails = await world.asARequest(() => queue.emails());
      const found = emails.filter(
        (email) => !email.givenUp && email.to === address,
      );
      assert.equal(found.length, 1, `${found.length} emails are queued.`);
      const only = found[0];
      assert.ok(only !== undefined);
      const written = writesEmails.write({
        kind: only.kind,
        language: "en",
        fill: only.fill ?? {},
      });
      return `${written.subject}\n${written.body}`;
    },
    makeRecordingFail: () => {
      refusing.refusing = true;
    },
  };
};

// Registering stands up the operation too, since it is the same mediator over
// the same accounts and the same queue. Said in its own words all the same,
// because a scenario about sending the link again is not about registering.
Given(
  "the application's sending of the confirmation link again",
  function (this: SpecWorld) {
    standUpFor(this);
  },
);

Given("the application's registering", function (this: SpecWorld) {
  standUpFor(this);
});

// Signing in is handled by the same mediator over the same accounts, so
// standing registering up stands it up too. Said in its own words because a
// scenario about signing in is not about registering.
Given("the application's signing in", function (this: SpecWorld) {
  standUpFor(this);
});

// The same mediator over the same accounts, said in its own words because a
// scenario about signing in with Google is not about registering.
Given("the application's signing in with Google", function (this: SpecWorld) {
  standUpFor(this);
});

// The same mediator over the same accounts, said in its own words because a
// scenario about forgetting is not about registering.
Given("the application's forgetting of accounts", function (this: SpecWorld) {
  standUpFor(this);
});

// The same mediator over the same accounts, said in its own words because a
// scenario about changing a name is not about registering.
Given("the application's changing of names", function (this: SpecWorld) {
  standUpFor(this);
});

// The same mediator over the same accounts and the same queue, said in its own
// words because a scenario about moving to another address is not about
// registering.
Given(
  "the application's changing of email addresses",
  function (this: SpecWorld) {
    standUpFor(this);
  },
);

// The same mediator over the same accounts, said in its own words because a
// scenario about changing a password is not about registering. The breached
// password check it asks is stood up here, as confirming's is.
Given(
  "the application's changing of passwords",
  async function (this: SpecWorld) {
    standUpFor(this);
    await aFakeOfHaveIBeenPwned(this);
  },
);

// The same mediator over the same accounts, said in its own words because a
// scenario about what an account shows is not about registering.
Given("the application's finding of profiles", function (this: SpecWorld) {
  standUpFor(this);
});

// The same mediator over the same queue, said in its own words because a
// scenario about telling the administrator is not about registering.
Given(
  "the application's reporting of unreachable services",
  function (this: SpecWorld) {
    standUpFor(this);
  },
);

// The same mediator over the same accounts and the same queue, said in its own
// words because a scenario about asking for a way back in is not about
// registering.
Given("the application's asking for a way back in", function (this: SpecWorld) {
  standUpFor(this);
});

// The same again, for a scenario about asking for a link to set a password;
// with the breached password check confirming starts, since those scenarios
// go on to set the password with the link.
Given(
  "the application's asking to set a password",
  async function (this: SpecWorld) {
    standUpFor(this);
    await aFakeOfHaveIBeenPwned(this);
  },
);

// Exported so that what stands up a tournament's operations can stand up the
// accounts they are asked by, the same way.
export const standUpFor = (world: SpecWorld): void => {
  const registering = standUpRegistering(world);
  world.registering = registering;
  world.accountsInHand = {
    give: (address, as) => registering.giveAnAccount(address, as),
    forget: (address) => registering.forget(address),
    linkToGoogle: (address, subject) =>
      registering.linkToGoogle(address, subject),
    giveRole: (address, role) => registering.giveRole(address, role),
    takeRole: (address, role) => registering.takeRole(address, role),
  };
};

// Confirming is handled by the same mediator, so standing registering up
// stands it up too. What this adds is the breached password check confirming
// asks, which registering has no use for and which has to be started.
Given("the application's confirming", async function (this: SpecWorld) {
  assert.ok(
    this.registering !== undefined,
    "The application's registering is not stood up.",
  );
  await aFakeOfHaveIBeenPwned(this);
});
