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

// The country of each tournament that was checked by hand, by the address it
// is found at on croquetscores.com: year, sport and slug. Names and time zones
// cannot tell these apart from the tournaments they got right, and the person
// who went through them year by year (issue 409) said where each was played,
// so that is taken over everything else (ImportTournaments.feature). Kept by
// address rather than by name because several share a name, as "Bayfield Cup"
// does in four years. The Virgin Islands of "west-indies-open" were not said
// to be British or American, so the British ones are taken.
const countryOfAddress: Readonly<Record<string, string>> = {
  "2013/gc/ramsgate-championship": "england",
  "2013/ac/ca-mens-championship": "england",
  "2013/gc/british-open-doubles-championship": "england",
  "2013/ac/irish-championships": "ie",
  "2013/ac/nsw-bronze-medal": "au",
  "2014/gc/swf-nailsea-v-dyffryn-1": "england",
  "2014/gc/national-forest-tournament-ashby-cc-eng": "england",
  "2014/ac/ca-open-championship": "england",
  "2014/ac/ca-open-doubles-championship": "england",
  "2014/gc/inter-club-championship-bowdon-cc-v-ashby-cc-ca-eng": "england",
  "2014/ac/nailsea-b-class-advanced": "england",
  "2014/ac/sca-scottish-open": "scotland",
  "2014/ac/croqcan": "ca",
  "2014/gc/welsh-b-level-golf": "wales",
  "2014/gc/selectors-sixes-eng-ca": "england",
  "2014/gc/sca-v-lkf": "scotland",
  "2014/ac/german-vs-uruguay": "de",
  "2014/gc/hurlingham-level-play-singles-eng": "england",
  "2014/gc/doubles-weekend-ca-eng": "england",
  "2015/gc/2nd-spain-latvia-friendly-tournament-1": "es",
  "2015/ac/bicc-bayfield-cup": "ca",
  "2015/gc/swf-dyffryn-v-nailsea": "england",
  "2015/gc/cheltenham-ascot-qualifier": "england",
  "2015/ac/nailsea-district-b-class-advanced-tournament": "england",
  "2015/ac/qualifier-for-womens-world-championship": "england",
  "2015/gc/swf-level-dyffryn-v-worcester-norton": "wales",
  "2015/gc/swcf-dyffryn-v-c-peasdown": "wales",
  "2015/gc/kate-jones-memorial-eng-ca": "england",
  "2015/ac/usa-vs-ireland-invitational": "us",
  "2015/gc/surbiton-oneday-august": "england",
  "2015/gc/welsh-b-class": "wales",
  "2015/ac/ca-inter-club-final": "england",
  "2016/gc/northampton-level-eng-ca-a-level-series": "england",
  "2016/ac/inter-county-championship": "england",
  "2016/ac/bicc-open": "ca",
  "2016/gc/cheltenham-ascot-cup": "england",
  "2016/gc/croqcan": "ca",
  "2016/ac/home-internationals": "england",
  "2016/ac/ca-open-championship": "england",
  "2016/gc/national-forest-championship-eng-ashby-cc": "england",
  "2016/ac/mary-rose-heat": "england",
  "2016/ac/irish-championship": "ie",
  "2016/gc/swf-dyffryn-v-cheltenham": "wales",
  "2016/ac/ca-v-sca": "england",
  "2016/gc/english-national-doubles-championship-eng-ca": "england",
  "2016/ac/nottingham-adv-weekend": "england",
  "2016/ac/aberdeen-crathes-handicap": "scotland",
  "2016/gc/welsh-b-class-golf-open": "wales",
  "2016/gc/portuga-boxing-day": "pt",
  "2017/ac/nwf-millennium-advanced": "england",
  "2017/gc/student-championships": "england",
  "2017/gc/student-doubles-championships": "england",
  "2017/ac/john-beech-memorial": "england",
  "2017/gc/golf-croquet-a-level-series-cheltenham": "england",
  "2017/ac/pendle-craven-b-level": "england",
  "2017/ac/ca-inter-county-championship": "england",
  "2017/gc/cheltenham-championship": "england",
  "2017/ac/nottingham-b-level-weekend": "england",
  "2017/gc/british-doubles-championship": "england",
  "2017/ac/roehampton-b-level-advanced": "england",
  "2017/gc/national-forest-championship-eng-ashby-cc": "england",
  "2017/ac/the-open-championships": "england",
  "2017/gc/ca-inter-club-cheltenham-versus-ashby": "england",
  "2017/ac/league-match-of-the-century": "england",
  "2017/gc/cheltenham-festival-golf-day": "england",
  "2017/gc/belgian-open-tournament": "be",
  "2017/ac/the-eastern-championships": "england",
  "2017/ac/cowhorn-eastbourne": "england",
  "2017/ac/parkstone-trophy-bristol-v-cheltenham": "england",
  "2017/gc/secf-level-surbiton-v-sussexccc": "england",
  "2017/gc/welsh-b-class": "wales",
  "2017/ac/ic-bristol-vs-colchester": "england",
  "2017/gc/ca-inter-club-letchworth-versus-ashby": "england",
  "2017/ac/bayfield-last-of-summer-wine": "ca",
  "2017/gc/v-ac-challenge-match": "england",
  "2018/gc/sca-championship": "scotland",
  "2018/gc/swcf-dyffryn-v-camerton-peasdown": "wales",
  "2018/gc/brisbane-metropolitan-pennants": "au",
  "2018/ac/victoria-day": "ca",
  "2018/gc/croqcan": "ca",
  "2018/gc/quebec-open": "ca",
  "2019/gc/1st-spain-england-test-match": "es",
  "2019/ac/egyptian": "england",
  "2019/gc/auckland-silver-badge": "nz",
  "2019/gc/skara-open-a": "se",
  "2019/gc/allan-wilson-classic-eastern-cape": "za",
  "2019/gc/wcca-open": "za",
  "2019/ac/newport-may-advanced-weekend": "england",
  "2019/gc/el-segundo-mexico-croquet-open": "mx",
  "2019/ac/british-columbia-vs-ontario": "ca",
  "2019/ac/tom-colls-cup": "ca",
  "2019/gc/quebec-open": "ca",
  "2020/gc/sweden-v-canterbury-u17": "nz",
  "2020/gc/sherry-golf-inaugural-trophy": "es",
  "2020/gc/1st-ireland-spain-womens-test-match": "es",
  "2020/ac/bayfield-cup": "ca",
  "2020/ac/irish-championships": "ie",
  "2020/gc/llandovery-v-glamorgan": "wales",
  "2021/gc/british-open-championship-1": "england",
  "2021/gc/cai-william-shield-trophy-singles": "ie",
  "2021/gc/cai-john-ronan-trophy-singles": "ie",
  "2021/gc/cai-paddy-murphy-trophy-doubles": "ie",
  "2021/gc/cai-paddy-murphy-trophy-doubles-1": "ie",
  "2021/gc/cai-jack-o-gorman-john-blanchard-cup-ladies-singles": "ie",
  "2021/gc/welsh-ca-team-golf-north": "wales",
  "2021/gc/welsh-ca-team-golf-south": "wales",
  "2021/gc/welsh-ca-team-golf-consolidated-singles": "wales",
  "2021/gc/the-fort-william-cup-doubles": "ie",
  "2021/gc/cai-lyons-cup-singles-2": "ie",
  "2021/gc/cai-peggy-ronan-trophy-singles": "ie",
  "2021/gc/wca-welsh-team-golf-final": "wales",
  "2021/gc/cai-mcostrich-cup-singles": "ie",
  "2021/gc/nrcc-divisional-singles": "au",
  "2021/gc/cai-midleton-distillery-cup-doubles": "ie",
  "2021/ac/bayfield-cup": "ca",
  "2021/ac/association-canadian-open": "ca",
  "2022/ac/sw-fed-glamorgan-v-nailsea-1": "wales",
  "2022/ac/bayfield-cup": "ca",
  "2022/gc/swf-hcp-glamorgan-v-worcester-norton": "wales",
  "2022/gc/bicc-golf-open": "ca",
  "2022/gc/ca-nwf-lpg-bowdon-v-crake": "england",
  "2022/gc/sw-fed-level-play": "wales",
  "2022/gc/welsh-golf-team-1": "wales",
  "2022/gc/ca-nwf-llanfairfechan-v-bowdon": "wales",
  "2022/gc/welsh-inter-club-final": "wales",
  "2022/ac/autumn-bowl": "ie",
  "2022/gc/european-club-league-algarve-1": "pt",
  "2023/gc/mexico-open-championship": "mx",
  "2023/ac/victoria-day-weekend-open": "ca",
  "2023/gc/quebec-open": "ca",
  "2023/gc/croquet-mx-campeonato-nacional-de-dobles": "mx",
  "2023/gc/san-miguel-archangel": "mx",
  "2023/gc/wcca-championships": "za",
  "2024/a6w/west-indies-open": "vg",
  "2024/gc/kurpfalz": "de",
  "2024/gc/interclub-sudwest-dechsendorf": "de",
  "2024/gc/interclub-sudwest-hamburg": "de",
  "2024/gc/wcf-erc-european-club-league-cern-cc-qualifier": "ch",
  "2024/ac/southwest-championships": "de",
  "2024/ac/national-german-doubles-championships": "de",
  "2024/gc/welsh-golf-team-southern-heat": "wales",
  "2024/ac/irish-croquet-championship": "ie",
  "2024/gc/southwest-championships": "de",
  "2024/gc/national-german-championships": "de",
  "2024/gc/happy-valley": "ca",
  "2025/gc/algarve-club-leage": "pt",
  "2025/gc/kurpfalz": "de",
  "2025/gc/welsh-league": "wales",
  "2025/gc/swedish-national-day-cup-benamor": "pt",
  "2025/gc/welsh-league-llanidloes-v-llandovery": "wales",
  "2025/gc/3rd-european-league-newcastle-heat": "ie",
  "2025/gc/alexander-mcostrich-cup-1910-open-singles": "ie",
  "2025/ac/sca-v-cqe": "scotland",
  "2025/gc/cai-v-fec-womens-match": "ie",
  "2025/gc/auckland-interclub": "nz",
  "2025/gc/auckland-interclub-division-1": "nz",
  "2025/gc/welsh-team-golf-final": "wales",
  "2026/ac/hurlingham-club-england-croquet-club-wolkersdorf-austria": "england",
  "2017/gc/womens-swiss-championship": "ch",
  "2024/gc/3rd-championship-berlin": "de",
  "2024/gc/paske": "no",
  "2024/gc/lutefisk-croquet": "no",
  "2024/gc/host-croquet": "no",
  "2024/gc/croquetvs-club-advantage-championship": "ch",
  "2024/gc/soaad-abotaleb-cup": "eg",
  "2024/gc/kohlhof": "de",
  "2025/gc/zurich-advantage": "ch",
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

// Whether the name begins with one of the words, in any case, as a word of its
// own: "Welsh" begins "Welsh Open" but not "Welshpool Open" or "The Welsh Open",
// which the old sites' rules for it never asked after.
const beginsWithAWord = (words: string, name: string): boolean =>
  wholeWord(words, "i").exec(name)?.index === 0;

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
  { says: (name) => name.toLowerCase().includes("german"), country: "de" },
  // Austrian and not Austria, which a name has for the place the other side
  // came from as well as for where it was played.
  { says: (name) => name.toLowerCase().includes("austrian"), country: "at" },
  { says: (name) => beginsWithAWord("Swiss|CERN", name), country: "ch" },
  {
    says: (name) =>
      beginsWithAWord("Czech", name) ||
      name.toLowerCase().includes("czech republic"),
    country: "cz",
  },
  { says: (name) => name.toLowerCase().includes("tonic"), country: "se" },
  // New South Wales is before the rules that follow and every country in a name
  // (countryNamedIn), which would take the Wales in it for Wales.
  {
    says: (name) => wholeWord("New South Wales", "i").test(name),
    country: "au",
  },
  { says: (name) => beginsWithAWord("CAI", name), country: "ie" },
  { says: (name) => beginsWithAWord("Bayfield|BICC", name), country: "ca" },
  {
    says: (name) => wholeWord("Aberdeen", "i").test(name),
    country: "scotland",
  },
  { says: (name) => beginsWithAWord("Welsh", name), country: "wales" },
  { says: (name) => beginsWithAWord("Irish", name), country: "ie" },
  { says: (name) => beginsWithAWord("Nottingham", name), country: "england" },
  {
    says: (name) => beginsWithAWord("English|British", name),
    country: "england",
  },
  {
    says: (name) => wholeWord("CroqCan|Quebec", "i").test(name),
    country: "ca",
  },
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

// The years the McWeeney Trophy, between the Croquet Association and Croquet
// Association of Ireland, was played in Ireland. It is played in each country
// in turn, and its name is the same either way, so the year is what says where
// (http://butedock.com/cnw2/event_name.php?ename=McWeeney&country=World&order=normal,
// as it stood on 2026-10-26).
const mcWeeneyYearsInIreland: ReadonlySet<number> = new Set([
  1986, 1988, 1992, 1994, 1996, 1998, 2000, 2002, 2004, 2006, 2008, 2013, 2016,
  2018, 2022, 2024, 2026,
]);

// The country each match between England and Scotland was played in, by the
// year it started: it is played in each country in turn under one name, so the
// year is what says where. From the list of its events at
// http://butedock.com/cgs/event_name.php?ename=england+v+scotland&country=World&order=normal
// as it stood on 2026-10-26.
const englandVScotlandYears: Readonly<Record<number, string>> = {
  1985: "england",
  1986: "england",
  1987: "england",
  1989: "england",
  1990: "scotland",
  1991: "scotland",
  1992: "scotland",
  1993: "england",
  1994: "england",
  1995: "england",
  1996: "england",
  1997: "england",
  1998: "england",
  1999: "england",
  2000: "england",
  2001: "ie",
  2003: "ie",
  2009: "ie",
};

// Whether the name is for the match between England and Scotland, with the
// sides either way round and v or vs between them.
const englandVScotland = (() => {
  const england = String.raw`(?:Croquet\s+)?England`;
  const scotland = String.raw`Scotland|Scottish\s+Croquet\s+Association`;
  const versus = String.raw`\s+vs?\s+`;
  return wholeWord(
    `${england}${versus}(?:${scotland})|(?:${scotland})${versus}${england}`,
    "i",
  );
})();

// What a name says of a tournament put in one country only, by the code of the
// country it was put in, in the order they are tried. Each is given the name as
// it was written, and says the country the tournament was played in, or
// nothing where the name says none (ImportTournaments.feature).
const namesSayingACountryForOne: Readonly<
  Record<string, (name: string, startYear: number) => string | undefined>
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
  england: (name, startYear) =>
    wholeWord("Balgreen|Scottish|Edinburgh|Auchincruive", "i").test(name) ||
    wholeWord("SCA").test(name)
      ? "scotland"
      : wholeWord("Dublin|Carrickmines|Leinster|Herbert Park", "i").test(
            name,
          ) ||
          (wholeWord("Mc ?Weeney", "i").test(name) &&
            mcWeeneyYearsInIreland.has(startYear))
        ? "ie"
        : undefined,
};

const countryPlayedIn = (
  said: Country,
  name: string,
  startYear: number,
): Country => {
  const written = name.trim();
  const named = namesSayingACountry.find(({ says }) => says(written))?.country;
  // Taken after the names above and before any country in the name, which
  // would take England or Scotland for the whole match. A year the list has no
  // event for says nothing, and so leaves the match to be in no country the
  // name has in it.
  const match = englandVScotland.test(written);
  const country =
    named ??
    (match
      ? englandVScotlandYears[startYear]
      : (countryNamedIn(written) ??
        namesSayingACountryForOne[said.code]?.(written, startYear))) ??
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
      const startYear = Number(dayOf(document.Start).toISOString().slice(0, 4));
      // Said by hand, so it is the last word on the country and the first on
      // the region, which is then none as for any other country moved.
      const checked = Countries.thereAre.find(
        (website === "croquetscores.com"
          ? countryOfAddress[
              `${startYear}/${document.SportType.trim().toLowerCase()}/${document.Slug.trim().toLowerCase()}`
            ]
          : undefined) ?? "",
      );
      const country =
        checked ?? countryPlayedIn(saidCountry, document.Name, startYear);
      const region =
        checked !== undefined ||
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
