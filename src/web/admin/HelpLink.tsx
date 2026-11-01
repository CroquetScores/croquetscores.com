import { say } from "./words.js";

import "./helpLink.css";

// The round "?" that leads to the help, in another tab so that what the reader
// was doing is kept. One component for a dialog, a page and a tab row, so that
// they cannot come to lead differently.

interface Props {
  /** Where the help is, as helpAddress.ts gives it. */
  readonly to: string;
  /** What it is called, where "Help" alone would not say what it is for. */
  readonly label?: string;
  /** Extra classes, for where it is drawn: over a title bar by default. */
  readonly className?: string;
}

export const HelpLink = ({
  to,
  label,
  className,
}: Props): React.JSX.Element => (
  <a
    className={
      className === undefined ? "dialog-help" : `dialog-help ${className}`
    }
    href={to}
    target="_blank"
    rel="noopener noreferrer"
    title={label ?? say("admin.dialog.help")}
    aria-label={label ?? say("admin.dialog.help")}
  >
    ?
  </a>
);
