// The help as it is searched, kept in Postgres (PostgresHelpSearchIndex.feature).
import {
  mostHelpSearchResults,
  snippetEnd,
  snippetStart,
  type HelpPageToSearch,
  type HelpSearchIndex,
  type HelpSearchResult,
} from "../../application/services/HelpSearchIndex.js";
import type { UnitOfWork } from "./UnitOfWork.js";

// Held while the index is replaced, so that two replacings take turns. The
// same reasoning as migrate.ts's lock, and a number as unlikely to be
// anybody else's; advisory locks share one namespace.
const replacingLock = 8_246_114;

export class PostgresHelpSearchIndex implements HelpSearchIndex {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async fingerprint(): Promise<string | undefined> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ fingerprint: string }>(
        "select fingerprint from help_search_state",
      );
    return rows[0]?.fingerprint;
  }

  // The caller's transaction is what makes this whole: a reader searching
  // meanwhile finds all of the old pages until it commits, and all of the new
  // ones after, as the world ranking players are replaced.
  async replace(
    pages: readonly HelpPageToSearch[],
    fingerprint: string,
  ): Promise<void> {
    const connection = this.unitOfWork.connection();
    await connection.query("select pg_advisory_xact_lock($1)", [replacingLock]);
    await connection.query("delete from help_search_pages");
    await connection.query(
      `insert into help_search_pages
           (language_tag, name, title, headings, body, rules)
         select tag, name, title, headings, body, rules::regconfig
           from unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[])
             as given (tag, name, title, headings, body, rules)`,
      [
        pages.map((page) => page.tag),
        pages.map((page) => page.name),
        pages.map((page) => page.title),
        // One line to a heading, which is as good as any separator to a
        // search that reads words.
        pages.map((page) => page.headings.join("\n")),
        pages.map((page) => page.text),
        pages.map((page) => page.rules),
      ],
    );
    await connection.query(
      `insert into help_search_state (fingerprint) values ($1)
         on conflict (only_row) do update set fingerprint = excluded.fingerprint`,
      [fingerprint],
    );
  }

  async search(
    tag: string,
    rules: string,
    query: string,
  ): Promise<readonly HelpSearchResult[]> {
    // Nothing to look for matches nothing, and is not worth the trip.
    if (query === "") return [];
    // Normalised so that a score is between 0 and 1: rank / (rank + 1), which
    // is flag 32. Ranked by the weights of the document, so that a title
    // outranks a heading and a heading a paragraph.
    const { rows } = await this.unitOfWork.connection().query<{
      name: string;
      title: string;
      score: number;
      snippet: string;
    }>(
      `with asked as (select to_tsquery($2::regconfig, $3) as query)
       select name, title,
              ts_rank_cd(document, asked.query, 32) as score,
              ts_headline($2::regconfig, title || E'\\n' || headings || E'\\n' || body, asked.query,
                'StartSel=${snippetStart}, StopSel=${snippetEnd}, MaxWords=35, MinWords=15, MaxFragments=1') as snippet
         from help_search_pages, asked
        where language_tag = $1 and document @@ asked.query
        order by score desc, name
        limit ${mostHelpSearchResults}`,
      [tag, rules, query],
    );
    return rows;
  }
}
