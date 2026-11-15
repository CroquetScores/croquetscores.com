// The accounts and signed-in readers a scenario that knows the site only by its
// address cannot make through a page without the whole of registering, an
// email and a link each time. Part of the test control (testControl.ts), and
// guarded as it is: mounted only for a site that has the token, and answering
// only to it.
//
// Made the way the site makes them, by the same commands it is sent from its
// own pages, so that a scenario about signing in is signing in to an account
// the site could actually have. A scenario says what it wants in plain words
// and gets back only a session to hold: no account, event or command type
// leaves the site.
import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";

import type { Mediator } from "../application/common/Mediator.js";
import { AskToForgetAccount } from "../application/operations/accounts/AskToForgetAccount.js";
import { ForgetAccount } from "../application/operations/accounts/ForgetAccount.js";
import { ConfirmEmailAddress } from "../application/operations/accounts/ConfirmEmailAddress.js";
import { RegisterAccount } from "../application/operations/accounts/RegisterAccount.js";
import { SignInWithGoogle } from "../application/operations/accounts/SignInWithGoogle.js";
import type { Sessions } from "../application/services/Sessions.js";
import type { Account } from "../domain/aggregates/accounts/Account.js";
import { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../domain/aggregates/accounts/value-objects/EmailAddress.js";
import {
  isRole,
  type Role,
} from "../domain/aggregates/accounts/value-objects/Role.js";
import { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import type { Clock } from "./common/requestedAt.js";
import { sameToken, testControlHeader } from "./testControl.js";

/** What making an account needs of the site, named by what each does. */
export interface ReaderMaking {
  readonly mediator: Mediator;
  readonly sessions: Sessions;
  readonly clock: Clock;
  readonly inTransaction: <T>(work: () => Promise<T>) => Promise<T>;
  readonly accountIdFor: (
    address: EmailAddress,
  ) => Promise<AccountId | undefined>;
  readonly loadAccount: (id: AccountId) => Promise<Account | undefined>;
  readonly saveAccount: (account: Account) => Promise<void>;
  readonly emailedTo: () => Promise<
    readonly {
      readonly to?: string | undefined;
      readonly kind: string;
      readonly link?: string | undefined;
      readonly givenUp: boolean;
    }[]
  >;
}

/** What an account a scenario says is there was made as. */
interface AccountToMake {
  emailAddress?: unknown;
  name?: unknown;
  password?: unknown;
  confirmed?: unknown;
  noPassword?: unknown;
  roles?: unknown;
}

// What an account is called when the scenario has not said.
const CALLED = "Sam Someone";
// The password of an account whose scenario has not said, which passes the
// site's rules for one.
const PASSWORD = "correct horse battery staple";

// The link in the newest email waiting for `address`, which is what confirming
// follows. Read from the queue rather than from an email sent, since a site
// under test sends nothing.
const linkTo = async (
  making: ReaderMaking,
  address: string,
  kind?: string,
): Promise<string> => {
  const waiting = (await making.inTransaction(making.emailedTo)).filter(
    (email) =>
      !email.givenUp &&
      email.to === address &&
      (kind === undefined || email.kind === kind),
  );
  const link = waiting[waiting.length - 1]?.link;
  if (link === undefined) {
    throw new Error(`No email carrying a link is queued for ${address}.`);
  }
  return link;
};

const textOf = (value: unknown, otherwise: string): string =>
  typeof value === "string" && value.trim() !== "" ? value : otherwise;

const make = async (
  making: ReaderMaking,
  asked: AccountToMake,
): Promise<void> => {
  const address = textOf(asked.emailAddress, "");
  if (address === "") throw new Error("An email address is needed.");
  // By the machine's clock and not the site's: the links an account is made with
  // are good for a time from when they are made, and a scenario that has set the
  // site's clock into the past must not find them already stale.
  const at = (): ReadOnlyDate => ReadOnlyDate.from(new Date());
  const name = textOf(asked.name, CALLED);

  if (asked.noPassword === true) {
    // The one way the site makes an account with no password: by signing in
    // with Google.
    await making.mediator.send(
      new SignInWithGoogle(`google-${address}`, address, true, name, at()),
    );
  } else {
    await making.mediator.send(
      new RegisterAccount(
        randomUUID(),
        address,
        "en",
        "croquetscores.com",
        at(),
      ),
    );
    if (asked.confirmed !== false) {
      const password = textOf(asked.password, PASSWORD);
      await making.mediator.send(
        new ConfirmEmailAddress(
          randomUUID(),
          await linkTo(making, address),
          name,
          password,
          password,
          at(),
        ),
      );
    }
  }

  const roles = Array.isArray(asked.roles) ? asked.roles : [];
  for (const written of roles) {
    if (typeof written !== "string" || !isRole(written)) {
      throw new Error(`${String(written)} is no role.`);
    }
    await giveRole(making, address, written, at());
  }
};

// Kept straight to the store, since no command gives a role yet, by an account
// of nobody's, as the role's event records whoever gave it.
const giveRole = async (
  making: ReaderMaking,
  address: string,
  role: Role,
  at: ReadOnlyDate,
): Promise<void> => {
  await making.inTransaction(async () => {
    const id = await making.accountIdFor(EmailAddress.from(address));
    if (id === undefined) throw new Error(`No account for ${address}.`);
    const account = await making.loadAccount(id);
    if (account === undefined) throw new Error(`No events for ${address}.`);
    account.addRole(role, AccountId.create(), at);
    await making.saveAccount(account);
  });
};

/** Mounts the readers on the test control, answering only to `token`. */
export const registerTestControlReaders = (
  server: FastifyInstance,
  token: string,
  making: ReaderMaking,
): void => {
  void server.register(
    (scope, _options, done) => {
      scope.addHook("onRequest", async (request, reply) => {
        if (!sameToken(request.headers[testControlHeader], token)) {
          return reply.callNotFound();
        }
        return undefined;
      });

      // An account, as the scenario says it is: confirmed or not, with a
      // password or none, and holding the roles it names.
      scope.post("/accounts", async (request, reply) => {
        try {
          await make(making, request.body ?? {});
        } catch (failure) {
          return reply
            .code(400)
            .send({ message: failure instanceof Error ? failure.message : "" });
        }
        return reply.code(201).send();
      });

      // An account forgotten, as forgetting one is done: asked for, and
      // confirmed with the link the asking emailed.
      scope.post("/accounts/forget", async (request, reply) => {
        const address = textOf(
          (request.body as { emailAddress?: unknown } | null)?.emailAddress,
          "",
        );
        try {
          const id = await making.inTransaction(() =>
            making.accountIdFor(EmailAddress.from(address)),
          );
          if (id === undefined) throw new Error(`No account for ${address}.`);
          // By the machine's clock, as making an account is (see make).
          const at = (): ReadOnlyDate => ReadOnlyDate.from(new Date());
          await making.mediator.send(
            new AskToForgetAccount(id.value, "en", "croquetscores.com", at()),
          );
          await making.mediator.send(
            new ForgetAccount(
              await linkTo(making, address, "Email.ConfirmForgetting"),
              id.value,
              at(),
            ),
          );
        } catch (failure) {
          return reply
            .code(400)
            .send({ message: failure instanceof Error ? failure.message : "" });
        }
        return reply.code(200).send();
      });

      // A session for the account, which the browser holds as a cookie.
      scope.post("/sessions", async (request, reply) => {
        const address = textOf(
          (request.body as { emailAddress?: unknown } | null)?.emailAddress,
          "",
        );
        const session = await making.inTransaction(async () => {
          const id = await making.accountIdFor(EmailAddress.from(address));
          return id === undefined
            ? undefined
            : making.sessions.start(id, ReadOnlyDate.from(making.clock()));
        });
        if (session === undefined) {
          return reply
            .code(404)
            .send({ message: `No account for ${address}.` });
        }
        return reply.code(201).send({ session });
      });

      done();
    },
    { prefix: "/__test" },
  );
};
