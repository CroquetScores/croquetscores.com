-- The requests already carried out, so that one sent twice happens once.
--
-- A request sent twice carries the same id both times, and the key on that id
-- is what decides which of them goes on: the insert is the claim. It is
-- written in the transaction of the request that made it, so an id is
-- remembered if and only if the work it names was kept. Moments are timestamps
-- in UTC.
--
-- The id is whatever whoever asked gave, and is nobody's secret: it says only
-- that a request by that name was carried out.
create table handled_requests (
    request_id  text        primary key,
    handled_at  timestamptz not null
);

-- What the forgetting asks: which claims have gone stale. Claiming takes them
-- out as it goes, so this is read as often as claims are made.
create index handled_requests_by_age on handled_requests (handled_at);
