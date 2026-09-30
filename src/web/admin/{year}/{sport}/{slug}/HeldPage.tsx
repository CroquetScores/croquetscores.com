import { HeldSections } from "./TournamentSections.js";

// What a tournament's page, or one of its competitions', draws while it asks
// for what it shows: the section bar's room, and the panel with its heading's
// room. Drawing nothing let the page collapse to its header and footer and
// then grow back, and moving between pages in place (App.tsx) looked like
// the browser loading the page again. Held, the frame stays where it will be
// and only what is in it arrives.
export const HeldPage = (): React.JSX.Element => (
  <>
    <HeldSections />
    <main id="content">
      <div className="page">
        <div className="panel stack">
          <div className="heading-held" aria-hidden="true">
            {" "}
          </div>
        </div>
      </div>
    </main>
  </>
);
