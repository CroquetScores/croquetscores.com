-- Where the document each error the import kept is of can be read: its path
-- on the site, and on the old site it came from, without a leading slash. A
-- competition's own page where the document was a competition the site has,
-- and its tournament's page otherwise, so that the administrator's page for a
-- document can link to both. Kept rather than worked out from the tournament's
-- address, since a competition's slug on the site is made from its name and
-- need not be the slug the old site gave it. Empty where the import knew no
-- tournament, as the rest of what it is of is (0024).
--
-- Not filled for the errors already kept: an import empties the database and
-- applies every migration again before it keeps any.
alter table import_errors
    add column new_site_path text,
    add column old_site_path text;
