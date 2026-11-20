-- A test's group is kept by its name alone, and its slug is worked out from the
-- name when the page asks (TestGroup.slug), as it always was when it was kept.
--
-- `group_slug` was a second column that said what the first already did, and
-- that the two could come to disagree about: the name and what is made of it.
-- A read model, so nothing is lost: the name stays, and the slug comes from it.

alter table competitions drop column group_slug;
