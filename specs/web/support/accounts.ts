// The accounts a browser scenario says are already there, made through the
// application it is talking to.
//
// Made the way the site makes them, rather than by writing rows: an account
// that is registered is registered, and one that is confirmed is confirmed by
// submitting a name and a password with the link the registering emailed, so
// that a scenario about signing in is signing in to an account the site could
// actually have. Only an account brought over from the old site is written
// straight to the store, because nothing imports one yet.
import { randomUUID } from "node:crypto";

import { AskToForgetAccount } from "../../../src/application/operations/accounts/AskToForgetAccount.js";
import { ForgetAccount } from "../../../src/application/operations/accounts/ForgetAccount.js";
import { ConfirmEmailAddress } from "../../../src/application/operations/accounts/ConfirmEmailAddress.js";
import { RegisterAccount } from "../../../src/application/operations/accounts/RegisterAccount.js";
import { SignInWithFacebook } from "../../../src/application/operations/accounts/SignInWithFacebook.js";
import { SignInWithGoogle } from "../../../src/application/operations/accounts/SignInWithGoogle.js";
import { Account } from "../../../src/domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../src/domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../../../src/domain/aggregates/accounts/value-objects/PersonName.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import { OldSitePasswordHasher } from "../../../src/infrastructure/identity/OldSitePasswordHasher.js";
import type { Application } from "../../../src/web/server.js";
import type { AccountsInHand } from "../../support/accounts.js";

/** What an account is called when the scenario has not said. */
const CALLED = "Sam Someone";

/**
 * The Google account an account with no password is made by, and so the one
 * that signs in to it.
 */
export const googleSubjectOf = (address: string): string => `google-${address}`;

/** What Google says a reader with no password is called. */
export const calledByGoogle = CALLED;

/**
 * The salt the old site added to every password. A scenario's own, so that an
 * account brought over can be made and signed in to whether or not whoever
 * runs the specs has the real one.
 */
export const oldSiteSaltForScenarios = "the old site's site-wide salt";

const theOldSite = new OldSitePasswordHasher(oldSiteSaltForScenarios);

// Sixteen bytes of salt, as the old site made them, fixed so that a scenario
// making the same account twice makes the same hash.
const ITS_SALT = Buffer.alloc(16, 7).toString("base64");

/** `password` as the old site would have kept it: its salt and its hash. */
const asTheOldSiteKeptIt = (password: string): string => {
  const hash = theOldSite.hashOf(password, ITS_SALT);
  return `${ITS_SALT.slice(0, 4)}${hash}${ITS_SALT.slice(4)}`;
};

export const accountsThrough = (
  application: Application,
  now: () => ReadOnlyDate,
): AccountsInHand => ({
  // Asked for and confirmed, as the forget account page does, with the link
  // the asking emailed.
  async forget(address) {
    const id = await application.unitOfWork.inTransaction(() =>
      application.accountsByEmailAddress.find(EmailAddress.from(address)),
    );
    if (id === undefined) throw new Error(`No account for ${address}.`);
    await application.mediator.send(
      new AskToForgetAccount(id.value, "en", "croquetscores.com", now()),
    );
    await application.mediator.send(
      new ForgetAccount(
        await linkEmailedTo(application, address, "Email.ConfirmForgetting"),
        id.value,
        now(),
      ),
    );
  },

  async give(address, as) {
    if (as.fromTheOldSite === true) {
      await broughtOver(application, address, as.password ?? "", now());
      return;
    }

    // Made the one way the site makes an account with no password: by
    // signing in with Google.
    if (as.noPassword === true) {
      await application.mediator.send(
        new SignInWithGoogle(
          googleSubjectOf(address),
          address,
          true,
          as.name ?? CALLED,
          now(),
        ),
      );
      return;
    }

    await application.mediator.send(
      new RegisterAccount(
        randomUUID(),
        address,
        "en",
        "croquetscores.com",
        now(),
      ),
    );
    if (!as.confirmed) return;

    const link = await linkEmailedTo(application, address);
    const password = as.password ?? "correct horse battery staple";
    await application.mediator.send(
      new ConfirmEmailAddress(
        randomUUID(),
        link,
        as.name ?? CALLED,
        password,
        password,
        now(),
      ),
    );
  },

  // Kept straight to the store, as an account brought over is, since no
  // command gives a role yet. Given by an account of nobody's, as the role's
  // event records whoever gave it and the scenario does not say.
  async giveRole(address, role) {
    await changed(application, address, (account) => {
      account.addRole(role, AccountId.create(), now());
    });
  },

  async takeRole(address, role) {
    await changed(application, address, (account) => {
      account.removeRole(role, AccountId.create(), now());
    });
  },

  // Linked the way the site links one: by a sign-in with Google carrying the
  // account's own address, verified. A scenario that says an account was
  // linked is not about how, and this is the one way there is.
  async linkToGoogle(address, subject) {
    await application.mediator.send(
      new SignInWithGoogle(subject, address, true, CALLED, now()),
    );
  },

  // As for Google: by a sign-in with Facebook carrying the account's own
  // address.
  async linkToFacebook(address, facebookId) {
    await application.mediator.send(
      new SignInWithFacebook(facebookId, address, CALLED, now()),
    );
  },
});

/** The account for `address`, changed by `change` and kept again. */
const changed = async (
  application: Application,
  address: string,
  change: (account: Account) => void,
): Promise<void> => {
  await application.unitOfWork.inTransaction(async () => {
    const id = await application.accountsByEmailAddress.find(
      EmailAddress.from(address),
    );
    if (id === undefined) throw new Error(`No account for ${address}.`);
    const account = await application.accounts.load(id);
    if (account === undefined) throw new Error(`No events for ${address}.`);
    change(account);
    await application.accounts.save(account);
  });
};

/** The link in the newest email queued for `address`, of `kind` if given. */
export const linkEmailedTo = async (
  application: Application,
  address: string,
  kind?: string,
): Promise<string> => {
  const queued = await application.unitOfWork.inTransaction(() =>
    application.emailQueue.emails(),
  );
  const waiting = queued.filter(
    (email) =>
      !email.givenUp &&
      email.to === address &&
      (kind === undefined || email.kind === kind),
  );
  const last = waiting[waiting.length - 1];
  if (last?.link === undefined) {
    throw new Error(`No email carrying a link is queued for ${address}.`);
  }
  return last.link;
};

// Written straight to the store, because nothing imports an account yet: what
// would is a maintenance task over the old site's database, and when it exists
// this goes through it instead.
const broughtOver = async (
  application: Application,
  address: string,
  password: string,
  at: ReadOnlyDate,
): Promise<void> => {
  const at_ = EmailAddress.from(address);
  const account = Account.bringOver(
    AccountId.create(),
    PersonName.from(CALLED),
    at_,
    application.emailAddresses.hash(at_),
    await application.passwords.import(asTheOldSiteKeptIt(password)),
    at,
  );
  await application.unitOfWork.inTransaction(() =>
    application.accounts.save(account),
  );
};
