-- The order emails were queued in, for those due at the same moment. Two
-- emails queued by one request are due at the same moment, and so can be two
-- queued by two requests in the same instant; nothing else says which came
-- first. The id cannot, being random, and the order rows happen to be kept in
-- changes whenever one is updated. Numbered by the database as each is
-- inserted, so that what is already queued is numbered too, in whatever order
-- it is found, which is the best there is for rows nothing numbered.
alter table email_queue add column queued bigint generated always as identity;

-- What sending looks for, in the order it takes them: whatever is due and not
-- given up, soonest first, and first queued first among those due together.
drop index email_queue_due;
create index email_queue_due on email_queue (due_at, queued) where given_up_at is null;
