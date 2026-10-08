import { say } from "../../../../../../words.js";
import { idInAddress, People } from "../people.js";

// The Scorers tab (scorers-tab.feature): the Managers tab for scorers, but
// that a tournament needs no scorer, so every one is offered Remove, and the
// reader is a manager, so never among them.
export const ScorersTab = ({
  tournament,
}: {
  readonly tournament: string;
}): React.JSX.Element => (
  <People
    at={`/api/v1/tournaments/${idInAddress(tournament)}/scorers`}
    listedUnder="scorers"
    name="scorers"
    fieldAbove
    words={{
      add: "admin.scorers.add",
      none: "admin.scorers.none",
      removeTitle: "admin.scorers.removeTitle",
      otherwise: "admin.scorers.otherwise",
    }}
    explanation={(scorer) =>
      say("admin.scorers.removeExplanation", { name: scorer.name })
    }
  />
);
