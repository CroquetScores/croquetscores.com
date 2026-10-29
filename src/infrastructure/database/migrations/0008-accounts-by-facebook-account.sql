-- Accounts by a keyed hash of the id Facebook knows their Facebook account by,
-- never the id itself, so that the table says nothing to anybody without the
-- key. As for Google (accounts_by_google_account): a Facebook account is linked
-- to one account and an account to one Facebook account, and a forgotten
-- account's row is deleted, which frees the Facebook account to be linked to
-- another. Empty until accounts are linked, so nothing needs rebuilding.
create table accounts_by_facebook_account (
    account_id       text primary key,
    facebook_id_hash text not null unique
);
