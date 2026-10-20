-- A second copy of the lines the server writes to its log, for an
-- administrator to read at /admin/administrator/logs without being on the
-- machine (PostgresServerLog.feature). The log file is still the log; this is
-- kept for seven days and then removed.
--
-- `severity` is the number the log writes the level in, 10 for Trace to 60 for
-- Fatal, so that "this severity and more severe" is a comparison. `details` is
-- the whole line, since which fields a line carries is the log's to decide and
-- not this table's, and a reference from an error page is found in it.
create table server_log (
    kept       bigint generated always as identity primary key,
    written_at timestamptz not null,
    severity   smallint    not null,
    message    text        not null,
    details    jsonb       not null
);

-- What the newest-first reading and the removal of the old both go by.
create index server_log_by_written_at on server_log (written_at, kept);
