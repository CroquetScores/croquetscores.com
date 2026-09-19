-- Emails to be sent, each queued in the transaction of the command it is about,
-- so that it is queued if and only if what it is about is kept. It holds no
-- words: its kind and its language say what the email writer is to write when
-- it is sent. Where it goes and whatever fills it in are sealed, with its
-- account's key when it is about an account, and with the site's key when it
-- is not, so that no address is kept as it was given. Moments are timestamps
-- in UTC.
create table email_queue (
    id                text        primary key,
    account_id        text,
    kind              text        not null,
    language          text        not null,
    sealed            text        not null,
    link_works_until  timestamptz,
    due_at            timestamptz not null,
    tries             integer     not null default 0,
    last_tried_at     timestamptz,
    given_up_at       timestamptz
);

-- What sending looks for: whatever is due and not given up, soonest first.
create index email_queue_due on email_queue (due_at) where given_up_at is null;
