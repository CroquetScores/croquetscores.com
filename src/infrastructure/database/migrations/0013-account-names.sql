-- What each account is called, kept so that a page that names who wrote
-- something asks the read model and not the account's events (AccountNames.feature).
-- An account's events include every time its owner signed in, so replaying them
-- for a name on every request was a cost the page should not carry.
--
-- A name is personal, and so this table is: forgetting an account takes its row
-- out, as it takes the account out of every other read model, and a row is never
-- kept for an account that is not yet named.
--
-- It starts empty. A name is sealed in the events it was kept with, so SQL
-- cannot read it back; the read models are made again once this has run
-- (`npm run db:rebuild-read-models`), and until they are, no commentary is
-- shown, since its writer has no name to be shown by.
create table account_names (
    account_id text primary key,
    name       text not null,
    changed_at timestamptz not null
);
