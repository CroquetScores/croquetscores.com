-- Whether each account is confirmed, for whatever gives an account something
-- by its address to ask in one query rather than by loading the account. An
-- account is confirmed when its address is, or when it came over from the old
-- site, and is never unconfirmed afterwards.
--
-- Filled from the events already kept, by the names they are kept under, so
-- that a database made before this has every account as it is rather than
-- every account waiting to be confirmed until the read models are rebuilt.
-- Neither event's name is sealed, so no account's key is needed.
alter table accounts_by_email_address
    add column confirmed boolean not null default false;

update accounts_by_email_address
   set confirmed = true
 where account_id in (
     select stream_id from events
      where name in ('account-brought-over', 'account-email-address-confirmed')
 );
