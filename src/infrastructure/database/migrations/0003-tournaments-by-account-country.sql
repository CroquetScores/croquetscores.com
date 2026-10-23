-- Where each tournament is played, so that the admin can narrow a reader's
-- list by country and region and offer only those the list holds. Nullable
-- because the rows already there do not have them: rebuilding the read models
-- (`npm run db:rebuild-read-models`) fills them in from the events, and until
-- then the admin offers nothing to narrow those rows by. A tournament in no
-- region has a null region, as it does in the events.
alter table tournaments_by_account_details
    add column country text,
    add column region  text;
