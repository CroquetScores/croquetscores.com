import { say } from "../../../../../../words.js";

// The Rankings tab (rankings-tab.feature): what the file the world rankings
// are sent is, and a link to it, and for Golf Croquet a second, to the file
// with the day of each game, which its officer asked for. A link rather than a button, since it goes to
// an address and changes nothing. It is the same address for anybody
// (rankings.feature), so there is nothing to ask of the server before it is
// drawn.
export const RankingsTab = ({
  address,
  sport,
}: {
  /** Where the tournament is found, as "2026/ac/spring-open". */
  readonly address: string;
  /** Its sport's code, as "ac". */
  readonly sport: string;
}): React.JSX.Element => (
  <section className="stack" aria-busy="false">
    <p className="rankings-kind">{say("admin.rankings.file")}</p>
    <p>
      <a className="button" href={`/${address}/rankings`}>
        {say("admin.rankings.download")}
      </a>
    </p>
    {sport === "gc" ? (
      <p>
        <a className="button" href={`/${address}/rankings2`}>
          {say("admin.rankings.downloadWithGameDate")}
        </a>
      </p>
    ) : null}
  </section>
);
