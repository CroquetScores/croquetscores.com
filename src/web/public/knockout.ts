// A knockout's grid, at the knockout's address followed by "grid": its draw
// drawn out as the old site drew it, a column for each round, first round
// first, each headed by the round's name for whatever reads the page aloud,
// though not shown, as the old site showed none. A round's matches are in the
// order of the draw, each its two sides one above the other with a cell for
// each game the match is the best of, and each two whose winners meet next
// bracketed together by a line that leads on to that match. Every round's
// column is as tall as the first's and gives each pair an equal share of it,
// its two matches at a quarter and three quarters of the way down, so that a
// later round's match stands level with the gap between the two before it,
// with nothing to measure.
//
// While there is more of the grid to the right than shows, an arrow halfway
// down its right edge says so, and once it is scrolled from its start, one
// halfway down its left edge leads back. They need no scripting: each leads
// to a round, the final or the first, and following a link to part of a page
// scrolls whatever holds it to bring it into view, the grid across among
// them. Whether there is more either way is the stylesheet's to know, by how
// far the grid is scrolled. What every view of a competition shares is
// competitionPages.ts's, and the summary draws a match as this does
// (knockoutSummary.ts).
import type {
  KnockoutToRead,
  MatchOfKnockout,
  RoundOfKnockout,
  SideOfKnockout,
  WhichSide,
} from "../../application/operations/tournaments/PublicKnockoutOfTournament.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import type { DrawView } from "./competitionPages.js";
import { playerShown } from "./tournamentPages.js";

/**
 * The name of the round at `at`, the first being 0, of a knockout of `rounds`
 * rounds, as the old site named them: counted back from the last, the Final,
 * the Semi Finals and the Quarter Finals, and any before those counted on
 * from the first.
 */
export const roundName = (
  at: number,
  rounds: number,
  speaking: Speaking,
): string => {
  const { say } = speaking;
  switch (rounds - 1 - at) {
    case 0:
      return say("knockout.round.final");
    case 1:
      return say("knockout.round.semis");
    case 2:
      return say("knockout.round.quarters");
    default:
      return say("knockout.round.number", { number: String(at + 1) });
  }
};

// Who a side is: a player as the tournament's other pages show one, saying
// so where they have withdrawn; a bye, said as one; or nothing, where the
// place is not yet known or nobody was entered in it.
const sideNamed = (
  side: SideOfKnockout,
  speaking: Speaking,
  assets: Assets,
): string => {
  const { say } = speaking;
  switch (side.is) {
    case "player": {
      const { player } = side;
      const withdrawn = player.withdrawn
        ? ` <span class="knockout-withdrawn">${escape(say("block.withdrawn"))}</span>`
        : "";
      return `${playerShown(player, "player", speaking, assets, `/${player.address}`)}${withdrawn}`;
    }
    case "bye":
      return `<span class="knockout-bye">${escape(say("knockout.bye"))}</span>`;
    default:
      return "";
  }
};

// The side at `which` of `match`, on a row of its own: who it is, then its
// score in each game the match is the best of, marked won or lost for it by
// more than its colour, and empty for a game not played.
const sideRow = (
  match: MatchOfKnockout,
  which: WhichSide,
  bestOf: number,
  speaking: Speaking,
  assets: Assets,
): string => {
  const side = match.sides[which];
  const known = side.is === "player" || side.is === "bye";
  const cells = Array.from({ length: bestOf }, (_, at) => {
    const game = match.games[at];
    if (game === undefined) return `<td class="knockout-score"></td>`;
    const result = game.winner === which ? "won" : "lost";
    return `<td class="knockout-score"><span class="knockout-${result}"><span class="knockout-points">${escape(game.scores[which])}</span> <span class="visually-hidden">${escape(speaking.say(`block.${result}`))}</span></span></td>`;
  });
  return `<tr class="knockout-side${known ? "" : " knockout-side-unknown"}"><th scope="row" class="knockout-name">${sideNamed(side, speaking, assets)}</th>${cells.join("")}</tr>`;
};

/** A match as the grid and the summary draw it: its two sides, one above the other. */
export const matchShown = (
  match: MatchOfKnockout,
  bestOf: number,
  speaking: Speaking,
  assets: Assets,
): string => `<table class="knockout-match"><tbody>
${sideRow(match, 0, bestOf, speaking, assets)}
${sideRow(match, 1, bestOf, speaking, assets)}
</tbody></table>`;

// A round's matches two by two, as the old site joined them: the two whose
// winners meet in the next round, which a line brackets together. The final
// is a pair of one, since nothing follows it.
const pairsOf = (
  matches: readonly MatchOfKnockout[],
): readonly (readonly MatchOfKnockout[])[] =>
  Array.from({ length: Math.ceil(matches.length / 2) }, (_, at) =>
    matches.slice(at * 2, at * 2 + 2),
  );

const roundShown = (
  round: RoundOfKnockout,
  at: number,
  rounds: number,
  speaking: Speaking,
  assets: Assets,
): string => `            <section class="knockout-round"${at === rounds - 1 ? ' id="knockout-final"' : at === 0 ? ' id="knockout-first"' : ""} aria-labelledby="knockout-round-${String(at)}">
              <h2 class="knockout-round-name visually-hidden" id="knockout-round-${String(at)}">${escape(roundName(at, rounds, speaking))}</h2>
              <div class="knockout-matches">
${pairsOf(round.matches)
  .map(
    (pair) =>
      `<div class="knockout-pair${pair.length === 1 ? " knockout-pair-alone" : ""}">${pair.map((match) => matchShown(match, round.bestOf, speaking, assets)).join("")}</div>`,
  )
  .join("\n")}
              </div>
            </section>`;

// The arrows' shafts and heads, drawn rather than written, so that each
// stands in the middle of its circle whatever the font, which places an arrow
// written as a letter where its own spacing puts it.
const onward = "M5 12h14M13 6l6 6-6 6";
const back = "M19 12H5M11 6l-6 6 6 6";

const arrowDrawn = (path: string): string =>
  `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="${path}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const grid = (
  asked: KnockoutToRead,
  speaking: Speaking,
  assets: Assets,
): string => `          <div class="knockout-frame">
            <div class="knockout-scroll" role="region" aria-labelledby="competition-heading" tabindex="0">
              <div class="knockout">
${asked.rounds.map((round, at) => roundShown(round, at, asked.rounds.length, speaking, assets)).join("\n")}
              </div>
            </div>
            <a class="knockout-arrow knockout-back" href="#knockout-first">${arrowDrawn(back)}<span class="visually-hidden">${escape(speaking.say("knockout.back"))}</span></a>
            <a class="knockout-arrow knockout-onward" href="#knockout-final">${arrowDrawn(onward)}<span class="visually-hidden">${escape(speaking.say("knockout.onward"))}</span></a>
          </div>`;

/** What draws a knockout's grid. */
export const knockoutView =
  (assets: Assets): DrawView<KnockoutToRead> =>
  (asked, speaking) =>
    grid(asked, speaking, assets);
