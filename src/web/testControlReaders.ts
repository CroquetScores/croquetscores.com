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
import { Countries } from "../domain/aggregates/tournaments/value-objects/Countries.js";
import type { DatabaseAccess } from "../application/common/DatabaseAccess.js";
import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";

import type { Mediator } from "../application/common/Mediator.js";
import { AskToForgetAccount } from "../application/operations/accounts/AskToForgetAccount.js";
import { ForgetAccount } from "../application/operations/accounts/ForgetAccount.js";
import { ResetPassword } from "../application/operations/accounts/ResetPassword.js";
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
  /** Says `times` emails of `kind` were written to the account `to`, `minutesAgo`. */
  readonly writeEmails: (
    to: AccountId,
    kind: string,
    times: number,
    minutesAgo: number,
  ) => Promise<void>;
  /** Says `times` askings for a way back in were made from `ipAddress`, `minutesAgo`. */
  readonly writeAskings: (
    ipAddress: string,
    times: number,
    minutesAgo: number,
  ) => Promise<void>;
  /** Whether `password` is the one the account keeps, and whether its hash is of an old kind. */
  readonly checkPassword: (
    id: AccountId,
    password: string,
  ) => Promise<{ matches: boolean; remake: boolean }>;
  /** An account the old site had, with `password` kept the way the old site kept it. */
  readonly bringOver: (
    address: EmailAddress,
    name: string,
    password: string,
    at: ReadOnlyDate,
  ) => Promise<void>;
  /** How many sessions the account has. */
  readonly sessionsOf: (id: AccountId) => Promise<number>;
  /** Says `times` sign ins as `comparable` (an address as it is compared) failed, `minutesAgo`. */
  /** Says the world rankings of `sport` ("ac" or "gc") hold a player called `name`. */
  readonly addWorldRankingPlayer: (
    sport: string,
    name: string,
  ) => Promise<void>;
  readonly writeFailedSignIns: (
    comparable: string,
    ipAddress: string,
    times: number,
    minutesAgo: number,
  ) => Promise<void>;
  readonly countFailedSignIns: (comparable: string) => Promise<number>;
  /** The account a session cookie belongs to, if it belongs to any. */
  readonly accountOfSession: (cookie: string) => Promise<string | undefined>;
  /** Whether any row the site keeps of its sessions holds `cookie`. */
  readonly sessionsHold: (cookie: string) => Promise<boolean>;
  /** What the tournament with this id holds, as plain data. */
  readonly keptOf: (id: string, name?: string) => Promise<object | undefined>;
  /** What the competition with this id holds, as plain data. */
  readonly gamesOf: (id: string) => Promise<object | undefined>;
  /** The notes of the tournament with this id, as plain data. */
  readonly notesOf: (id: string) => Promise<object[]>;
  /** The build the site names, and from now on another one. */
  readonly build: () => string;
  readonly deployAgain: () => void;
  /** The switch for database access, which the site keeps outside its database. */
  readonly databaseAccess: DatabaseAccess;
  /** Puts an entry in the server's log as if it had been written at `writtenAt`. */
  /** False where there is no severity of that name, and nothing was put. */
  readonly addLogEntry: (entry: {
    readonly writtenAt: Date;
    readonly severity: string;
    readonly message: string;
    readonly reference?: string;
  }) => Promise<boolean>;
  /** Says the world rankings' list of `sport` names the country with this code. */
  readonly listCountry: (sport: "ac" | "gc", code: string) => void;
  readonly emailedTo: () => Promise<
    readonly {
      readonly to?: string | undefined;
      readonly kind: string;
      readonly link?: string | undefined;
      readonly fill?: Readonly<Record<string, string>> | undefined;
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
  fromTheOldSite?: unknown;
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

  if (asked.fromTheOldSite === true) {
    await making.bringOver(
      EmailAddress.from(address),
      name,
      textOf(asked.password, PASSWORD),
      at(),
    );
  } else if (asked.noPassword === true) {
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

      // Whether the site has an account for an address: an address that breaks the
      // rules for one never had an account, and is counted as none.
      scope.get("/accounts/count", async (request) => {
        const address = (request.query as { emailAddress?: string })
          .emailAddress;
        try {
          const id = await making.inTransaction(() =>
            making.accountIdFor(EmailAddress.from(address ?? "")),
          );
          return { count: id === undefined ? 0 : 1 };
        } catch {
          return { count: 0 };
        }
      });

      // Emails written to an account before, which the site counts against the
      // limit on how many it writes in an hour.
      scope.post("/emails/written", async (request, reply) => {
        const body = (request.body ?? {}) as {
          emailAddress?: unknown;
          kind?: unknown;
          times?: unknown;
          minutesAgo?: unknown;
        };
        const id = await making.inTransaction(() =>
          making.accountIdFor(EmailAddress.from(textOf(body.emailAddress, ""))),
        );
        if (
          id === undefined ||
          typeof body.kind !== "string" ||
          typeof body.times !== "number" ||
          typeof body.minutesAgo !== "number"
        ) {
          return reply.code(400).send({ code: "TestControl.NotWritable" });
        }
        await making.writeEmails(id, body.kind, body.times, body.minutesAgo);
        return reply.code(200).send();
      });

      // Askings for a way back in, which the site counts against a limit for
      // the address they came from.
      scope.post("/askings", async (request, reply) => {
        const body = (request.body ?? {}) as {
          ipAddress?: unknown;
          times?: unknown;
          minutesAgo?: unknown;
        };
        if (
          typeof body.ipAddress !== "string" ||
          typeof body.times !== "number" ||
          typeof body.minutesAgo !== "number"
        ) {
          return reply.code(400).send({ code: "TestControl.NotWritable" });
        }
        await making.writeAskings(body.ipAddress, body.times, body.minutesAgo);
        return reply.code(200).send();
      });

      // Forgetting asked for, as the forget account page asks for it: the link to
      // confirm it is emailed.
      scope.post("/accounts/ask-to-forget", async (request, reply) => {
        const address = textOf(
          (request.body as { emailAddress?: unknown } | null)?.emailAddress,
          "",
        );
        try {
          const id = await making.inTransaction(() =>
            making.accountIdFor(EmailAddress.from(address)),
          );
          if (id === undefined) throw new Error(`No account for ${address}.`);
          await making.mediator.send(
            new AskToForgetAccount(
              id.value,
              "en",
              "croquetscores.com",
              ReadOnlyDate.from(new Date()),
            ),
          );
        } catch (failure) {
          return reply
            .code(400)
            .send({ message: failure instanceof Error ? failure.message : "" });
        }
        return reply.code(200).send();
      });

      // A way back in asked for, as the forgot password page asks for one.
      scope.post("/accounts/way-back", async (request, reply) => {
        const address = textOf(
          (request.body as { emailAddress?: unknown } | null)?.emailAddress,
          "",
        );
        try {
          await making.mediator.send(
            new ResetPassword(
              randomUUID(),
              address,
              "en",
              "croquetscores.com",
              ReadOnlyDate.from(new Date()),
            ),
          );
        } catch (failure) {
          return reply
            .code(400)
            .send({ message: failure instanceof Error ? failure.message : "" });
        }
        return reply.code(200).send();
      });

      // Whether a password is the account's, and of today's kind.
      scope.post("/accounts/password", async (request, reply) => {
        const body = (request.body ?? {}) as {
          emailAddress?: unknown;
          password?: unknown;
        };
        const id = await making.inTransaction(() =>
          making.accountIdFor(EmailAddress.from(textOf(body.emailAddress, ""))),
        );
        if (id === undefined || typeof body.password !== "string") {
          return reply.code(404).send({ code: "TestControl.NoAccount" });
        }
        return making.checkPassword(id, body.password);
      });

      // Whether the site may use its database, as an administrator sets it.
      scope.get("/database-access", async () => {
        const state = await making.databaseAccess.current();
        return {
          off: state.off,
          ...(state.off
            ? {
                expectedBackAt: state.expectedBackAt.toISOString(),
                words: state.words,
              }
            : {}),
        };
      });
      scope.post("/database-access", async (request, reply) => {
        const body = (request.body ?? {}) as {
          off?: unknown;
          minutes?: unknown;
          words?: unknown;
          move?: unknown;
        };
        const words = typeof body.words === "string" ? body.words : undefined;
        const now = making.clock();
        if (body.off === false) {
          await making.databaseAccess.turnOn();
        } else if (typeof body.minutes === "number") {
          if (body.move === true) {
            await making.databaseAccess.moveReturn(body.minutes, now, words);
          } else {
            await making.databaseAccess.turnOff(body.minutes, now, words);
          }
        } else {
          return reply.code(400).send({ code: "TestControl.NotWritable" });
        }
        return reply.code(200).send({});
      });

      // An entry of the server's log, as the stream writes one: a row for each.
      scope.post("/log-entries", async (request, reply) => {
        const body = (request.body ?? {}) as {
          message?: unknown;
          severity?: unknown;
          writtenAt?: unknown;
          reference?: unknown;
        };
        const writtenAt =
          typeof body.writtenAt === "string"
            ? new Date(body.writtenAt)
            : undefined;
        if (
          typeof body.severity !== "string" ||
          typeof body.message !== "string" ||
          writtenAt === undefined ||
          Number.isNaN(writtenAt.getTime())
        ) {
          return reply.code(400).send({ code: "TestControl.NotWritable" });
        }
        const put = await making.addLogEntry({
          writtenAt,
          severity: body.severity,
          message: body.message,
          ...(typeof body.reference === "string"
            ? { reference: body.reference }
            : {}),
        });
        if (!put) {
          return reply.code(400).send({ code: "TestControl.NotWritable" });
        }
        return reply.code(201).send({});
      });

      // The countries the world rankings' lists name, which a site under the
      // control starts knowing none of, so that a scenario says which.
      scope.post("/world-ranking-countries", async (request, reply) => {
        const body = (request.body ?? {}) as {
          sport?: unknown;
          country?: unknown;
        };
        const country = Countries.thereAre.all.find(
          (each) => each.name === body.country,
        );
        if (
          (body.sport !== "ac" && body.sport !== "gc") ||
          country === undefined
        ) {
          return reply.code(400).send({ code: "TestControl.NotWritable" });
        }
        making.listCountry(body.sport, country.code);
        return reply.code(201).send({});
      });

      // What the admin is told the site's build is called, and a deploy that
      // changes it, so that a page loaded before is behind it.
      scope.get("/build", () => ({ build: making.build() }));
      scope.post("/build", async (_request, reply) => {
        making.deployAgain();
        return reply.code(200).send({ build: making.build() });
      });

      // A player the world rankings are said to hold, as an import would have
      // left them, so that what is found among them is the scenario's subject.
      scope.post("/world-ranking-players", async (request, reply) => {
        const body = (request.body ?? {}) as {
          sport?: unknown;
          name?: unknown;
        };
        if (
          (body.sport !== "ac" && body.sport !== "gc") ||
          typeof body.name !== "string"
        ) {
          return reply.code(400).send({ code: "TestControl.NotWritable" });
        }
        await making.addWorldRankingPlayer(body.sport, body.name);
        return reply.code(201).send({});
      });

      // Sign ins that failed, which the site counts against a limit.
      scope.post("/signins/failed", async (request, reply) => {
        const body = (request.body ?? {}) as {
          emailAddress?: unknown;
          ipAddress?: unknown;
          times?: unknown;
          minutesAgo?: unknown;
        };
        if (
          typeof body.times !== "number" ||
          typeof body.minutesAgo !== "number" ||
          (typeof body.emailAddress !== "string" &&
            typeof body.ipAddress !== "string")
        ) {
          return reply.code(400).send({ code: "TestControl.NotWritable" });
        }
        // Counted against an account's address or against where it came from,
        // which a failure is for one or the other.
        await making.writeFailedSignIns(
          typeof body.emailAddress === "string"
            ? EmailAddress.from(body.emailAddress).comparable
            : "",
          typeof body.ipAddress === "string" ? body.ipAddress : "",
          body.times,
          body.minutesAgo,
        );
        return reply.code(200).send();
      });

      scope.get("/signins/failed", async (request) => {
        const address = (request.query as { emailAddress?: string })
          .emailAddress;
        return {
          count: await making.countFailedSignIns(
            EmailAddress.from(address ?? "").comparable,
          ),
        };
      });

      // What a tournament holds, as plain data, for a scenario that says what was
      // kept of it and cannot say so from a page.
      scope.get("/tournaments/kept", async (request, reply) => {
        const { id, name } = request.query as { id?: string; name?: string };
        const kept = await making.keptOf(id ?? "", name);
        if (kept === undefined) {
          return reply.code(404).send({ code: "TestControl.NoTournament" });
        }
        return kept;
      });

      // The notes a tournament holds, as plain data.
      scope.get("/tournaments/notes/kept", async (request) => {
        const id = (request.query as { id?: string }).id ?? "";
        return await making.notesOf(id);
      });

      // What a competition holds: its players and its games, as plain data.
      scope.get("/competitions/kept", async (request) => {
        const id = (request.query as { id?: string }).id ?? "";
        const games = await making.gamesOf(id);
        // One nobody has entered or played in has kept nothing yet.
        return games ?? { players: [], games: [] };
      });

      // Whether what the site keeps of its sessions holds the cookie as it is: the
      // site keeps a hash of it, so that what is kept is not what is sent.
      scope.get("/sessions/holds", async (request) => {
        const cookie = (request.query as { cookie?: string }).cookie ?? "";
        return { holds: await making.sessionsHold(cookie) };
      });

      // Whose session a cookie is, as the browser holds it.
      scope.get("/sessions/account", async (request) => {
        const cookie = (request.query as { cookie?: string }).cookie ?? "";
        return { accountId: (await making.accountOfSession(cookie)) ?? null };
      });

      // A role given or taken away, by nobody in particular, since who may is for
      // the role's own features to say.
      scope.post("/accounts/role", async (request, reply) => {
        const body = (request.body ?? {}) as {
          emailAddress?: unknown;
          role?: unknown;
          taken?: unknown;
        };
        try {
          if (typeof body.role !== "string" || !isRole(body.role)) {
            throw new Error(`${String(body.role)} is no role.`);
          }
          const address = textOf(body.emailAddress, "");
          await making.inTransaction(async () => {
            const id = await making.accountIdFor(EmailAddress.from(address));
            if (id === undefined) throw new Error(`No account for ${address}.`);
            const account = await making.loadAccount(id);
            if (account === undefined)
              throw new Error(`No events for ${address}.`);
            const now = ReadOnlyDate.from(new Date());
            if (body.taken === true) {
              account.removeRole(body.role as Role, AccountId.create(), now);
            } else {
              account.addRole(body.role as Role, AccountId.create(), now);
            }
            await making.saveAccount(account);
          });
        } catch (failure) {
          return reply
            .code(400)
            .send({ message: failure instanceof Error ? failure.message : "" });
        }
        return reply.code(200).send();
      });

      // How many sessions an account has, as a scenario about signing out asks.
      scope.get("/accounts/sessions", async (request, reply) => {
        const { emailAddress: address, accountId } = request.query as {
          emailAddress?: string;
          accountId?: string;
        };
        // By the account's id where it is given, which a forgotten account has
        // still when its address no longer finds it.
        const id =
          accountId !== undefined
            ? AccountId.from(accountId)
            : await making.inTransaction(() =>
                making.accountIdFor(EmailAddress.from(address ?? "")),
              );
        if (id === undefined) {
          return reply.code(404).send({ code: "TestControl.NoAccount" });
        }
        return { count: await making.sessionsOf(id) };
      });

      // What an account is called, as the site keeps it.
      scope.get("/accounts/name", async (request, reply) => {
        const address = (request.query as { emailAddress?: string })
          .emailAddress;
        const found = await making.inTransaction(async () => {
          const id = await making.accountIdFor(
            EmailAddress.from(address ?? ""),
          );
          const account =
            id === undefined ? undefined : await making.loadAccount(id);
          return account === undefined
            ? undefined
            : {
                id: account.id.value,
                name: account.name?.toString() ?? null,
                confirmed: account.confirmed,
              };
        });
        if (found === undefined) {
          return reply
            .code(404)
            .send({ message: `No account for ${String(address)}.` });
        }
        return found;
      });

      // What has been queued for an address, oldest first, as a scenario that
      // follows the link in an email reads it.
      scope.get("/emails", async (request) => {
        const to = (request.query as { to?: string }).to;
        const queued = await making.inTransaction(making.emailedTo);
        return {
          emails: queued
            .filter((email) => to === undefined || email.to === to)
            .map(({ to: address, kind, link, givenUp, fill }) => ({
              to: address,
              kind,
              link,
              givenUp,
              fill,
            })),
        };
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
