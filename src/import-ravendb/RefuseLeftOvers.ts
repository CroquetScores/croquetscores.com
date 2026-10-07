import type { ImportDatabase } from "./ImportDatabase.js";
import { isArchived } from "./ImportWholeTournaments.js";
import { ImportRefused } from "./ImportRefused.js";
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
 * tournament has been read, and refuses each one whose tournament was never
 * read (RefuseLeftOvers.feature). A tournament brings over what names it
 * (ImportWholeTournaments.feature), so a document naming one the old site no
 * longer had is reached by nothing else, and an import keeping no errors
 * could otherwise have left it behind without anyone reading it.
 *
 * An archived document is passed over wherever it points, since the old
 * sites archived it to be rid of it.
 */
export class RefuseLeftOvers implements Importer<NamingATournament> {
  constructor(
    readonly collection: string,
    private readonly database: ImportDatabase,
  ) {}

  async importDocument({
    website,
    document,
  }: ReadDocument<NamingATournament>): Promise<void> {
    if (isArchived(document)) return;
    const tournament = document.Tournament.Id;
    if (await this.database.wasTournamentRead(website, tournament)) return;
    throw new ImportRefused(
      "RefuseLeftOvers.NoTournament",
      `The tournament ${tournament} it names was not there to bring it over.`,
    );
  }
}
