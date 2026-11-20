import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  PublicCommentaryOfTournament,
  type TournamentCommentaryToRead,
} from "./PublicCommentaryOfTournament.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import {
  managerNotesChangedFor,
  tournamentOfPage,
  formatOfPage,
} from "./tournamentOfPage.js";
import {
  namesOf,
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";
import type { TournamentPages } from "./tournamentPages.js";

export class PublicCommentaryOfTournamentHandler extends QueryHandler<
  PublicCommentaryOfTournament,
  TournamentCommentaryToRead
> {
  readonly handles: RequestType<PublicCommentaryOfTournament> =
    PublicCommentaryOfTournament;

  constructor(
    // The only aggregates it loads, for the name of the commentary's writer,
    // which no read model keeps.
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(
    query: PublicCommentaryOfTournament,
  ): Promise<TournamentCommentaryToRead> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicCommentaryOfTournament",
    );
    const id = TournamentId.from(tournament.id);
    const noSuchCommentary = (): never => {
      throw new TournamentOperationRefused(
        "PublicCommentaryOfTournament.NoSuchCommentary",
        "There is no such commentary.",
      );
    };
    // Found at its slug and read with its comments from the read model of the
    // tournament's commentaries.
    const commentary =
      (await this.changes.read(id, query.slug)) ?? noSuchCommentary();
    // A forgotten writer has no name to be read, and every word of the
    // commentary is theirs, so it is not one a reader is shown.
    const [writer] = await namesOf(this.accounts, [
      AccountId.from(commentary.writer),
    ]);
    if (writer === undefined) return noSuchCommentary();
    const address = tournament.address;
    return {
      name: tournament.name,
      subtitle: tournament.subtitle,
      commentariesChanged: await this.changes.of(id),
      managerNotes: await managerNotesChangedFor(this.notes, tournament),
      address,
      playedByTeams: formatOfPage(tournament).isTeamFormat,
      competitions: tournament.competitions,
      commentary: {
        id: commentary.id,
        tournament: tournament.id,
        title: commentary.title,
        writer: writer.name,
        address: `${address}/commentaries/${commentary.slug}`,
        writtenByReader: query.account === commentary.writer,
        comments: commentary.comments.map((comment) => ({
          id: comment.id,
          text: comment.text,
          writtenAt: comment.writtenAt.toISOString(),
          lastEditedAt: comment.lastEditedAt?.toISOString(),
        })),
      },
    };
  }
}
