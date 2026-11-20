-- A note says when it was made and when it last changed, and a note that
-- changed after it was made was edited.
--
-- `written_at` and `last_edited_at` were kept beside `changed_at`, which was
-- always the last of them: deleting a note changes none of the three. A read
-- model, made again from the events, and what was kept is kept: the moment of a
-- note's making is the one it was written at.

alter table manager_notes_by_tournament
    rename column written_at to created_at;

alter table manager_notes_by_tournament
    drop column last_edited_at;
