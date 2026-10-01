// The composition root. This is the only file outside src/infrastructure/ that
// names a concrete implementation: everything chosen here is chosen once.
import Fastify, { type FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import formbody from "@fastify/formbody";
import fastifyStatic from "@fastify/static";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Pool } from "pg";

import { AggregateRepository } from "../application/common/AggregateRepository.js";
import { Mediator } from "../application/common/Mediator.js";
import { ProjectingEventStore } from "../application/common/ProjectingEventStore.js";
import type { Projection } from "../application/common/Projection.js";
import { ValidationBehaviour } from "../application/common/ValidationBehaviour.js";
import { ConfirmEmailAddressHandler } from "../application/operations/accounts/ConfirmEmailAddressHandler.js";
import { ConfirmEmailAddressValidator } from "../application/operations/accounts/ConfirmEmailAddressValidator.js";
import { RegisterAccountHandler } from "../application/operations/accounts/RegisterAccountHandler.js";
import { RegisterAccountValidator } from "../application/operations/accounts/RegisterAccountValidator.js";
import { SendConfirmationLinkAgainHandler } from "../application/operations/accounts/SendConfirmationLinkAgainHandler.js";
import { SignInHandler } from "../application/operations/accounts/SignInHandler.js";
import { SignInWithGoogleHandler } from "../application/operations/accounts/SignInWithGoogleHandler.js";
import { ResetPasswordHandler } from "../application/operations/accounts/ResetPasswordHandler.js";
import { ResetPasswordValidator } from "../application/operations/accounts/ResetPasswordValidator.js";
import { ReportUnreachableServiceHandler } from "../application/operations/accounts/ReportUnreachableServiceHandler.js";
import { SetNewPasswordHandler } from "../application/operations/accounts/SetNewPasswordHandler.js";
import { SetNewPasswordValidator } from "../application/operations/accounts/SetNewPasswordValidator.js";
import { AskToForgetAccountHandler } from "../application/operations/accounts/AskToForgetAccountHandler.js";
import { AskToSetPasswordHandler } from "../application/operations/accounts/AskToSetPasswordHandler.js";
import { AccountProfile } from "../application/operations/accounts/AccountProfile.js";
import { AccountProfileHandler } from "../application/operations/accounts/AccountProfileHandler.js";
import { ChangeNameHandler } from "../application/operations/accounts/ChangeNameHandler.js";
import { ChangePasswordHandler } from "../application/operations/accounts/ChangePasswordHandler.js";
import { AskToChangeEmailAddressHandler } from "../application/operations/accounts/AskToChangeEmailAddressHandler.js";
import { AskToChangeEmailAddressValidator } from "../application/operations/accounts/AskToChangeEmailAddressValidator.js";
import { ChangeEmailAddressHandler } from "../application/operations/accounts/ChangeEmailAddressHandler.js";
import { WhatAMovingLinkIsWorthHandler } from "../application/operations/accounts/WhatAMovingLinkIsWorthHandler.js";
import { ChangePasswordValidator } from "../application/operations/accounts/ChangePasswordValidator.js";
import { ChangeNameValidator } from "../application/operations/accounts/ChangeNameValidator.js";
import { ForgetAccountHandler } from "../application/operations/accounts/ForgetAccountHandler.js";
import { WhatAForgettingLinkIsWorthHandler } from "../application/operations/accounts/WhatAForgettingLinkIsWorthHandler.js";
import { WhatASetNewPasswordLinkIsWorthHandler } from "../application/operations/accounts/WhatASetNewPasswordLinkIsWorthHandler.js";
import { WhatAConfirmationLinkIsWorthHandler } from "../application/operations/accounts/WhatAConfirmationLinkIsWorthHandler.js";
import { AddBlockHandler } from "../application/operations/tournaments/AddBlockHandler.js";
import { AddBlockValidator } from "../application/operations/tournaments/AddBlockValidator.js";
import { AddKnockoutHandler } from "../application/operations/tournaments/AddKnockoutHandler.js";
import { AddKnockoutValidator } from "../application/operations/tournaments/AddKnockoutValidator.js";
import { AddManagerHandler } from "../application/operations/tournaments/AddManagerHandler.js";
import { AddManagerValidator } from "../application/operations/tournaments/AddManagerValidator.js";
import { AddPlayerHandler } from "../application/operations/tournaments/AddPlayerHandler.js";
import { AddTeamValidator } from "../application/operations/tournaments/AddTeamValidator.js";
import { UpdateTeamValidator } from "../application/operations/tournaments/UpdateTeamValidator.js";
import { MoveTeamValidator } from "../application/operations/tournaments/MoveTeamValidator.js";
import { AddTeamPlayerValidator } from "../application/operations/tournaments/AddTeamPlayerValidator.js";
import { UpdateTeamPlayerValidator } from "../application/operations/tournaments/UpdateTeamPlayerValidator.js";
import { MoveTeamPlayerValidator } from "../application/operations/tournaments/MoveTeamPlayerValidator.js";
import { AddTestValidator } from "../application/operations/tournaments/AddTestValidator.js";
import { UpdateTestValidator } from "../application/operations/tournaments/UpdateTestValidator.js";
import { AddTeamHandler } from "../application/operations/tournaments/AddTeamHandler.js";
import { UpdateTeamHandler } from "../application/operations/tournaments/UpdateTeamHandler.js";
import { ArchiveTeamHandler } from "../application/operations/tournaments/ArchiveTeamHandler.js";
import { RestoreTeamHandler } from "../application/operations/tournaments/RestoreTeamHandler.js";
import { MoveTeamHandler } from "../application/operations/tournaments/MoveTeamHandler.js";
import { AddTeamPlayerHandler } from "../application/operations/tournaments/AddTeamPlayerHandler.js";
import { UpdateTeamPlayerHandler } from "../application/operations/tournaments/UpdateTeamPlayerHandler.js";
import { RestoreTeamPlayerHandler } from "../application/operations/tournaments/RestoreTeamPlayerHandler.js";
import { MoveTeamPlayerHandler } from "../application/operations/tournaments/MoveTeamPlayerHandler.js";
import { AddTestHandler } from "../application/operations/tournaments/AddTestHandler.js";
import { ArchiveTeamPlayerHandler } from "../application/operations/tournaments/ArchiveTeamPlayerHandler.js";
import { UpdateTestHandler } from "../application/operations/tournaments/UpdateTestHandler.js";
import { TeamsOfTournamentHandler } from "../application/operations/tournaments/TeamsOfTournamentHandler.js";
import { PlayersOfTeamHandler } from "../application/operations/tournaments/PlayersOfTeamHandler.js";
import { PlayersOfTestHandler } from "../application/operations/competitions/PlayersOfTestHandler.js";
import { AddPlayerValidator } from "../application/operations/tournaments/AddPlayerValidator.js";
import { AddScorerHandler } from "../application/operations/tournaments/AddScorerHandler.js";
import { AddScorerValidator } from "../application/operations/tournaments/AddScorerValidator.js";
import { AddSwissHandler } from "../application/operations/tournaments/AddSwissHandler.js";
import { AddSwissValidator } from "../application/operations/tournaments/AddSwissValidator.js";
import { ArchiveCompetitionHandler } from "../application/operations/tournaments/ArchiveCompetitionHandler.js";
import { ArchivePlayerHandler } from "../application/operations/tournaments/ArchivePlayerHandler.js";
import { ArchiveTournamentHandler } from "../application/operations/tournaments/ArchiveTournamentHandler.js";
import { CreateTournamentHandler } from "../application/operations/tournaments/CreateTournamentHandler.js";
import { CreateTournamentValidator } from "../application/operations/tournaments/CreateTournamentValidator.js";
import { RemoveManagerHandler } from "../application/operations/tournaments/RemoveManagerHandler.js";
import { CompetitionsOfTournamentHandler } from "../application/operations/tournaments/CompetitionsOfTournamentHandler.js";
import { ManagersOfTournamentHandler } from "../application/operations/tournaments/ManagersOfTournamentHandler.js";
import { PlayersOfTournamentHandler } from "../application/operations/tournaments/PlayersOfTournamentHandler.js";
import { RemoveScorerHandler } from "../application/operations/tournaments/RemoveScorerHandler.js";
import { ScorersOfTournamentHandler } from "../application/operations/tournaments/ScorersOfTournamentHandler.js";
import { MoveCompetitionHandler } from "../application/operations/tournaments/MoveCompetitionHandler.js";
import { MoveCompetitionValidator } from "../application/operations/tournaments/MoveCompetitionValidator.js";
import { RestoreCompetitionHandler } from "../application/operations/tournaments/RestoreCompetitionHandler.js";
import { RestorePlayerHandler } from "../application/operations/tournaments/RestorePlayerHandler.js";
import { RestoreTournamentHandler } from "../application/operations/tournaments/RestoreTournamentHandler.js";
import { UpdateBlockHandler } from "../application/operations/tournaments/UpdateBlockHandler.js";
import { UpdateBlockValidator } from "../application/operations/tournaments/UpdateBlockValidator.js";
import { UpdateKnockoutHandler } from "../application/operations/tournaments/UpdateKnockoutHandler.js";
import { UpdateKnockoutValidator } from "../application/operations/tournaments/UpdateKnockoutValidator.js";
import { UpdatePlayerHandler } from "../application/operations/tournaments/UpdatePlayerHandler.js";
import { UpdatePlayerValidator } from "../application/operations/tournaments/UpdatePlayerValidator.js";
import { UpdateSwissHandler } from "../application/operations/tournaments/UpdateSwissHandler.js";
import { UpdateSwissValidator } from "../application/operations/tournaments/UpdateSwissValidator.js";
import { UpdateTournamentHandler } from "../application/operations/tournaments/UpdateTournamentHandler.js";
import { UpdateTournamentValidator } from "../application/operations/tournaments/UpdateTournamentValidator.js";
import { TournamentsOfAccountHandler } from "../application/operations/tournaments/TournamentsOfAccountHandler.js";
import { CompetitionPageHandler } from "../application/operations/tournaments/CompetitionPageHandler.js";
import { TeamPageHandler } from "../application/operations/tournaments/TeamPageHandler.js";
import { TournamentPageHandler } from "../application/operations/tournaments/TournamentPageHandler.js";
import { TournamentToChangeHandler } from "../application/operations/tournaments/TournamentToChangeHandler.js";
import { TournamentYearsOfAccountHandler } from "../application/operations/tournaments/TournamentYearsOfAccountHandler.js";
import type { BreachedPasswords } from "../application/services/BreachedPasswords.js";
import { AddGameHandler } from "../application/operations/competitions/AddGameHandler.js";
import { AddGameValidator } from "../application/operations/competitions/AddGameValidator.js";
import { ArchiveGameHandler } from "../application/operations/competitions/ArchiveGameHandler.js";
import { CorrectGameHandler } from "../application/operations/competitions/CorrectGameHandler.js";
import { CorrectGameValidator } from "../application/operations/competitions/CorrectGameValidator.js";
import { GamesOfCompetitionHandler } from "../application/operations/competitions/GamesOfCompetitionHandler.js";
import { RestoreGameHandler } from "../application/operations/competitions/RestoreGameHandler.js";
import { EnterPlayerHandler } from "../application/operations/competitions/EnterPlayerHandler.js";
import { MoveCompetitionPlayerHandler } from "../application/operations/competitions/MoveCompetitionPlayerHandler.js";
import { MoveCompetitionPlayerValidator } from "../application/operations/competitions/MoveCompetitionPlayerValidator.js";
import { PlayersOfCompetitionHandler } from "../application/operations/competitions/PlayersOfCompetitionHandler.js";
import { RemovePlayerHandler } from "../application/operations/competitions/RemovePlayerHandler.js";
import { ReverseWithdrawalHandler } from "../application/operations/competitions/ReverseWithdrawalHandler.js";
import { WithdrawPlayerHandler } from "../application/operations/competitions/WithdrawPlayerHandler.js";
import { MovePlayerHandler } from "../application/operations/tournaments/MovePlayerHandler.js";
import { MovePlayerValidator } from "../application/operations/tournaments/MovePlayerValidator.js";
import { Competition } from "../domain/aggregates/tournaments/competitions/Competition.js";
import { nameCompetitionEvents } from "../domain/aggregates/tournaments/competitions/events/competitionEvents.js";
import { gamesKeptByCompetitions } from "../application/operations/competitions/competitionGames.js";
import type { EventStore } from "../application/services/EventStore.js";
import { Account } from "../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import type { CompetitionId } from "../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../domain/aggregates/tournaments/primitives/TournamentId.js";
import { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { nameAccountEvents } from "../domain/aggregates/accounts/events/accountEvents.js";
import { nameTournamentEvents } from "../domain/aggregates/tournaments/events/tournamentEvents.js";
import { EventRegistry } from "../domain/common/EventRegistry.js";
import {
  loadConfig,
  loadEnvFile,
  type Config,
} from "../infrastructure/config/Config.js";
import { createPool } from "../infrastructure/database/pool.js";
import { ReadOnlyTransactionBehaviour } from "../infrastructure/database/ReadOnlyTransactionBehaviour.js";
import { TransactionBehaviour } from "../infrastructure/database/TransactionBehaviour.js";
import { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import { FileEmailSender } from "../infrastructure/email/FileEmailSender.js";
import { PostgresEmailQueue } from "../infrastructure/email/PostgresEmailQueue.js";
import { AccountEventSealing } from "../infrastructure/encryption/AccountEventSealing.js";
import { AccountKeys } from "../infrastructure/encryption/AccountKeys.js";
import { KeyedEmailAddressHasher } from "../infrastructure/encryption/KeyedEmailAddressHasher.js";
import { PostgresEmailsWritten } from "../infrastructure/email/PostgresEmailsWritten.js";
import { PostgresEventStore } from "../infrastructure/event-store/PostgresEventStore.js";
import { PostgresHandledRequests } from "../infrastructure/database/PostgresHandledRequests.js";
import { PostgresFailedSignIns } from "../infrastructure/database/PostgresFailedSignIns.js";
import { PostgresPasswordResetAskings } from "../infrastructure/database/PostgresPasswordResetAskings.js";
import { PostgresSessions } from "../infrastructure/database/PostgresSessions.js";
import { Argon2id } from "../infrastructure/identity/Argon2id.js";
import { ImportedPasswordHasher } from "../infrastructure/identity/ImportedPasswordHasher.js";
import { OldSitePasswordHasher } from "../infrastructure/identity/OldSitePasswordHasher.js";
import { HaveIBeenPwnedPasswords } from "../infrastructure/identity/HaveIBeenPwnedPasswords.js";
import { RecaptchaReaderCheck } from "../infrastructure/identity/RecaptchaReaderCheck.js";
import { SignedLinks } from "../infrastructure/identity/SignedLinks.js";
import { AccountsByEmailAddress } from "../infrastructure/read-models/AccountsByEmailAddress.js";
import { AccountsByGoogleAccount } from "../infrastructure/read-models/AccountsByGoogleAccount.js";
import { TournamentsByAccount } from "../infrastructure/read-models/TournamentsByAccount.js";
import { TournamentsByAddress } from "../infrastructure/read-models/TournamentsByAddress.js";
import {
  GoogleOpenIdConnect,
  GoogleOpenIdConnectFailed,
  type GoogleEndpoints,
} from "../infrastructure/identity/GoogleOpenIdConnect.js";
import { apiV1 } from "./api/v1/index.js";
import { adminPage, builtAdminPage } from "./common/adminPage.js";
import { assetsPath, readAssets, type Assets } from "./common/assets.js";
import { sendTheEmailQueue } from "./common/emailQueueSending.js";
import { emailWriter, siteAddress } from "./common/emailWriter.js";
import { refuseCrossSite } from "./common/crossSite.js";
import { knowTheReader, signedIn, type Reader } from "./common/reader.js";
import type { InTransaction } from "./common/database.js";
import { readerFromSessions, registerSignOut } from "./common/session.js";
import { speakToRequests, type Language } from "./common/language.js";
import { sendersBelieved } from "./common/trustedProxy.js";
import { nameTheSite } from "./common/site.js";
import {
  machineClock,
  stampRequests,
  type Clock,
} from "./common/requestedAt.js";
import { english } from "./languages/english.js";
import { spanish } from "./languages/spanish.js";
import { auth } from "./auth/index.js";
import {
  GoogleUnreachable,
  registerGoogleRoutes,
  type GoogleSignIn,
} from "./auth/google.js";
import { registerErrorMapping } from "./common/errors.js";
import { registerConfirmEmailAddressPage } from "./public/confirmEmailAddress.js";
import { registerNewConfirmationLinkPage } from "./public/newConfirmationLink.js";
import { registerForgotPasswordPage } from "./public/forgotPassword.js";
import { registerForgetAccountPage } from "./public/forgetAccount.js";
import { registerChangeNamePage } from "./public/changeName.js";
import { registerChangePasswordPage } from "./public/changePassword.js";
import { registerChangeEmailAddressPage } from "./public/changeEmailAddress.js";
import { registerProfilePage, toSignIn } from "./public/profile.js";
import { registerSetPasswordPage } from "./public/setPassword.js";
import { registerRegistrationsSuspendedPage } from "./public/registrationsSuspended.js";
import { registerSetNewPasswordPage } from "./public/setNewPassword.js";
import { registerSignInPage } from "./public/signIn.js";
import { registerPublicPages } from "./public/pages.js";
import { registerRegisterPage, type ReaderCheck } from "./public/register.js";
import { registerJavaScriptRequiredPage } from "./public/javaScriptRequired.js";
import { registerLanguageRoute } from "./public/language.js";
import { registerThemeRoute } from "./public/theme.js";
import { registerWelcomePage } from "./public/welcome.js";

const repositoryRoot = join(import.meta.dirname, "..", "..");

// The check the page wants, over the one the infrastructure offers: the page
// asks what a reader is worth and shows the key, and reCAPTCHA answers the
// first and the config holds the second.
const recaptchaAsAReaderCheck = (keys: {
  readonly siteKey: string;
  readonly secretKey: string;
}): ReaderCheck => {
  const check = new RecaptchaReaderCheck(keys.secretKey);
  return {
    judge: (token) => check.judge(token),
    siteKey: keys.siteKey,
  };
};

// The sign-in the Google routes want, over the OpenID Connect client the
// infrastructure offers: the one failure the routes tell a reader about, Google
// being unreachable, is said in their words; anything else is not believed and
// goes on as the failure it is.
const googleAsASignIn = (google: GoogleOpenIdConnect): GoogleSignIn => ({
  whereToSend: (asking) => google.whereToSend(asking),
  whoCameBack: async (returned) => {
    try {
      return await google.whoCameBack(returned);
    } catch (failure) {
      if (
        failure instanceof GoogleOpenIdConnectFailed &&
        failure.code === "Google.Unreachable"
      ) {
        throw new GoogleUnreachable(failure.message);
      }
      throw failure;
    }
  },
});

// A route reaches the mediator as request.server.mediator, and nothing else of
// the application. Declared here, beside the one place that puts it there.
declare module "fastify" {
  interface FastifyInstance {
    readonly mediator: Mediator;
  }
}

export interface Application {
  readonly server: FastifyInstance;
  readonly pool: Pool;
  readonly config: Config;
  readonly mediator: Mediator;
  /** Where a request's validator is registered, alongside its handler. */
  readonly validation: ValidationBehaviour;
  /** What a repository, the event store or a projection asks for its connection. */
  readonly unitOfWork: UnitOfWork;
  /** Where every event is kept, with every read model kept in step as it is. */
  readonly eventStore: EventStore;
  /** Where emails wait to be sent, queued in the command they are about. */
  readonly emailQueue: PostgresEmailQueue;
  /** Every account, by its id, as a command loads and saves one. */
  readonly accounts: AggregateRepository<Account, AccountId>;
  /** Which account an email address belongs to, as the read model keeps it. */
  readonly accountsByEmailAddress: AccountsByEmailAddress;
  /** How an address is hashed to find its account. */
  readonly emailAddresses: KeyedEmailAddressHasher;
  /** How passwords are hashed and checked. */
  readonly passwords: ImportedPasswordHasher;
  /** Where sessions are kept, which is how a reader stays signed in. */
  readonly sessions: PostgresSessions;
  /** Every tournament, by its id, as a command loads and saves one. */
  readonly tournaments: AggregateRepository<Tournament, TournamentId>;
  /** Every competition's players, each competition under its own id. */
  readonly competitions: AggregateRepository<Competition, CompetitionId>;
  /** The tournaments each account has a part in, as the read model keeps them. */
  readonly tournamentsByAccount: TournamentsByAccount;
}

// The one mediator, and the order its behaviours run in. Validation stands
// first in both lines and is the same behaviour in each, so that a request that
// was never going to be carried out is refused before it costs a connection, and
// a validator is registered once whichever side its request comes in on. Behind
// it a command gets a transaction it can write in, and a query one it cannot —
// except for the few commands that say they run their own, which are given
// none and open what they need themselves.
const putTogether = (
  unitOfWork: UnitOfWork,
): { mediator: Mediator; validation: ValidationBehaviour } => {
  const mediator = new Mediator();
  const validation = new ValidationBehaviour();

  mediator.addCommandBehaviour(validation);
  mediator.addCommandBehaviour(new TransactionBehaviour(unitOfWork));

  mediator.addQueryBehaviour(validation);
  mediator.addQueryBehaviour(new ReadOnlyTransactionBehaviour(unitOfWork));

  return { mediator, validation };
};

const year = 60 * 60 * 24 * 365;

const registerAssets = (server: FastifyInstance, assets: Assets): void => {
  server.get<{ Params: { "*": string } }>(
    `${assetsPath}*`,
    (request, reply) => {
      const asset = assets.resolve(request.params["*"]);
      if (asset === undefined) return reply.callNotFound();

      // A name carrying the current hash cannot come to mean a different file, so
      // it may be kept for as long as anyone likes. A name without one — an old
      // hash from a deploy ago, or none at all — still serves the file, so a page
      // held in a browser's cache is not left unstyled, but it is not promised to
      // stay put.
      return reply
        .header(
          "cache-control",
          asset.current
            ? `public, max-age=${year}, immutable`
            : "public, max-age=60",
        )
        .type(asset.contentType)
        .send(createReadStream(asset.path));
    },
  );
};

const registerAdmin = async (
  server: FastifyInstance,
  adminRoot: string,
): Promise<void> => {
  if (!existsSync(adminRoot)) {
    // A fresh clone has not built the SPA yet. Say so, rather than 404ing as
    // though /admin were not a thing this application has.
    const notBuilt = (): never => {
      throw Object.assign(new Error("The admin SPA has not been built."), {
        statusCode: 503,
      });
    };
    server.get("/admin", notBuilt);
    server.get("/admin/*", notBuilt);
    return;
  }

  // Only what Vite puts in assets/ is served as it was built. The page itself
  // is not: it is said into on the way out (adminPage.ts), so it is left to the
  // star route below, which with wildcard: false also claims every path that is
  // not a file, which is what makes a deep link reload rather than 404.
  await server.register(fastifyStatic, {
    root: join(adminRoot, "assets"),
    prefix: "/admin/assets/",
    wildcard: false,
  });
  const built = builtAdminPage(
    readFileSync(join(adminRoot, "index.html"), "utf8"),
  );
  server.get("/admin", (_request, reply) => reply.redirect("/admin/", 308));
  // What every other page is sent with, for the same reason: the page is now
  // drawn from the reader's cookies and the languages their browser asks for.
  // Nothing in the admin is anybody's but the reader's own, so a reader who is
  // not signed in is sent to sign in first, and brought back to the address
  // they asked for, as every page of an account's own does.
  server.get("/admin/*", (request, reply) =>
    signedIn(request)
      ? reply
          .header("cache-control", "private, no-cache")
          .header("vary", "Cookie, Accept-Language")
          .type("text/html; charset=utf-8")
          .send(adminPage(built, request))
      : toSignIn(request, reply),
  );
};

export interface ApplicationOptions {
  /** Off for the specs, whose output is the scenario list and not a request log. */
  readonly logger?: boolean;
  /** Where the time comes from. The machine's clock, unless a scenario sets one. */
  readonly clock?: Clock;
  /**
   * The languages the site offers, the first being the one it falls back to.
   * English and Spanish, unless a scenario offers others.
   */
  readonly languages?: readonly Language[];
  /**
   * The kinds of event the store knows how to read back, and the projections
   * that keep the read models. The application's own, unless a scenario gives
   * its examples instead.
   */
  readonly events?: EventRegistry;
  readonly projections?: readonly Projection[];
  /**
   * What says which account the reader of a request is signed in to. The
   * session cookie, unless a scenario says otherwise: one with no database to
   * keep sessions in hands in a way of its own.
   */
  readonly reader?: Reader;
  /**
   * Whether what is queued is sent while the server is listening. It is,
   * unless a scenario says otherwise: the browser scenarios listen over the
   * developer's own database, and a test run has no business sending what is
   * queued there.
   */
  readonly sendsTheEmailQueue?: boolean;
  /**
   * What says whether a password has been breached. Have I Been Pwned, unless
   * a scenario says otherwise: a spec run has no business asking an outside
   * service, and none of what it would answer is what a scenario is about.
   */
  readonly breachedPasswords?: BreachedPasswords;
  /**
   * What judges whether whoever is registering is a person. reCAPTCHA, when
   * the site has keys for it, unless a scenario says otherwise: a spec run has
   * no business asking Google, and a scenario that is about being judged needs
   * to say what the judgement was.
   */
  readonly readerCheck?: ReaderCheck;
  /**
   * Where Google answers. Google's own, unless a scenario stands one in: a
   * spec run has no business asking Google, and a scenario has to say who
   * Google says the reader is. The site checks what a stand-in says exactly as
   * it checks what Google says.
   */
  readonly googleEndpoints?: GoogleEndpoints;
}

// Every kind of event the application records, each named once by the name it
// is kept under, and how it is read back.
const events = (): EventRegistry =>
  nameCompetitionEvents(
    nameTournamentEvents(nameAccountEvents(new EventRegistry())),
  );

export const buildApplication = async (
  config: Config,
  options: ApplicationOptions = {},
): Promise<Application> => {
  const server = Fastify({
    logger: options.logger ?? true,
    // Which senders' word for where a request came from is believed, from
    // the setting that names what forwards to this site (trustedProxy.ts).
    trustProxy: sendersBelieved(config.trustedProxies),
  });
  const pool = createPool(config.databaseUrl);
  const assets = readAssets(join(repositoryRoot, "assets"));
  const unitOfWork = new UnitOfWork(pool);
  // Handed to the two handlers that set a password, each of which asks it
  // between the transaction it reads in and the one it writes in, where the
  // asking holds no connection.
  const breached = options.breachedPasswords ?? new HaveIBeenPwnedPasswords();
  const { mediator, validation } = putTogether(unitOfWork);

  // What is personal in an account's events is encrypted with the account's
  // own key as they are kept, and the key kept with the site's.
  const accountKeys = new AccountKeys(unitOfWork, config.accountEncryptionKey);
  const emailAddresses = new KeyedEmailAddressHasher(
    config.accountEmailAddressHashKey,
  );
  const accountsByEmailAddress = new AccountsByEmailAddress(
    unitOfWork,
    emailAddresses,
  );

  const accountsByGoogleAccount = new AccountsByGoogleAccount(
    unitOfWork,
    config.accountEmailAddressHashKey,
  );

  const tournamentsByAddress = new TournamentsByAddress(unitOfWork);
  const tournamentsByAccount = new TournamentsByAccount(unitOfWork);

  // Every read model's projection, each given every event as it is appended.
  const projections: readonly Projection[] = [
    accountsByEmailAddress,
    accountsByGoogleAccount,
    tournamentsByAddress,
    tournamentsByAccount,
  ];

  // On the unit of work the mediator's transactions use, so that what a
  // command's handler appends, and what every projection writes of it, is kept
  // in the command's transaction or not at all.
  const eventStore = new ProjectingEventStore(
    new PostgresEventStore(
      unitOfWork,
      options.events ?? events(),
      new AccountEventSealing(accountKeys),
    ),
    options.projections ?? projections,
  );

  // Emails are written from the site's catalogues, with links made from the
  // site's configured address and never a request's, and written to files in
  // temp/ until there is a mail provider.
  const languages = options.languages ?? [english, spanish];
  const where = siteAddress(config.canonicalHost, config.port);
  const emailQueue = new PostgresEmailQueue(
    unitOfWork,
    accountKeys,
    emailWriter(languages, {
      address: where,
      fromName: config.emailFromName,
      siteName: config.siteName,
    }),
    new FileEmailSender(join(repositoryRoot, "temp")),
    config.emailFromAddress,
  );

  // What an account's operations are put together from. The links are signed
  // with the site's token signing key and made for the site's own address, so
  // that a link is never made from the host a request happened to name.
  const accounts = new AggregateRepository(
    eventStore,
    (id: AccountId, events) => Account.rebuiltFrom(id, events),
  );
  const links = new SignedLinks(where, config.tokenSigningKey);
  const handledRequests = new PostgresHandledRequests(unitOfWork);
  const emailsWritten = new PostgresEmailsWritten(unitOfWork);

  // Today's hashes, and the old site's kept checkable until their readers sign
  // in. Without the old site's salt an imported hash matches nothing, which is
  // what a site that never imported anything wants anyway.
  const passwords = new ImportedPasswordHasher(
    new Argon2id(),
    config.oldSitePasswordSalt === undefined
      ? undefined
      : new OldSitePasswordHasher(config.oldSitePasswordSalt),
  );

  validation.register(new RegisterAccountValidator());
  mediator.handleCommand(
    new RegisterAccountHandler(
      accounts,
      accountsByEmailAddress,
      emailAddresses,
      emailQueue,
      emailsWritten,
      handledRequests,
      links,
    ),
  );
  validation.register(new ConfirmEmailAddressValidator());
  mediator.handleCommand(
    new ConfirmEmailAddressHandler(
      accounts,
      links,
      passwords,
      handledRequests,
      unitOfWork,
      breached,
    ),
  );
  mediator.handleCommand(
    new SignInHandler(accounts, accountsByEmailAddress, passwords),
  );
  mediator.handleCommand(
    new SignInWithGoogleHandler(
      accounts,
      accountsByEmailAddress,
      accountsByGoogleAccount,
      emailAddresses,
    ),
  );
  validation.register(new ResetPasswordValidator());
  mediator.handleCommand(
    new ResetPasswordHandler(
      accounts,
      accountsByEmailAddress,
      emailAddresses,
      emailQueue,
      emailsWritten,
      handledRequests,
      links,
    ),
  );
  mediator.handleCommand(
    new ReportUnreachableServiceHandler(
      emailQueue,
      emailsWritten,
      config.administratorEmailAddress,
    ),
  );
  validation.register(new SetNewPasswordValidator());
  mediator.handleCommand(
    new SetNewPasswordHandler(
      accounts,
      links,
      passwords,
      handledRequests,
      unitOfWork,
      breached,
    ),
  );
  mediator.handleQuery(
    new WhatASetNewPasswordLinkIsWorthHandler(accounts, links, handledRequests),
  );
  mediator.handleCommand(
    new AskToForgetAccountHandler(accounts, emailQueue, links),
  );
  mediator.handleCommand(
    new AskToSetPasswordHandler(
      accounts,
      emailQueue,
      emailsWritten,
      handledRequests,
      links,
    ),
  );
  mediator.handleCommand(new ForgetAccountHandler(accounts, links));
  validation.register(new ChangeNameValidator());
  mediator.handleCommand(new ChangeNameHandler(accounts));
  mediator.handleQuery(new AccountProfileHandler(accounts));
  validation.register(new AskToChangeEmailAddressValidator());
  mediator.handleCommand(
    new AskToChangeEmailAddressHandler(
      accounts,
      accountsByEmailAddress,
      emailAddresses,
      passwords,
      emailQueue,
      emailsWritten,
      links,
    ),
  );
  mediator.handleQuery(new WhatAMovingLinkIsWorthHandler(accounts, links));
  mediator.handleCommand(
    new ChangeEmailAddressHandler(accounts, emailAddresses, emailQueue, links),
  );
  validation.register(new ChangePasswordValidator());
  mediator.handleCommand(
    new ChangePasswordHandler(
      accounts,
      passwords,
      emailQueue,
      unitOfWork,
      breached,
    ),
  );
  mediator.handleQuery(new WhatAForgettingLinkIsWorthHandler(accounts, links));
  mediator.handleCommand(
    new SendConfirmationLinkAgainHandler(
      accounts,
      emailQueue,
      emailsWritten,
      handledRequests,
      links,
    ),
  );
  mediator.handleQuery(
    new WhatAConfirmationLinkIsWorthHandler(accounts, links),
  );

  // Every operation on a tournament, asked by the account the reader is
  // signed in to.
  const tournaments = new AggregateRepository(
    eventStore,
    (id: TournamentId, events) => Tournament.rebuiltFrom(id, events),
  );
  const competitions = new AggregateRepository(
    eventStore,
    (id: CompetitionId, events) => Competition.rebuiltFrom(id, events),
  );
  // Whether games have been played is asked of the games the competitions
  // keep.
  const games = gamesKeptByCompetitions(tournaments, competitions);
  const both = [tournaments, accounts] as const;
  validation.register(new CreateTournamentValidator());
  validation.register(new UpdateTournamentValidator());
  validation.register(new AddPlayerValidator());
  validation.register(new UpdatePlayerValidator());
  validation.register(new AddBlockValidator());
  validation.register(new UpdateBlockValidator());
  validation.register(new AddKnockoutValidator());
  validation.register(new UpdateKnockoutValidator());
  validation.register(new AddSwissValidator());
  validation.register(new UpdateSwissValidator());
  validation.register(new MoveCompetitionValidator());
  validation.register(new MovePlayerValidator());
  validation.register(new MoveCompetitionPlayerValidator());
  validation.register(new AddGameValidator());
  validation.register(new CorrectGameValidator());
  validation.register(new AddManagerValidator());
  validation.register(new AddScorerValidator());
  validation.register(new AddTeamValidator());
  validation.register(new UpdateTeamValidator());
  validation.register(new MoveTeamValidator());
  validation.register(new AddTeamPlayerValidator());
  validation.register(new UpdateTeamPlayerValidator());
  validation.register(new MoveTeamPlayerValidator());
  validation.register(new AddTestValidator());
  validation.register(new UpdateTestValidator());
  mediator.handleCommand(
    new CreateTournamentHandler(...both, tournamentsByAddress),
  );
  mediator.handleCommand(
    new UpdateTournamentHandler(...both, tournamentsByAddress),
  );
  mediator.handleCommand(new ArchiveTournamentHandler(...both));
  mediator.handleCommand(new RestoreTournamentHandler(...both));
  mediator.handleCommand(new AddPlayerHandler(...both));
  mediator.handleCommand(new UpdatePlayerHandler(...both));
  mediator.handleCommand(
    new ArchivePlayerHandler(...both, competitions, games),
  );
  mediator.handleCommand(new RestorePlayerHandler(...both));
  mediator.handleCommand(new MovePlayerHandler(...both));
  mediator.handleCommand(new AddBlockHandler(...both));
  mediator.handleCommand(new UpdateBlockHandler(...both));
  mediator.handleCommand(new AddKnockoutHandler(...both));
  mediator.handleCommand(new UpdateKnockoutHandler(...both, games));
  mediator.handleCommand(new AddSwissHandler(...both));
  mediator.handleCommand(new UpdateSwissHandler(...both));
  mediator.handleCommand(new ArchiveCompetitionHandler(...both));
  mediator.handleCommand(new RestoreCompetitionHandler(...both));
  mediator.handleCommand(new MoveCompetitionHandler(...both));
  mediator.handleCommand(
    new AddManagerHandler(...both, accountsByEmailAddress),
  );
  mediator.handleCommand(new AddScorerHandler(...both, accountsByEmailAddress));
  mediator.handleCommand(new RemoveManagerHandler(...both));
  mediator.handleCommand(new RemoveScorerHandler(...both));
  mediator.handleCommand(new AddTeamHandler(...both));
  mediator.handleCommand(new UpdateTeamHandler(...both));
  mediator.handleCommand(new ArchiveTeamHandler(...both));
  mediator.handleCommand(new RestoreTeamHandler(...both));
  mediator.handleCommand(new MoveTeamHandler(...both));
  mediator.handleCommand(new AddTeamPlayerHandler(...both));
  mediator.handleCommand(new UpdateTeamPlayerHandler(...both));
  mediator.handleCommand(new RestoreTeamPlayerHandler(...both));
  mediator.handleCommand(new MoveTeamPlayerHandler(...both));
  mediator.handleCommand(new AddTestHandler(...both));
  mediator.handleCommand(new ArchiveTeamPlayerHandler(...both, games));
  mediator.handleCommand(new UpdateTestHandler(...both, games));
  mediator.handleCommand(new EnterPlayerHandler(...both, competitions));
  mediator.handleCommand(
    new MoveCompetitionPlayerHandler(...both, competitions),
  );
  mediator.handleCommand(new WithdrawPlayerHandler(...both, competitions));
  mediator.handleCommand(new ReverseWithdrawalHandler(...both, competitions));
  mediator.handleCommand(new RemovePlayerHandler(...both, competitions));
  mediator.handleCommand(new AddGameHandler(...both, competitions));
  mediator.handleCommand(new ArchiveGameHandler(...both, competitions));
  mediator.handleCommand(new RestoreGameHandler(...both, competitions));
  mediator.handleCommand(new CorrectGameHandler(...both, competitions));
  mediator.handleQuery(new GamesOfCompetitionHandler(...both, competitions));
  mediator.handleQuery(new PlayersOfCompetitionHandler(...both, competitions));
  mediator.handleQuery(new CompetitionsOfTournamentHandler(...both, games));
  mediator.handleQuery(new TeamsOfTournamentHandler(...both));
  mediator.handleQuery(new PlayersOfTeamHandler(...both, games));
  mediator.handleQuery(new PlayersOfTestHandler(...both));
  mediator.handleQuery(new ManagersOfTournamentHandler(...both));
  mediator.handleQuery(
    new PlayersOfTournamentHandler(...both, competitions, games),
  );
  mediator.handleQuery(new ScorersOfTournamentHandler(...both));
  mediator.handleQuery(new TournamentsOfAccountHandler(tournamentsByAccount));
  mediator.handleQuery(
    new TournamentToChangeHandler(tournaments, tournamentsByAddress),
  );
  mediator.handleQuery(
    new TournamentPageHandler(tournaments, tournamentsByAddress),
  );
  mediator.handleQuery(
    new CompetitionPageHandler(tournaments, tournamentsByAddress),
  );
  mediator.handleQuery(new TeamPageHandler(tournaments, tournamentsByAddress));
  mediator.handleQuery(
    new TournamentYearsOfAccountHandler(tournamentsByAccount),
  );

  // Before any route is added, so that every one of them finds it there.
  server.decorate("mediator", mediator);

  await server.register(cookie, { secret: config.sessionCookieSecret });
  await server.register(formbody);

  registerErrorMapping(server, assets);

  const clock = options.clock ?? machineClock;
  stampRequests(server, clock);
  speakToRequests(server, languages);
  nameTheSite(server, config.siteName, config.website);
  // A page reads and writes through this, and knows nothing else of the
  // database.
  const inTransaction: InTransaction = (work) => unitOfWork.inTransaction(work);

  const sessions = new PostgresSessions(unitOfWork);
  knowTheReader(
    server,
    options.reader ??
      readerFromSessions(
        sessions,
        inTransaction,
        async (account) =>
          (await mediator.query(new AccountProfile(account.value)))
            ?.hasPassword ?? false,
      ),
  );

  // Before any route, so nothing that changes something can be reached from
  // another site by forgetting to ask.
  refuseCrossSite(server, config.canonicalHost);

  await server.register(apiV1, { prefix: "/api/v1", assets });
  await server.register(
    auth({
      googleConfigured: config.google !== undefined,
      facebookConfigured: config.facebook !== undefined,
    }),
    { prefix: "/auth" },
  );

  registerAssets(server, assets);

  await registerAdmin(server, join(repositoryRoot, "dist", "admin"));

  registerThemeRoute(server);
  registerLanguageRoute(server);
  // reCAPTCHA where the site has keys for it. Where it has none — development,
  // which has no keys to give — every reader is taken for a person, which is
  // what the page did before there was a check at all. A production site
  // without the keys has an open form that emails whoever it is told to, so
  // the keys belong on the deployment checklist (TODO.md says so).
  const readers: ReaderCheck =
    options.readerCheck ??
    (config.recaptcha === undefined
      ? { judge: () => Promise.resolve("a person"), siteKey: undefined }
      : recaptchaAsAReaderCheck(config.recaptcha));

  // Offered only where the site has been given Google's credentials: without
  // them there is nothing to send a reader to Google with.
  const google =
    config.google === undefined
      ? undefined
      : googleAsASignIn(
          new GoogleOpenIdConnect(config.google, options.googleEndpoints),
        );
  if (google !== undefined) {
    registerGoogleRoutes(server, {
      google,
      sessions,
      inTransaction,
      siteAddress:
        config.canonicalHost === undefined
          ? undefined
          : siteAddress(config.canonicalHost, config.port),
    });
  }

  registerRegisterPage(server, assets, readers, google !== undefined);
  registerConfirmEmailAddressPage(server, assets);
  // One count of failed signings in, shared by every page that takes a
  // password, so that guessing on one counts against guessing on the other.
  const failedSignIns = new PostgresFailedSignIns(unitOfWork);
  registerSignInPage(
    server,
    assets,
    sessions,
    failedSignIns,
    inTransaction,
    google !== undefined,
  );
  registerChangePasswordPage(
    server,
    assets,
    sessions,
    failedSignIns,
    inTransaction,
  );
  registerSignOut(server, sessions, inTransaction);
  registerForgotPasswordPage(
    server,
    assets,
    new PostgresPasswordResetAskings(unitOfWork),
    inTransaction,
  );
  registerSetNewPasswordPage(server, assets, sessions, inTransaction);
  registerForgetAccountPage(server, assets, sessions, inTransaction);
  registerProfilePage(server, assets);
  registerSetPasswordPage(server, assets);
  registerChangeNamePage(server, assets);
  registerChangeEmailAddressPage(server, assets, failedSignIns, inTransaction);
  registerRegistrationsSuspendedPage(server, assets);
  registerNewConfirmationLinkPage(server, assets, links);
  registerWelcomePage(server, assets);
  registerJavaScriptRequiredPage(server, assets);
  registerPublicPages(server, assets);

  // What is queued is sent while the server is listening, and the pool is
  // still open while the last round finishes: the server is closed before the
  // pool is ended, by whoever closes them.
  if (options.sendsTheEmailQueue ?? true)
    sendTheEmailQueue(server, emailQueue, clock);

  return {
    server,
    pool,
    config,
    mediator,
    validation,
    unitOfWork,
    eventStore,
    emailQueue,
    accounts,
    accountsByEmailAddress,
    emailAddresses,
    passwords,
    sessions,
    tournaments,
    competitions,
    tournamentsByAccount,
  };
};

const startedDirectly =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === import.meta.filename;

if (startedDirectly) {
  loadEnvFile();
  const config = loadConfig();
  const application = await buildApplication(config);
  await application.server.listen({ port: config.port, host: "0.0.0.0" });

  // A deploy stops the server with a signal, and left alone a signal ends the
  // process where it stands, part way through sending an email if it is. So
  // the server is closed instead, which waits for the round being sent, and
  // the pool after it, which the round was using.
  const stop = (): void => {
    application.server
      .close()
      .then(() => application.pool.end())
      .then(
        () => process.exit(0),
        // Whatever would not close, the process is still to end, and to say
        // that it did not end well.
        (error: unknown) => {
          application.server.log.error(
            error,
            "The server did not stop cleanly.",
          );
          process.exit(1);
        },
      );
  };
  process.once("SIGTERM", stop);
  process.once("SIGINT", stop);
}
