import { go } from "../../../../../../navigation.js";
import { say } from "../../../../../../words.js";
import { People } from "../../../../../../people.js";
import { idInAddress } from "../../../../../../api.js";

// The Managers tab (managers-tab.feature). A tournament always has a manager,
// so the last one is not offered Remove. A reader taking themselves off is told
// what it will mean in words of its own, since nobody on the page can undo it
// for them, and once they are off they can no longer see the page, so they are
// taken back to their list of tournaments.
export const ManagersTab = ({
  tournament,
}: {
  readonly tournament: string;
}): React.JSX.Element => (
  <People
    at={`/api/v1/tournaments/${idInAddress(tournament)}/managers`}
    listedUnder="managers"
    name="managers"
    fieldAbove
    words={{
      add: "admin.managers.add",
      none: "admin.managers.none",
      removeTitle: "admin.managers.removeTitle",
      otherwise: "admin.managers.otherwise",
    }}
    removable={(_manager, everybody) => everybody.length > 1}
    explanation={(manager) =>
      manager.isReader === true
        ? say("admin.managers.removeYourself.explanation")
        : say("admin.managers.removeExplanation", { name: manager.name })
    }
    removed={(manager) => {
      if (manager.isReader === true) go("/admin/");
    }}
  />
);
