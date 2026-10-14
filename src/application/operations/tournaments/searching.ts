import type { Website } from "../../../domain/common/Website.js";

/**
 * How many of each kind a search answers at most, so that a single letter
 * typed is answered with a page and not with the whole of the website
 * (Search.feature, SearchPlayersOfWebsite.feature).
 */
export const MOST_FOUND = 100;

// The accents written over and under letters, as Slug.ts takes them off: only
// those of the Latin, Greek and Cyrillic scripts, since a mark in another
// script is part of its letter.
const ACCENTS = /[̀-ͯ]/g;

// Anything that is not part of a letter or a digit, in any script.
const NEITHER_LETTER_NOR_DIGIT = /[^\p{L}\p{M}\p{N}]+/u;

/**
 * `text` as a name is looked for by it, and as a name is kept to be looked in:
 * with its accents off, in lower case, and with whatever separates its words
 * made one space. So "José  García" and "jose garcia" are the same, and a
 * word typed is found as part of a word kept.
 *
 * Taken apart first, so that an accent is a mark of its own that can be taken
 * off, and put back together last, so that a letter the taking apart split in
 * two, as it does a Korean syllable, is one letter again.
 */
export const foldedForSearch = (text: string): string =>
  text
    .normalize("NFKD")
    .replace(ACCENTS, "")
    .toLowerCase()
    .split(NEITHER_LETTER_NOR_DIGIT)
    .filter((part) => part !== "")
    .join(" ")
    .normalize("NFC");

/**
 * The words of `text`, each folded, which a name is found by when every one is
 * somewhere in it. None where there is nothing but what separates words, which
 * is no search at all.
 */
export const wordsOfSearch = (text: string): readonly string[] => [
  ...new Set(
    foldedForSearch(text)
      .split(" ")
      .filter((word) => word !== ""),
  ),
];

/** A tournament found, and where its page is, as "2026/ac/spring-open". */
export interface TournamentFound {
  readonly name: string;
  readonly address: string;
}

/**
 * A player found, once however many tournaments they have played in, and where
 * their page is, as "players/sam-someone".
 */
export interface PlayerFound {
  readonly name: string;
  readonly address: string;
}

/** A competition found, with the tournament it is in. */
export interface CompetitionFound {
  readonly name: string;
  /** Where it is, as "2026/ac/spring-open/competitions/block-a". */
  readonly address: string;
  readonly tournament: TournamentFound;
}

/** A tournament a player is in, as their page lists it and leads to it. */
export interface PlayerTournament {
  readonly name: string;
  /** Where it is found, as "2026/ac/spring-open". */
  readonly address: string;
  /** The day it started, written as the year, the month and the day. */
  readonly startedOn: string;
  /** Where the player's own page in it is, as "2026/ac/spring-open/players/sam-someone". */
  readonly playerAddress: string;
}

/** A player of a website, as their page shows them. */
export interface PlayerOfWebsiteFound {
  /** The world ranking name as the tournament that started most recently wrote it. */
  readonly name: string;
  /** The tournaments they are in, once each, the most recently started first. */
  readonly tournaments: readonly PlayerTournament[];
}

/**
 * The most that was asked for of a kind, and whether there were more than
 * that, so that a hundred is not taken for all there is.
 */
export interface Limited<T> {
  readonly found: readonly T[];
  readonly more: boolean;
}

/** What a search of a website found, each kind in alphabetical order. */
export interface SearchFound {
  readonly tournaments: readonly TournamentFound[];
  readonly players: readonly PlayerFound[];
  readonly competitions: readonly CompetitionFound[];
  /** Of which kinds there were more than were answered. */
  readonly more: {
    readonly tournaments: boolean;
    readonly players: boolean;
    readonly competitions: boolean;
  };
}

/** What a search of a website's players found. */
export interface PlayersFound {
  readonly players: readonly PlayerFound[];
  /** Whether there were more than were answered. */
  readonly more: boolean;
}

/**
 * What a website is searched by, read from the read model that keeps every
 * name there folded. Each is given the words of what was typed, of which every
 * one is to be in a name, and answers the first `most` in alphabetical order
 * of their names, archived ones and those of archived tournaments left out.
 */
export interface SearchByWebsite {
  tournaments(
    website: Website,
    words: readonly string[],
    most: number,
  ): Promise<Limited<TournamentFound>>;

  /** By world ranking name, each person once (SearchPlayersOfWebsite.feature). */
  players(
    website: Website,
    words: readonly string[],
    most: number,
  ): Promise<Limited<PlayerFound>>;

  competitions(
    website: Website,
    words: readonly string[],
    most: number,
  ): Promise<Limited<CompetitionFound>>;

  /**
   * The player whose world ranking name makes `slug`, or nothing where no
   * player of the website does, none being left once what is archived is.
   */
  player(
    website: Website,
    slug: string,
  ): Promise<PlayerOfWebsiteFound | undefined>;
}
