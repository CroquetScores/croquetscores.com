create table events (
    global_position bigserial   primary key,
    stream_id       text        not null,
    version         integer     not null,
    event_type      text        not null,
    event_version   integer     not null default 1,
    data            jsonb       not null,
    metadata        jsonb       not null,
    occurred_at     timestamptz not null,
    constraint events_stream_version unique (stream_id, version)
);

create index events_stream on events (stream_id, version);
create index events_by_type on events (event_type, global_position);
