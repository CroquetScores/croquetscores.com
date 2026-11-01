-- Whether each tournament is national or international, so that the search
-- results and a player's page can set the row of one that is in bold. Not null
-- and false, so that the rows already there are listed as ordinary
-- tournaments: rebuilding the read models (`npm run db:rebuild-read-models`)
-- fills them in from the events.
alter table search_by_website_tournaments
    add column national      boolean not null default false,
    add column international boolean not null default false;
