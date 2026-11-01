// A field of the admin's own forms, drawn as every dialog's is: the form that
// creates and changes a tournament, a tab's own form, and a modal dialog's.
// Here rather than in any one of them, so that they cannot come to differ.

import { say } from "./words.js";

// The words with the link to the help in the place the language put it. The
// link is the dialogs' own word for help, so that it is the same word in the
// title bar and here.
const withHelpLink = (words: string, help: string): React.ReactNode => {
  const [before = "", ...rest] = words.split("{help}");
  return (
    <>
      {before}
      <a href={help} target="_blank" rel="noopener noreferrer">
        {say("admin.dialog.help")}
      </a>
      {rest.join("{help}")}
    </>
  );
};

/** What was refused about a field: the refusal's code, and its words. */
export interface Refusal {
  readonly code: string;
  readonly words: string;
  /**
   * The line of what was typed it is about, where a field holds several lines
   * that are each refused on their own. Several refusals of one code are then
   * told apart by it.
   */
  readonly line?: number | undefined;
  /**
   * Where the help for it is. Its words then have `{help}` in them, which is
   * drawn as a link there, since where in a sentence the word for help falls
   * is for the language to say, and a link tacked on after it would say it
   * twice.
   */
  readonly help?: string | undefined;
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
   * A field whose label is not drawn, because the dialog it is in says what
   * it is for. It is still its name, for a screen reader.
   */
  readonly unlabelled?: boolean;
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
  unlabelled = false,
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
        <span
          className={unlabelled ? "field-label visually-hidden" : "field-label"}
          id={labelId}
        >
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
          {refused.map(({ code, words, line, help }, place) => (
            <span
              key={`${code}-${String(place)}`}
              data-code={code}
              data-line={line}
            >
              {help === undefined ? words : withHelpLink(words, help)}
            </span>
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
