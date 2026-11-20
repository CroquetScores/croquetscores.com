import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  PublicCommentariesOfTournament,
  type TournamentCommentariesToRead,
} from "./PublicCommentariesOfTournament.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import {
  managerNotesChangedFor,
  tournamentOfPage,
  formatOfPage,
} from "./tournamentOfPage.js";
import { namesOf, type TournamentAddresses } from "./tournamentOperations.js";
import type { TournamentPages } from "./tournamentPages.js";

export class PublicCommentariesOfTournamentHandler extends QueryHandler<
  PublicCommentariesOfTournament,
  TournamentCommentariesToRead
> {
  readonly handles: RequestType<PublicCommentariesOfTournament> =
    PublicCommentariesOfTournament;

  constructor(
    // The only aggregates it loads, for the names of the commentaries'
    // writers, which no read model keeps.
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(
    query: PublicCommentariesOfTournament,
  ): Promise<TournamentCommentariesToRead> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicCommentariesOfTournament",
    );
    const id = TournamentId.from(tournament.id);
    const address = tournament.address;
    // From the read model of its commentaries, which reads no comment.
    const listed = await this.changes.listed(id);
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
    const changed = await this.changes.of(id);
    return {
      id: tournament.id,
      name: tournament.name,
      subtitle: tournament.subtitle,
      commentariesChanged: changed,
      managerNotes: await managerNotesChangedFor(this.notes, tournament),
      address,
      playedByTeams: formatOfPage(tournament).isTeamFormat,
      competitions: tournament.competitions,
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
