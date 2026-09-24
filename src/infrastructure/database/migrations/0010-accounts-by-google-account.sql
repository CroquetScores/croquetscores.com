-- Accounts by a keyed hash of the subject Google knows their Google account by,
-- never the subject itself, so that the table says nothing to anybody without
-- the key. A Google account is linked to one account and an account to one
-- Google account. A forgotten account's row is deleted, since nothing is ever
-- to find it by its Google account again, and that frees the Google account to
-- be linked to another.
create table accounts_by_google_account (
    account_id   text primary key,
    subject_hash text not null unique
);
