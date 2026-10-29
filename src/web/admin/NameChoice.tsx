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
  /**
   * What is said, as a browser says what is wrong with a field, while the box
   * holds words that name none of the choices. Given, the reader is held in the
   * box until it names one: leaving it by the keys or the pointer puts the focus
   * back and says so, and the form is not sent. Escape puts back the last choice
   * made, so that being held is never being stuck.
   */
  readonly mustChoose?: string | undefined;
  /** Whether nothing in the box is as much a fault, as where a choice is needed. */
  readonly required?: boolean;
}

// Set while a box takes the focus back, so that the box the focus is taken from,
// which is held too, does not take it back in its turn and the two go on for
// ever.
let takingTheFocusBack = false;

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
  mustChoose,
  required = false,
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
  // Whether what is in the box names none of the choices, which a box that is
  // held says to the browser, so that the browser too will not send the form.
  const invalid =
    mustChoose !== undefined &&
    (typed.trim() === ""
      ? required
      : !choices.some((each) => sameWords(each.name, typed)));
  const saySoToBrowser = (): void => {
    field.current?.setCustomValidity(invalid ? (mustChoose ?? "") : "");
  };
  useEffect(saySoToBrowser, [invalid, mustChoose]);
  // The last choice that was valid, to put back: none where nothing is a fault
  // and nothing was chosen, which is a choice of its own, and none where
  // something is needed and nothing has been chosen yet.
  const lastValid = useRef<string | undefined>(required ? undefined : "");
  // Looked for in the words in the box and not in the choice the form has, which
  // is none as soon as the words name none, and would put back nothing.
  useEffect(() => {
    const named = choices.find((each) => sameWords(each.name, typed));
    if (named !== undefined) lastValid.current = named.code;
    else if (typed.trim() === "" && !required) lastValid.current = "";
  }, [typed, offered, required]);
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
    lastValid.current = choice.code;
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
          // What is wrong is said again to send the form, and taken back for
          // as long as the reader keys on, since the bubble a browser draws
          // stays up for as long as it is said. Leaving says it again.
          if (event.key === "Enter") saySoToBrowser();
          else if (event.key !== "Tab")
            event.currentTarget.setCustomValidity("");
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
          } else if (
            event.key === "Escape" &&
            invalid &&
            lastValid.current !== undefined
          ) {
            // The way out of being held: what was chosen before is put back.
            event.preventDefault();
            const code = lastValid.current;
            setTyped(nameOf(code));
            told.current = code;
            onChange(code);
          }
        }}
        onBlur={(event) => {
          onBlur?.(event);
          close();
          const left = event.currentTarget;
          saySoToBrowser();
          // A window put behind another blurs its field and leaves it the one
          // the page has focused, so nothing was left; and a box taking the
          // focus back takes it from this one without this one being left.
          if (
            !invalid ||
            takingTheFocusBack ||
            left.ownerDocument.activeElement === left
          ) {
            return;
          }
          // Once the event that took the focus has finished, since a focus
          // given back inside it is taken away again by the move in progress.
          setTimeout(() => {
            if (left.validity.valid) return;
            takingTheFocusBack = true;
            left.focus();
            takingTheFocusBack = false;
            left.reportValidity();
          }, 0);
        }}
        onChange={(event) => {
          const words = event.target.value;
          setTyped(words);
          setBrowsing(false);
          setActive(-1);
          const named = choices.find((each) => sameWords(each.name, words));
          // A whole name has nothing left to suggest, and a list left open
          // under it covers whatever is beneath the field; typing on opens it.
          setOpen(named === undefined);
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
          // As a key does, the arrow takes back what is said to be wrong, so
          // that it is not left over the list it opens.
          field.current?.setCustomValidity("");
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
