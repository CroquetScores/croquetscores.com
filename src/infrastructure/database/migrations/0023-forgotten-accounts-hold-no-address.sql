-- An account that is forgotten holds no address, and the table does not say it
-- again with a mark.
--
-- `forgotten` said of an account what `account_keys.forgotten` already says, and
-- the address of one was kept for nothing: a forgotten account is never found
-- by it. Its row stays, with no address, so that its id is still known to the
-- table, and an address is held by one account whatever the others are.
--
-- A read model, made again from the events. Rows already forgotten give up the
-- address they were holding.

drop index one_account_per_email_address;

alter table accounts_by_email_address
    alter column email_address_hash drop not null;

update accounts_by_email_address
   set email_address_hash = null
 where forgotten;

alter table accounts_by_email_address drop column forgotten;

create unique index one_account_per_email_address
    on accounts_by_email_address (email_address_hash);
