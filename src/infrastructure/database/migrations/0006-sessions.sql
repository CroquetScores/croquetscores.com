-- A reader stays signed in by a cookie holding an id that means nothing by
-- itself. What is kept here is a hash of that id, never the id, so that
-- whoever takes this table takes nothing a browser could send back.
--
-- The account is kept beside it, so that every session an account has can be
-- ended at once: setting a new password does that, and so does forgetting the
-- account. Moments are timestamps in UTC, as everywhere else.
create table sessions (
    id_hash       text        primary key,
    account_id    text        not null,
    started_at    timestamptz not null,
    last_used_at  timestamptz not null
);

-- What ending every session an account has asks for.
create index sessions_by_account on sessions (account_id);
