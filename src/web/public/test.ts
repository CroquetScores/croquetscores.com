// A test's grid, at the test's address followed by "grid", as the old site
// drew it: what each match is the best of, then a table headed by the two
// teams by their names, the first on the left and each over its own side, a row for each match played in the order it
// began, the first team's player on the left and the second's on the right
// with the match's games between them, and beneath the matches each team's
// games and hoops on its own side. What every view of a competition shares is
// competitionPages.ts's.
import type {
  GameOfTestMatch,
  MatchOfTest,
  TestToRead,
} from "../../application/operations/tournaments/PublicTestOfTournament.js";
import type { WhichSide } from "../../application/operations/tournaments/PublicKnockoutOfTournament.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import type { DrawView } from "./competitionPages.js";

// One side's score in a game, marked as won by more than its colour where it
// won: a word said aloud, and a weight.
const scoreOf = (
  game: GameOfTestMatch,
  side: WhichSide,
  speaking: Speaking,
): string => {
  const won = game.winner === side;
  const said = won
    ? ` <span class="visually-hidden">${escape(speaking.say("block.won"))}</span>`
    : "";
  return `<span class="test-score${won ? " test-won" : ""}">${escape(game.scores[side])}</span>${said}`;
};

const matchRow = (match: MatchOfTest, speaking: Speaking): string =>
  `              <tr class="test-match">
                <td class="test-side">${escape(match.sides[0])}</td>
                <td class="test-games">${match.games.map((game) => `<span class="test-game">${scoreOf(game, 0, speaking)} - ${scoreOf(game, 1, speaking)}</span>`).join("")}</td>
                <td class="test-side">${escape(match.sides[1])}</td>
              </tr>`;

const grid = (asked: TestToRead, speaking: Speaking): string => {
  const { say } = speaking;
  const [first, second] = asked.test.teams;
  const totals: readonly {
    word: string;
    of: (team: { games: number; hoops: number }) => number;
  }[] = [
    { word: "test.games", of: (team) => team.games },
    { word: "test.hoops", of: (team) => team.hoops },
  ];
  const numbers = new Intl.NumberFormat(speaking.language.tag);
  return `          <p class="test-best-of">${escape(say("test.bestOf", { count: String(asked.test.bestOf) }))}</p>
          <div class="test-scroll" role="region" aria-labelledby="competition-heading" tabindex="0">
          <table class="test-matches">
            <thead>
              <tr>
                <th scope="col" class="test-team">${escape(first.name)}</th>
                <th scope="col" class="test-vs">${escape(say("test.vs"))}</th>
                <th scope="col" class="test-team">${escape(second.name)}</th>
              </tr>
            </thead>
            <tbody>
${asked.matches.map((match) => matchRow(match, speaking)).join("\n")}
            </tbody>
            <tfoot>
${totals
  .map(
    ({ word, of }) => `              <tr class="test-total">
                <td class="test-total-number">${escape(numbers.format(of(first)))}</td>
                <th scope="row" class="test-total-name">${escape(say(word))}</th>
                <td class="test-total-number">${escape(numbers.format(of(second)))}</td>
              </tr>`,
  )
  .join("\n")}
            </tfoot>
          </table>
          </div>`;
};

/** What draws a test's grid, which shows no flag and so needs no assets. */
export const testView = (): DrawView<TestToRead> => (asked, speaking) =>
  grid(asked, speaking);
