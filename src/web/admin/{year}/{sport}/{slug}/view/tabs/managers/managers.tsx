import { say } from "../../../../../../words.js";
import { PeopleTab } from "../people.js";

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
  <PeopleTab
    tournament={tournament}
    part="managers"
    removable={(_manager, everybody) => everybody.length > 1}
    explanation={(manager) =>
      manager.isReader === true
        ? say("admin.managers.removeYourself.explanation")
        : say("admin.managers.removeExplanation", { name: manager.name })
    }
    removed={(manager) => {
      if (manager.isReader === true) window.location.assign("/admin/");
    }}
  />
);
