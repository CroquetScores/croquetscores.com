import { TournamentForm } from "../TournamentForm.js";

// Where a reader creates a tournament (new.feature): the form every tournament
// is created and changed with, beginning empty but for what is decided.
export const NewTournament = (): React.JSX.Element => (
  <TournamentForm
    title="New Tournament"
    button="Create Tournament"
    send={(said) =>
      fetch("/api/v1/tournaments", {
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
