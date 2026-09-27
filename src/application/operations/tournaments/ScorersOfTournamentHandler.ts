import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import {
  type Tournament,
  TournamentRefused,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  type ListedScorer,
  ScorersOfTournament,
} from "./ScorersOfTournament.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";

export class ScorersOfTournamentHandler extends QueryHandler<
  ScorersOfTournament,
  readonly ListedScorer[]
> {
  readonly handles: RequestType<ScorersOfTournament> = ScorersOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: ScorersOfTournament): Promise<readonly ListedScorer[]> {
    // In the order a command asks, so that a list refuses as changing the
    // tournament would: who is asking, then which tournament, then whether
    // they manage it.
    const by = await askedBy(this.accounts, query.account);
    const tournament = await tournamentFor(
      this.tournaments,
      query.tournament,
      "ScorersOfTournament",
    );
    if (!tournament.manages(by)) {
      throw new TournamentRefused(
        "Tournament.NotAManager",
        "Only a manager of the tournament can list its scorers.",
      );
    }
    const listed: ListedScorer[] = [];
    for (const scorer of tournament.scorers) {
      const account = await this.accounts.load(scorer);
      // A forgotten account has no name to read, and is left out whatever
      // else it is.
      const name = account?.forgotten === false ? account.name : undefined;
      if (name !== undefined) {
        listed.push({ id: scorer.value, name: name.toString() });
      }
    }
    return listed;
  }
}
