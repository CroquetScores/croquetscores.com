-- The tournament each error the import kept is of, where the import knew it:
-- its address and its name as the site has them, and the name of the
-- competition the document was, where it was one, so that the administrator's
-- page for a document can link to the tournament on the site and on the old
-- site, and say what it was. Empty where the import refused the document
-- before it knew of any tournament, as for a tournament refused itself.
--
-- Not filled for the errors already kept: an import empties the database and
-- applies every migration again before it keeps any.
alter table import_errors
    add column tournament_address text,
    add column tournament_name    text,
    add column competition_name   text;
