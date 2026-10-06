import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { Commentaries } from "../commentaries/commentaryOperations.js";
import { CommentaryId } from "../../../domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  PublicCommentaryOfTournament,
  type TournamentCommentaryToRead,
} from "./PublicCommentaryOfTournament.js";
import {
  competitionsInUse,
  tournamentForReaders,
  managerNotesChangedOf,
  type TournamentCommentaries,
} from "./tournamentForReaders.js";
import {
  namesOf,
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

export class PublicCommentaryOfTournamentHandler extends QueryHandler<
  PublicCommentaryOfTournament,
  TournamentCommentaryToRead
> {
  readonly handles: RequestType<PublicCommentaryOfTournament> =
    PublicCommentaryOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly commentaries: Commentaries,
    private readonly addresses: TournamentAddresses,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(
    query: PublicCommentaryOfTournament,
  ): Promise<TournamentCommentaryToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicCommentaryOfTournament",
    );
    const noSuchCommentary = (): never => {
      throw new TournamentOperationRefused(
        "PublicCommentaryOfTournament.NoSuchCommentary",
        "There is no such commentary.",
      );
    };
    // Found at its slug by the read model of the tournament's commentaries,
    // and read from its own stream.
    const id = await this.changes.at(tournament.id, query.slug);
    const found =
      (id === undefined
        ? undefined
        : await this.commentaries.load(CommentaryId.from(id))) ??
      noSuchCommentary();
    // A forgotten writer has no name to be read, and every word of the
    // commentary is theirs, so it is not one a reader is shown.
    const [writer] = await namesOf(this.accounts, [found.writer]);
    if (writer === undefined) return noSuchCommentary();
    const commentary = found;
    const address = tournament.address.toString();
    return {
      name: tournament.name.toString(),
      subtitle: tournament.subtitle?.markdown,
      commentariesChanged: await this.changes.of(tournament.id),
      managerNotes: await managerNotesChangedOf(this.notes, tournament),
      address,
      playedByTeams: tournament.format.isTeamFormat,
      competitions: competitionsInUse(tournament),
      commentary: {
        id: found.id.value,
        tournament: tournament.id.value,
        title: found.title.toString(),
        writer: writer.name,
        address: `${address}/commentaries/${found.slug.toString()}`,
        writtenByReader: query.account === found.writer.value,
        comments: commentary.comments.map((comment) => ({
          id: comment.id.value,
          text: comment.text.toString(),
          writtenAt: comment.writtenAt.toISOString(),
          lastEditedAt: comment.lastEditedAt?.toISOString(),
        })),
      },
    };
  }
}
