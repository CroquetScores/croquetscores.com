-- What went wrong with a document the import refused, said for a person
-- rather than for whoever reads the code: "Game Tim 26 beat Trev 0 in Spring
-- Open - Knockout because they are not drawn to play each other.", for the
-- administrator's pages to show above the message the code wrote. In English,
-- as the rest of what the import says is. Empty where the import has no such
-- saying for what it refused.
--
-- Not filled for the errors already kept: an import empties the database and
-- applies every migration again before it keeps any.
alter table import_errors
    add column summary text;
