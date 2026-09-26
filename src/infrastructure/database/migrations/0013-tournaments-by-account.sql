-- What the admin lists of each tournament, once for the tournament rather than
-- once for each account with a part in it, so that making somebody a manager
-- has nothing to copy from another account's row, and a change to the
-- tournament is one row to change. The website is kept as it was created,
-- since a tournament keeps the one it was created on.
create table tournaments_by_account_details (
    tournament_id text primary key,
    website       text not null,
    name          text not null,
    starts        date not null,
    finishes      date not null,
    address       text not null,
    archived      boolean not null default false
);

-- Each account's part in a tournament: one row an account, since an account
-- that manages a tournament does not also score it.
create table tournaments_by_account (
    tournament_id text not null,
    account_id    text not null,
    part          text not null check (part in ('manager', 'scorer')),
    primary key (tournament_id, account_id)
);

create index tournaments_by_account_account on tournaments_by_account (account_id);
