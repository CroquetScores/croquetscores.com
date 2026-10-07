-- The accounts holding each role, for an administrator to list them. Nothing
-- can replay every account's events to find out, so this keeps the answer as
-- roles are given and taken. It keeps no name: a name is personal, kept
-- sealed in the account's own events, and read from there.
create table accounts_by_role (
    account_id text not null,
    role       text not null,
    primary key (role, account_id)
);
