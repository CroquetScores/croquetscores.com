import { trashCanPath } from "../common/iconPaths.js";

// The trash can an Archive or Delete button is drawn as, the same outline the
// public pages draw for a comment (commentary.ts). Hidden from a screen reader:
// the button names itself.
export const TrashCan = (): React.JSX.Element => (
  <svg className="icon icon-trash-can" viewBox="0 0 24 24" aria-hidden="true">
    <path d={trashCanPath} />
  </svg>
);
