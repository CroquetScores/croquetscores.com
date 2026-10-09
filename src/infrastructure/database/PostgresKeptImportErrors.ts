// The errors the import kept, read from the table it writes them to
// (ImportErrorsKept.feature, ImportErrorKept.feature).
import type {
  KeptImportError,
  KeptImportErrorTournament,
  KeptImportErrors,
} from "../../application/services/KeptImportErrors.js";
import type { UnitOfWork } from "./UnitOfWork.js";

export class PostgresKeptImportErrors implements KeptImportErrors {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  // The first line is cut in Postgres so that a list of them does not carry
  // every message whole, which run to many lines. A carriage return is taken
  // out first, so that a message written with Windows line endings has the
  // same first line as one written without.
  async list(): Promise<readonly KeptImportError[]> {
    const { rows } = await this.unitOfWork.connection().query<{
      document_id: string;
      first_line: string;
    }>(
      `select document_id,
              split_part(replace(error_message, E'\\r', ''), E'\\n', 1)
                as first_line
         from import_errors
        order by first_line, document_id, kept`,
    );
    return rows.map((row) => ({
      documentId: row.document_id,
      firstLine: row.first_line,
    }));
  }

  async messagesOf(documentId: string): Promise<readonly string[]> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ error_message: string }>(
        "select error_message from import_errors where document_id = $1 order by kept",
        [documentId],
      );
    return rows.map((row) => row.error_message);
  }

  // The website is the document id's first part, which the import writes it
  // as.
  async tournamentOf(
    documentId: string,
  ): Promise<KeptImportErrorTournament | undefined> {
    const { rows } = await this.unitOfWork.connection().query<{
      tournament_address: string;
      tournament_name: string;
      competition_name: string | null;
      new_site_path: string | null;
      old_site_path: string | null;
    }>(
      `select tournament_address, tournament_name, competition_name,
              new_site_path, old_site_path
         from import_errors
        where document_id = $1 and tournament_address is not null
        order by kept desc
        limit 1`,
      [documentId],
    );
    const row = rows[0];
    if (row === undefined) return undefined;
    return {
      website: documentId.split("/")[0] ?? "",
      address: row.tournament_address,
      name: row.tournament_name,
      competitionName: row.competition_name ?? undefined,
      // The tournament's page, where an error was kept before the paths were.
      newSitePath: row.new_site_path ?? row.tournament_address,
      oldSitePath: row.old_site_path ?? row.tournament_address,
    };
  }
}
