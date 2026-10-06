import type { ReactNode } from "react";

import "./tabControl.css";

// A tab control (STYLE.md §5d): a row of tabs in the panel beneath a page's
// heading, and beneath them the tab panel holding what the tab being read
// holds, which the page gives as children. The tabs have no addresses, so they
// are buttons.

interface Props<Tab extends string> {
  /** The tabs, in their order. */
  readonly tabs: readonly Tab[];
  /** The one being read. */
  readonly chosen: Tab;
  readonly choose: (tab: Tab) => void;
  /** Each tab's words. */
  readonly wordsFor: (tab: Tab) => string;
  /** What the row is named for a reader who cannot see it. */
  readonly label: string;
  /** What the tab being read holds. */
  readonly children: ReactNode;
  /** What its tabs' and its panel's ids begin with, so that a tab control in
      a dialog over the page does not take the ids of the page's own. */
  readonly ids?: string;
}

export const TabControl = <Tab extends string>({
  tabs,
  chosen,
  choose,
  wordsFor,
  label,
  children,
  ids = "tab",
}: Props<Tab>): React.JSX.Element => {
  const tabPanelId = `${ids}-panel`;
  const tabId = (tab: string): string => `${ids}-${tab}`;
  return (
    <div className="tabbed">
      <div className="tab-control" role="tablist" aria-label={label}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            id={tabId(tab)}
            aria-controls={tabPanelId}
            aria-selected={tab === chosen}
            onClick={() => {
              choose(tab);
            }}
          >
            {wordsFor(tab)}
          </button>
        ))}
      </div>
      <div id={tabPanelId} role="tabpanel" aria-labelledby={tabId(chosen)}>
        {children}
      </div>
    </div>
  );
};
