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
import { placeOfTimeZone } from "./timeZones.js";
import type { RankedSport, WorldRankingEvents } from "./WorldRankingEvents.js";

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

// Tournaments whose name says where they were played better than their time
// zone does, by name, whatever time zone they were kept in
// (ImportTournaments.feature).
const countryOfName: Readonly<Record<string, string>> = {
  "Oktober GC": "no",
};

// Countries the old sites put tournaments in that were played in another, by
// the code of each (ImportTournaments.feature).
const countriesPlayedInInstead: Readonly<Record<string, string>> = {
  cl: "us",
  iq: "eg",
  il: "eg",
  jo: "eg",
  ma: "lv",
  na: "eg",
  sg: "au",
  tw: "au",
  th: "au",
  ua: "lv",
};

// The names of Spanish clubs, which a tournament's name has as a word of its
// own in capitals when the club ran it. Whole is no letter or digit beside it,
// and the capitals are meant: in lower case these are plain words and names.
// Whether the name has any of the phrases in it, in any case.
const hasAny = (name: string, phrases: readonly string[]): boolean => {
  const lower = name.toLowerCase();
  return phrases.some((phrase) => lower.includes(phrase));
};

// A word of its own is one with no letter or digit beside it. Its case is the
// one it is given, unless the flags say "i".
const wholeWord = (word: string, flags = ""): RegExp =>
  new RegExp(`(?<![\\p{L}\\p{N}])(?:${word})(?![\\p{L}\\p{N}])`, `${flags}u`);

