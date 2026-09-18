-- Every event ever recorded, in the stream of the thing it happened to, in the
-- order it happened. Rows are only ever added.
--
-- An event is kept as the registry wrote it down: the name its kind goes by, and
-- everything it said as JSON. Its moment is in there as text, in UTC, as the
-- event wrote it, rather than lifted into a timestamp column, so that the
-- database's own time zone has no say in when anything happened.
--
-- The key is what makes two commands appending to one stream at once safe.
-- Both may find the stream at the same version and try to add the next; the
-- second has to wait for the first to finish, and then finds the version taken.
create table events (
    stream_id text    not null,
    version   integer not null,
    name      text    not null,
    data      jsonb   not null,
    constraint one_event_per_version primary key (stream_id, version)
);
