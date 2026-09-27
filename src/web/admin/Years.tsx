import { useLayoutEffect, useRef, useState } from "react";

import { say } from "./words.js";

// The years to choose from, in the section bar. The newest are tabs, as many
// as fit on one row of it, and the rest are in a drop-down list at the end of
// the row. The bar's own tabs wrap rather than hide anything, because they are
// the page's sections; years are not, and grow by one every season, so fifteen
// of them would wrap onto four rows on a phone before the list had begun.
//
// How many fit is measured rather than guessed from a breakpoint, since it
// depends on how many years there are as much as on the width, and it is
// measured again whenever the bar changes width, since turning a phone round
// changes it.

interface Props {
  /** Every year offered, the newest first. */
  readonly years: readonly number[];
  readonly chosen: number;
  readonly choose: (year: number) => void;
}

// How many of `widths` fit in `available`, `gap` apart, with room left for
// `list` after them when not all of them do.
const howManyFit = (
  widths: readonly number[],
  gap: number,
  list: number,
  available: number,
): number => {
  const across = (count: number): number =>
    widths.slice(0, count).reduce((sum, width) => sum + width, 0) +
    gap * Math.max(0, count - 1);
  // A pixel spare, since a width is measured to the pixel and laid out to a
  // fraction of one, and a row that fits exactly on paper can wrap in fact.
  if (across(widths.length) <= available - 1) return widths.length;
  let count = widths.length - 1;
  while (count > 0 && across(count) + gap + list > available - 1) count--;
  return count;
};

export const Years = ({ years, chosen, choose }: Props): React.JSX.Element => {
  // What the drop-down list says while the year chosen is a tab, and what it
  // is called for a reader who is listening rather than looking.
  const earlier = say("admin.years.earlier");
  const bar = useRef<HTMLDivElement>(null);
  const measuring = useRef<HTMLUListElement>(null);
  const [fit, setFit] = useState(years.length);

  useLayoutEffect(() => {
    const measure = (): void => {
      const list = measuring.current;
      if (list === null) return;
      const items = [...list.children] as HTMLElement[];
      const style = getComputedStyle(list);
      const available =
        list.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      const tabs = items.slice(0, -1).map((item) => item.offsetWidth);
      const dropDown = items.at(-1)?.offsetWidth ?? 0;
      setFit(
        howManyFit(tabs, parseFloat(style.columnGap) || 0, dropDown, available),
      );
    };
    measure();
    const watching = new ResizeObserver(measure);
    if (bar.current !== null) watching.observe(bar.current);
    return () => {
      watching.disconnect();
    };
  }, [years]);

  const tabs = years.slice(0, fit);
  const rest = years.slice(fit);
  const tab = (year: number): React.JSX.Element => (
    <a
      href={`/admin/${String(year)}`}
      aria-current={year === chosen ? "page" : undefined}
      onClick={(event) => {
        event.preventDefault();
        choose(year);
      }}
    >
      {year}
    </a>
  );
  const dropDown = (inThis: readonly number[]): React.JSX.Element => (
    <select
      aria-label={earlier}
      value={inThis.includes(chosen) ? String(chosen) : ""}
      onChange={(event) => {
        choose(Number(event.target.value));
      }}
    >
      <option value="" disabled hidden>
        {earlier}
      </option>
      {inThis.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );

  return (
    <nav className="site-sections years" aria-label={say("admin.years.label")}>
      <div className="page">
        <div className="years-row" ref={bar}>
          <ul>
            {tabs.map((year) => (
              <li key={year}>{tab(year)}</li>
            ))}
            {rest.length > 0 ? (
              <li className="years-earlier">{dropDown(rest)}</li>
            ) : null}
          </ul>
          {/* Every year as a tab, and the drop-down list saying what it says
            while it selects nothing, which is the widest it is: laid out as
            the bar lays them out and never seen, so that how wide each would
            be is known before deciding how many fit. */}
          <ul className="years-measuring" ref={measuring} aria-hidden="true">
            {years.map((year) => (
              <li key={year}>
                <a tabIndex={-1}>{year}</a>
              </li>
            ))}
            <li className="years-earlier">
              <select tabIndex={-1} aria-hidden="true" defaultValue="">
                <option value="">{earlier}</option>
              </select>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
