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
import { errorOf } from "./AcceptedImportErrors.js";
import { describedFailure } from "./ImportRefused.js";
import { tournamentBecome } from "./ImportTournamentPlayers.js";
import { numberedApartWithin, shortenedTo } from "./names.js";
import { momentOf } from "./newtonsoft.js";
import type { Commentary as OldCommentary } from "./ravendb-models/Commentary.js";
import type { Importer, ReadDocument } from "./runImporter.js";

/**
 * Brings the old sites' commentaries over as commentaries of the tournaments
 * they were on, started by the accounts their writers became, with their
 * comments in the order they were written (ImportCommentaries.feature).
 *
 * A comment the site refuses is kept as an error naming it, and the rest are
 * added all the same. What the old sites archived is left behind. The
 * tournament, the commentary, and
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
      );

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

      // The old sites let a title run longer than the site does, and did not
      // tell a tournament's commentaries apart by their titles, as the site
      // does in any case. So a title too long is shortened, and one another
      // commentary has is numbered apart, shortened to leave room for its
      // number, and either is kept whole as the first comment, so that
      // nothing its writer wrote is lost. Asked of the title as the site
      // would take it first, so that one it refuses for anything but its
      // length is refused for that.
      const whole = document.Title.trim();
      const most = CommentaryTitle.mostCharacters;
      CommentaryTitle.from(shortenedTo(whole, most));
      const taken = await this.listed.taken(tournament.id);
      const title = CommentaryTitle.from(
        numberedApartWithin(whole, taken.titles, most),
      );
      // Shortened, whether for its length or for its number's.
      const shortened = !title.toString().startsWith(whole);
      tournament.allowWritingCommentary();
      const commentary = Commentary.start(
        CommentaryId.create(),
        tournament.id,
        title,
        taken,
        writer,
        at,
      );

      // Written by its writer when the commentary was started, before every
      // comment the old site kept.
      if (shortened) {
        commentary.addComment(
          CommentId.create(),
          CommentText.from(whole),
          writer,
          at,
        );
      }

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
            errorOf(tournament),
          );
        }
      }

      await this.commentaries.save(commentary);
    });
  }
}
