-- The keys that work, found by the hash of the key an app sends, for the site
-- to know whose request it is. Nothing can replay every account's events to
-- find out, so this keeps the answer as keys are made and revoked and accounts
-- forgotten. A revoked key's row is deleted, so a key that no longer works is
-- found by nothing. It holds the hash of a key and never the key, and nothing
-- personal: the account's id and the key's id say nothing of the person.
--
-- It can be made again from the events, which are what it is made from.
create table accounts_by_api_key (
    key_hash   text primary key,
    key_id     text not null unique,
    account_id text not null
);

create index accounts_by_api_key_account_id on accounts_by_api_key (account_id);
