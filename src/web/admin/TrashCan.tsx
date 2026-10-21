// The trash can an Archive or Delete button is drawn as. The same one the
// public pages draw for a comment (commentary.ts), written again because the
// admin's bundle cannot take in a file of the server's. Hidden from a screen
// reader: the button names itself.
export const TrashCan = (): React.JSX.Element => (
  <svg className="icon icon-trash-can" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z" />
  </svg>
);
