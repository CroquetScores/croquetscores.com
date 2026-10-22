import { say } from "../../words.js";
import { People, type Person } from "../../people.js";

// The accounts page (accounts.feature): a section for each role, each listing
// the accounts holding it with Remove beside each, and beneath the list a
// field for an email address and Add, in the order the page was asked for.
// Drawn as a tournament's Managers and Scorers tabs are (people.tsx), since a
// role is given and taken as a part in a tournament is.

type Role =
  "administrator" | "ac-world-ranking-officer" | "gc-world-ranking-officer";

const RoleSection = ({ role }: { readonly role: Role }): React.JSX.Element => (
  <People
    at={`/api/v1/roles/${role}/accounts`}
    listedUnder="accounts"
    name={role}
    heading={say(`admin.roles.${role}.heading`)}
    fieldAbove={false}
    words={{
      add: "admin.roles.add",
      none: `admin.roles.${role}.none`,
      removeTitle: `admin.roles.${role}.removeTitle`,
      otherwise: "admin.people.otherwise",
    }}
    explanation={(holder: Person) =>
      say(`admin.roles.${role}.removeExplanation`, { name: holder.name })
    }
  />
);

export const Accounts = (): React.JSX.Element => (
  <div className="stack">
    <h1>{say("admin.accounts.title")}</h1>
    <RoleSection role="administrator" />
    <RoleSection role="ac-world-ranking-officer" />
    <RoleSection role="gc-world-ranking-officer" />
  </div>
);
