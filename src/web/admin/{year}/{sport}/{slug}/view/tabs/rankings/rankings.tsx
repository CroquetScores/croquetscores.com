import { say } from "../../../../../../words.js";

// The Rankings tab (rankings-tab.feature): what the file the world rankings
// are sent is, what is left for the manager to fill in by hand, and a link to
// the file. A link rather than a button, since it goes to an address and
// changes nothing. It is the same address for anybody (rankings.feature), so
// there is nothing to ask of the server before it is drawn.
export const RankingsTab = ({
  address,
  sport,
}: {
  /** Where the tournament is found, as "2026/ac/spring-open". */
  readonly address: string;
  /** Its sport's code, which says which kind of file it is. */
  readonly sport: string;
}): React.JSX.Element => {
  // Association Croquet's is a text file with a winner for each competition to
  // check; the others' are a spreadsheet with the tournament's winner to add.
  const textFile = sport === "ac";
  return (
    <section className="stack" aria-busy="false">
      <p className="rankings-kind">
        {say(
          textFile ? "admin.rankings.textFile" : "admin.rankings.spreadsheet",
        )}
      </p>
      <p className="rankings-fill-in">
        {say(
          textFile
            ? "admin.rankings.fillInWinners"
            : "admin.rankings.fillInWinner",
        )}
      </p>
      <p className="rankings-send">{say("admin.rankings.sendIt")}</p>
      <p>
        <a className="button" href={`/${address}/rankings`}>
          {say("admin.rankings.download")}
        </a>
      </p>
    </section>
  );
};