// Every country's whole name as a word of its own, the longest first so that
// Papua New Guinea is taken before the Guinea in it.
const wholeCountryNames = Countries.thereAre.all
  .map(({ code, name }) => ({
    code,
    length: name.length,
    pattern: wholeWord(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
  }))
  .sort((a, b) => b.length - a.length);

// The country whose whole name the name has as a word of its own, if any. Tried
// after every name above, which mean more than the country in them.
const countryNamedIn = (name: string): string | undefined =>
  wholeCountryNames.find(({ pattern }) => pattern.test(name))?.code;

const spanishClubs =
  /(?<![\p{L}\p{N}])(?:RSHECC|CCVM|VGCC|RCGVH|RCLM|RCP)(?![\p{L}\p{N}])/u;

// What a tournament's name can say of the country it was played in, in the
// order they are tried: it begins with a word, or has one anywhere in it, in
// any case, or has a club's name as a word of its own. The first to match is
// taken, whatever else says (ImportTournaments.feature). Each is given the
// name as it was written.
const namesSayingACountry: readonly {
  readonly says: (name: string) => boolean;
  readonly country: string;
}[] = [
  {
    says: (name) => name.toLowerCase().startsWith("latvia"),
    country: "lv",
  },
  { says: (name) => name.toLowerCase().includes("spanish"), country: "es" },
  { says: (name) => spanishClubs.test(name), country: "es" },
  {
    says: (name) => name.toLowerCase().includes("western cape"),
    country: "za",
  },
  {
    says: (name) => /open door|stage door/i.test(name),
    country: "za",
  },
  { says: (name) => /south african/i.test(name), country: "za" },
  { says: (name) => name.toLowerCase().includes("egypt"), country: "eg" },
  { says: (name) => hasAny(name, ["norfolk island"]), country: "nf" },
  {
    // "Provinicial" is how some old names spell it.
    says: (name) =>
      /gauteng provin(?:i)?cial/i.test(name) ||
      hasAny(name, ["western province croquet association"]),
    country: "za",
  },
  { says: (name) => hasAny(name, ["allasch kummel"]), country: "lv" },
  {
    says: (name) => hasAny(name, ["zouzou abdelhalim cup", "borg cup"]),
    country: "eg",
  },
  { says: (name) => wholeWord("Greece", "i").test(name), country: "gr" },
  {
    // Called exactly this, whichever way its apostrophe is written.
    says: (name) =>
      name.replaceAll("’", "'").toLowerCase() ===
      "wgca women's intl friendship cup",
    country: "us",
  },
];

// An ordinal at the start of a name, as "1st", "10th" or "112th", in any case
// and a word of its own. Only the look of one is asked: "1th" is let through.
const startsWithAnOrdinal = /^\d+(?:st|nd|rd|th)(?![\p{L}\p{N}])/iu;

// What a name says of a tournament put in one country only, by the code of the
// country it was put in, in the order they are tried. Each is given the name as
// it was written, and says the country the tournament was played in, or
// nothing where the name says none (ImportTournaments.feature).
const namesSayingACountryForOne: Readonly<
  Record<string, (name: string) => string | undefined>
> = {
  // South African has South Africa in it, so the one is asked for.
  na: (name) => (/saca|south africa/i.test(name) ? "za" : undefined),
  ng: (name) => (/rondebosch/i.test(name) ? "za" : undefined),
  // Western Cape is South Africa's in any country (namesSayingACountry), so
  // only the club's initials are left to say.
  st: (name) => (wholeWord("Surbiton", "i").test(name) ? "england" : undefined),
  ro: (name) =>
    /wcca/i.test(name)
      ? "za"
      : wholeWord("SWF").test(name)
        ? "england"
        : wholeWord("Ramadan").test(name)
          ? "eg"
          : undefined,
  ma: (name) => (startsWithAnOrdinal.test(name) ? "es" : undefined),
  // Scotland and Ireland have no time zone of their own, so the old sites put
  // their tournaments in England, and only there are their names looked for:
  // Dublin and Edinburgh are places elsewhere too. SCA is in capitals, since
  // "sca" begins other words and names.
  england: (name) =>
    wholeWord("Balgreen|Scottish|Edinburgh|Auchincruive", "i").test(name) ||
    wholeWord("SCA").test(name)
      ? "scotland"
      : wholeWord(
            "Dublin|Carrickmines|Leinster|Herbert Park|Mc ?Weeney",
            "i",
          ).test(name)
        ? "ie"
        : undefined,
};

const countryPlayedIn = (said: Country, name: string): Country => {
  const written = name.trim();
  const country =
    namesSayingACountry.find(({ says }) => says(written))?.country ??
    countryNamedIn(written) ??
    namesSayingACountryForOne[said.code]?.(written) ??
    countriesPlayedInInstead[said.code];
  return Countries.thereAre.find(country ?? "") ?? said;
};

const placeOf = (
  timeZone: string | null,
  name: string,
): { readonly country: Country; readonly region?: string | undefined } => {
  const named = Countries.thereAre.find(countryOfName[name.trim()] ?? "");
  if (named !== undefined) return { country: named };
  if (timeZone === null || timeZone.trim() === "") {
    throw new ImportRefused(
      "ImportTournaments.NoTimeZone",
      "The tournament was kept in no time zone, so its country is not known.",
    );
  }
  const place = placeOfTimeZone(timeZone);
  const country =
    place === undefined ? undefined : Countries.thereAre.find(place.country);
  if (country === undefined) {
    throw new ImportRefused(
      "ImportTournaments.UnknownTimeZone",
      `The import does not know which country ${timeZone} is.`,
    );
  }
  return { country, region: place?.region };
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

/** What the import counts of the tournaments of one sport. */
export interface TournamentsCounted {
  tournaments: number;
  tookListedCountry: number;
}

// The sport of a tournament the world rankings keep a list for, if it is one.
const rankedSportOf = (document: OldTournament): RankedSport | undefined => {
  const sport = document.SportType.trim().toLowerCase();
  return sport === "ac" || sport === "gc" ? sport : undefined;
};

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

  /**
   * How many tournaments of each sport the world rankings keep a list for were
   * brought over, and how many of them took their country from it
   * (ImportTournaments.feature), for the import to say when it is done.
   */
  readonly counted: Readonly<Record<RankedSport, TournamentsCounted>> = {
    ac: { tournaments: 0, tookListedCountry: 0 },
    gc: { tournaments: 0, tookListedCountry: 0 },
  };

  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: ImportedAccounts,
    private readonly database: ImportDatabase,
    // Asked for at each import and not held, so that a scenario can give the
    // lists after the importer is made.
    private readonly events: () => WorldRankingEvents,
  ) {}

  async importDocument({
    website,
    id,
    document,
  }: ReadDocument<OldTournament>): Promise<void> {
    let counting: RankedSport | undefined;
    let tookListedCountry = false;
    await this.unitOfWork.inTransaction(async () => {
      const format = formatOf(document.TournamentType);
      const sport = sportOf(document.SportType);
      const timeZones = placeOf(document.TimeZoneId, document.Name);
      // The time zone is only the nearest thing to a country, so the world
      // rankings' word for where the tournament was played is taken over it
      // (ImportTournaments.feature). A region is a country's, so it is kept
      // only where the country is the same.
      const listed = this.#countryInTheLists(document);
      counting = rankedSportOf(document);
      tookListedCountry = listed !== undefined;
      const saidCountry = listed ?? timeZones.country;
      // A country the old sites put a tournament in that it was never played
      // in is the one it was, wherever the country came from, and a region is
      // its country's, so the tournament is then in none.
      const country = countryPlayedIn(saidCountry, document.Name);
      const region =
        country.code !== saidCountry.code ||
        (listed !== undefined && listed.code !== timeZones.country.code)
          ? undefined
          : timeZones.region;
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
          region,
          subtitle: subtitleOf(document.Notes),
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
    // Once the tournament is kept, so that one refused, or one whose
    // transaction fails, is not counted.
    if (counting !== undefined) {
      this.counted[counting].tournaments += 1;
      if (tookListedCountry) this.counted[counting].tookListedCountry += 1;
    }
  }

  // The country the world rankings' list of the tournament's sport gives it,
  // for a sport they keep one for.
  #countryInTheLists(document: OldTournament): Country | undefined {
    const sport = rankedSportOf(document);
    if (sport === undefined) return undefined;
    return this.events().countryOf(
      sport,
      dayOf(document.Start).toISOString().slice(0, 10),
      dayOf(document.Finish).toISOString().slice(0, 10),
      tournamentNameToImport(document.Name),
    );
  }
}
