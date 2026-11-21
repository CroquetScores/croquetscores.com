-- A comment says when it was made and when it last changed, and a comment that
-- was edited is one whose last change is after it was made.
--
-- `written_at` and `last_edited_at` were kept beside `changed_at`, which was
-- always the last of them: the moment of the comment's adding, or of its last
-- edit. Now there are two moments, and the third is told from them. A read
-- model, made again from the events, and what was kept is kept: the moment of a
-- comment's making is the one it was written at.

alter table commentary_comments
    rename column written_at to created_at;

alter table commentary_comments
    drop column last_edited_at;
