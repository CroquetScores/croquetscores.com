import { say } from "../../words.js";
import { TournamentForm } from "../TournamentForm.js";

// Where a reader creates a tournament (new.feature): the form every tournament
// is created and changed with, beginning empty but for what is decided.
export const NewTournament = (): React.JSX.Element => (
  <TournamentForm
    title={say("admin.newTournament.title")}
    helpPage="creating-a-tournament"
    button={say("admin.newTournament.submit")}
    hover={say("admin.hover.dialog.tournament.new")}
    send={(said) =>
      fetch("/api/site/tournaments", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(said),
      })
    }
  />
);
