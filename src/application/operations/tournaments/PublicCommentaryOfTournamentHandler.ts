import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { Commentaries } from "../commentaries/commentaryOperations.js";
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
    const found =
      tournament.commentaries.find(
        ({ slug }) => slug.toString() === query.slug,
      ) ?? noSuchCommentary();
    // A forgotten writer has no name to be read, and every word of the
    // commentary is theirs, so it is not one a reader is shown.
    const [writer] = await namesOf(this.accounts, [found.writer]);
    if (writer === undefined) return noSuchCommentary();
    const commentary =
      (await this.commentaries.load(found.id)) ?? noSuchCommentary();
    const address = tournament.address.toString();
    return {
      name: tournament.name.toString(),
      notes: tournament.notes?.markdown,
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
