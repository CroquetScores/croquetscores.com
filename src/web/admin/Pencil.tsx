// The pencil an Edit button is drawn as. The same pencil the public pages draw
// (commentary.ts), written again because the admin's bundle cannot take in a
// file of the server's. Hidden from a screen reader: the button names itself.
export const Pencil = (): React.JSX.Element => (
  <svg className="icon icon-pencil" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25Zm17.7-10.2a1 1 0 0 0 0-1.42l-2.33-2.33a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" />
  </svg>
);
