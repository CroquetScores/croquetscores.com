import type { ImportDatabase } from "./ImportDatabase.js";
import { isArchived } from "./ImportWholeTournaments.js";
import { ImportRefused } from "./ImportRefused.js";
import type { AcceptedImportErrors } from "./AcceptedImportErrors.js";
import type { Reference } from "./ravendb-models/Tournament.js";
import type { Importer, ReadDocument } from "./runImporter.js";

/** Whatever names a tournament, as far as finding it a tournament reads it. */
export interface NamingATournament {
  readonly Tournament: Reference;
  /** Left out of a document of the tournament's players, which is never archived. */
  readonly IsArchived?: boolean;
}

/**
 * Reads a collection of documents that name a tournament, once every
 * tournament has been read, and finds each one whose tournament was never
 * read (RefuseLeftOvers.feature). A tournament brings over what names it
 * (ImportWholeTournaments.feature), so a document naming one the old site no
 * longer had is reached by nothing else, and could otherwise have been left
 * behind without anyone reading it.
 *
 * One naming a tournament the old site no longer had is said as corrected,
 * with the tournament it names, since nothing in it could be put right. It
 * is no error, and is not brought over, so it has no page on the new site.
 * One naming a tournament
 * that was there but was not read, which has an error kept against it, as
 * one the old site could not be asked about, is refused, and so kept as an
 * error, since the tournament could be read another time.
 *
 * An archived document is passed over wherever it points, since the old
 * sites archived it to be rid of it.
 */
export class RefuseLeftOvers implements Importer<NamingATournament> {
  constructor(
    readonly collection: string,
    private readonly database: ImportDatabase,
    /** Where what the import corrected is said (ImportFiles.feature). */
    private readonly correcting: AcceptedImportErrors,
  ) {}

  async importDocument({
    website,
    id,
    document,
  }: ReadDocument<NamingATournament>): Promise<void> {
    if (isArchived(document)) return;
    const tournament = document.Tournament.Id;
    if (await this.database.wasTournamentRead(website, tournament)) return;
    if (await this.database.hasErrorsFor(`${website}/${tournament}`)) {
      throw new ImportRefused(
        "RefuseLeftOvers.TournamentNotRead",
        `The tournament ${tournament} it names was there, but was not read.`,
      );
    }
    await this.correcting.accept({
      documentId: `${website}/${id}`,
      website,
      newSitePath: undefined,
      // The tournament is gone, and nothing says where the document was.
      oldSitePath: "",
      what: tournament,
      code: "RefuseLeftOvers.TournamentMissing",
      description: `This ${this.collection} document names the tournament ${tournament}, which the old site no longer had, so it was not brought over.`,
    });
  }
}
