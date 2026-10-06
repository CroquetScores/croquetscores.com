import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  PublicCommentariesOfTournament,
  type TournamentCommentariesToRead,
} from "./PublicCommentariesOfTournament.js";
import {
  competitionsInUse,
  tournamentForReaders,
  managerNotesChangedOf,
  type TournamentCommentaries,
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
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
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
    // From the read model of its commentaries, which reads no comment.
    const changed = await this.changes.of(tournament.id);
    const changedAt = new Map(
      changed.map(({ id, changedAt }) => [id, changedAt]),
    );
    return {
      id: tournament.id.value,
      name: tournament.name.toString(),
      notes: tournament.notes?.markdown,
      commentariesChanged: changed,
      managerNotes: await managerNotesChangedOf(this.notes, tournament),
      address,
      playedByTeams: tournament.format.isTeamFormat,
      competitions: competitionsInUse(tournament),
      commentaries: tournament.commentaries
        .flatMap((commentary) => {
          const writer = writers.get(commentary.writer.value);
          const at = changedAt.get(commentary.id.value);
          return writer === undefined || at === undefined
            ? []
            : [
                {
                  id: commentary.id.value,
                  title: commentary.title.toString(),
                  writer,
                  address: `${address}/commentaries/${commentary.slug.toString()}`,
                  changedAt: at,
                },
              ];
        })
        // The tournament keeps them in the order they were started.
        .reverse(),
    };
  }
}
