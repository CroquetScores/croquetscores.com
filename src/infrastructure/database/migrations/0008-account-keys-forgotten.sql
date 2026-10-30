-- An account is forgotten by rewriting what is personal in its events, and its
-- key is kept, so a key can no longer be told forgotten by being missing. This
-- says so, and every key made so far is of an account not yet forgotten.
alter table account_keys add column forgotten boolean not null default false;
