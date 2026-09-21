-- What the site has written to is not always an account. A reader who has
-- forgotten their password gives an address, and an address with no account is
-- sent a link to register instead; that email fills an inbox exactly as the
-- others do, and the limit that keeps an inbox from being buried has to count
-- it. So the column says whom rather than which account: an account by its id,
-- and an address with no account by the same keyed hash the accounts read
-- model finds an address by, which is no use to anyone without the key.
alter table emails_written rename column account_id to written_to;

-- What is already there was all written to accounts.
update emails_written set written_to = 'account:' || written_to;

alter index emails_written_by_account rename to emails_written_by_whoever;
