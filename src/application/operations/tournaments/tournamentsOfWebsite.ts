// What the three questions the home page asks share: the tournaments of a
// website as the read model keeps them, and the filter a reader narrows them
// by, made from what the request names.
import { Countries } from "../../../domain/aggregates/tournaments/value-objects/Countries.js";
import { TournamentFilter } from "../../../domain/aggregates/tournaments/value-objects/TournamentFilter.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { Website } from "../../../domain/common/Website.js";
import { TournamentOperationRefused } from "./tournamentOperations.js";

/** A tournament as a row of the home page shows it and leads to it. */
export interface TournamentOfWebsite {
  readonly id: string;
  readonly name: string;
  /** Each a day, written as the year, the month and the day. */
  readonly starts: string;
  readonly finishes: string;
  /** The code of the country it is played in. */
  readonly country: string;
  /** Where it is found, as "2026/ac/spring-open". */
  readonly address: string;
}

/** A tournament played lately, and when the last game in use was added to it. */
export interface TournamentPlayed extends TournamentOfWebsite {
  readonly lastPlayed: ReadOnlyDate;
}

/**
 * The tournaments of each website, and the years they are in, as a read model
 * keeps them. None of them archived: an archived tournament is not one a
 * reader is sent to. The application names what it asks; the infrastructure
 * keeps the answer.
 */
export interface TournamentsByWebsite {
  /**
   * Those on `website` the filter lets through with a game in use added at
   * `since` or after: the one played most lately first, and those last played
   * at the same moment by name.
   */
  playedSince(
    website: Website,
    since: ReadOnlyDate,
    filter: TournamentFilter,
  ): Promise<readonly TournamentPlayed[]>;

  /**
   * Those on `website` the filter lets through starting from the day `first`
   * to the day `last`, both written as the year, the month and the day, and
   * both ends with them: the soonest first, and those starting on the same day
   * by name.
   */
  startingBetween(
    website: Website,
    first: string,
    last: string,
    filter: TournamentFilter,
  ): Promise<readonly TournamentOfWebsite[]>;

  /** The years it has a tournament starting in, the newest first, each once. */
  yearsOf(website: Website): Promise<readonly number[]>;
}

/** What a reader chose to narrow the tournaments by, each by its code. */
export interface FilterChosen {
  readonly country?: string | undefined;
  readonly region?: string | undefined;
  readonly sport?: string | undefined;
}

/**
 * The filter of what was `chosen` on `website`. A country there is not is
 * refused as `operation`'s `NoSuchCountry`, as creating a tournament refuses
 * one, and anything else the filter cannot be is the filter's to refuse.
 */
export const filterFor = (
  website: Website,
  chosen: FilterChosen,
  operation: "RecentResults" | "UpcomingTournaments",
): TournamentFilter => {
  const country =
    chosen.country === undefined
      ? undefined
      : Countries.thereAre.find(chosen.country);
  if (chosen.country !== undefined && country === undefined) {
    throw new TournamentOperationRefused(
      `${operation}.NoSuchCountry`,
      "There is no such country.",
    );
  }
  return TournamentFilter.from(website, {
    country,
    region: chosen.region,
    sport: chosen.sport,
  });
};

/** Whether each of what was chosen is text or nothing, as a request has to say. */
export const isChosen = (chosen: unknown): chosen is FilterChosen => {
  if (typeof chosen !== "object" || chosen === null) return false;
  const { country, region, sport } = chosen as Record<string, unknown>;
  return [country, region, sport].every(
    (each) => each === undefined || typeof each === "string",
  );
};
