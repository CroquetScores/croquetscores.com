import { pencilPath } from "../common/iconPaths.js";

// The pencil an Edit button is drawn as, the same outline the public pages
// draw (commentary.ts). Hidden from a screen reader: the button names itself.
export const Pencil = (): React.JSX.Element => (
  <svg className="icon icon-pencil" viewBox="0 0 24 24" aria-hidden="true">
    <path d={pencilPath} />
  </svg>
);
