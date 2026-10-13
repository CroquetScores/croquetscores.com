import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import { TournamentId } from "../domain/aggregates/tournaments/primitives/TournamentId.js";
import { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { Countries } from "../domain/aggregates/tournaments/value-objects/Countries.js";
import type { Country } from "../domain/aggregates/tournaments/value-objects/Country.js";
import { Sport } from "../domain/aggregates/tournaments/value-objects/Sport.js";
import { TournamentFormat } from "../domain/aggregates/tournaments/value-objects/TournamentFormat.js";
import { TournamentName } from "../domain/aggregates/tournaments/value-objects/TournamentName.js";
import { TournamentSubtitle } from "../domain/aggregates/tournaments/value-objects/TournamentSubtitle.js";
import { Slug } from "../domain/common/Slug.js";
import { Website } from "../domain/common/Website.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import type { ImportDatabase } from "./ImportDatabase.js";
import type { ImportedAccounts } from "./ImportedAccounts.js";
import { ImportRefused } from "./ImportRefused.js";
import { tournamentNameToImport } from "./names.js";
import { dayOf } from "./newtonsoft.js";
import type { Tournament as OldTournament } from "./ravendb-models/Tournament.js";
import type { Importer, ReadDocument } from "./runImporter.js";
import { countryOfTimeZone } from "./timeZones.js";

// The site's sport for each the old sites named, by the code they kept, in
// small letters. The old sites kept a code in whatever case it was written
// in, "AC" in one tournament and "ac" in another, and read it in any case, so
// it is looked for here in small letters.
const sportCodes: Readonly<Record<string, string>> = {
  ac: "ac",
  gc: "gc",
  gb: "gb",
  a6w: "a6w",
  rc: "rc",
};

// The site's format for each tournament type the old sites named, looked for
// in small letters as a sport is.
const formats: Readonly<Record<string, TournamentFormat>> = {
  standard: TournamentFormat.standard,
  teams: TournamentFormat.teams,
  eirecup: TournamentFormat.eireCup,
  interstateshield: TournamentFormat.interstateShield,
  gcwtc: TournamentFormat.gcWorldTeamChampionship,
};

const sportOf = (code: string): Sport => {
  const known = sportCodes[code.trim().toLowerCase()];
  if (known === undefined) {
    throw new ImportRefused(
      "ImportTournaments.UnknownSport",
      `The old sites never offered the sport ${code}.`,
    );
  }
  return Sport.from(known);
};

const formatOf = (type: string): TournamentFormat => {
  const known = formats[type.trim().toLowerCase()];
  if (known === undefined) {
    throw new ImportRefused(
      "ImportTournaments.UnknownType",
      `The old sites never offered the tournament type ${type}.`,
    );
  }
  return known;
};

/**
 * Whether the old sites' tournament type `type` is played by teams, or not
 * where it is no type they offered, which bringing the tournament over
 * refuses.
 */
export const isPlayedByTeams = (type: string): boolean =>
  formats[type.trim().toLowerCase()]?.isTeamFormat ?? false;

const countryOf = (timeZone: string | null): Country => {
  if (timeZone === null || timeZone.trim() === "") {
    throw new ImportRefused(
      "ImportTournaments.NoTimeZone",
      "The tournament was kept in no time zone, so its country is not known.",
    );
  }
  const code = countryOfTimeZone(timeZone);
  const country =
    code === undefined ? undefined : Countries.thereAre.find(code);
  if (country === undefined) {
    throw new ImportRefused(
      "ImportTournaments.UnknownTimeZone",
      `The import does not know which country ${timeZone} is.`,
    );
  }
  return country;
};

// The subtitle the old sites' notes make, read as the old sites showed them,
// which wrote "<" and ">" as "&lt;" and "&gt;" and showed them as the
// characters. None where the document says none, or leaves them out, as
// RavenDB left out a field never set.
const subtitleOf = (
  notes: string | null | undefined,
): TournamentSubtitle | undefined =>
  notes === null || notes === undefined
    ? undefined
    : TournamentSubtitle.from(
        notes.replaceAll("&lt;", "<").replaceAll("&gt;", ">"),
      );

/**
 * Brings one of the old sites' tournaments over, found where they found it,
 * and keeps which tournament it became (ImportTournaments.feature). Which
 * tournaments are brought over, and what is brought over with each, is
 * ImportWholeTournaments'.
 *
 * The tournament, its managers and scorers, any forgotten account made for
 * one of them, and the record of it are kept in one transaction, so that none
 * is kept without the rest.
 */
export class ImportTournaments implements Importer<OldTournament> {
  readonly collection = "Tournaments";

  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: ImportedAccounts,
    private readonly database: ImportDatabase,
  ) {}

  async importDocument({
    website,
    id,
    document,
  }: ReadDocument<OldTournament>): Promise<void> {
    await this.unitOfWork.inTransaction(async () => {
      const format = formatOf(document.TournamentType);
      const sport = sportOf(document.SportType);
      const country = countryOf(document.TimeZoneId);
      // The old sites kept no moment a tournament was created at, so it was
      // created when it started, as far as anything here says.
      const at = dayOf(document.Start);
      const creator = await this.accounts.accountOf(
        website,
        document.CreatedBy.Id,
        at,
      );

      const tournament = Tournament.bringOver(
        TournamentId.create(),
        Website.from(website),
        {
          name: TournamentName.from(tournamentNameToImport(document.Name)),
          starts: dayOf(document.Start),
          finishes: dayOf(document.Finish),
          format,
          sport,
          country,
          subtitle: subtitleOf(document.Notes),
          // Nothing the old sites never said is claimed: none of them allowed
          // a drawn game, but for those the import found a tie marked in text
          // in (ImportWholeTournaments.feature), and none said the rest.
          handicap: false,
          drawsAllowed: document.DrawsAllowed === true,
          // What the old sites sent to the world rankings is what the site now
          // counts, a sport's whole, so a tournament of a sport that counts is
          // brought over counting. Not where it allows drawn games, which
          // cannot count and would be refused (ImportTournaments.feature).
          worldRankings:
            sport.countsTowardsWorldRankings && document.DrawsAllowed !== true,
          national: false,
          international: false,
          // Said only of a tournament played by teams, which alone has tests,
          // and only where the old site said it, so that a GC World Team
          // Championship draws them as it always did.
          levelTestsDrawn:
            format.isTeamFormat && document.DrawnMatchesAreNotDecidedByNetHoops
              ? true
              : undefined,
        },
        Slug.from(document.Slug),
        creator,
        at,
      );

      for (const manager of document.Managers) {
        const account = await this.accounts.accountOf(website, manager.Id, at);
        if (!tournament.manages(account)) {
          tournament.addManager(account, creator, at);
        }
      }
      // A manager does everything a scorer does, so is not made one as well,
      // as the old sites made every manager.
      for (const scorer of document.Scorers) {
        const account = await this.accounts.accountOf(website, scorer.Id, at);
        if (!tournament.manages(account) && !tournament.scores(account)) {
          tournament.addScorer(account, creator, at);
        }
      }

      await this.tournaments.save(tournament);
      await this.database.recordImportedTournament(
        website,
        id,
        tournament.id.value,
      );
    });
  }
}
