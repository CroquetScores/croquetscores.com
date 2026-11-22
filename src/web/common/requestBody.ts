// How the routes of the API read what a caller sent in a body. A caller is not
// trusted to have typed what a field is for, so each reader gives what the
// field holds where it is of the kind wanted and what the application will
// refuse where it is not, and none of them throws. They are the API's, shared
// by /api/site and /api/v0 so that a route moved from the one to the other
// reads its body as it did.
import type { LosersKnockoutSaid } from "../../application/operations/tournaments/AddKnockout.js";
import type { TestRequest } from "../../application/operations/tournaments/testOperations.js";
import type { TournamentRequest } from "../../application/operations/tournaments/tournamentOperations.js";
import type { CompetitionRulesSaid } from "../../domain/aggregates/tournaments/value-objects/CompetitionRules.js";

// A query parameter where it was given once, as text.
export const oneOf = (given: unknown): string | undefined =>
  typeof given === "string" ? given : undefined;

// What a caller sent under `field`, where it is text, and nothing typed where
// it is not: a value of any other kind was not typed into anything, and is
// refused as nothing typed would be rather than failing on the way in.
export const textOf = (body: unknown, field: string): string => {
  const value = (body as Record<string, unknown> | null)?.[field];
  return typeof value === "string" ? value : "";
};

// The text sent under `field`, and nothing where none was, which a block's
// update takes as leaving its tie break as it was.
export const optionalTextOf = (
  body: unknown,
  field: string,
): string | undefined => {
  const value = (body as Record<string, unknown> | null)?.[field];
  return typeof value === "string" ? value : undefined;
};

// A number where one was sent, and otherwise one that is no number, which is
// refused as a best-of or a draw's places are when they are not whole.
export const numberOf = (body: unknown, field: string): number => {
  const value = (body as Record<string, unknown> | null)?.[field];
  return typeof value === "number" ? value : Number.NaN;
};

// The numbers sent under `field`, each as `numberOf` reads one, and none where
// no list was sent.
export const numbersOf = (body: unknown, field: string): number[] => {
  const value = (body as Record<string, unknown> | null)?.[field];
  return Array.isArray(value)
    ? value.map((each) => (typeof each === "number" ? each : Number.NaN))
    : [];
};

// The losers knockouts sent with a knockout: each a name and a round, and
// none where no list was sent. What is not a name or a number is left to be
// refused as it is elsewhere.
export const losersOf = (body: unknown): LosersKnockoutSaid[] => {
  const value = (body as Record<string, unknown> | null)?.["losers"];
  return Array.isArray(value)
    ? value.map((each) => ({
        name: textOf(each, "name"),
        round: numberOf(each, "round"),
      }))
    : [];
};

// A count of a carry forward, which is nothing where nothing was typed, the
// number typed where it is text, as a dialog's field sends it, and one that is
// no number where it is anything else, so that it is refused as not whole.
// Only digits, with a sign and a fraction, are read as a number: Number()
// alone would read "1e2" as 100 and "0x10" as 16, and keep a count nobody
// typed.
export const countOf = (body: unknown, field: string): number | undefined => {
  const value = (body as Record<string, unknown> | null)?.[field];
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;
  const typed = value.trim();
  if (typed === "") return undefined;
  return /^-?\d+(?:\.\d+)?$/.test(typed) ? Number(typed) : Number.NaN;
};

// A side's hoops or target as it was typed, for the application to read: text
// with its "w" where there is one, a number as a number, and nothing where it
// was left empty (`readTyped`). What is neither is not a number to look at.
export const typedOf = (
  body: unknown,
  field: string,
): number | string | undefined => {
  const value = (body as Record<string, unknown> | null)?.[field];
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;
  const typed = value.trim();
  return typed === "" ? undefined : typed;
};

// Yes or no where it was said, and unsaid otherwise, which the tournament
// decides for itself (create.feature).
export const yesOrNoOf = (
  body: unknown,
  field: string,
): boolean | undefined => {
  const value = (body as Record<string, unknown> | null)?.[field];
  return typeof value === "boolean" ? value : undefined;
};

