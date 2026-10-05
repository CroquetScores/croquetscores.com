import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import { Commentary } from "../domain/aggregates/tournaments/commentaries/Commentary.js";
import { CommentId } from "../domain/aggregates/tournaments/commentaries/primitives/CommentId.js";
import { CommentText } from "../domain/aggregates/tournaments/commentaries/value-objects/CommentText.js";
import { CommentaryId } from "../domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { TournamentId } from "../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { CommentaryTitle } from "../domain/aggregates/tournaments/value-objects/CommentaryTitle.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import type { ImportDatabase } from "./ImportDatabase.js";
import type { ImportedAccounts } from "./ImportedAccounts.js";
import { describedFailure } from "./ImportRefused.js";
import { tournamentBecome } from "./ImportTournamentPlayers.js";
import { numberedApart } from "./names.js";
import { momentOf } from "./newtonsoft.js";
import type { Commentary as OldCommentary } from "./ravendb-models/Commentary.js";
import type { Importer, ReadDocument } from "./runImporter.js";

/**
 * Brings the old sites' commentaries over as commentaries of the tournaments
 * they were on, started by the accounts their writers became, with their
 * comments in the order they were written (ImportCommentaries.feature).
 *
 * A comment the site refuses is kept as an error naming it, and the rest are
 * added all the same. What the old sites archived is left behind, as is a
 * commentary of a tournament left behind. The tournament, the commentary, and
 * any forgotten account made for its writer are kept in one transaction.
 */
export class ImportCommentaries implements Importer<OldCommentary> {
  readonly collection = "Commentaries";

  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly commentaries: AggregateRepository<
      Commentary,
      CommentaryId
    >,
    private readonly accounts: ImportedAccounts,
    private readonly database: ImportDatabase,
  ) {}

  async importDocument({
    website,
    id,
    document,
  }: ReadDocument<OldCommentary>): Promise<void> {
    if (document.IsArchived) return;

    await this.unitOfWork.inTransaction(async () => {
      const tournament = await tournamentBecome(
        this.database,
        this.tournaments,
        website,
        document.Tournament.Id,
        "ImportCommentaries.NoTournament",
      );
      if (tournament === undefined) return;

      const comments = document.Comments.filter(
        (comment) => !comment.IsArchived,
      );
      // The old sites kept no moment a commentary was started at, so it was
      // started when its first comment was written, or when its tournament
      // was where it has none.
      const [first] = comments;
      const at =
        first === undefined ? tournament.starts : momentOf(first.CreatedAt);
      const writer = await this.accounts.accountOf(
        website,
        document.Commentator.Id,
        at,
      );

      // The site tells a tournament's commentaries apart by their titles, in
      // any case, and the old sites did not.
      const title = CommentaryTitle.from(
        numberedApart(
          CommentaryTitle.from(document.Title).toString(),
          tournament.commentaries.map((each) => each.title.toString()),
        ),
      );
      const commentaryId = CommentaryId.create();
      tournament.startCommentary(commentaryId, title, writer, at);
      const commentary = Commentary.start(commentaryId, writer, at);

      // Numbered from 1 among those not archived, as the error names them.
      for (const [index, comment] of comments.entries()) {
        try {
          commentary.addComment(
            CommentId.create(),
            CommentText.from(comment.Content),
            writer,
            momentOf(comment.CreatedAt),
          );
        } catch (failure) {
          await this.database.recordError(
            `${website}/${id}`,
            `comment ${String(index + 1)}: ${describedFailure(failure)}`,
          );
        }
      }

      await this.tournaments.save(tournament);
      await this.commentaries.save(commentary);
    });
  }
}
