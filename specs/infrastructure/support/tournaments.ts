// What stands behind "the application's tournaments": every operation on a
// tournament, over the event store the accounts support keeps and the
// tournaments by address and by website read models kept in step with it,
// behind a mediator with the behaviours the application gives a command —
// validation, then a transaction — and a query, whose transaction writes
// nothing. The accounts the operations are asked by are stood up the way
// registering stands them up, since that is what the scenarios make them with.
//
// Here rather than beside the features because the features are the
// application's, and an application spec may name nothing from
// infrastructure. It puts a plain shape on the world (specs/support/
// tournaments.ts) and the steps ask only that.
import { ChangePlayerWorldRankingNameHandler } from "../../../src/application/operations/tournaments/ChangePlayerWorldRankingNameHandler.js";
import { ChangePlayerWorldRankingNameValidator } from "../../../src/application/operations/tournaments/ChangePlayerWorldRankingNameValidator.js";
import { ChangeTeamPlayerWorldRankingNameHandler } from "../../../src/application/operations/tournaments/ChangeTeamPlayerWorldRankingNameHandler.js";
import { ChangeTeamPlayerWorldRankingNameValidator } from "../../../src/application/operations/tournaments/ChangeTeamPlayerWorldRankingNameValidator.js";
import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AggregateRepository } from "../../../src/application/common/AggregateRepository.js";
import { Mediator } from "../../../src/application/common/Mediator.js";
import { ProjectingEventStore } from "../../../src/application/common/ProjectingEventStore.js";
import { ValidationBehaviour } from "../../../src/application/common/ValidationBehaviour.js";
import { AddBlockHandler } from "../../../src/application/operations/tournaments/AddBlockHandler.js";
import { AddBlockValidator } from "../../../src/application/operations/tournaments/AddBlockValidator.js";
import { AddKnockoutHandler } from "../../../src/application/operations/tournaments/AddKnockoutHandler.js";
import { AddKnockoutValidator } from "../../../src/application/operations/tournaments/AddKnockoutValidator.js";
import { AddManagerHandler } from "../../../src/application/operations/tournaments/AddManagerHandler.js";
import { AddManagerValidator } from "../../../src/application/operations/tournaments/AddManagerValidator.js";
import { AddPlayerHandler } from "../../../src/application/operations/tournaments/AddPlayerHandler.js";
import { AddTeamValidator } from "../../../src/application/operations/tournaments/AddTeamValidator.js";
import { UpdateTeamValidator } from "../../../src/application/operations/tournaments/UpdateTeamValidator.js";
import { MoveTeamValidator } from "../../../src/application/operations/tournaments/MoveTeamValidator.js";
import { AddTeamPlayerValidator } from "../../../src/application/operations/tournaments/AddTeamPlayerValidator.js";
import { UpdateTeamPlayerValidator } from "../../../src/application/operations/tournaments/UpdateTeamPlayerValidator.js";
import { MoveTeamPlayerValidator } from "../../../src/application/operations/tournaments/MoveTeamPlayerValidator.js";
import { AddTestValidator } from "../../../src/application/operations/tournaments/AddTestValidator.js";
import { UpdateTestValidator } from "../../../src/application/operations/tournaments/UpdateTestValidator.js";
import { AddTeamHandler } from "../../../src/application/operations/tournaments/AddTeamHandler.js";
import { UpdateTeamHandler } from "../../../src/application/operations/tournaments/UpdateTeamHandler.js";
import { ArchiveTeamHandler } from "../../../src/application/operations/tournaments/ArchiveTeamHandler.js";
import { RestoreTeamHandler } from "../../../src/application/operations/tournaments/RestoreTeamHandler.js";
import { MoveTeamHandler } from "../../../src/application/operations/tournaments/MoveTeamHandler.js";
import { AddTeamPlayerHandler } from "../../../src/application/operations/tournaments/AddTeamPlayerHandler.js";
import { UpdateTeamPlayerHandler } from "../../../src/application/operations/tournaments/UpdateTeamPlayerHandler.js";
import { RestoreTeamPlayerHandler } from "../../../src/application/operations/tournaments/RestoreTeamPlayerHandler.js";
import { MoveTeamPlayerHandler } from "../../../src/application/operations/tournaments/MoveTeamPlayerHandler.js";
import { AddTestHandler } from "../../../src/application/operations/tournaments/AddTestHandler.js";
import { ArchiveTeamPlayerHandler } from "../../../src/application/operations/tournaments/ArchiveTeamPlayerHandler.js";
import { UpdateTestHandler } from "../../../src/application/operations/tournaments/UpdateTestHandler.js";
import { TeamsOfTournamentHandler } from "../../../src/application/operations/tournaments/TeamsOfTournamentHandler.js";
import { PlayersOfTeamHandler } from "../../../src/application/operations/tournaments/PlayersOfTeamHandler.js";
import { PlayersOfTestHandler } from "../../../src/application/operations/competitions/PlayersOfTestHandler.js";
import { AddPlayerValidator } from "../../../src/application/operations/tournaments/AddPlayerValidator.js";
import { AddScorerHandler } from "../../../src/application/operations/tournaments/AddScorerHandler.js";
import { AddScorerValidator } from "../../../src/application/operations/tournaments/AddScorerValidator.js";
import { AddSwissHandler } from "../../../src/application/operations/tournaments/AddSwissHandler.js";
import { AddSwissValidator } from "../../../src/application/operations/tournaments/AddSwissValidator.js";
import { ArchiveCompetitionHandler } from "../../../src/application/operations/tournaments/ArchiveCompetitionHandler.js";
import { ArchivePlayerHandler } from "../../../src/application/operations/tournaments/ArchivePlayerHandler.js";
import { ArchiveTournamentHandler } from "../../../src/application/operations/tournaments/ArchiveTournamentHandler.js";
import { CreateTournamentHandler } from "../../../src/application/operations/tournaments/CreateTournamentHandler.js";
import { CreateTournamentValidator } from "../../../src/application/operations/tournaments/CreateTournamentValidator.js";
import { RemoveManagerHandler } from "../../../src/application/operations/tournaments/RemoveManagerHandler.js";
import { CompetitionsOfTournamentHandler } from "../../../src/application/operations/tournaments/CompetitionsOfTournamentHandler.js";
import { ManagersOfTournamentHandler } from "../../../src/application/operations/tournaments/ManagersOfTournamentHandler.js";
import { PlayersOfTournamentHandler } from "../../../src/application/operations/tournaments/PlayersOfTournamentHandler.js";
import { RemoveScorerHandler } from "../../../src/application/operations/tournaments/RemoveScorerHandler.js";
import { ScorersOfTournamentHandler } from "../../../src/application/operations/tournaments/ScorersOfTournamentHandler.js";
import { MoveCompetitionHandler } from "../../../src/application/operations/tournaments/MoveCompetitionHandler.js";
import { MoveCompetitionValidator } from "../../../src/application/operations/tournaments/MoveCompetitionValidator.js";
import { RestoreCompetitionHandler } from "../../../src/application/operations/tournaments/RestoreCompetitionHandler.js";
import { RestorePlayerHandler } from "../../../src/application/operations/tournaments/RestorePlayerHandler.js";
import { RestoreTournamentHandler } from "../../../src/application/operations/tournaments/RestoreTournamentHandler.js";
import { UpdateBlockHandler } from "../../../src/application/operations/tournaments/UpdateBlockHandler.js";
import { UpdateBlockValidator } from "../../../src/application/operations/tournaments/UpdateBlockValidator.js";
import { UpdateKnockoutHandler } from "../../../src/application/operations/tournaments/UpdateKnockoutHandler.js";
import { UpdateKnockoutValidator } from "../../../src/application/operations/tournaments/UpdateKnockoutValidator.js";
import { UpdatePlayerHandler } from "../../../src/application/operations/tournaments/UpdatePlayerHandler.js";
import { UpdatePlayerValidator } from "../../../src/application/operations/tournaments/UpdatePlayerValidator.js";
import { UpdateSwissHandler } from "../../../src/application/operations/tournaments/UpdateSwissHandler.js";
import { UpdateSwissValidator } from "../../../src/application/operations/tournaments/UpdateSwissValidator.js";
import { UpdateTournamentHandler } from "../../../src/application/operations/tournaments/UpdateTournamentHandler.js";
import { UpdateTournamentValidator } from "../../../src/application/operations/tournaments/UpdateTournamentValidator.js";
import { AddGameHandler } from "../../../src/application/operations/competitions/AddGameHandler.js";
import { AddGameValidator } from "../../../src/application/operations/competitions/AddGameValidator.js";
import { ArchiveGameHandler } from "../../../src/application/operations/competitions/ArchiveGameHandler.js";
import { MoveGameHandler } from "../../../src/application/operations/competitions/MoveGameHandler.js";
import { MoveGameValidator } from "../../../src/application/operations/competitions/MoveGameValidator.js";
import { CorrectGameHandler } from "../../../src/application/operations/competitions/CorrectGameHandler.js";
import { CorrectGameValidator } from "../../../src/application/operations/competitions/CorrectGameValidator.js";
import { GamesOfCompetitionHandler } from "../../../src/application/operations/competitions/GamesOfCompetitionHandler.js";
import { RestoreGameHandler } from "../../../src/application/operations/competitions/RestoreGameHandler.js";
import { ReverseGameWithdrawalHandler } from "../../../src/application/operations/competitions/ReverseGameWithdrawalHandler.js";
import { WithdrawGameHandler } from "../../../src/application/operations/competitions/WithdrawGameHandler.js";
import { EnterPlayerHandler } from "../../../src/application/operations/competitions/EnterPlayerHandler.js";
import { MoveCompetitionPlayerHandler } from "../../../src/application/operations/competitions/MoveCompetitionPlayerHandler.js";
import { ChangeCarryForwardHandler } from "../../../src/application/operations/competitions/ChangeCarryForwardHandler.js";
import { ChangeCarryForwardValidator } from "../../../src/application/operations/competitions/ChangeCarryForwardValidator.js";
import { MoveCompetitionPlayerValidator } from "../../../src/application/operations/competitions/MoveCompetitionPlayerValidator.js";
import { PlayersOfCompetitionHandler } from "../../../src/application/operations/competitions/PlayersOfCompetitionHandler.js";
import { RemovePlayerHandler } from "../../../src/application/operations/competitions/RemovePlayerHandler.js";
import { ReverseWithdrawalHandler } from "../../../src/application/operations/competitions/ReverseWithdrawalHandler.js";
import { WithdrawPlayerHandler } from "../../../src/application/operations/competitions/WithdrawPlayerHandler.js";
import { MovePlayerHandler } from "../../../src/application/operations/tournaments/MovePlayerHandler.js";
import { MovePlayerValidator } from "../../../src/application/operations/tournaments/MovePlayerValidator.js";
import { Competition } from "../../../src/domain/aggregates/tournaments/competitions/Competition.js";
import { gamesKeptByCompetitions } from "../../../src/application/operations/competitions/competitionGames.js";
import { Account } from "../../../src/domain/aggregates/accounts/Account.js";
import { Tournament } from "../../../src/domain/aggregates/tournaments/Tournament.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import { ReadOnlyTransactionBehaviour } from "../../../src/infrastructure/database/ReadOnlyTransactionBehaviour.js";
import { TransactionBehaviour } from "../../../src/infrastructure/database/TransactionBehaviour.js";
import { TournamentsByAddress } from "../../../src/infrastructure/read-models/TournamentsByAddress.js";
import { TournamentsByWebsite } from "../../../src/infrastructure/read-models/TournamentsByWebsite.js";
import { SearchByWebsite } from "../../../src/infrastructure/read-models/SearchByWebsite.js";
import { SearchHandler } from "../../../src/application/operations/tournaments/SearchHandler.js";
import { PlayerOfWebsiteHandler } from "../../../src/application/operations/tournaments/PlayerOfWebsiteHandler.js";
import { SearchPlayersOfWebsiteHandler } from "../../../src/application/operations/tournaments/SearchPlayersOfWebsiteHandler.js";
import { RepresentingMatchingHandler } from "../../../src/application/operations/tournaments/RepresentingMatchingHandler.js";
import { RecentResultsHandler } from "../../../src/application/operations/tournaments/RecentResultsHandler.js";
import { UpcomingTournamentsHandler } from "../../../src/application/operations/tournaments/UpcomingTournamentsHandler.js";
import { TournamentYearsHandler } from "../../../src/application/operations/tournaments/TournamentYearsHandler.js";
import { TournamentsInYearHandler } from "../../../src/application/operations/tournaments/TournamentsInYearHandler.js";
import { TournamentsInUnlistedCountriesHandler } from "../../../src/application/operations/world-rankings/TournamentsInUnlistedCountriesHandler.js";
import type { WorldRankingCountries } from "../../../src/application/services/WorldRankingCountries.js";
import { GamesOfTournamentHandler } from "../../../src/application/operations/tournaments/GamesOfTournamentHandler.js";
import { PublicPlayersOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicPlayersOfTournamentHandler.js";
import { PublicPlayerOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicPlayerOfTournamentHandler.js";
import { PublicBlockOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicBlockOfTournamentHandler.js";
import { PublicKnockoutOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicKnockoutOfTournamentHandler.js";
import { PublicRankingsOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicRankingsOfTournamentHandler.js";
import { PublicSwissOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicSwissOfTournamentHandler.js";
import { PublicGroupOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicGroupOfTournamentHandler.js";
import { PublicTeamSummaryOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicTeamSummaryOfTournamentHandler.js";
import { PublicTestOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicTestOfTournamentHandler.js";
import { StartCommentaryHandler } from "../../../src/application/operations/tournaments/StartCommentaryHandler.js";
import { StartCommentaryValidator } from "../../../src/application/operations/tournaments/StartCommentaryValidator.js";
import { ChangeCommentaryTitleHandler } from "../../../src/application/operations/tournaments/ChangeCommentaryTitleHandler.js";
import { ChangeCommentaryTitleValidator } from "../../../src/application/operations/tournaments/ChangeCommentaryTitleValidator.js";
import { AddManagerNoteHandler } from "../../../src/application/operations/tournaments/AddManagerNoteHandler.js";
import { AddManagerNoteValidator } from "../../../src/application/operations/tournaments/AddManagerNoteValidator.js";
import { DeleteManagerNoteHandler } from "../../../src/application/operations/tournaments/DeleteManagerNoteHandler.js";
import { EditManagerNoteHandler } from "../../../src/application/operations/tournaments/EditManagerNoteHandler.js";
import { EditManagerNoteValidator } from "../../../src/application/operations/tournaments/EditManagerNoteValidator.js";
import { ManagerNotesOfTournamentHandler } from "../../../src/application/operations/tournaments/ManagerNotesOfTournamentHandler.js";
import { PublicManagerNoteOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicManagerNoteOfTournamentHandler.js";
import { PublicManagerNotesOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicManagerNotesOfTournamentHandler.js";
import { AddCommentHandler } from "../../../src/application/operations/commentaries/AddCommentHandler.js";
import { AddCommentValidator } from "../../../src/application/operations/commentaries/AddCommentValidator.js";
import { EditCommentHandler } from "../../../src/application/operations/commentaries/EditCommentHandler.js";
import { EditCommentValidator } from "../../../src/application/operations/commentaries/EditCommentValidator.js";
import { DeleteCommentHandler } from "../../../src/application/operations/commentaries/DeleteCommentHandler.js";
import { PublicCommentariesOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicCommentariesOfTournamentHandler.js";
import { PublicCommentaryOfTournamentHandler } from "../../../src/application/operations/tournaments/PublicCommentaryOfTournamentHandler.js";
import { Commentary } from "../../../src/domain/aggregates/tournaments/commentaries/Commentary.js";
import { ManagerNote } from "../../../src/domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import { ManagerNotesByTournament } from "../../../src/infrastructure/read-models/ManagerNotesByTournament.js";
import { CommentariesByTournament } from "../../../src/infrastructure/read-models/CommentariesByTournament.js";
import { ManagerNoteToEditHandler } from "../../../src/application/operations/tournaments/ManagerNoteToEditHandler.js";
import type { TournamentsInHand } from "../../support/tournaments.js";
import type { SpecWorld } from "../../support/world.js";
import { accountsOf } from "./accounts.js";
import { standUpFor } from "./registering.js";
import { unitOfWorkOf } from "./transactions.js";
import { heldAfter } from "../../support/heldAtOnce.js";

const standUpTheTournaments = function (this: SpecWorld): void {
  standUpFor(this);
  const unitOfWork = unitOfWorkOf(this);
  const accounts = accountsOf(this);
  const byAddress = new TournamentsByAddress(unitOfWork);
  const byWebsite = new TournamentsByWebsite(unitOfWork);
  const bySearch = new SearchByWebsite(unitOfWork);
  const byNotes = new ManagerNotesByTournament(unitOfWork);
  const byCommentaries = new CommentariesByTournament(unitOfWork);
  const store = new ProjectingEventStore(accounts.store, [
    byAddress,
    byWebsite,
    bySearch,
    byNotes,
    byCommentaries,
  ]);
  // Wrapped rather than handed over as they are: a static passed on its own is
  // a method separated from what it was declared on.
  const tournaments = new AggregateRepository(store, (id, events) =>
    Tournament.rebuiltFrom(id, events),
  );
  const competitions = new AggregateRepository(store, (id, events) =>
    Competition.rebuiltFrom(id, events),
  );
  const commentaries = new AggregateRepository(store, (id, events) =>
    Commentary.rebuiltFrom(id, events),
  );
  const managerNotes = new AggregateRepository(store, (id, events) =>
    ManagerNote.rebuiltFrom(id, events),
  );
  const accountRepository = new AggregateRepository(
    accounts.store,
    (id, events) => Account.rebuiltFrom(id, events),
  );

  // Whether games have been played is asked of the games the competitions
  // keep, as the application asks it.
  const games = gamesKeptByCompetitions(tournaments, competitions);

  const mediator = new Mediator();
  const validation = new ValidationBehaviour();
  mediator.addCommandBehaviour(validation);
  mediator.addCommandBehaviour(new TransactionBehaviour(unitOfWork));
  // As the site asks them: checked, then in a transaction that writes nothing.
  mediator.addQueryBehaviour(validation);
  mediator.addQueryBehaviour(new ReadOnlyTransactionBehaviour(unitOfWork));
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
  validation.register(new AddTeamValidator());
  validation.register(new UpdateTeamValidator());
  validation.register(new MoveTeamValidator());
  validation.register(new AddTeamPlayerValidator());
  validation.register(new UpdateTeamPlayerValidator());
  validation.register(new MoveTeamPlayerValidator());
  validation.register(new AddTestValidator());
  validation.register(new UpdateTestValidator());
  validation.register(new StartCommentaryValidator());
  validation.register(new ChangeCommentaryTitleValidator());
  validation.register(new AddManagerNoteValidator());
  validation.register(new EditManagerNoteValidator());
  validation.register(new AddCommentValidator());
  validation.register(new EditCommentValidator());
  const both = [tournaments, accountRepository] as const;
  mediator.handleCommand(new CreateTournamentHandler(...both, byAddress));
  mediator.handleCommand(new UpdateTournamentHandler(...both, byAddress));
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
  mediator.handleCommand(new AddManagerHandler(...both, accounts.readModel));
  mediator.handleCommand(new AddScorerHandler(...both, accounts.readModel));
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
  // What is taken is read held, for the scenarios that ask two of these at
  // once.
  const takenHeld = heldAfter(this, byCommentaries, "taken");
  mediator.handleCommand(
    new StartCommentaryHandler(...both, commentaries, takenHeld),
  );
  mediator.handleCommand(
    new ChangeCommentaryTitleHandler(...both, commentaries, takenHeld),
  );
  mediator.handleCommand(
    new AddManagerNoteHandler(
      ...both,
      managerNotes,
      heldAfter(this, byNotes, "slugsTakenIn"),
    ),
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
  mediator.handleQuery(new ManagerNotesOfTournamentHandler(...both, byNotes));
  mediator.handleQuery(
    new PublicManagerNotesOfTournamentHandler(
      tournaments,
      byAddress,
      byNotes,
      byCommentaries,
    ),
  );
  mediator.handleQuery(
    new PublicManagerNoteOfTournamentHandler(
      tournaments,
      byAddress,
      managerNotes,
      byNotes,
      byCommentaries,
    ),
  );
  mediator.handleQuery(new RecentResultsHandler(byWebsite));
  mediator.handleQuery(new SearchHandler(bySearch));
  mediator.handleQuery(new PlayerOfWebsiteHandler(bySearch));
  mediator.handleQuery(new SearchPlayersOfWebsiteHandler(bySearch));
  mediator.handleQuery(new RepresentingMatchingHandler(bySearch));
  mediator.handleQuery(new UpcomingTournamentsHandler(byWebsite));
  mediator.handleQuery(new TournamentYearsHandler(byWebsite));
  mediator.handleQuery(new TournamentsInYearHandler(byWebsite));
  // The lists the scenario says name countries, read as they are when asked.
  const listedCountries = { ac: new Set<string>(), gc: new Set<string>() };
  const lists: WorldRankingCountries = {
    countriesOf: (sport) => listedCountries[sport],
  };
  mediator.handleQuery(
    new TournamentsInUnlistedCountriesHandler(
      accountRepository,
      byWebsite,
      lists,
    ),
  );
  mediator.handleQuery(
    new GamesOfTournamentHandler(
      tournaments,
      competitions,
      byAddress,
      byNotes,
      byCommentaries,
    ),
  );
  mediator.handleQuery(
    new PublicPlayersOfTournamentHandler(
      tournaments,
      byAddress,
      byNotes,
      byCommentaries,
    ),
  );
  mediator.handleQuery(
    new PublicPlayerOfTournamentHandler(
      tournaments,
      competitions,
      byAddress,
      byNotes,
      byCommentaries,
    ),
  );
  mediator.handleQuery(
    new PublicBlockOfTournamentHandler(
      tournaments,
      competitions,
      byAddress,
      byNotes,
      byCommentaries,
    ),
  );
  mediator.handleQuery(
    new PublicKnockoutOfTournamentHandler(
      tournaments,
      competitions,
      byAddress,
      byNotes,
      byCommentaries,
    ),
  );
  mediator.handleQuery(
    new PublicRankingsOfTournamentHandler(tournaments, competitions, byAddress),
  );
  mediator.handleQuery(
    new PublicSwissOfTournamentHandler(
      tournaments,
      competitions,
      byAddress,
      byNotes,
      byCommentaries,
    ),
  );
  mediator.handleQuery(
    new PublicTeamSummaryOfTournamentHandler(
      tournaments,
      competitions,
      byAddress,
      byNotes,
      byCommentaries,
    ),
  );
  mediator.handleQuery(
    new PublicGroupOfTournamentHandler(
      tournaments,
      competitions,
      byAddress,
      byNotes,
      byCommentaries,
    ),
  );
  mediator.handleQuery(
    new PublicTestOfTournamentHandler(
      tournaments,
      competitions,
      byAddress,
      byNotes,
      byCommentaries,
    ),
  );
  mediator.handleQuery(
    new PublicCommentariesOfTournamentHandler(
      tournaments,
      accountRepository,
      byAddress,
      byNotes,
      byCommentaries,
    ),
  );
  mediator.handleQuery(
    new PublicCommentaryOfTournamentHandler(
      tournaments,
      accountRepository,
      commentaries,
      byAddress,
      byNotes,
      byCommentaries,
    ),
  );

  const inHand: TournamentsInHand = {
    send: (command) => mediator.send(command),
    ask: (query) => mediator.query(query),
    load: (id) => this.asARequest(() => tournaments.load(id)),
    listedCountries,
    loadManagerNote: (id) => this.asARequest(() => managerNotes.load(id)),
    saveManagerNote: (note) => this.asARequest(() => managerNotes.save(note)),
    managerNotesOf: (id) => this.asARequest(() => byNotes.of(id)),
    commentariesOf: (id) => this.asARequest(() => byCommentaries.listed(id)),
    loadCompetition: (id) => this.asARequest(() => competitions.load(id)),
    loadCommentary: (id) => this.asARequest(() => commentaries.load(id)),
    eventsOf: (id) => this.asARequest(() => accounts.store.getEvents(id)),
    kept: async () => {
      const { rows } = await this.asARequest(() =>
        unitOfWork.connection().query<{ kept: string }>(
          `select count(distinct stream_id) as kept from events
              where stream_id like 'tournament/%'`,
        ),
      );
      return Number(rows[0]?.kept ?? 0);
    },
    games,
    // Through registering, which makes every account the scenario said there
    // was the first time one is asked for, so that whatever the request finds
    // is there.
    accountFor: async (address) => {
      assert.ok(this.registering !== undefined, "Registering is not stood up.");
      return (await this.registering.accountFor(address))?.id;
    },
    now: () => {
      assert.ok(this.moment !== undefined, "No moment has been named.");
      return ReadOnlyDate.from(this.moment);
    },
  };
  this.tournamentsInHand = inHand;
};

Given("the application's tournaments", standUpTheTournaments);

// What the player dialog asks as the field for what a player represents is
// typed (RepresentingMatching.feature): the same application, since what is
// found is found among the players the tournaments keep.
Given(
  "the application's finding of what players represent",
  standUpTheTournaments,
);
