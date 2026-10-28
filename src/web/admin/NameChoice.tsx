import { useEffect, useId, useRef, useState } from "react";

interface Choice {
  readonly code: string;
  readonly name: string;
}

// Capital letters are not worth a refusal in a name that is typed.
const sameWords = (one: string, other: string): boolean =>
  one.trim().toLowerCase() === other.trim().toLowerCase();

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
  useEffect(() => {
    if (value !== told.current) setTyped(nameOf(value));
  }, [value, choices]);
  // Narrowed to the names that have what has been typed, which is what the
  // list is specified to hold (tournaments.feature).
  const suggested =
    typed.trim() === ""
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
