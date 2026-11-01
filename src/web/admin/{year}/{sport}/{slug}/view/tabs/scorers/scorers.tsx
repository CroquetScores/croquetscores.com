import { say } from "../../../../../../words.js";
import { People } from "../../../../../../people.js";
import { standardHelp, teamsHelp } from "../../../../../../helpAddress.js";
import { idInAddress } from "../../../../../../api.js";

// The Scorers tab (scorers-tab.feature): the Managers tab for scorers, but
// that a tournament needs no scorer, so every one is offered Remove, and the
// reader is a manager, so never among them.
export const ScorersTab = ({
  tournament,
  playedByTeams,
}: {
  readonly tournament: string;
  /** Whether it is played by teams, whose help is a page of its own. */
  readonly playedByTeams: boolean;
}): React.JSX.Element => (
  <People
    at={`/api/site/tournaments/${idInAddress(tournament)}/scorers`}
    listedUnder="scorers"
    name="scorers"
    fieldAbove
    help={(playedByTeams ? teamsHelp : standardHelp)(
      "managers-and-scorers",
      "scorers",
    )}
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
