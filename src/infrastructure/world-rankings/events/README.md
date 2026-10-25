# The world rankings' lists of events

The events the world rankings have ranked, each with the country it was played
in, as they were given for the import on 24 October 2026. The import
reads them to say which country a tournament was played in
(`../../../import-ravendb/WorldRankingEvents.ts`,
`WorldRankingEvents.feature`), and the site reads which countries each names
for the administrator's page of the tournaments played in countries the
lists do not name (`../FileWorldRankingCountries.ts`,
`FileWorldRankingCountries.feature`, `countries.feature`).

- `ac-world-ranking-events.csv`: Association Croquet. Column 4 the name, column
  5 the days it was played as text, column 10 the country, as a number into
  `ac-world-ranking-countries.csv`.
- `ac-world-ranking-countries.csv`: the number, the name, then the codes the
  world rankings use.
- `gc-world-ranking-events.csv`: Golf Croquet. Column 3 the name, column 4 the
  country's three letters, column 5 the day it started as Excel counts days
  from 1 January 1900.

To refresh them, replace the files with newer ones in the same columns. A row
that cannot be read stops the import and names its file and line.
