import { say } from "../../../../../../words.js";
import { PeopleTab } from "../people.js";

// The Scorers tab (scorers-tab.feature): the Managers tab for scorers, but
// that a tournament needs no scorer, so every one is offered Remove, and the
// reader is a manager, so never among them.
export const ScorersTab = ({
  tournament,
}: {
  readonly tournament: string;
}): React.JSX.Element => (
  <PeopleTab
    tournament={tournament}
    part="scorers"
    removable={() => true}
    explanation={(scorer) =>
      say("admin.scorers.removeExplanation", { name: scorer.name })
    }
  />
);
