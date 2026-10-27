-- The country each tournament is played in, so that a search can show its flag
-- beside it. Nullable because the rows already there do not have one:
-- rebuilding the read models (`npm run db:rebuild-read-models`) fills it in
-- from the events, and until then those rows are shown with no flag.
alter table search_by_website_tournaments
    add column country text;
