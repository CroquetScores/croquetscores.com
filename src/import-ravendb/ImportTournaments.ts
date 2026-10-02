import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import type { EmailAddressHasher } from "../application/services/EmailAddressHasher.js";
import { Account } from "../domain/aggregates/accounts/Account.js";
import { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../domain/aggregates/accounts/value-objects/PersonName.js";
import { TournamentId } from "../domain/aggregates/tournaments/primitives/TournamentId.js";
import { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { Countries } from "../domain/aggregates/tournaments/value-objects/Countries.js";
import type { Country } from "../domain/aggregates/tournaments/value-objects/Country.js";
import { Sport } from "../domain/aggregates/tournaments/value-objects/Sport.js";
import { TournamentFormat } from "../domain/aggregates/tournaments/value-objects/TournamentFormat.js";
import { TournamentName } from "../domain/aggregates/tournaments/value-objects/TournamentName.js";
import { TournamentNotes } from "../domain/aggregates/tournaments/value-objects/TournamentNotes.js";
import type { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import { Slug } from "../domain/common/Slug.js";
import { Website } from "../domain/common/Website.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import type { ImportDatabase } from "./ImportDatabase.js";
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

// What a forgotten account is brought over as before it is forgotten, which
// nobody reads: a forgotten account is read back as "Account Forgotten" and
// an address at the site's own domain whatever it was kept as (AccountEventSealing).
const FORGOTTEN_NAME = "Account Forgotten";

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

// The notes as the old sites showed them, which wrote "<" and ">" as "&lt;"
// and "&gt;" and showed them as the characters. None where the document says
// none, or leaves them out, as RavenDB left out a field never set.
const notesOf = (
  notes: string | null | undefined,
): TournamentNotes | undefined =>
  notes === null || notes === undefined
    ? undefined
    : TournamentNotes.from(
        notes.replaceAll("&lt;", "<").replaceAll("&gt;", ">"),
      );

/**
 * Brings every tournament the old sites did not archive over, found where
 * they found it, and keeps which tournament each became and which were left
 * behind (ImportTournaments.feature).
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
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly emailAddresses: EmailAddressHasher,
    private readonly database: ImportDatabase,
  ) {}

  async importDocument({
    website,
    id,
    document,
  }: ReadDocument<OldTournament>): Promise<void> {
    await this.unitOfWork.inTransaction(async () => {
      if (document.IsArchived) {
        await this.database.recordLeftBehind(website, id);
        return;
      }

      const format = formatOf(document.TournamentType);
      const sport = sportOf(document.SportType);
      const country = countryOf(document.TimeZoneId);
      // The old sites kept no moment a tournament was created at, so it was
      // created when it started, as far as anything here says.
      const at = dayOf(document.Start);
      const creator = await this.#accountOf(website, document.CreatedBy.Id, at);

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
          notes: notesOf(document.Notes),
          // Nothing the old sites never said is claimed: none of them allowed
          // a drawn game, and none said the rest.
          handicap: false,
          drawsAllowed: false,
          worldRankings: false,
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
        const account = await this.#accountOf(website, manager.Id, at);
        if (!tournament.manages(account)) {
          tournament.addManager(account, creator, at);
        }
      }
      // A manager does everything a scorer does, so is not made one as well,
      // as the old sites made every manager.
      for (const scorer of document.Scorers) {
        const account = await this.#accountOf(website, scorer.Id, at);
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

  // The account the user `documentId` on `website` became, or where they
  // became none, the forgotten account made for them the first time one was
  // needed: one that holds nothing of them and that nobody can sign in to.
  async #accountOf(
    website: string,
    documentId: string,
    at: ReadOnlyDate,
  ): Promise<AccountId> {
    const imported = await this.database.findAccountOf(website, documentId);
    if (imported !== undefined) return AccountId.from(imported.accountId);
    const forgotten = await this.database.findForgottenAccountOf(
      website,
      documentId,
    );
    if (forgotten !== undefined) return AccountId.from(forgotten);

    const id = AccountId.create();
    const address = EmailAddress.from(
      `account-forgotten-${id.value.slice(id.value.indexOf("/") + 1)}@croquetscores.com`,
    );
    // Brought over and forgotten in one save, so that it is never an account
    // anybody could be sent anything at, and its key is gone with it.
    const account = Account.bringOver(
      id,
      PersonName.from(FORGOTTEN_NAME),
      address,
      this.emailAddresses.hash(address),
      "",
      at,
    );
    account.forget(at);
    await this.accounts.save(account);
    await this.database.recordForgottenUser(website, documentId, id.value);
    return id;
  }
}
