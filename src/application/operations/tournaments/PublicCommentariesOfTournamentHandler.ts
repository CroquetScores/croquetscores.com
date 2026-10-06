import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
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
    // From the read model of its commentaries, which reads no comment.
    const listed = await this.changes.listed(tournament.id);
    // A forgotten writer has no name to be read, and namesOf leaves them out,
    // which is what leaves their commentaries out.
    const writers = new Map(
      (
        await namesOf(
          this.accounts,
          listed.map(({ writer }) => AccountId.from(writer)),
        )
      ).map(({ id, name }) => [id.value, name]),
    );
    const changed = await this.changes.of(tournament.id);
    return {
      id: tournament.id.value,
      name: tournament.name.toString(),
      subtitle: tournament.subtitle?.markdown,
      commentariesChanged: changed,
      managerNotes: await managerNotesChangedOf(this.notes, tournament),
      address,
      playedByTeams: tournament.format.isTeamFormat,
      competitions: competitionsInUse(tournament),
      commentaries: listed.flatMap((commentary) => {
        const writer = writers.get(commentary.writer);
        return writer === undefined
          ? []
          : [
              {
                id: commentary.id,
                title: commentary.title,
                writer,
                address: `${address}/commentaries/${commentary.slug}`,
                changedAt: commentary.changedAt,
              },
            ];
      }),
    };
  }
}
