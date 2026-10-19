/**
 * What a dialog says of what it has just done, such as that a player was
 * added. Told to a screen reader as it changes, since nothing else on the
 * dialog changes where the reader is.
 */
export const DialogStatus = ({
  children,
}: {
  readonly children: React.ReactNode;
}): React.JSX.Element => (
  <p className="dialog-status" role="status">
    {children}
  </p>
);
