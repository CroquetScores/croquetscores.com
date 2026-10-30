import { Fragment } from "react";

interface Option {
  readonly code: string;
  readonly name: string;
}

// A list that is not in groups is one group, so that only the lists that are
// need say so.
const inGroups = (
  given: readonly Option[] | readonly (readonly Option[])[],
): readonly (readonly Option[])[] =>
  given.every((each) => Array.isArray(each))
    ? (given as readonly (readonly Option[])[])
    : [given as readonly Option[]];

/**
 * The options of a drop-down list in groups, with a line drawn between one
 * group and the next. Here rather than in each list, so that how a group is
 * told from the next is decided once.
 */
export function GroupedOptions({
  groups,
}: {
  readonly groups: readonly Option[] | readonly (readonly Option[])[];
}): React.JSX.Element {
  return (
    <>
      {inGroups(groups).map((group, at) => (
        <Fragment key={at}>
          {at === 0 ? null : <hr />}
          {group.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </Fragment>
      ))}
    </>
  );
}
