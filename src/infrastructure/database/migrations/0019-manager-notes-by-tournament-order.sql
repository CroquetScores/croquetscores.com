-- Two notes of a tournament written at the same moment are told apart by
-- their ids, the greater first, rather than by the order their rows were made
-- in. A rebuild takes the notes' streams in no order but each stream's own,
-- so the order rows are made in is not the order they were first made in,
-- and two notes listed one way before a rebuild were listed the other way
-- after it. An id is the same whenever its row is made. Nothing reads made
-- now, so it goes.
alter table manager_notes_by_tournament drop column made;
