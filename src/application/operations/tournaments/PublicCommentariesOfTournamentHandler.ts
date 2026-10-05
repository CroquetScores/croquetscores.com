import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  PublicCommentariesOfTournament,
  type TournamentCommentariesToRead,
} from "./PublicCommentariesOfTournament.js";
import {
  competitionsInUse,
  tournamentForReaders,
} from "./tournamentForReaders.js";
import { namesOf, type TournamentAddresses } from "./tournamentOperations.js";

export class PublicCommentariesOfTournamentHandler extends QueryHandler<
  PublicCommentariesOfTournament,
  TournamentCommentariesToRead
> {
  readonly handles: RequestType<PublicCommentariesOfTournament> =
    PublicCommentariesOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly addresses: TournamentAddresses,
  ) {
    super();
  }

  async handle(
    query: PublicCommentariesOfTournament,
  ): Promise<TournamentCommentariesToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicCommentariesOfTournament",
    );
    const address = tournament.address.toString();
    // A forgotten writer has no name to be read, and namesOf leaves them out,
    // which is what leaves their commentaries out.
    const writers = new Map(
      (
        await namesOf(
          this.accounts,
          tournament.commentaries.map(({ writer }) => writer),
        )
      ).map(({ id, name }) => [id.value, name]),
    );
    return {
      id: tournament.id.value,
      name: tournament.name.toString(),
      address,
      playedByTeams: tournament.format.isTeamFormat,
      competitions: competitionsInUse(tournament),
      commentaries: tournament.commentaries
        .flatMap((commentary) => {
          const writer = writers.get(commentary.writer.value);
          return writer === undefined
            ? []
            : [
                {
                  id: commentary.id.value,
                  title: commentary.title.toString(),
                  writer,
                  address: `${address}/commentaries/${commentary.slug.toString()}`,
                },
              ];
        })
        // The tournament keeps them in the order they were started.
        .reverse(),
    };
  }
}
