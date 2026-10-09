import { appendFile, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Where the documents that name a tournament the old site no longer had are
 * said, rather than kept as errors (RefuseLeftOvers.feature): there is
 * nothing in the document anyone could put right, and nothing for the import
 * to bring it over into.
 */
export interface MissingTournaments {
  /**
   * Says that `documentId`, which names its website too, names the tournament
   * `tournamentId`, which was not there.
   */
  missing(tournamentId: string, documentId: string): Promise<void>;
}

/**
 * Says the documents that name a missing tournament in a Markdown file, a
 * line each, as "tournaments/67856 croquetscores.com/TournamentPlayers/68718"
 * (MissingTournaments.feature). The import begins by emptying it, so that it
 * says only what the last import found, and writes each as it is found.
 */
export class MissingTournamentsFile implements MissingTournaments {
  constructor(private readonly path: string) {}

  /** Deletes what the last import said, and begins the file again. */
  async begin(): Promise<void> {
    await rm(this.path, { force: true });
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(
      this.path,
      "# Missing Tournaments\n\n" +
        "The following is the list of RavenDb documents that reference a " +
        "tournament document that does not exist.\n\n",
    );
  }

  async missing(tournamentId: string, documentId: string): Promise<void> {
    await appendFile(this.path, `${tournamentId} ${documentId}\n`);
  }
}
