-- Every commentary is kept with its comments.
--
-- `comments_kept` was a flag the migration that added the comments set to say
-- which commentaries were kept before them, so that a page was refused until
-- the read models were made again. They have been, and it is true of every row.

alter table commentaries_by_tournament drop column comments_kept;
