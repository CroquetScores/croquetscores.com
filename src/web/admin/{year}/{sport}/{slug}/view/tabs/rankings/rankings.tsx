import { say } from "../../../../../../words.js";

// The Rankings tab (rankings-tab.feature): what the file the world rankings
// are sent is, and a link to it. A link rather than a button, since it goes to
// an address and changes nothing. It is the same address for anybody
// (rankings.feature), so there is nothing to ask of the server before it is
// drawn.
export const RankingsTab = ({
  address,
}: {
  /** Where the tournament is found, as "2026/ac/spring-open". */
  readonly address: string;
}): React.JSX.Element => (
  <section className="stack" aria-busy="false">
    <p className="rankings-kind">{say("admin.rankings.file")}</p>
    <p>
      <a className="button" href={`/${address}/rankings`}>
        {say("admin.rankings.download")}
      </a>
    </p>
  </section>
);
