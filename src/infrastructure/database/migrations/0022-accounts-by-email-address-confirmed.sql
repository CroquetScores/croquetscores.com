-- Whether each account is confirmed, for whatever gives an account something
-- by its address to ask in one query rather than by loading the account. An
-- account is confirmed when its address is, or when it came over from the old
-- site, and is never unconfirmed afterwards.
--
-- Not filled from the events already kept: no site keeps real events yet, and
-- a database is imported again from the old sites, which empties it first.
alter table accounts_by_email_address
    add column confirmed boolean not null default false;
