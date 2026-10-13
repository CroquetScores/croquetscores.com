// The composition root. This is the only file outside src/infrastructure/ that
// names a concrete implementation: everything chosen here is chosen once.
import { ChangePlayerWorldRankingNameHandler } from "../application/operations/tournaments/ChangePlayerWorldRankingNameHandler.js";
import { ChangePlayerWorldRankingNameValidator } from "../application/operations/tournaments/ChangePlayerWorldRankingNameValidator.js";
import { ChangeTeamPlayerWorldRankingNameHandler } from "../application/operations/tournaments/ChangeTeamPlayerWorldRankingNameHandler.js";
import { ChangeTeamPlayerWorldRankingNameValidator } from "../application/operations/tournaments/ChangeTeamPlayerWorldRankingNameValidator.js";
import Fastify, { type FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import formbody from "@fastify/formbody";
import fastifyStatic from "@fastify/static";
import { createHash } from "node:crypto";
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
import { AccountsWithRoleHandler } from "../application/operations/accounts/AccountsWithRoleHandler.js";
import { AddRoleHandler } from "../application/operations/accounts/AddRoleHandler.js";
import { ImportWorldRankingPlayersHandler } from "../application/operations/world-rankings/ImportWorldRankingPlayersHandler.js";
import { WorldRankingPlayersMatchingHandler } from "../application/operations/world-rankings/WorldRankingPlayersMatchingHandler.js";
import { ImportErrorKeptHandler } from "../application/operations/import-errors/ImportErrorKeptHandler.js";
import { ImportErrorsKeptHandler } from "../application/operations/import-errors/ImportErrorsKeptHandler.js";
import { AddRoleValidator } from "../application/operations/accounts/AddRoleValidator.js";
import { RemoveRoleHandler } from "../application/operations/accounts/RemoveRoleHandler.js";
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
import { RecentResultsHandler } from "../application/operations/tournaments/RecentResultsHandler.js";
import { UpcomingTournamentsHandler } from "../application/operations/tournaments/UpcomingTournamentsHandler.js";
import { TournamentYearsHandler } from "../application/operations/tournaments/TournamentYearsHandler.js";
import { TournamentsInYearHandler } from "../application/operations/tournaments/TournamentsInYearHandler.js";
import { GamesOfTournamentHandler } from "../application/operations/tournaments/GamesOfTournamentHandler.js";
import { PublicPlayersOfTournamentHandler } from "../application/operations/tournaments/PublicPlayersOfTournamentHandler.js";
import { PublicPlayerOfTournamentHandler } from "../application/operations/tournaments/PublicPlayerOfTournamentHandler.js";
import { PublicBlockOfTournamentHandler } from "../application/operations/tournaments/PublicBlockOfTournamentHandler.js";
import { PublicKnockoutOfTournamentHandler } from "../application/operations/tournaments/PublicKnockoutOfTournamentHandler.js";
import { PublicRankingsOfTournamentHandler } from "../application/operations/tournaments/PublicRankingsOfTournamentHandler.js";
import { PublicSwissOfTournamentHandler } from "../application/operations/tournaments/PublicSwissOfTournamentHandler.js";
import { PublicGroupOfTournamentHandler } from "../application/operations/tournaments/PublicGroupOfTournamentHandler.js";
import { PublicTeamSummaryOfTournamentHandler } from "../application/operations/tournaments/PublicTeamSummaryOfTournamentHandler.js";
import { PublicTestOfTournamentHandler } from "../application/operations/tournaments/PublicTestOfTournamentHandler.js";
import type { BreachedPasswords } from "../application/services/BreachedPasswords.js";
import type { WorldRankingLists } from "../application/services/WorldRankingLists.js";
import { AddGameHandler } from "../application/operations/competitions/AddGameHandler.js";
import { AddGameValidator } from "../application/operations/competitions/AddGameValidator.js";
import { ArchiveGameHandler } from "../application/operations/competitions/ArchiveGameHandler.js";
import { MoveGameHandler } from "../application/operations/competitions/MoveGameHandler.js";
import { MoveGameValidator } from "../application/operations/competitions/MoveGameValidator.js";
import { CorrectGameHandler } from "../application/operations/competitions/CorrectGameHandler.js";
import { CorrectGameValidator } from "../application/operations/competitions/CorrectGameValidator.js";
import { GamesOfCompetitionHandler } from "../application/operations/competitions/GamesOfCompetitionHandler.js";
import { RestoreGameHandler } from "../application/operations/competitions/RestoreGameHandler.js";
import { ReverseGameWithdrawalHandler } from "../application/operations/competitions/ReverseGameWithdrawalHandler.js";
import { WithdrawGameHandler } from "../application/operations/competitions/WithdrawGameHandler.js";
import { EnterPlayerHandler } from "../application/operations/competitions/EnterPlayerHandler.js";
import { MoveCompetitionPlayerHandler } from "../application/operations/competitions/MoveCompetitionPlayerHandler.js";
import { ChangeCarryForwardHandler } from "../application/operations/competitions/ChangeCarryForwardHandler.js";
import { ChangeCarryForwardValidator } from "../application/operations/competitions/ChangeCarryForwardValidator.js";
import { MoveCompetitionPlayerValidator } from "../application/operations/competitions/MoveCompetitionPlayerValidator.js";
import { PlayersOfCompetitionHandler } from "../application/operations/competitions/PlayersOfCompetitionHandler.js";
import { RemovePlayerHandler } from "../application/operations/competitions/RemovePlayerHandler.js";
import { ReverseWithdrawalHandler } from "../application/operations/competitions/ReverseWithdrawalHandler.js";
import { WithdrawPlayerHandler } from "../application/operations/competitions/WithdrawPlayerHandler.js";
import { MovePlayerHandler } from "../application/operations/tournaments/MovePlayerHandler.js";
import { MovePlayerValidator } from "../application/operations/tournaments/MovePlayerValidator.js";
import { Competition } from "../domain/aggregates/tournaments/competitions/Competition.js";
import { nameCompetitionEvents } from "../domain/aggregates/tournaments/competitions/events/competitionEvents.js";
import { Commentary } from "../domain/aggregates/tournaments/commentaries/Commentary.js";
import { nameCommentaryEvents } from "../domain/aggregates/tournaments/commentaries/events/commentaryEvents.js";
import { nameManagerNoteEvents } from "../domain/aggregates/tournaments/manager-notes/events/managerNoteEvents.js";
import { ManagerNote } from "../domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import type { ManagerNoteId } from "../domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { CommentaryId } from "../domain/aggregates/tournaments/primitives/CommentaryId.js";
import { StartCommentaryHandler } from "../application/operations/tournaments/StartCommentaryHandler.js";
import { StartCommentaryValidator } from "../application/operations/tournaments/StartCommentaryValidator.js";
import { ChangeCommentaryTitleHandler } from "../application/operations/tournaments/ChangeCommentaryTitleHandler.js";
import { ChangeCommentaryTitleValidator } from "../application/operations/tournaments/ChangeCommentaryTitleValidator.js";
import { AddManagerNoteHandler } from "../application/operations/tournaments/AddManagerNoteHandler.js";
import { AddManagerNoteValidator } from "../application/operations/tournaments/AddManagerNoteValidator.js";
import { DeleteManagerNoteHandler } from "../application/operations/tournaments/DeleteManagerNoteHandler.js";
import { EditManagerNoteHandler } from "../application/operations/tournaments/EditManagerNoteHandler.js";
import { EditManagerNoteValidator } from "../application/operations/tournaments/EditManagerNoteValidator.js";
import { ManagerNotesOfTournamentHandler } from "../application/operations/tournaments/ManagerNotesOfTournamentHandler.js";
import { ManagerNoteToEditHandler } from "../application/operations/tournaments/ManagerNoteToEditHandler.js";
import { PublicManagerNoteOfTournamentHandler } from "../application/operations/tournaments/PublicManagerNoteOfTournamentHandler.js";
import { PublicManagerNotesOfTournamentHandler } from "../application/operations/tournaments/PublicManagerNotesOfTournamentHandler.js";
import { AddCommentHandler } from "../application/operations/commentaries/AddCommentHandler.js";
import { AddCommentValidator } from "../application/operations/commentaries/AddCommentValidator.js";
import { EditCommentHandler } from "../application/operations/commentaries/EditCommentHandler.js";
import { EditCommentValidator } from "../application/operations/commentaries/EditCommentValidator.js";
import { DeleteCommentHandler } from "../application/operations/commentaries/DeleteCommentHandler.js";
import { PublicCommentariesOfTournamentHandler } from "../application/operations/tournaments/PublicCommentariesOfTournamentHandler.js";
import { PublicCommentaryOfTournamentHandler } from "../application/operations/tournaments/PublicCommentaryOfTournamentHandler.js";
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
import {
  PostgresEventStore,
  type StoredEvent,
} from "../infrastructure/event-store/PostgresEventStore.js";
import { PostgresHandledRequests } from "../infrastructure/database/PostgresHandledRequests.js";
import { PostgresFailedSignIns } from "../infrastructure/database/PostgresFailedSignIns.js";
import { PostgresPasswordResetAskings } from "../infrastructure/database/PostgresPasswordResetAskings.js";
import { PostgresSessions } from "../infrastructure/database/PostgresSessions.js";
import { Argon2id } from "../infrastructure/identity/Argon2id.js";
import { ImportedPasswordHasher } from "../infrastructure/identity/ImportedPasswordHasher.js";
import { OldSitePasswordHasher } from "../infrastructure/identity/OldSitePasswordHasher.js";
import { HaveIBeenPwnedPasswords } from "../infrastructure/identity/HaveIBeenPwnedPasswords.js";
import { PostgresKeptImportErrors } from "../infrastructure/database/PostgresKeptImportErrors.js";
import { PostgresWorldRankingPlayers } from "../infrastructure/database/PostgresWorldRankingPlayers.js";
import { WorldRankingWebsite } from "../infrastructure/services/WorldRankingWebsite.js";
import { RecaptchaReaderCheck } from "../infrastructure/identity/RecaptchaReaderCheck.js";
import { SignedLinks } from "../infrastructure/identity/SignedLinks.js";
import { AccountsByEmailAddress } from "../infrastructure/read-models/AccountsByEmailAddress.js";
import { AccountsByGoogleAccount } from "../infrastructure/read-models/AccountsByGoogleAccount.js";
import { AccountsByRole } from "../infrastructure/read-models/AccountsByRole.js";
import { TournamentsByAccount } from "../infrastructure/read-models/TournamentsByAccount.js";
import { TournamentsByWebsite } from "../infrastructure/read-models/TournamentsByWebsite.js";
import { TournamentsByAddress } from "../infrastructure/read-models/TournamentsByAddress.js";
import { ManagerNotesByTournament } from "../infrastructure/read-models/ManagerNotesByTournament.js";
import { CommentariesByTournament } from "../infrastructure/read-models/CommentariesByTournament.js";
import {
  GoogleOpenIdConnect,
  GoogleOpenIdConnectFailed,
  type GoogleEndpoints,
} from "../infrastructure/identity/GoogleOpenIdConnect.js";
import { apiV1 } from "./api/v1/index.js";
import {
  adminBuildHeader,
  adminPage,
  builtAdminPage,
} from "./common/adminPage.js";
import { assetsPath, readAssets, type Assets } from "./common/assets.js";
import { sendTheEmailQueue } from "./common/emailQueueSending.js";
import { emailWriter, siteAddress } from "./common/emailWriter.js";
import { refuseCrossSite } from "./common/crossSite.js";
import {
  isAdministrator,
  knowTheReader,
  signedIn,
  type Reader,
} from "./common/reader.js";
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
import { afrikaans } from "./languages/afrikaans.js";
import { chinese } from "./languages/chinese.js";
import { dutch } from "./languages/dutch.js";
import { egyptian } from "./languages/egyptian.js";
import { english } from "./languages/english.js";
import { french } from "./languages/french.js";
import { german } from "./languages/german.js";
import { italian } from "./languages/italian.js";
import { japanese } from "./languages/japanese.js";
import { korean } from "./languages/korean.js";
import { maori } from "./languages/maori.js";
import { polish } from "./languages/polish.js";
import { portuguese } from "./languages/portuguese.js";
import { russian } from "./languages/russian.js";
import { spanish } from "./languages/spanish.js";
import { swedish } from "./languages/swedish.js";
import { welsh } from "./languages/welsh.js";

// English first, because it is the language a reader gets where the site has
// none of the ones their browser asks for, and the one a word missing from
// another falls back to. The rest follow in the order of their names in
// English, which is the order the footer offers them in.
const offeredLanguages = [
  english,
  afrikaans,
  chinese,
  dutch,
  egyptian,
  french,
  german,
  italian,
  japanese,
  korean,
  maori,
  polish,
  portuguese,
  russian,
  spanish,
  swedish,
  welsh,
];
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
import { registerHomePage } from "./public/home.js";
import { registerYearPage } from "./public/year.js";
import { registerYearSportPage } from "./public/yearSport.js";
import { registerTournamentPage } from "./public/tournament.js";
import { registerPlayersPage } from "./public/players.js";
import { registerRankings } from "./public/rankings.js";
import { registerCommentariesPage } from "./public/commentaries.js";
import { registerNotePage } from "./public/note.js";
import { registerNotesPage } from "./public/notes.js";
import { registerStartCommentaryPage } from "./public/startCommentary.js";
import { registerCommentaryPage } from "./public/commentary.js";
import { registerEditCommentPages } from "./public/editComment.js";
import { registerChangeCommentaryTitlePage } from "./public/changeCommentaryTitle.js";
import { registerPlayerPage } from "./public/player.js";
import { gridView } from "./public/block.js";
import { summaryView } from "./public/blockSummary.js";
import {
  blockOrderOfPlay,
  knockoutOrderOfPlay,
  swissOrderOfPlay,
  testOrderOfPlay,
} from "./public/orderOfPlay.js";
import { testView } from "./public/test.js";
import { swissView } from "./public/swiss.js";
import { swissSummaryView } from "./public/swissSummary.js";
import { registerCompetitionPages } from "./public/competitionPages.js";
import { registerGroupPage } from "./public/group.js";
import { registerTeamSummaryPage } from "./public/teamSummary.js";
import { knockoutView } from "./public/knockout.js";
import { knockoutSummaryView } from "./public/knockoutSummary.js";
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
  /** Every commentary's comments, each commentary under its own id. */
  readonly commentaries: AggregateRepository<Commentary, CommentaryId>;
  /** Every note a tournament's managers wrote, each under its own id. */
  readonly managerNotes: AggregateRepository<ManagerNote, ManagerNoteId>;
  /** The notes of each tournament, without what they say, as the read model keeps them. */
  readonly managerNotesByTournament: ManagerNotesByTournament;
  /** The commentaries of each tournament, without their comments, as the read model keeps them. */
  readonly commentariesByTournament: CommentariesByTournament;
  /** The tournaments each account has a part in, as the read model keeps them. */
  readonly tournamentsByAccount: TournamentsByAccount;
  /**
   * Makes every read model again from every event kept, in one transaction,
   * and answers how many events that was. For the maintenance script that
   * rebuilds them (scripts/rebuild-read-models.mjs); no route calls it.
   */
  readonly rebuildReadModels: () => Promise<number>;
  /**
   * Re-encrypts every account's key, and every email waiting with no account,
   * with `newSiteKey`, in one transaction, and rewrites no event. For the
   * maintenance script that changes ACCOUNT_ENCRYPTION_KEY
   * (scripts/change-site-key.mjs); no route calls it.
   */
  readonly changeSiteKey: (newSiteKey: string) => Promise<void>;
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

// /admin/administrator and everything beneath it, but not an address that
// only begins the same way, such as /admin/administrators.
const administratorsOnly = /^\/admin\/administrator(?:[/?#]|$)/;

// The admin's page as it was built, read once, so that the page served and the
// build it is named as are the same reading of it, or nothing where the admin
// has not been built.
const builtPageIn = (adminRoot: string): string | undefined => {
  const page = join(adminRoot, "index.html");
  return existsSync(page) ? readFileSync(page, "utf8") : undefined;
};

// What the admin was built to, which changes whenever the admin does: the
// built page names the files Vite hashed, so a hash of the page is a hash of
// them. Not the server's own version, which changes with a deploy that left the
// admin as it was, and would have every open tab offered a reload for nothing.
const buildOf = (page: string | undefined): string =>
  page === undefined
    ? "not built"
    : createHash("sha256").update(page).digest("hex").slice(0, 16);

const registerAdmin = async (
  server: FastifyInstance,
  adminRoot: string,
  page: string | undefined,
  build: () => string,
): Promise<void> => {
  if (page === undefined) {
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
  const built = builtAdminPage(page);
  server.get("/admin", (_request, reply) => reply.redirect("/admin/", 308));
  // What every other page is sent with, for the same reason: the page is now
  // drawn from the reader's cookies and the languages their browser asks for.
  // Nothing in the admin is anybody's but the reader's own, so a reader who is
  // not signed in is sent to sign in first, and brought back to the address
  // they asked for, as every page of an account's own does.
  //
  // The administrator's pages are nobody's own, so being signed in is not
  // enough for them (administrator.feature). Not found rather than refused, so
  // that they do not announce themselves to whoever may not open them. A
  // reader not signed in is still sent to sign in, since they may be an
  // administrator who has not said so yet.
  server.get("/admin/*", (request, reply) => {
    if (!signedIn(request)) return toSignIn(request, reply);
    if (administratorsOnly.test(request.url) && !isAdministrator(request)) {
      return reply.callNotFound();
    }
    return reply
      .header("cache-control", "private, no-cache")
      .header("vary", "Cookie, Accept-Language")
      .type("text/html; charset=utf-8")
      .send(adminPage(built, request, build()));
  });
};

export interface ApplicationOptions {
  /** Off for the specs, whose output is the scenario list and not a request log. */
  readonly logger?: boolean;
  /**
   * What the admin's build is called, asked afresh for every page and every
   * answer of the API. What the admin was built to, unless a scenario says
   * otherwise: a scenario deploys the site again by answering something else.
   */
  readonly build?: () => string | undefined;
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
   * Where the players the world rankings know are read from. The rankings'
   * own site, unless a scenario says otherwise, for the reason Have I Been
   * Pwned is not asked.
   */
  readonly worldRankingLists?: WorldRankingLists;
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

/** A read model that can be made again from every event kept. */
interface RebuildableReadModel {
  rebuildFrom(events: readonly StoredEvent[]): Promise<void>;
}

// Every kind of event the application records, each named once by the name it
// is kept under, and how it is read back.
const events = (): EventRegistry =>
  nameManagerNoteEvents(
    nameCommentaryEvents(
      nameCompetitionEvents(
        nameTournamentEvents(nameAccountEvents(new EventRegistry())),
      ),
    ),
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

  const accountsByRole = new AccountsByRole(unitOfWork);

  const tournamentsByAddress = new TournamentsByAddress(unitOfWork);
  const tournamentsByAccount = new TournamentsByAccount(unitOfWork);
  const tournamentsByWebsite = new TournamentsByWebsite(unitOfWork);
  const managerNotesByTournament = new ManagerNotesByTournament(unitOfWork);
  const commentariesByTournament = new CommentariesByTournament(unitOfWork);

  // Every read model, each given every event as it is appended and each made
  // again from every event by the maintenance script that rebuilds them. One
  // list, so that a read model is never projected and left out of a rebuild.
  const readModels: readonly (Projection & RebuildableReadModel)[] = [
    accountsByEmailAddress,
    accountsByGoogleAccount,
    accountsByRole,
    tournamentsByAddress,
    tournamentsByAccount,
    tournamentsByWebsite,
    managerNotesByTournament,
    commentariesByTournament,
  ];

  // On the unit of work the mediator's transactions use, so that what a
  // command's handler appends, and what every projection writes of it, is kept
  // in the command's transaction or not at all.
  const keptEvents = new PostgresEventStore(
    unitOfWork,
    options.events ?? events(),
    new AccountEventSealing(accountKeys),
  );
  const eventStore = new ProjectingEventStore(
    keptEvents,
    options.projections ?? readModels,
  );
  // Everything it changes is changed in one transaction, so that a change
  // that fails leaves every key as it was. The application goes on using the
  // key it was made with; the setting is changed and the site started again.
  const changeSiteKey = (newSiteKey: string): Promise<void> =>
    unitOfWork.inTransaction(() => accountKeys.changeSiteKey(newSiteKey));
  // Reading every event is not something the EventStore the application
  // hands out can do, since no command or query has any business doing it, so
  // the maintenance script that rebuilds the read models asks for it here, and
  // a route cannot. The application's own read models are rebuilt, and never
  // a scenario's stand-in projections, which are examples rather than read
  // models. One transaction, so that a rebuild that fails leaves every read
  // model as it was, and one that is running is not seen half done.
  const rebuildReadModels = (): Promise<number> =>
    unitOfWork.inTransaction(async () => {
      const everyEvent = await keptEvents.readAll();
      for (const readModel of readModels) {
        await readModel.rebuildFrom(everyEvent);
      }
      return everyEvent.length;
    });

  // Emails are written from the site's catalogues, with links made from the
  // site's configured address and never a request's, and written to files in
  // temp/ until there is a mail provider.
  const languages = options.languages ?? offeredLanguages;
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
  mediator.handleCommand(
    new ForgetAccountHandler(accounts, links, accountsByRole),
  );
  validation.register(new ChangeNameValidator());
  mediator.handleCommand(new ChangeNameHandler(accounts));
  mediator.handleQuery(new AccountProfileHandler(accounts));
  validation.register(new AddRoleValidator());
  mediator.handleCommand(new AddRoleHandler(accounts, accountsByEmailAddress));
  mediator.handleCommand(new RemoveRoleHandler(accounts, accountsByRole));
  mediator.handleQuery(new AccountsWithRoleHandler(accounts, accountsByRole));
  // Given the unit of work to run its own transactions in, since it reads the
  // rankings' lists between them, where the reading holds no connection.
  const worldRankingPlayers = new PostgresWorldRankingPlayers(unitOfWork);
  mediator.handleCommand(
    new ImportWorldRankingPlayersHandler(
      accounts,
      options.worldRankingLists ?? new WorldRankingWebsite(),
      worldRankingPlayers,
      unitOfWork,
    ),
  );
  mediator.handleQuery(
    new WorldRankingPlayersMatchingHandler(worldRankingPlayers),
  );
  const keptImportErrors = new PostgresKeptImportErrors(unitOfWork);
  mediator.handleQuery(new ImportErrorsKeptHandler(accounts, keptImportErrors));
  mediator.handleQuery(new ImportErrorKeptHandler(accounts, keptImportErrors));
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
  mediator.handleQuery(
    new WhatAForgettingLinkIsWorthHandler(accounts, links, accountsByRole),
  );
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
  const commentaries = new AggregateRepository(
    eventStore,
    (id: CommentaryId, events) => Commentary.rebuiltFrom(id, events),
  );
  // Each note a tournament's managers wrote, kept apart from the tournament so
  // that what it says is read only where the note is.
  const managerNotes = new AggregateRepository(
    eventStore,
    (id: ManagerNoteId, events) => ManagerNote.rebuiltFrom(id, events),
  );
  // Whether games have been played is asked of the games the competitions
  // keep.
  const games = gamesKeptByCompetitions(tournaments, competitions);
  const both = [tournaments, accounts] as const;
  validation.register(new CreateTournamentValidator());
  validation.register(new UpdateTournamentValidator());
  validation.register(new AddPlayerValidator());
  validation.register(new UpdatePlayerValidator());
  validation.register(new ChangePlayerWorldRankingNameValidator());
  validation.register(new ChangeTeamPlayerWorldRankingNameValidator());
  validation.register(new AddBlockValidator());
  validation.register(new UpdateBlockValidator());
  validation.register(new AddKnockoutValidator());
  validation.register(new UpdateKnockoutValidator());
  validation.register(new AddSwissValidator());
  validation.register(new UpdateSwissValidator());
  validation.register(new MoveCompetitionValidator());
  validation.register(new MovePlayerValidator());
  validation.register(new MoveCompetitionPlayerValidator());
  validation.register(new ChangeCarryForwardValidator());
  validation.register(new MoveGameValidator());
  validation.register(new AddGameValidator());
  validation.register(new CorrectGameValidator());
  validation.register(new AddManagerValidator());
  validation.register(new AddScorerValidator());
  validation.register(new StartCommentaryValidator());
  validation.register(new ChangeCommentaryTitleValidator());
  validation.register(new AddManagerNoteValidator());
  validation.register(new EditManagerNoteValidator());
  validation.register(new AddCommentValidator());
  validation.register(new EditCommentValidator());
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
  mediator.handleCommand(new ChangePlayerWorldRankingNameHandler(...both));
  mediator.handleCommand(new ChangeTeamPlayerWorldRankingNameHandler(...both));
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
  mediator.handleCommand(new ArchiveCompetitionHandler(...both, games));
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
  mediator.handleCommand(new ChangeCarryForwardHandler(...both, competitions));
  mediator.handleCommand(new RemovePlayerHandler(...both, competitions));
  mediator.handleCommand(new AddGameHandler(...both, competitions));
  mediator.handleCommand(new ArchiveGameHandler(...both, competitions));
  mediator.handleCommand(new MoveGameHandler(...both, competitions));
  mediator.handleCommand(new RestoreGameHandler(...both, competitions));
  mediator.handleCommand(new WithdrawGameHandler(...both, competitions));
  mediator.handleCommand(
    new ReverseGameWithdrawalHandler(...both, competitions),
  );
  mediator.handleCommand(new CorrectGameHandler(...both, competitions));
  mediator.handleCommand(
    new StartCommentaryHandler(...both, commentaries, commentariesByTournament),
  );
  mediator.handleCommand(
    new ChangeCommentaryTitleHandler(
      ...both,
      commentaries,
      commentariesByTournament,
    ),
  );
  mediator.handleCommand(
    new AddManagerNoteHandler(...both, managerNotes, managerNotesByTournament),
  );
  mediator.handleCommand(new EditManagerNoteHandler(...both, managerNotes));
  mediator.handleCommand(new DeleteManagerNoteHandler(...both, managerNotes));
  mediator.handleCommand(new AddCommentHandler(...both, commentaries));
  mediator.handleCommand(new EditCommentHandler(...both, commentaries));
  mediator.handleCommand(new DeleteCommentHandler(...both, commentaries));
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
  mediator.handleQuery(new ManagerNoteToEditHandler(...both, managerNotes));
  mediator.handleQuery(
    new ManagerNotesOfTournamentHandler(...both, managerNotesByTournament),
  );
  mediator.handleQuery(
    new TournamentsOfAccountHandler(tournamentsByAccount, accounts),
  );
  mediator.handleQuery(
    new TournamentToChangeHandler(tournaments, tournamentsByAddress, accounts),
  );
  mediator.handleQuery(
    new TournamentPageHandler(tournaments, tournamentsByAddress, accounts),
  );
  mediator.handleQuery(
    new CompetitionPageHandler(tournaments, tournamentsByAddress, accounts),
  );
  mediator.handleQuery(
    new TeamPageHandler(tournaments, tournamentsByAddress, accounts),
  );
  mediator.handleQuery(
    new TournamentYearsOfAccountHandler(tournamentsByAccount, accounts),
  );
  mediator.handleQuery(new RecentResultsHandler(tournamentsByWebsite));
  mediator.handleQuery(new UpcomingTournamentsHandler(tournamentsByWebsite));
  mediator.handleQuery(new TournamentYearsHandler(tournamentsByWebsite));
  mediator.handleQuery(new TournamentsInYearHandler(tournamentsByWebsite));
  mediator.handleQuery(
    new GamesOfTournamentHandler(
      tournaments,
      competitions,
      tournamentsByAddress,
      managerNotesByTournament,
      commentariesByTournament,
    ),
  );
  mediator.handleQuery(
    new PublicPlayersOfTournamentHandler(
      tournaments,
      tournamentsByAddress,
      managerNotesByTournament,
      commentariesByTournament,
    ),
  );
  mediator.handleQuery(
    new PublicPlayerOfTournamentHandler(
      tournaments,
      competitions,
      tournamentsByAddress,
      managerNotesByTournament,
      commentariesByTournament,
    ),
  );
  mediator.handleQuery(
    new PublicBlockOfTournamentHandler(
      tournaments,
      competitions,
      tournamentsByAddress,
      managerNotesByTournament,
      commentariesByTournament,
    ),
  );
  mediator.handleQuery(
    new PublicRankingsOfTournamentHandler(
      tournaments,
      competitions,
      tournamentsByAddress,
    ),
  );
  mediator.handleQuery(
    new PublicKnockoutOfTournamentHandler(
      tournaments,
      competitions,
      tournamentsByAddress,
      managerNotesByTournament,
      commentariesByTournament,
    ),
  );
  mediator.handleQuery(
    new PublicSwissOfTournamentHandler(
      tournaments,
      competitions,
      tournamentsByAddress,
      managerNotesByTournament,
      commentariesByTournament,
    ),
  );
  mediator.handleQuery(
    new PublicTeamSummaryOfTournamentHandler(
      tournaments,
      competitions,
      tournamentsByAddress,
      managerNotesByTournament,
      commentariesByTournament,
    ),
  );
  mediator.handleQuery(
    new PublicGroupOfTournamentHandler(
      tournaments,
      competitions,
      tournamentsByAddress,
      managerNotesByTournament,
      commentariesByTournament,
    ),
  );
  mediator.handleQuery(
    new PublicTestOfTournamentHandler(
      tournaments,
      competitions,
      tournamentsByAddress,
      managerNotesByTournament,
      commentariesByTournament,
    ),
  );
  mediator.handleQuery(
    new PublicManagerNotesOfTournamentHandler(
      tournaments,
      tournamentsByAddress,
      managerNotesByTournament,
      commentariesByTournament,
    ),
  );
  mediator.handleQuery(
    new PublicManagerNoteOfTournamentHandler(
      tournaments,
      tournamentsByAddress,
      managerNotes,
      managerNotesByTournament,
      commentariesByTournament,
    ),
  );
  mediator.handleQuery(
    new PublicCommentariesOfTournamentHandler(
      tournaments,
      accounts,
      tournamentsByAddress,
      managerNotesByTournament,
      commentariesByTournament,
    ),
  );
  mediator.handleQuery(
    new PublicCommentaryOfTournamentHandler(
      tournaments,
      accounts,
      commentaries,
      tournamentsByAddress,
      managerNotesByTournament,
      commentariesByTournament,
    ),
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
      readerFromSessions(sessions, inTransaction, async (account) => {
        const profile = await mediator.query(new AccountProfile(account.value));
        return {
          hasPassword: profile?.hasPassword ?? false,
          isAdministrator: profile?.isAdministrator ?? false,
        };
      }),
  );

  // Before any route, so nothing that changes something can be reached from
  // another site by forgetting to ask.
  refuseCrossSite(server, config.canonicalHost);

  // Every answer of the API names the build the site is serving, so that an
  // admin left open across a deploy learns of it (newerBuild.feature).
  const adminRoot = join(repositoryRoot, "dist", "admin");
  const adminPageBuilt = builtPageIn(adminRoot);
  const builtAs = buildOf(adminPageBuilt);
  const build = (): string => options.build?.() ?? builtAs;
  server.addHook("onSend", (request, reply, payload, done) => {
    if (request.url.startsWith("/api/v1/"))
      reply.header(adminBuildHeader, build());
    done(null, payload);
  });
  await server.register(apiV1, { prefix: "/api/v1", assets });
  await server.register(
    auth({
      googleConfigured: config.google !== undefined,
      facebookConfigured: config.facebook !== undefined,
    }),
    { prefix: "/auth" },
  );

  registerAssets(server, assets);

  await registerAdmin(server, adminRoot, adminPageBuilt, build);

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
  registerHomePage(server, assets);
  registerYearPage(server, assets);
  registerYearSportPage(server, assets);
  registerTournamentPage(server, assets);
  registerPlayersPage(server, assets);
  registerRankings(server, assets);
  registerCommentariesPage(server, assets);
  registerNotesPage(server, assets);
  registerNotePage(server, assets);
  registerStartCommentaryPage(server, assets);
  registerCommentaryPage(server, assets);
  registerEditCommentPages(server, assets);
  registerChangeCommentaryTitlePage(server, assets);
  registerPlayerPage(server, assets);
  registerTeamSummaryPage(server, assets);
  registerGroupPage(server, assets);
  registerCompetitionPages(server, assets, {
    block: {
      grid: gridView(assets),
      summary: summaryView(assets),
      orderOfPlay: blockOrderOfPlay(assets),
    },
    knockout: {
      grid: knockoutView(assets),
      summary: knockoutSummaryView(assets),
      orderOfPlay: knockoutOrderOfPlay(assets),
    },
    swiss: {
      grid: swissView(assets),
      summary: swissSummaryView(assets),
      orderOfPlay: swissOrderOfPlay(assets),
    },
    test: {
      grid: testView(),
      orderOfPlay: testOrderOfPlay(assets),
    },
  });

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
    commentaries,
    managerNotes,
    managerNotesByTournament,
    commentariesByTournament,
    tournamentsByAccount,
    rebuildReadModels,
    changeSiteKey,
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
