import type { Refusal } from "./Field.js";

/**
 * What was refused about a dialog as a whole rather than any one of its
 * fields, shown above them. Nothing where nothing was.
 *
 * The codes as well as the words, as a field's refusals carry them, so that
 * what was refused can be told apart from how it is said.
 */
export const DialogProblems = ({
  refused,
}: {
  readonly refused: readonly Refusal[];
}): React.JSX.Element | null =>
  refused.length > 0 ? (
    <div
      className="dialog-problems"
      data-refused={refused.map(({ code }) => code).join(" ")}
    >
      {refused.map(({ code, words }) => (
        <p key={code}>{words}</p>
      ))}
    </div>
  ) : null;
