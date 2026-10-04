// A Swiss's summary, the view for a phone, as the old site's was: the grid's
// table without its results (swiss.ts), so that it is never wider than a
// phone. What every view of a competition shares is competitionPages.ts's.
import type { SwissToRead } from "../../application/operations/tournaments/PublicSwissOfTournament.js";
import type { Assets } from "../common/assets.js";
import type { DrawView } from "./competitionPages.js";
import { swissTable } from "./swiss.js";

/** What draws a Swiss's summary. */
export const swissSummaryView =
  (assets: Assets): DrawView<SwissToRead> =>
  (asked, speaking) =>
    swissTable(asked, false, speaking, assets);
