// The last thing in the header: a person, which opens on what a reader can do
// with their account. A reader who is not signed in is offered the ways in; one
// who is signed in is offered their own pages and the way out: the ones that
// ask for the password the account has now only when it has one, and setting a
// password only when it has none.
//
// It is a summary and the details under it, as the primary navigation's menu
// is, so that it opens with no scripting: every public page works without it,
// and a menu that needed it would be the one part that did not.
import { escape } from "./escape.js";
import type { Speaking } from "./language.js";

/**
 * An item in the menu: where it goes, and the name the catalogue keeps its
 * words under. `words` rather than `label`, which a page's sections use for
 * the words themselves: the two look alike and are not, and an item moved from
 * one to the other would render the name of its words.
 */
interface MenuItem {
  readonly href: string;
  readonly words: string;
  /** Which accounts it is offered to, where it is not offered to all. */
  readonly for?: "with a password" | "without a password";
}

const waysIn: readonly MenuItem[] = [
  { href: "/account/register", words: "account.register" },
  { href: "/account/sign-in", words: "account.signIn" },
  { href: "/account/forgot-password", words: "account.forgotPassword" },
];

const theAccounts: readonly MenuItem[] = [
  { href: "/account/profile", words: "account.profile" },
  {
    href: "/account/change-password",
    words: "account.changePassword",
    for: "with a password",
  },
  {
    href: "/account/set-password",
    words: "account.setPassword",
    for: "without a password",
  },
  {
    href: "/account/change-email-address",
    words: "account.changeEmailAddress",
    for: "with a password",
  },
  { href: "/account/change-name", words: "account.changeName" },
];

/** Whether `item` is offered to an account that has a password or not. */
export const offeredTo = (
  item: { readonly for?: "with a password" | "without a password" },
  hasPassword: boolean,
): boolean =>
  item.for === undefined ||
  item.for === (hasPassword ? "with a password" : "without a password");

/** Where signing out is asked for. */
export const signOutPath = "/account/sign-out";

/** What the menu needs of the page it is drawn on. */
export interface AccountMenu {
  readonly speaking: Speaking;
  /** Whether the reader is signed in, which decides what it opens on. */
  readonly signedIn: boolean;
  /** Whether the account signed in to has a password. */
  readonly hasPassword: boolean;
  /** Where in the menu the reader is, if anywhere. */
  readonly currentPath?: string | undefined;
}

// One shape, drawn here rather than fetched or set in a font: it costs no
// request, and it takes the colour of the words beside it. Hidden from anyone
// reading the page aloud, since the menu says in words what it is for.
const person = `<svg class="person" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.7-8 6v2h16v-2c0-3.3-3.6-6-8-6Z" />
            </svg>`;

// Signing out is a button in a form that posts, never a link: a link can be put
// in an image on another site and followed by a reader's browser without their
// asking, and a post from another site is refused by the cross-site guard.
// Nothing marks it as the page being read, because it is not a page to be on.
const signOut = (speaking: Speaking): string =>
  `              <li>
                <form method="post" action="${signOutPath}">
                  <button type="submit">${escape(speaking.say("account.signOut"))}</button>
                </form>
              </li>`;

// The pages an account has are in here rather than in the navigation beside it,
// so this is what has to say which of them the reader is on. Said the way the
// section bar says it.
const item = (
  { href, words }: MenuItem,
  speaking: Speaking,
  currentPath: string | undefined,
): string => {
  const here = href === currentPath ? ' aria-current="page"' : "";
  return `              <li><a href="${href}"${here}>${escape(speaking.say(words))}</a></li>`;
};

/**
 * The list items the menu offers, as markup. Drawn once here for both places
 * the account is offered, the person beside the navigation and the group at
 * the foot of the navigation's button, so that a page added to one is in the
 * other.
 */
export const accountItems = ({
  speaking,
  signedIn,
  hasPassword,
  currentPath,
}: AccountMenu): string[] => {
  const shown = (each: MenuItem) => item(each, speaking, currentPath);
  return signedIn
    ? [
        signOut(speaking),
        ...theAccounts
          .filter((each) => offeredTo(each, hasPassword))
          .map(shown),
      ]
    : waysIn.map(shown);
};

/** The menu, as the reader of the page it is drawn on sees it. */
export const accountMenu = (menu: AccountMenu): string => {
  const named = escape(menu.speaking.say("account.menu"));

  return `        <details class="account-menu">
          <summary>
            <span class="visually-hidden">${named}</span>
            ${person}
          </summary>
          <nav class="account-menu-links" aria-label="${named}">
            <ul>
${accountItems(menu).join("\n")}
            </ul>
          </nav>
        </details>`;
};
