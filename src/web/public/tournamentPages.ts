// What the pages of a tournament a reader follows share, whichever of its
// sections they show (tournament.ts, players.ts, blockOrderOfPlay.ts): the
// section bar, how a player is shown, and how a game is.
import type { PlayerInGame } from "../../application/operations/tournaments/GamesOfTournament.js";
import type { CompetitionOfTournament } from "../../application/operations/tournaments/tournamentForReaders.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import { Flags } from "../../domain/aggregates/tournaments/value-objects/Flags.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import type { Section } from "../common/layout.js";

/**
 * The tournament's sections, by the address it is found at now: Recent, which
 * is its page, then Players, Notes and Commentary, then each of its
 * competitions in use. A tournament played by teams has no players of its
 * own, only its teams', so it has no Players.
 */
export const sectionsOf = (
  tournament: {
    readonly address: string;
    readonly playedByTeams: boolean;
    readonly competitions: readonly CompetitionOfTournament[];
  },
  speaking: Speaking,
): readonly Section[] => {
  const { say } = speaking;
  const here = `/${tournament.address}`;
  return [
    { href: here, label: say("tournament.recent") },
    ...(tournament.playedByTeams
      ? []
      : [{ href: `${here}/players`, label: say("tournament.players") }]),
    { href: `${here}/notes`, label: say("tournament.notes") },
    { href: `${here}/commentary`, label: say("tournament.commentary") },
    ...tournament.competitions.map((competition) => ({
      href: `/${competition.address}`,
      label: competition.name,
    })),
  ];
};

/**
 * A player as a tournament's pages show them: their name, what they represent
 * in brackets, and the flag they fly, named by what it is the flag of. Nothing
 * is left in the place of what they have none of. Each part is marked with
 * `kind` and what it is, as "game-name", so that a page can draw its own; the
 * name leads to `href` where one is given.
 */
export const playerShown = (
  {
    name,
    representing,
    flag,
  }: {
    readonly name: string;
    readonly representing?: string | undefined;
    readonly flag?: string | undefined;
  },
  kind: string,
  speaking: Speaking,
  assets: Assets,
  href?: string,
): string => {
  const flown = flag === undefined ? undefined : Flags.thereAre.find(flag);
  return [
    href === undefined
      ? `<span class="${kind}-name">${escape(name)}</span>`
      : `<a class="${kind}-name" href="${escape(href)}">${escape(name)}</a>`,
    ...(representing === undefined
      ? []
      : [
          `<span class="${kind}-representing">(${escape(representing)})</span>`,
        ]),
    ...(flown === undefined
      ? []
      : [
          `<img class="${kind}-flag" src="${escape(assets.url(`images/${flown.relativePath}`))}" alt="${escape(speaking.say(`country.${String(flown)}`))}" />`,
        ]),
  ].join(" ");
};

// How long ago `then` was, as a reader would say it: seconds under a minute,
// minutes under an hour and hours under a day, each counted down to the whole
// one, and from a day on the day itself, in UTC as a tournament's days are,
// with its month named in the reader's language. The day is marked as one, so
// that what reads a page for its words can tell it from them.
const ago = (then: ReadOnlyDate, now: Date, speaking: Speaking): string => {
  const { say } = speaking;
  const seconds = Math.floor((now.getTime() - then.toDate().getTime()) / 1000);
  if (seconds < 60) {
    return escape(say("tournament.ago.seconds", { count: String(seconds) }));
  }
  if (seconds < 60 * 60) {
    return escape(
      say("tournament.ago.minutes", {
        count: String(Math.floor(seconds / 60)),
      }),
    );
  }
  if (seconds < 24 * 60 * 60) {
    const hours = Math.floor(seconds / (60 * 60));
    return escape(
      hours === 1
        ? say("tournament.ago.hour")
        : say("tournament.ago.hours", { count: String(hours) }),
    );
  }
  const day = then.toDate();
  const month = new Intl.DateTimeFormat(speaking.language.tag, {
    month: "short",
    timeZone: "UTC",
  }).format(day);
  const written = `${String(day.getUTCDate()).padStart(2, "0")} ${month} ${String(day.getUTCFullYear())}`;
  return `<span class="game-day">${escape(written)}</span>`;
};

/** A game as a tournament's pages list it. */
export interface GameShown {
  readonly winner: PlayerInGame;
  /** Each score as it was typed, as "26tp". */
  readonly winnerScore: string;
  readonly loser: PlayerInGame;
  readonly loserScore: string;
  readonly drawn: boolean;
  /** When it was added, or nothing where that was never kept. */
  readonly addedAt: ReadOnlyDate | undefined;
}

/**
 * A game as the pages that list games show it: the winner on one line, with
 * their score and "beat", or "drew with" where it was drawn, and the loser on
 * the next with theirs. Beside the winner is `beside`, already escaped, where
 * there is anything to say there, and beside the loser how long before `now`
 * the game was added.
 */
export const gameShown = (
  played: GameShown,
  beside: string | undefined,
  now: Date,
  speaking: Speaking,
  assets: Assets,
): string => {
  const { say } = speaking;
  const result = say(played.drawn ? "tournament.drewWith" : "tournament.beat");
  return `            <li class="game">
              <p class="game-line game-winner">${playerShown(played.winner, "game", speaking, assets)} <span class="game-score">${escape(played.winnerScore)}</span> <span class="game-result">${escape(result)}</span></p>
${beside === undefined ? "" : `              <p class="game-beside game-competition">${beside}</p>\n`}              <p class="game-line game-loser">${playerShown(played.loser, "game", speaking, assets)} <span class="game-score">${escape(played.loserScore)}</span></p>
              <p class="game-beside game-ago">${played.addedAt === undefined ? "" : ago(played.addedAt, now, speaking)}</p>
            </li>`;
};
