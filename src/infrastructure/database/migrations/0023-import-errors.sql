-- The documents the import from the old sites refused, with why. Made with the
-- site's own tables rather than by the import, so that the administrator's
-- page for them finds the table on a site the import has never run on, and
-- answers none. Not projected: nothing on the site records them as events.
--
-- A document can be refused more than once, so nothing here is unique; the
-- number is what keeps the messages in the order they were kept.
create table import_errors (
    kept          bigint generated always as identity primary key,
    document_id   text not null,
    error_message text not null
);

create index import_errors_by_document_id on import_errors (document_id);
