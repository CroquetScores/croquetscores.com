// Reading the world rankings' lists and keeping the players on each, which
// the administrator's page asks for (ImportWorldRankingPlayers.feature) and
// the import from the old sites does once it is done
// (ImportWorldRankingPlayerNames.feature). Written once, so that the two
// cannot come to keep the players by different rules.
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { ErrorLog } from "../../services/ErrorLog.js";
import type { Transactions } from "../../services/Transactions.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import {
  DuplicateNamesRefused,
  ListRefused,
  NameTakenRefused,
  type WorldRankingLists,
  type WorldRankingSport,
  worldRankingSports,
} from "../../services/WorldRankingLists.js";
import type { WorldRankingPlayers } from "../../services/WorldRankingPlayers.js";
import type { ImportReport } from "./ImportWorldRankingPlayers.js";

/** What reading the lists and keeping their players needs. */
export interface WorldRankingImportParts {
  readonly lists: WorldRankingLists;
  readonly players: WorldRankingPlayers;
  readonly transactions: Transactions;
  readonly errors: ErrorLog;
  readonly queue: EmailQueue;
  /** Who is told of a list that gives one name to two players. */
  readonly administrator: string;
  /** The host of the website asked on, which the email says the site by. */
  readonly website: string;
  /**
   * Whether the administrator is emailed of a list that is refused for its
   * names. An administrator who imports is told every time, since they are
   * the one importing; a refresh done for any reader is not, since it would
   * tell them every hour for as long as the rankings stay wrong. Either way
   * it is logged as an error.
   */
  readonly emailsAdministrator: boolean;
}

/**
 * Reads each sport's list in turn and keeps the players on it, telling
 * `report` each thing done as it is done, a list that was not read with
 * its code and why, so that whoever is told can say it as it happens.
 *
 * Each list is read with nothing held, and only a list read in full is kept,
 * in a transaction of its own, so that one sport's list failing leaves its
 * players as they were and the other's is still kept. Run outside any
 * transaction, since it opens its own.
 */
export const importWorldRankingPlayers = async (
  parts: WorldRankingImportParts,
  report: (report: ImportReport) => void,
  at: ReadOnlyDate,
  // Both, unless whoever asks wants only one: the refresh a list of players
  // does of its own sport's names has no use for the other's.
  sports: readonly WorldRankingSport[] = worldRankingSports,
): Promise<void> => {
  const { lists, players, transactions } = parts;
  for (const sport of sports) {
    report({ kind: "reading", sport });
    // What is read, and how it is kept: golf croquet's replaces what was
    // kept, and association croquet's is kept by number, at `at`.
    let read: number;
    let keep: () => Promise<void>;
    try {
      if (sport === "ac") {
        const listed = await lists.associationCroquetPlayers();
        read = listed.length;
        keep = () => players.keepAssociationCroquet(listed, at);
      } else {
        const names = await lists.golfCroquetNames();
        read = names.length;
        keep = () => players.replaceGolfCroquet(names);
      }
    } catch (failure) {
      // Only a list that was not read is said and passed over. Anything else
      // is the site failing, and stops the import where it is.
      if (!(failure instanceof ListRefused)) throw failure;
      await refused(parts, sport, failure, report, at);
      continue;
    }
    report({ kind: "read", sport, players: read });
    // A list can be read in full and still be refused by what is kept, as
    // when it gives a name another player holds. Nothing of it is kept then,
    // since the transaction is let go of, and the other sport's is still read.
    try {
      await transactions.inTransaction(keep);
    } catch (failure) {
      if (!(failure instanceof ListRefused)) throw failure;
      await refused(parts, sport, failure, report, at);
      continue;
    }
    report({ kind: "kept", sport, players: read });
  }
  report({ kind: "finished" });
};

// A list refused is said as it happens. One that gives a name to two players,
// or a name the site keeps for another, is also logged as an error and told
// to the administrator of the site, who is the one who can have it corrected
// at the rankings: every time an import finds it, since nothing else would say
// it is still wrong.
const refused = async (
  {
    transactions,
    errors,
    queue,
    administrator,
    website,
    emailsAdministrator,
  }: WorldRankingImportParts,
  sport: WorldRankingSport,
  failure: ListRefused,
  report: (report: ImportReport) => void,
  at: ReadOnlyDate,
): Promise<void> => {
  report({
    kind: "refused",
    sport,
    code: failure.code,
    message: failure.message,
  });
  const told =
    failure instanceof DuplicateNamesRefused
      ? {
          kind: "Email.WorldRankingDuplicateNames",
          details: { duplicates: failure.duplicates },
          fill: failure.duplicates
            .map(
              ({ name, worldRankingIds }) =>
                `${name} (${worldRankingIds.join(", ")})`,
            )
            .join("; "),
        }
      : failure instanceof NameTakenRefused
        ? {
            kind: "Email.WorldRankingNameTaken",
            details: { names: failure.names },
            fill: failure.names.join("; "),
          }
        : undefined;
  if (told === undefined) return;
  errors.error(failure.message, told.details);
  if (!emailsAdministrator) return;
  // Said and passed over where the administrator cannot be told: the refusal
  // is already reported and logged, and the other sport's list is still to be
  // kept, which an email that would not queue is no reason to stop.
  try {
    await transactions.inTransaction(() =>
      queue.queue({
        kind: told.kind,
        to: administrator,
        language: "en",
        website,
        fill: { names: told.fill },
        queuedAt: at,
      }),
    );
  } catch (cause) {
    errors.error("The administrator could not be told of a refused list.", {
      cause: String(cause),
    });
  }
};
