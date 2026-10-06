import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import type { TournamentCommentaries } from "../application/operations/tournaments/tournamentForReaders.js";
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
 * any forgotten account made for its writer are kept in one transaction. The
 * titles and slugs the tournament's other commentaries have are asked of the
 * read model of them, as starting one on the site asks.
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
    private readonly listed: TournamentCommentaries,
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
      const taken = await this.listed.taken(tournament.id);
      const title = CommentaryTitle.from(
        numberedApart(
          CommentaryTitle.from(document.Title).toString(),
          taken.titles,
        ),
      );
      tournament.allowWritingCommentary();
      const commentary = Commentary.start(
        CommentaryId.create(),
        tournament.id,
        title,
        taken,
        writer,
        at,
      );

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

      await this.commentaries.save(commentary);
    });
  }
}
