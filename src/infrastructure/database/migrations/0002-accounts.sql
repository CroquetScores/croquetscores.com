-- Each account's own key, encrypted with the site's key, and a mark of which
-- site's key that was: a keyed hash of a fixed text, made with it, which says
-- nothing of the key and lets a store opened with another be refused as that
-- rather than finding every key tampered with. Deleting a row forgets its
-- account: what is kept of its name and email address can never be read again.
create table account_keys (
    account_id    text  primary key,
    key           bytea not null,
    site_key_mark text  not null
);

-- Accounts by a keyed hash of their email address, never the address itself.
-- A forgotten account keeps its row, marked, and is never found by it again;
-- no row is ever deleted. An address has one account at a time among those not
-- forgotten, which is what stops two registrations of one address, sent at
-- once, both making an account.
create table accounts_by_email_address (
    account_id         text    primary key,
    email_address_hash text    not null,
    forgotten          boolean not null default false
);

create unique index one_account_per_email_address
    on accounts_by_email_address (email_address_hash)
    where not forgotten;
