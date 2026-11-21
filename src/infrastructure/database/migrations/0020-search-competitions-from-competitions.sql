-- The search keeps a competition's name folded, which is its own, and reads the
-- name and the slug from the competition.
--
-- Both were kept again in the search each time the competition's own row was
-- written, so that a competition renamed was renamed in two places that could
-- come to disagree. A read model, made again from the events.

alter table search_by_website_competitions
    drop column name,
    drop column slug;
