import { knows, say } from "../../../words.js";

// What a page draws in place of what it shows when the API refused it: the
// page's heading, and the refusal's words by its code, or the words for any
// where there are none. The code is the contract and is kept on the page so
// that what was refused can be told from how it is said; the words are only
// what it says.
export const RefusedPage = ({
  heading,
  code,
  otherwise,
}: {
  readonly heading: string;
  readonly code: string;
  /** The words for a refusal that has none of its own. */
  readonly otherwise: string;
}): React.JSX.Element => (
  <main id="content">
    <div className="page">
      <div className="panel stack">
        <h1>{heading}</h1>
        <p className="page-refused" data-refused={code}>
          {say(knows(code) ? code : otherwise)}
        </p>
      </div>
    </div>
  </main>
);
