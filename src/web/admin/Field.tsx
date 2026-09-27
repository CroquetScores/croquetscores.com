// A field of the admin's own forms, drawn as every dialog's is: the form that
// creates and changes a tournament, a tab's own form, and a modal dialog's.
// Here rather than in any one of them, so that they cannot come to differ.

/** What was refused about a field: the refusal's code, and its words. */
export interface Refusal {
  readonly code: string;
  readonly words: string;
}

interface FieldProps {
  readonly name: string;
  readonly label: string;
  readonly refused: readonly Refusal[] | undefined;
  /** A field whose label is always lifted: one that is never empty to look at. */
  readonly lifted?: boolean;
  readonly children: (said: {
    id: string;
    "aria-labelledby": string;
    "aria-describedby"?: string;
    "aria-invalid"?: true;
  }) => React.JSX.Element;
}

// A field drawn as every dialog's is (STYLE.md §5b): the box is the label, the
// label lies on the line until the field is in use, and what is wrong with it
// is beneath it, tied to it so that it is read out with it.
export const Field = ({
  name,
  label,
  refused,
  lifted,
  children,
}: FieldProps): React.JSX.Element => {
  const id = `field-${name}`;
  const labelId = `${id}-label`;
  const messageId = `${id}-message`;
  const wrong = refused !== undefined && refused.length > 0;
  return (
    <div className="field">
      <label
        className={lifted === true ? "field-box field-box-lifted" : "field-box"}
        htmlFor={id}
      >
        {/* Named by the label's words alone: a list inside the label would
            otherwise take the choice it shows into its own name. */}
        {children({
          id,
          "aria-labelledby": labelId,
          ...(wrong
            ? { "aria-describedby": messageId, "aria-invalid": true }
            : {}),
        })}
        <span className="field-label" id={labelId}>
          {label}
        </span>
      </label>
      {wrong ? (
        <p
          className="field-message"
          id={messageId}
          data-refused={refused.map(({ code }) => code).join(" ")}
        >
          {refused.map(({ code, words }) => (
            <span key={code}>{words}</span>
          ))}
        </p>
      ) : null}
    </div>
  );
};
