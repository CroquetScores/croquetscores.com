import { useEffect, useId, useState } from "react";

import "./nameSuggestions.css";

// What a name field is given to suggest the names the website already has as
// the reader types: for a tournament's name (new.feature) and a competition's
// (competition.feature). Here, so that the two cannot come to suggest by
// different rules.

// How many names are suggested at most: more than a phone's screen holds is a
// list to scroll rather than one to glance at, and the reader who has not found
// theirs types another word.
const mostSuggested = 6;

// The names that have every word typed somewhere in them, in any order and
// any case, so that "CNSW Bronze" finds "CNSW AC Bronze Medal". A name that
// begins with what was typed would not, which is what a reader who remembers
// some of the words and not the rest is after. A name that is what was typed
// has nothing left to suggest, and nor has the name the thing being changed
// already has. The case is not folded for either: a name offered back in its
// proper capitals is how a name typed all in lower case, which is refused, is
// put right.
const suggestionsFor = (
  typed: string,
  names: readonly string[],
  own: string | undefined,
): string[] => {
  const words = typed.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return names
    .filter((each) => {
      const lower = each.toLowerCase();
      return (
        each !== typed.trim() &&
        each !== own &&
        words.every((word) => lower.includes(word))
      );
    })
    .slice(0, mostSuggested);
};

interface Options {
  /** Where the website's names are asked for, which answers `{ names }`. */
  readonly at: string;
  readonly name: string;
  readonly setName: (name: string) => void;
  /** The name the thing being changed has, which is not offered back to it. */
  readonly own?: string | undefined;
  /** Told whenever the reader types, for what typing is the end of. */
  readonly typed?: (() => void) | undefined;
}

/**
 * The attributes and handlers to spread on the name's input, and the list to
 * draw beside it, inside the same box.
 */
export const useNameSuggestions = ({
  at,
  name,
  setName,
  own,
  typed,
}: Options): {
  readonly input: React.InputHTMLAttributes<HTMLInputElement> & {
    "data-names": "unasked" | "asking" | "known";
  };
  readonly list: React.ReactNode;
  /**
   * Says the names the website has have changed, as when the dialog has just
   * added one, so that they are asked for again when the reader next types.
   */
  readonly renew: () => void;
} => {
  const [names, setNames] = useState<readonly string[]>([]);
  // Whether the suggestions are shown and which the keys are on. They are
  // shown as the reader types and put away by choosing one, leaving the field
  // or Escape.
  const [suggesting, setSuggesting] = useState(false);
  const [active, setActive] = useState(-1);
  // What asking for the names has come to, and where they were asked. Names
  // asked for somewhere else are not these, so a field that is moved to
  // another place begins unasked again rather than suggesting the old names.
  const [asked, setAsked] = useState<{
    readonly at: string;
    readonly state: "unasked" | "asking" | "known";
  }>({ at, state: "unasked" });
  const known = asked.at === at ? asked.state : "unasked";
  const listId = useId();

  // Asked when the reader first types in the name and not when the form opens:
  // a website has thousands of names, and a reader who never types there has
  // no use for them.
  useEffect(() => {
    if (!suggesting || known !== "unasked") return;
    setAsked({ at, state: "asking" });
    void fetch(at, { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { names: string[] })
          : undefined,
      )
      .then((answer) => {
        if (answer !== undefined) setNames(answer.names);
      })
      .catch(() => {
        // Nothing to suggest, which leaves the field as any other is.
      })
      // Said once it has finished whichever way it went, which is what a
      // scenario that a name is not suggested waits for.
      .finally(() => {
        setAsked((now) => (now.at === at ? { at, state: "known" } : now));
      });
  }, [suggesting, known, at]);

  // The name the keys are on stays in view, as a list that scrolls is for.
  useEffect(() => {
    if (active >= 0) {
      document
        .getElementById(`${listId}-${String(active)}`)
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [active, listId]);

  const suggestions = suggesting ? suggestionsFor(name, names, own) : [];
  const put = (chosen: string): void => {
    setName(chosen);
    setSuggesting(false);
    setActive(-1);
  };
  const away = (): void => {
    setSuggesting(false);
    setActive(-1);
  };

  return {
    renew: () => {
      setAsked({ at, state: "unasked" });
    },
    input: {
      role: "combobox",
      "aria-expanded": suggestions.length > 0,
      "aria-controls": suggestions.length > 0 ? listId : undefined,
      "aria-autocomplete": "list",
      "aria-activedescendant":
        active >= 0 && suggestions.length > 0
          ? `${listId}-${String(active)}`
          : undefined,
      "data-names": known,
      value: name,
      onChange: (event) => {
        setName(event.target.value);
        setSuggesting(true);
        setActive(-1);
        typed?.();
      },
      onBlur: away,
      onKeyDown: (event) => {
        // Not the Enter that ends a composition in an input method, which
        // confirms what was composed and is not a choice.
        if (suggestions.length === 0 || event.nativeEvent.isComposing) return;
        const chosen = suggestions[active];
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setActive((now) => Math.min(now + 1, suggestions.length - 1));
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          setActive((now) => Math.max(now - 1, -1));
        } else if (event.key === "Enter" && chosen !== undefined) {
          // Choosing is not sending the form: only where the keys are on a
          // name to choose.
          event.preventDefault();
          put(chosen);
        } else if (event.key === "Escape") {
          // Put the list away and no more: Escape is also what closes a
          // dialog the field may be in.
          event.preventDefault();
          event.stopPropagation();
          away();
        }
      },
    },
    // Drawn beneath the field, in the page's own words and not the list a
    // browser draws, which narrows itself to names that begin with what is
    // typed. The mouse press does not take the focus from the field, which
    // would put the list away before the click that chooses reached it.
    list:
      suggestions.length > 0 ? (
        <ul id={listId} role="listbox" className="name-suggestions">
          {suggestions.map((each, place) => (
            <li
              key={each}
              id={`${listId}-${String(place)}`}
              role="option"
              aria-selected={place === active}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={() => {
                put(each);
              }}
            >
              {each}
            </li>
          ))}
        </ul>
      ) : null,
  };
};
