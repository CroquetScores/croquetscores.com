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

import { AggregateRepository } from "../../../src/application/common/AggregateRepository.js";
import { Mediator } from "../../../src/application/common/Mediator.js";
import { ProjectingEventStore } from "../../../src/application/common/ProjectingEventStore.js";
import { ValidationBehaviour } from "../../../src/application/common/ValidationBehaviour.js";
import { RegisterAccountHandler } from "../../../src/application/operations/accounts/RegisterAccountHandler.js";
import { RegisterAccountValidator } from "../../../src/application/operations/accounts/RegisterAccountValidator.js";
import type { RegisterAccount } from "../../../src/application/operations/accounts/RegisterAccount.js";
import type { Projection } from "../../../src/application/common/Projection.js";
import { Account } from "../../../src/domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../src/domain/aggregates/accounts/value-objects/AccountId.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../../../src/domain/aggregates/accounts/value-objects/PersonName.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import { PostgresHandledRequests } from "../../../src/infrastructure/database/PostgresHandledRequests.js";
import { PostgresEmailsWritten } from "../../../src/infrastructure/email/PostgresEmailsWritten.js";
import { SignedLinks } from "../../../src/infrastructure/identity/SignedLinks.js";
import { TransactionBehaviour } from "../../../src/infrastructure/database/TransactionBehaviour.js";
import type { Registering, SeenEmail } from "../../support/registering.js";
import type { SpecWorld } from "../../support/world.js";
import { aSiteKey, keepAccounts, readBack } from "./accounts.js";
import { queueingOf } from "./emailQueue.js";
import { unitOfWorkOf } from "./transactions.js";
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
  confirmed: boolean;
}

// What an account a scenario says is confirmed was confirmed as. Registering
// changes neither, and the scenarios ask only that nothing more was recorded.
const CONFIRMED_AS = "Sam Someone";
const CONFIRMED_WITH = "stand-in$password-hash";

// The writer the site writes with, given the address the scenarios' links are
// made with. Named here, where naming the web layer is allowed, so that the
// application's feature can ask where an email points without naming it.
const writesEmails = emailWriter(scenarioLanguages, SITE_ADDRESS);

export const standUpRegistering = (world: SpecWorld): Registering => {
  const unitOfWork = unitOfWorkOf(world);
  const accounts = keepAccounts(world, aSiteKey());
  const { queue } = queueingOf(world);

  const refusing = new RefusingProjection();
  const store = new ProjectingEventStore(accounts.store, [
    accounts.readModel,
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
  world.mediator = mediator;
  world.validation = validation;

  let pending: Pending | undefined;

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
    if (pending !== undefined) {
      const making = pending;
      pending = undefined;
      settling = settling.then(() => make(making));
    }
    return settling;
  };

  const make = async ({ address, confirmed }: Pending): Promise<void> => {
    const account = Account.register(
      AccountId.create(),
      EmailAddress.from(address),
      accounts.hasher.hash(EmailAddress.from(address)),
      now(),
    );
    if (confirmed) {
      account.confirm(PersonName.from(CONFIRMED_AS), CONFIRMED_WITH, now());
    }
    await world.keepAccount?.(account);
  };

  return {
    async send(command: RegisterAccount): Promise<void> {
      await settle();
      await mediator.send(command);
    },
    giveAnAccount(address, confirmed) {
      pending = { address, confirmed };
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
        await world.asARequest(() => written.record(id, kind, at));
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
        fill: only.link === undefined ? {} : { link: only.link },
      });
      return `${written.subject}\n${written.body}`;
    },
    makeRecordingFail: () => {
      refusing.refusing = true;
    },
  };
};

Given("the application's registering", function (this: SpecWorld) {
  this.registering = standUpRegistering(this);
});
