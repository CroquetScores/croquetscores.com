// A Swiss's grid, at the Swiss's address followed by "grid": a table as the
// old site's was, a row for each player ranked, with their games, their wins,
// the share of their games they have won and their results, each game they
// played said as the opponent's initial and last name and the margin, as
// "C.Denny +4". The summary is the same table without the results
// (swissSummary.ts). What every view of a competition shares is
// competitionPages.ts's.
import type {
  PlayerOfSwiss,
  ResultOfSwiss,
  SwissToRead,
} from "../../application/operations/tournaments/PublicSwissOfTournament.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import type { DrawView } from "./competitionPages.js";
import { playerShown } from "./tournamentPages.js";

/**
 * A player's name as the old site's results said it: the first letter of
 * their first name and their last name, as "C.Denny", their last name being
 * their last word with a letter in it, so that a number added to tell two
 * players of one name apart, as "Andrew Hobbs (2)", is left out. A player of
 * one such word is that word.
 */
export const shortNameOf = (name: string): string => {
  const words = name.split(/\s+/u).filter((word) => /\p{L}/u.test(word));
  const [first] = words;
  const last = words.at(-1);
  if (first === undefined || last === undefined) return name;
  if (words.length === 1) return first;
  return `${Array.from(first)[0] ?? ""}.${last}`;
};

// A margin as the old site wrote it: a plus for a game won, a minus for one
// lost, and none for one drawn. The game's peeling follows it, as "+9tp".
const marginOf = (margin: number): string =>
  margin > 0 ? `+${String(margin)}` : String(margin);

// A result, said as the old site said it, with the opponent's whole name for
// whatever reads the page aloud, and marked won, lost or drawn by its class
// as well as by the sign of its margin. A withdrawn game is struck through,
// and said to be withdrawn, since it counts for nothing.
const resultShown =
  (speaking: Speaking) =>
  ({ opponent, result, margin, peeling, withdrawn }: ResultOfSwiss): string => {
    const marked = withdrawn ? " data-withdrawn" : "";
    const said = withdrawn
      ? ` <span class="swiss-result-withdrawn visually-hidden">${escape(speaking.say("block.gameWithdrawn"))}</span>`
      : "";
    return `<span class="swiss-result swiss-${result}"${marked}><span class="swiss-result-opponent"><span aria-hidden="true">${escape(shortNameOf(opponent.name))}</span><span class="visually-hidden">${escape(opponent.name)}</span></span> <span class="swiss-margin">${escape(marginOf(margin) + peeling)}</span>${said}</span>`;
  };

// The share of the games they have played that a player has won, to one
// decimal place, as "66.7%", or nothing where they have played none.
const shareOf = ({ gamesWon, gamesPlayed }: PlayerOfSwiss): string =>
  gamesPlayed === 0 ? "" : `${((gamesWon / gamesPlayed) * 100).toFixed(1)}%`;

/**
 * The Swiss's players ranked, in a table, with their results where
 * `withResults` says, as the grid has them and the summary has not.
 */
export const swissTable = (
  asked: SwissToRead,
  withResults: boolean,
  speaking: Speaking,
  assets: Assets,
): string => {
  const { say } = speaking;
  const byId = new Map(asked.players.map((player) => [player.id, player]));
  const columns: readonly {
    word: string;
    of: (player: PlayerOfSwiss) => string;
  }[] = [
    { word: "swiss.games", of: (player) => String(player.gamesPlayed) },
    {
      word: "swiss.wins",
      of: (player) => (player.gamesPlayed === 0 ? "" : String(player.gamesWon)),
    },
    { word: "swiss.winShare", of: shareOf },
  ];
  const rows = asked.ranked
    .flatMap((id) => {
      const player = byId.get(id);
      return player === undefined ? [] : [player];
    })
    .map((player) => {
      const withdrawn = player.withdrawn
        ? ` <span class="swiss-withdrawn">${escape(say("block.withdrawn"))}</span>`
        : "";
      const results = withResults
        ? `\n                <td class="swiss-results">${player.results.map(resultShown(speaking)).join(", ")}</td>`
        : "";
      return `              <tr>
                <th scope="row" class="swiss-player">${playerShown(player, "player", speaking, assets, `/${player.address}`, player.withdrawn)}${withdrawn}</th>
${columns.map(({ of }) => `                <td class="swiss-total">${escape(of(player))}</td>`).join("\n")}${results}
              </tr>`;
    })
    .join("\n");
  const headings = [
    ...columns.map(({ word }) => word),
    ...(withResults ? ["swiss.results"] : []),
  ];
  return `          <div class="swiss-scroll" role="region" aria-labelledby="competition-heading" tabindex="0">
          <table class="swiss-table">
            <thead>
              <tr>
                <td class="swiss-corner"></td>
${headings.map((word) => `                <th scope="col" class="swiss-heading">${escape(say(word))}</th>`).join("\n")}
              </tr>
            </thead>
            <tbody>
${rows}
            </tbody>
          </table>
          </div>`;
};

/** What draws a Swiss's grid. */
export const swissView =
  (assets: Assets): DrawView<SwissToRead> =>
  (asked, speaking) =>
    swissTable(asked, true, speaking, assets);
