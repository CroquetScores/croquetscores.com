import {
  AN_UPDATE_EVERY,
  commas,
  failureSaid,
  minutesLeftSaid,
  type Rebuilding,
  streamsSaid,
  tookSaid,
} from "./rebuildReadModelsCli.js";

export interface RebuildBackupReadModelsOutcome {
  readonly exitCode: 0 | 1;
}

/** What the script is given of the world it runs in. */
export interface RebuildBackupReadModelsWorld {
  readonly now: () => Date;
  /** Says a line. */
  readonly say: (line: string) => void;
}

/**
 * The script's work (rebuildBackupReadModelsCli.feature): makes the read
 * models of the backup database again from every event kept there, saying how
 * far it has got, and how long it took.
 *
 * It does not turn database access off, as the rebuild of the site's own
 * read models does (rebuildReadModelsCli.feature). That switch is the site's,
 * and nothing serves readers from the backup database, so turning it off
 * would only put a site that is running on this computer into maintenance for
 * a rebuild that is no concern of its.
 *
 * `backupDatabase` is what the setting says, and is only needed to say whether
 * there is one: `rebuilding` is already of it.
 */
export const runRebuildBackupReadModels = async (
  args: readonly string[],
  backupDatabase: string | undefined,
  rebuilding: Rebuilding,
  world: RebuildBackupReadModelsWorld,
): Promise<RebuildBackupReadModelsOutcome> => {
  const { now, say } = world;
  const refuse = (line: string): RebuildBackupReadModelsOutcome => {
    say(line);
    return { exitCode: 1 };
  };

  // Nothing to say how long it is expected to take to, since nobody is told:
  // an argument would be taken for something it is not.
  if (args.length > 0) {
    return refuse("Usage: db:rebuild-backup-read-models");
  }
  if (backupDatabase === undefined || backupDatabase.trim() === "") {
    return refuse("The backup database is needed: BACKUP_DATABASE_URL.");
  }

  say("Making the read models of the backup database again.");
  let total = 0;
  let began = now().getTime();
  let lastUpdate = began;
  try {
    const events = await rebuilding.rebuild({
      streams: (count) => {
        total = count;
        say(
          `There ${count === 1 ? "is" : "are"} ${streamsSaid(count)} in the event store.`,
        );
        began = now().getTime();
        lastUpdate = began;
      },
      streamDone: (completed) => {
        // Not when everything is done: the next line says how long it took.
        if (completed >= total) return;
        const at = now().getTime();
        if (at - lastUpdate < AN_UPDATE_EVERY) return;
        lastUpdate = at;
        const left = ((at - began) / completed) * (total - completed);
        say(
          `${commas(completed)} of ${commas(total)} streams completed, approximately ${minutesLeftSaid(left)} minutes to complete.`,
        );
      },
    });
    const took = now().getTime() - began;
    say(`Every read model is made again from ${commas(events)} events.`);
    say(`The rebuild took ${tookSaid(took)}.`);
  } catch (failure) {
    // One transaction, so every read model is as it was.
    say(`The rebuild failed: ${failureSaid(failure)}`);
    return { exitCode: 1 };
  }
  return { exitCode: 0 };
};
