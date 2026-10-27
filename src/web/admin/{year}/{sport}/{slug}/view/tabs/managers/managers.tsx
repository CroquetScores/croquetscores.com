import { go } from "../../../../../../navigation.js";
import { say } from "../../../../../../words.js";
import { People } from "../../../../../../people.js";
import { idInAddress } from "../../../../../../api.js";

// The subject of the message the link opens, which is the site's name for the
// world rankings' mail to a tournament's managers (managers-tab.feature).
const SUBJECT = "Croquet Scores";

// A message to every manager at once, which the reader's own email program
// opens, so that nothing is sent from the site. Each address is encoded as a
// part of the link, keeping its "@" as it is read, and a comma between each.
const mailtoOf = (addresses: readonly string[]): string =>
  `mailto:${addresses
    .map((address) => encodeURIComponent(address).replaceAll("%40", "@"))
    .join(",")}?subject=${encodeURIComponent(SUBJECT)}`;

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
    at={`/api/site/tournaments/${idInAddress(tournament)}/managers`}
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
    // Only those who write to the managers are told their addresses, so only
    // they are offered the link.
    above={(managers) => {
      const addresses = managers.flatMap(({ emailAddress }) =>
        emailAddress === undefined ? [] : [emailAddress],
      );
      return addresses.length === 0 ? null : (
        <p>
          <a className="button" href={mailtoOf(addresses)}>
            {say("admin.managers.email")}
          </a>
        </p>
      );
    }}
  />
);
