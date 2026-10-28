-- The sport each tournament is for, so that a search can show its code beside
-- it. Nullable because the rows already there do not have one: rebuilding the
-- read models (`npm run db:rebuild-read-models`) fills it in from the events,
-- and until then those rows are shown with no sport.
alter table search_by_website_tournaments
    add column sport text;
