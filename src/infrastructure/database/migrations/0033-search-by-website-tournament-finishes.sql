-- A player's page dates each tournament they have played in by the days it
-- runs, so each is kept with the day it finishes as well as the day it starts.
-- What is there has none until the read models are rebuilt (npm run
-- db:rebuild-read-models), which the migration cannot do: the first day of the
-- calendar is what it says until then, and no tournament is dated by it once
-- they have been.
alter table search_by_website_tournaments
    add column finishes date not null default '0001-01-01';
