import { useEffect, useId, useRef, useState } from "react";

import { sameWords } from "../common/sameWords.js";

interface Choice {
  readonly code: string;
  readonly name: string;
}

interface Props extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "list" | "type" | "role"
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
 *
 * The suggestions are a list of its own, drawn beneath the field as wide as it
 * is and in its text, and not the datalist a browser draws: a browser's is its
 * own to place and size, and narrows itself to what is in the box, which is
 * only the choice made once one has been. The arrow at the end of the field,
 * and the down arrow, open every name as though nothing were in it.
 */
export function NameChoice({
  choices,
  value,
  onChange,
  refusing = true,
  onKeyDown,
  onBlur,
  ...rest
}: Props): React.JSX.Element {
  const listId = useId();
  const field = useRef<HTMLInputElement>(null);
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
  // Whether the list is drawn, which of its names is the one the keys are on,
  // and whether it was opened by an arrow, which asks for every name, and not
  // by typing, which asks for those that have what was typed.
  const [open, setOpen] = useState(false);
  const [browsing, setBrowsing] = useState(false);
  const [active, setActive] = useState(-1);
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
    browsing ||
    typed.trim() === "" ||
    choices.some((each) => sameWords(each.name, typed))
      ? choices
      : choices.filter((each) =>
          each.name.toLowerCase().includes(typed.trim().toLowerCase()),
        );
  useEffect(() => {
    // The name the keys are on stays in view, as a list that scrolls is for.
    if (open && active >= 0) {
      document
        .getElementById(`${listId}-${String(active)}`)
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [open, active, listId]);

  const close = (): void => {
    setOpen(false);
    setBrowsing(false);
    setActive(-1);
  };
  // Every name, with the keys on the one chosen, if one is.
  const openAll = (): void => {
    setBrowsing(true);
    setOpen(true);
    setActive(choices.findIndex((each) => sameWords(each.name, typed)));
  };
  const choose = (choice: Choice): void => {
    setTyped(choice.name);
    told.current = choice.code;
    onChange(choice.code);
    close();
  };

  return (
    <span className="name-choice">
      <input
        {...rest}
        ref={field}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          open && active >= 0 ? `${listId}-${String(active)}` : undefined
        }
        autoComplete="off"
        value={typed}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!open) openAll();
            else setActive((now) => Math.min(now + 1, suggested.length - 1));
          } else if (event.key === "ArrowUp" && open) {
            event.preventDefault();
            setActive((now) => Math.max(now - 1, 0));
          } else if (event.key === "Enter" && open && active >= 0) {
            // Choosing is not sending the form.
            event.preventDefault();
            const choice = suggested[active];
            if (choice !== undefined) choose(choice);
          } else if (event.key === "Escape" && open) {
            event.preventDefault();
            close();
          }
        }}
        onBlur={(event) => {
          onBlur?.(event);
          close();
        }}
        onChange={(event) => {
          const words = event.target.value;
          setTyped(words);
          setBrowsing(false);
          setOpen(true);
          setActive(-1);
          const named = choices.find((each) => sameWords(each.name, words));
          told.current = named?.code ?? (refusing ? words.trim() : "");
          onChange(told.current);
        }}
      />
      {/* For the mouse alone, since the keys do what it does: not a button, so
          that it is not a tab stop or a thing the form is said to have. It
          does not take the focus from the field, which closing the list on
          blur would otherwise answer by closing it as it opens. It shows every
          name, and shuts the list where every name is shown already. */}
      <span
        className="name-choice-arrow"
        aria-hidden="true"
        onMouseDown={(event) => {
          event.preventDefault();
          field.current?.focus();
          if (open && browsing) close();
          else openAll();
        }}
      />
      <ul
        id={listId}
        role="listbox"
        className="name-choice-list"
        hidden={!open}
      >
        {suggested.map(({ code, name }, at) => (
          <li
            key={code}
            id={`${listId}-${String(at)}`}
            role="option"
            aria-selected={at === active}
            className={at === active ? "name-choice-active" : undefined}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={() => {
              choose({ code, name });
            }}
          >
            {name}
          </li>
        ))}
      </ul>
    </span>
  );
}
