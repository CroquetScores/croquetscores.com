-- What has been written to an account, kept after the email itself has been
-- sent and dropped from the queue, because the limit registering keeps is on
-- what was sent rather than on what is still waiting. It holds no address: an
-- account's id, the kind of email, and when. Moments are timestamps in UTC.
create table emails_written (
    id          bigserial   primary key,
    account_id  text        not null,
    kind        text        not null,
    written_at  timestamptz not null
);

-- What the limit asks: how much has been written to one account lately.
create index emails_written_by_account on emails_written (account_id, written_at);
