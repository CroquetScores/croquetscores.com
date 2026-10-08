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
  /** What the field is for, said beneath it where its label alone would leave
      a reader wondering, and read out with it. */
  readonly explanation?: string | undefined;
  /**
   * Something said of what was typed, at the end of the line it is on, and
   * read out with the field as what is beneath it is. Nothing where there is
   * nothing to say.
   */
  readonly mark?: React.ReactNode;
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
  explanation,
  mark,
  children,
}: FieldProps): React.JSX.Element => {
  const id = `field-${name}`;
  const labelId = `${id}-label`;
  const messageId = `${id}-message`;
  const explanationId = `${id}-explanation`;
  const markId = `${id}-mark`;
  const wrong = refused !== undefined && refused.length > 0;
  // What is wrong first, since it is what the reader most needs to hear.
  const describedBy = [
    ...(wrong ? [messageId] : []),
    ...(explanation === undefined ? [] : [explanationId]),
    ...(mark === undefined ? [] : [markId]),
  ].join(" ");
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
          ...(describedBy === "" ? {} : { "aria-describedby": describedBy }),
          ...(wrong ? { "aria-invalid": true as const } : {}),
        })}
        <span className="field-label" id={labelId}>
          {label}
        </span>
        {mark === undefined ? null : (
          <span className="field-mark" id={markId}>
            {mark}
          </span>
        )}
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
      {explanation === undefined ? null : (
        <p className="field-explanation" id={explanationId}>
          {explanation}
        </p>
      )}
    </div>
  );
};
