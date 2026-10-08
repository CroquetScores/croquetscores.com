import { say } from "../words.js";

// The section bar of the administrator's pages (AdministratorSections.feature):
// back to the tournaments, and on to the accounts, to the page where the
// world ranking players are imported, and to the documents the import from
// the old sites refused. Tournaments is never marked
// here, since the tournaments are not one of the administrator's pages; and
// the administrator's pages at /admin/administrator itself are neither
// section, so nothing is marked there.
//
// Its links are plain links, which the admin follows in place as it does
// every link to one of its pages (App.tsx).

interface Props {
  /** The section being read, if the page is one of them. */
  readonly reading?:
    "accounts" | "world-rankings" | "import-errors" | undefined;
}

export const AdministratorSections = ({
  reading,
}: Props): React.JSX.Element => (
  <nav
    className="site-sections"
    aria-label={say("admin.administrator.sections.label")}
  >
    <div className="page">
      <ul>
        <li>
          {/* /admin/ rather than /admin, which is only sent on to it. */}
          <a href="/admin/">
            {say("admin.administrator.sections.tournaments")}
          </a>
        </li>
        <li>
          <a
            href="/admin/administrator/accounts"
            aria-current={reading === "accounts" ? "page" : undefined}
          >
            {say("admin.administrator.sections.accounts")}
          </a>
        </li>
        <li>
          <a
            href="/admin/administrator/import-world-ranking-players"
            aria-current={reading === "world-rankings" ? "page" : undefined}
          >
            {say("admin.administrator.sections.worldRankings")}
          </a>
        </li>
        <li>
          <a
            href="/admin/administrator/import-errors"
            aria-current={reading === "import-errors" ? "page" : undefined}
          >
            {say("admin.administrator.sections.importErrors")}
          </a>
        </li>
      </ul>
    </div>
  </nav>
);