// The most hoops a game is played to as a dialog sends it: null for none, which
// is different from leaving it out, since that is the usual for the sport. A
// number is a number, and text is read as one where it is only digits, and is
// otherwise no number, so that it is refused rather than taken as none.
export const maximumHoopsOf = (body: unknown): number | null | undefined => {
  const value = (body as Record<string, unknown> | null)?.["maximumHoops"];
  if (value === undefined || value === null) return value;
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;
  return /^-?\d+(?:\.\d+)?$/.test(value.trim()) ? Number(value) : Number.NaN;
};

// How a competition is played and counted, as its dialog sends it: each said
// or not. Nothing where none is, which an update takes as leaving them as they
// were.
export const rulesOf = (body: unknown): CompetitionRulesSaid | undefined => {
  const handicap = yesOrNoOf(body, "handicap");
  const drawsAllowed = yesOrNoOf(body, "drawsAllowed");
  const worldRankings = yesOrNoOf(body, "worldRankings");
  const maximumHoops = maximumHoopsOf(body);
  const advantage = yesOrNoOf(body, "advantage");
  return handicap === undefined &&
    drawsAllowed === undefined &&
    worldRankings === undefined &&
    maximumHoops === undefined &&
    advantage === undefined
    ? undefined
    : { handicap, drawsAllowed, worldRankings, maximumHoops, advantage };
};

// A game's player as the score dialog sends them: a competition's player by
// the part of their id after "competition-player/", and a test's, who is a
// player in one of its teams, by their whole id, since a test's players are
// not its own (gamesInATest.feature). Nothing where nobody was chosen, for
// the game to refuse.
export const gamePlayerOf = (said: string): string | undefined =>
  said === ""
    ? undefined
    : said.startsWith("team-player/")
      ? said
      : `competition-player/${said}`;

// What a tournament is to be, as a form sends it to create one or to change
// one. A subtitle left empty is none, and so is a region left empty.
export const tournamentFrom = (body: unknown): TournamentRequest => {
  const subtitle = textOf(body, "subtitle");
  const region = textOf(body, "region");
  return {
    name: textOf(body, "name"),
    starts: textOf(body, "starts"),
    finishes: textOf(body, "finishes"),
    format: textOf(body, "format"),
    sport: textOf(body, "sport"),
    country: textOf(body, "country"),
    ...(region === "" ? {} : { region }),
    ...(subtitle === "" ? {} : { subtitle }),
    levelTestsDrawn: yesOrNoOf(body, "levelTestsDrawn"),
    national: yesOrNoOf(body, "national"),
    international: yesOrNoOf(body, "international"),
  };
};

// A note's description may be 750,000 characters (ManagerNoteDescription.ts),
// counted as a reader counts them, and a character can take several bytes to
// send: an accented letter typed as a letter and its accent takes three, and
// JSON escapes some characters into six. So adding and editing a note take a
// body larger than the 1 MiB every other request is held to: eight, room for
// a description at its limit of any of those. The description's own rule is
// still what refuses one too long.
export const noteBodyLimit = 8 * 1024 * 1024;

// What a note is, as the note dialog sends it. A description left empty is
// no description.
export const noteFrom = (body: unknown) => ({
  title: textOf(body, "title"),
  description: textOf(body, "description"),
});

// What a team is, as the team dialog sends it. Its flag is left out where
// none was chosen.
export const teamFrom = (body: unknown) => {
  const flag = textOf(body, "flag");
  return {
    name: textOf(body, "name"),
    shortName: textOf(body, "shortName"),
    ...(flag === "" ? {} : { flag }),
  };
};

// What a player in a team is, as the team player dialog sends it. Their
// world ranking name is left out where nothing was said.
export const teamPlayerFrom = (body: unknown) => {
  const worldRankingName = textOf(body, "worldRankingName");
  return {
    name: textOf(body, "name"),
    ...(worldRankingName === "" ? {} : { worldRankingName }),
  };
};

// What a test is, as the test dialog sends it: its teams by the part of
// their ids after "team/", nothing where none was chosen, for the request
// to refuse.
export const testFrom = (body: unknown): TestRequest => {
  const team = (field: string): string | undefined => {
    const said = textOf(body, field);
    return said === "" ? undefined : `team/${said}`;
  };
  return {
    firstTeam: team("firstTeam"),
    secondTeam: team("secondTeam"),
    starts: textOf(body, "starts"),
    finishes: textOf(body, "finishes"),
    expectedMatches: numberOf(body, "expectedMatches"),
    bestOf: numberOf(body, "bestOf"),
    group: textOf(body, "group"),
    rules: rulesOf(body),
  };
};
