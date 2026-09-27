// What stands behind "the application's tournaments": every operation on a
// tournament, over the event store the accounts support keeps and the
// tournaments by address read model kept in step with it, behind a mediator
// with the behaviours the application gives a command — validation, then a
// transaction — and a query, whose transaction writes nothing. The accounts the operations are asked by are stood up the way
// registering stands them up, since that is what the scenarios make them with.
//
// Here rather than beside the features because the features are the
// application's, and an application spec may name nothing from
// infrastructure. It puts a plain shape on the world (specs/support/
// tournaments.ts) and the steps ask only that.
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
import { ManagersOfTournamentHandler } from "../../../src/application/operations/tournaments/ManagersOfTournamentHandler.js";
import { PlayersOfTournamentHandler } from "../../../src/application/operations/tournaments/PlayersOfTournamentHandler.js";
import { RemoveScorerHandler } from "../../../src/application/operations/tournaments/RemoveScorerHandler.js";
import { ScorersOfTournamentHandler } from "../../../src/application/operations/tournaments/ScorersOfTournamentHandler.js";
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
import type { Games } from "../../../src/application/services/Games.js";
import { Account } from "../../../src/domain/aggregates/accounts/Account.js";
import { Tournament } from "../../../src/domain/aggregates/tournaments/Tournament.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import { ReadOnlyTransactionBehaviour } from "../../../src/infrastructure/database/ReadOnlyTransactionBehaviour.js";
import { TransactionBehaviour } from "../../../src/infrastructure/database/TransactionBehaviour.js";
import { TournamentsByAddress } from "../../../src/infrastructure/read-models/TournamentsByAddress.js";
import type { TournamentsInHand } from "../../support/tournaments.js";
import type { SpecWorld } from "../../support/world.js";
import { accountsOf } from "./accounts.js";
import { standUpFor } from "./registering.js";
import { unitOfWorkOf } from "./transactions.js";

Given("the application's tournaments", function (this: SpecWorld) {
  standUpFor(this);
  const unitOfWork = unitOfWorkOf(this);
  const accounts = accountsOf(this);
  const byAddress = new TournamentsByAddress(unitOfWork);
  const store = new ProjectingEventStore(accounts.store, [byAddress]);
  // Wrapped rather than handed over as they are: a static passed on its own is
  // a method separated from what it was declared on.
  const tournaments = new AggregateRepository(store, (id, events) =>
    Tournament.rebuiltFrom(id, events),
  );
  const accountRepository = new AggregateRepository(
    accounts.store,
    (id, events) => Account.rebuiltFrom(id, events),
  );

  // The games say what the scenario says has been played, and nothing else,
  // which is what the application's own games say while nothing has been.
  const said = {
    playersWhoHavePlayed: new Set<string>(),
    knockoutsWhoseChangeMovesAPlayer: new Set<string>(),
  };
  const games: Games = {
    hasPlayed: (_tournament, player) =>
      Promise.resolve(said.playersWhoHavePlayed.has(player.value)),
    movesAPlayerWhoHasPlayed: (_tournament, competition) =>
      Promise.resolve(
        said.knockoutsWhoseChangeMovesAPlayer.has(competition.value),
      ),
  };

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
  validation.register(new AddBlockValidator());
  validation.register(new UpdateBlockValidator());
  validation.register(new AddKnockoutValidator());
  validation.register(new UpdateKnockoutValidator());
  validation.register(new AddSwissValidator());
  validation.register(new UpdateSwissValidator());
  validation.register(new AddManagerValidator());
  validation.register(new AddScorerValidator());
  const both = [tournaments, accountRepository] as const;
  mediator.handleCommand(new CreateTournamentHandler(...both, byAddress));
  mediator.handleCommand(new UpdateTournamentHandler(...both, byAddress));
  mediator.handleCommand(new ArchiveTournamentHandler(...both));
  mediator.handleCommand(new RestoreTournamentHandler(...both));
  mediator.handleCommand(new AddPlayerHandler(...both));
  mediator.handleCommand(new UpdatePlayerHandler(...both));
  mediator.handleCommand(new ArchivePlayerHandler(...both, games));
  mediator.handleCommand(new RestorePlayerHandler(...both));
  mediator.handleCommand(new AddBlockHandler(...both));
  mediator.handleCommand(new UpdateBlockHandler(...both));
  mediator.handleCommand(new AddKnockoutHandler(...both));
  mediator.handleCommand(new UpdateKnockoutHandler(...both, games));
  mediator.handleCommand(new AddSwissHandler(...both));
  mediator.handleCommand(new UpdateSwissHandler(...both));
  mediator.handleCommand(new ArchiveCompetitionHandler(...both));
  mediator.handleCommand(new RestoreCompetitionHandler(...both));
  mediator.handleCommand(new AddManagerHandler(...both, accounts.readModel));
  mediator.handleCommand(new AddScorerHandler(...both, accounts.readModel));
  mediator.handleCommand(new RemoveManagerHandler(...both));
  mediator.handleCommand(new RemoveScorerHandler(...both));
  mediator.handleQuery(new ManagersOfTournamentHandler(...both));
  mediator.handleQuery(new PlayersOfTournamentHandler(...both, games));
  mediator.handleQuery(new ScorersOfTournamentHandler(...both));

  const inHand: TournamentsInHand = {
    send: (command) => mediator.send(command),
    ask: (query) => mediator.query(query),
    load: (id) => this.asARequest(() => tournaments.load(id)),
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
    games: said,
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
});
