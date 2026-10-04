// A knockout's summary, the view for a phone: its rounds one beneath another
// rather than side by side, each headed by its name, and each match drawn as
// the grid draws it (knockout.ts). A match whose sides are not yet both known
// is not listed, since there is nothing yet to say of it, nor is a round with
// no such match; the grid shows where they will be. What every view of a
// competition shares is competitionPages.ts's.
import type {
  KnockoutToRead,
  MatchOfKnockout,
} from "../../application/operations/tournaments/PublicKnockoutOfTournament.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import type { DrawView } from "./competitionPages.js";
import { matchShown, roundName } from "./knockout.js";

// Whether both of `match`'s sides are known: a player or a bye each.
const known = ({ sides }: MatchOfKnockout): boolean =>
  sides.every((side) => side.is === "player" || side.is === "bye");

const summary = (
  asked: KnockoutToRead,
  speaking: Speaking,
  assets: Assets,
): string =>
  `          <div class="knockout-summary">
${asked.rounds
  .map((round, at) => ({ round, at, listed: round.matches.filter(known) }))
  .filter(({ listed }) => listed.length > 0)
  .map(
    ({
      round,
      at,
      listed,
    }) => `            <section class="knockout-summary-round" aria-labelledby="knockout-round-${String(at)}">
              <h2 class="knockout-round-name" id="knockout-round-${String(at)}">${escape(roundName(at, asked.rounds.length, speaking))}</h2>
${listed.map((match) => matchShown(match, round.bestOf, speaking, assets)).join("\n")}
            </section>`,
  )
  .join("\n")}
          </div>`;

/** What draws a knockout's summary. */
export const knockoutSummaryView =
  (assets: Assets): DrawView<KnockoutToRead> =>
  (asked, speaking) =>
    summary(asked, speaking, assets);
