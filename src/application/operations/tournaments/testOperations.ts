// What adding a test and updating one share: what a request says a test is,
// as it was chosen and typed, what it breaks of its own values' rules, and
// what the tournament is given of it.
import { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import type { TestDetails } from "../../../domain/aggregates/tournaments/Tournament.js";
import { BestOf } from "../../../domain/aggregates/tournaments/value-objects/BestOf.js";
import { ExpectedMatches } from "../../../domain/aggregates/tournaments/value-objects/ExpectedMatches.js";
import { TestGroup } from "../../../domain/aggregates/tournaments/value-objects/TestGroup.js";
import { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { brokenBy } from "./tournamentOperations.js";

/** What a request says a test is, as it was chosen and typed. */
export interface TestRequest {
  /** Each team by its id, or nothing where none was chosen. */
  readonly firstTeam?: string | undefined;
  readonly secondTeam?: string | undefined;
  /** Each a day, as "2026-10-03". */
  readonly starts: string;
  readonly finishes: string;
  readonly expectedMatches: number;
  readonly bestOf: number;
  /** Nothing, or nothing but whitespace, where the test is in no group. */
  readonly group?: string | undefined;
}

// The start of the day `written` in UTC, which is what a test's day is. A
// writing that is no day is refused as a moment that cannot be read, and so
// is a day the calendar has not got, as 30 February, which a Date would
// otherwise run on into the next month.
const dayFrom = (written: string): ReadOnlyDate => {
  const day = new Date(`${written}T00:00:00Z`);
  const isThatDay =
    !Number.isNaN(day.getTime()) && day.toISOString().slice(0, 10) === written;
  return ReadOnlyDate.from(isThatDay ? day : new Date(Number.NaN));
};

const chosen = (team: string | undefined): team is string =>
  team !== undefined && team.trim() !== "";

/**
 * Every rule `request` breaks of its values' own, in the order a form asks
 * them. A team not chosen breaks `operation`'s `FirstTeamMissing` or
 * `SecondTeamMissing`.
 */
export const brokenByTest = (
  request: TestRequest,
  operation: "AddTest" | "UpdateTest",
): BrokenRule[] => [
  ...(chosen(request.firstTeam)
    ? []
    : [{ code: `${operation}.FirstTeamMissing`, fields: ["firstTeam"] }]),
  ...(chosen(request.secondTeam)
    ? []
    : [{ code: `${operation}.SecondTeamMissing`, fields: ["secondTeam"] }]),
  ...brokenBy("starts", () => dayFrom(request.starts)),
  ...brokenBy("finishes", () => dayFrom(request.finishes)),
  ...brokenBy("expectedMatches", () =>
    ExpectedMatches.from(request.expectedMatches),
  ),
  ...brokenBy("bestOf", () => BestOf.from(request.bestOf)),
  ...brokenBy("group", () => TestGroup.from(request.group ?? "")),
];

/** What `request` says, as the tournament is given it, once it breaks nothing. */
export const testDetailsFrom = (request: TestRequest): TestDetails => ({
  firstTeam: TeamId.from(request.firstTeam ?? ""),
  secondTeam: TeamId.from(request.secondTeam ?? ""),
  starts: dayFrom(request.starts),
  finishes: dayFrom(request.finishes),
  expectedMatches: ExpectedMatches.from(request.expectedMatches),
  bestOf: BestOf.from(request.bestOf),
  group: TestGroup.from(request.group ?? ""),
});
