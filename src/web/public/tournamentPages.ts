// What the pages of a tournament a reader follows share, whichever of its
// sections they show (tournament.ts, players.ts): the section bar, and how a
// player is shown.
import type { CompetitionOfTournament } from "../../application/operations/tournaments/tournamentForReaders.js";
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
