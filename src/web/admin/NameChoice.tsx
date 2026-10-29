import { useEffect, useId, useRef, useState } from "react";

import { sameWords } from "../common/sameWords.js";

interface Choice {
  readonly code: string;
  readonly name: string;
}

interface Props extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "list" | "type"
> {
  readonly choices: readonly Choice[];
  /** The code of the choice made, or nothing where none is. */
  readonly value: string;
  /**
   * Told the code of the choice the typing names. Where it names none, the
   * words typed are told instead (see `refusing`), so that the server refuses
   * them with the code it always has rather than the form quietly keeping
   * nothing.
   */
  readonly onChange: (code: string) => void;
  /**
   * Whether words that name no choice are told on as they are, to be refused
   * (a form that is sent). A filter has nothing to refuse, and is told none
   * is chosen.
   */
  readonly refusing?: boolean;
}

/**
 * A field to type a country, a region or a sport into, which suggests the
 * names that have what has been typed so far. A drop-down list of a hundred
 * countries is a long way to scroll to Zimbabwe, and no line can be drawn
 * between groups in the suggestions of a field, so the groups' order is all
 * of them that is kept.
 */
export function NameChoice({
  choices,
  value,
  onChange,
  refusing = true,
  ...rest
}: Props): React.JSX.Element {
  const listId = useId();
  const nameOf = (code: string): string =>
    choices.find((each) => each.code === code)?.name ?? code;
  // What is in the box, which is not the choice made while it is being typed.
  const [typed, setTyped] = useState(nameOf(value));
  // The last choice this box told the form of. A choice that is that one is
  // the box's own, and the words that made it are the reader's to go on
  // editing: a name that is half deleted names nothing, which is told as none
  // chosen, and the form handing that back must not empty the box. Any other
  // is the form's doing, as when it empties the region because the country was
  // changed, or when the choices were not there yet to give the name of the
  // choice it began with, and the box says what it is.
  const told = useRef<string | undefined>(undefined);
  // What the choices are rather than which array holds them, since a form that
  // builds the array again as it is drawn has not changed them.
  const offered = JSON.stringify(choices.map((each) => [each.code, each.name]));
  const lastOffered = useRef(offered);
  useEffect(() => {
    // Other choices are another list, as the regions are of another country,
    // and words typed towards the old ones say nothing of them, even where the
    // choice made is none both before and after.
    const another = offered !== lastOffered.current;
    lastOffered.current = offered;
    if (value === told.current && !another) return;
    // Taken from the form, so nothing the box told it is still the choice: were
    // it left, the form coming back to that code (the browser's Forward, say)
    // would be taken for the box's own, and the box would not say so.
    told.current = undefined;
    setTyped(nameOf(value));
  }, [value, offered]);
  // Narrowed to the names that have what has been typed, which is what the
  // list is specified to hold (tournaments.feature). A whole name is not
  // something to narrow by: it is a choice made, and the reader who goes on to
  // make another needs all of them (new.feature).
  const suggested =
    typed.trim() === "" || choices.some((each) => sameWords(each.name, typed))
      ? choices
      : choices.filter((each) =>
          each.name.toLowerCase().includes(typed.trim().toLowerCase()),
        );
  return (
    <>
      <input
        {...rest}
        type="text"
        list={listId}
        autoComplete="off"
        value={typed}
        onChange={(event) => {
          const words = event.target.value;
          setTyped(words);
          const named = choices.find((each) => sameWords(each.name, words));
          told.current = named?.code ?? (refusing ? words.trim() : "");
          onChange(told.current);
        }}
      />
      <datalist id={listId}>
        {suggested.map(({ code, name }) => (
          <option key={code} value={name} />
        ))}
      </datalist>
    </>
  );
}
