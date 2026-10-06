// A tournament played by teams has a summary of how its teams stand, at the
// tournament's address followed by "summary", as the old site's was: one
// table, a row for each team ranked, said by its name, since the summary is
// where a reader looks for each team as a whole, and beside it,
// grouped under Tests, Games and Hoops, the tests it has won, lost and drawn,
// the games it has won and lost, and its hoops for, against and net; and,
// where any test has matches the best of more than 1, under Matches after the
// tests, the matches it has won and lost. Its
// sections are the tournament's, with Summary marked.
//
// A Standard tournament has no summary, any more than a tournament a reader
// is not sent to has. An address the tournament has moved on from leads to
// the summary where it is now.
import type { FastifyInstance } from "fastify";

import {
  PublicTeamSummaryOfTournament,
  type TeamStanding,
} from "../../application/operations/tournaments/PublicTeamSummaryOfTournament.js";
import { TournamentOperationRefused } from "../../application/operations/tournaments/tournamentOperations.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import { speakingOf } from "../common/language.js";
import { render } from "../common/layout.js";
import { hasPassword, signedIn } from "../common/reader.js";
import { siteNameOf, websiteOf } from "../common/site.js";
import { themeOf } from "../common/theme.js";
import { sendPage } from "./tournamentLists.js";
import { notesReadOf } from "./notesRead.js";
import { sectionsOf } from "./tournamentPages.js";
import { yearInPath } from "./year.js";

// What answers the page as one that is not there.
const notThere: readonly string[] = [
  "PublicTeamSummaryOfTournament.NoSuchTournament",
  "PublicTeamSummaryOfTournament.NotPlayedByTeams",
];

// A group of the table's columns, each with what it says of a team.
interface Group {
  readonly word: string;
  readonly columns: readonly {
    readonly word: string;
    readonly of: (team: TeamStanding) => number;
  }[];
}

const tests: Group = {
  word: "teamSummary.tests",
  columns: [
    { word: "teamSummary.wins", of: (team) => team.testsWon },
    { word: "teamSummary.losses", of: (team) => team.testsLost },
    { word: "teamSummary.draws", of: (team) => team.testsDrawn },
  ],
};

// After the tests, as the teams are ranked by them after their tests.
const matches: Group = {
  word: "teamSummary.matches",
  columns: [
    { word: "teamSummary.wins", of: (team) => team.matchesWon },
    { word: "teamSummary.losses", of: (team) => team.matchesLost },
  ],
};

const rest: readonly Group[] = [
  {
    word: "teamSummary.games",
    columns: [
      { word: "teamSummary.wins", of: (team) => team.gamesWon },
      { word: "teamSummary.losses", of: (team) => team.gamesLost },
    ],
  },
  {
    word: "teamSummary.hoops",
    columns: [
      { word: "teamSummary.for", of: (team) => team.hoopsFor },
      { word: "teamSummary.against", of: (team) => team.hoopsAgainst },
      {
        word: "teamSummary.net",
        of: (team) => team.hoopsFor - team.hoopsAgainst,
      },
    ],
  },
];

export const registerTeamSummaryPage = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get<{ Params: { year: string; sport: string; slug: string } }>(
    `/${yearInPath}/:sport/:slug/summary`,
    async (request, reply) => {
      const { year, sport, slug } = request.params;
      const address = `${year}/${sport}/${slug}`;
      const website = websiteOf(request);
      let asked;
      try {
        asked = await request.server.mediator.query(
          new PublicTeamSummaryOfTournament(website.host, address),
        );
      } catch (failure) {
        if (
          failure instanceof TournamentOperationRefused &&
          notThere.includes(failure.code)
        ) {
          return reply.callNotFound();
        }
        throw failure;
      }
      // An address the tournament has moved on from leads to its summary
      // where it is now, for good, so that a link kept from before still works.
      if (asked.address !== address) {
        return reply.redirect(`/${asked.address}/summary`, 301);
      }

      const speaking = speakingOf(request);
      const { say } = speaking;
      // Written as the reader's language writes a number, grouped as the old
      // site grouped a thousand or more, as "1,970".
      const numbers = new Intl.NumberFormat(speaking.language.tag);
      // Each column, and whether it begins its group, where a thick line
      // parts it from the group before.
      // A match the best of 1 is its one game, so where every test's are,
      // its matches would only say its games again.
      const groups: readonly Group[] = [
        tests,
        ...(asked.bestOfMoreThanOne ? [matches] : []),
        ...rest,
      ];
      const columns = groups.flatMap((group) =>
        group.columns.map((column, at) => ({ ...column, starts: at === 0 })),
      );
      const startClass = (starts: boolean): string =>
        starts ? " team-summary-starts" : "";
      const byId = new Map(asked.teams.map((team) => [team.id, team]));
      const rows = asked.ranked
        .flatMap((id) => {
          const team = byId.get(id);
          return team === undefined ? [] : [team];
        })
        .map(
          (team) => `              <tr>
                <th scope="row" class="team-summary-team">${escape(team.name)}</th>
${columns.map(({ of, starts }) => `                <td class="team-summary-number${startClass(starts)}">${escape(numbers.format(of(team)))}</td>`).join("\n")}
              </tr>`,
        )
        .join("\n");

      return sendPage(
        reply,
        request,
        render(assets, {
          tournament: {
            name: asked.name,
            address: asked.address,
            notes: asked.notes,
          },
          title: asked.name,
          sections: sectionsOf(asked, speaking, notesReadOf(request)),
          currentSection: `/${asked.address}/summary`,
          theme: themeOf(request),
          signedIn: signedIn(request),
          hasPassword: hasPassword(request),
          speaking,
          siteName: siteNameOf(request),
          tryWebsite: website.isTry,
          path: request.url,
          // The table says the tournament's name in its first heading, as the
          // old site's did, so the page's own heading is left for whatever
          // reads the page aloud rather than shown again above it.
          body: `          <h1 id="team-summary-heading" class="visually-hidden">${escape(asked.name)}</h1>
          <div class="team-summary-scroll" role="region" aria-labelledby="team-summary-heading" tabindex="0">
          <table class="team-summary">
            <thead>
              <tr>
                <th scope="col" class="team-summary-corner" rowspan="2">${escape(asked.name)}</th>
${groups.map((group) => `                <th scope="colgroup" colspan="${String(group.columns.length)}" class="team-summary-group team-summary-starts">${escape(say(group.word))}</th>`).join("\n")}
              </tr>
              <tr>
${columns.map(({ word, starts }) => `                <th scope="col" class="team-summary-heading${startClass(starts)}">${escape(say(word))}</th>`).join("\n")}
              </tr>
            </thead>
            <tbody>
${rows}
            </tbody>
          </table>
          </div>`,
        }),
      );
    },
  );
};
