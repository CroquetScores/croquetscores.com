-- Whether a commentary's writer was forgotten is read from the accounts' read
-- model, which already keeps it, and not from a copy of its own.
--
-- `commentaries_by_tournament_forgotten` held the accounts forgotten, heard of
-- from their own streams, so that a forgetting heard of before the commentary's
-- start still counted. The accounts' table says the same of every account at
-- the moment it is asked, whichever stream was read first, so that the third
-- place the same fact was kept in is no longer needed.

drop table commentaries_by_tournament_forgotten;
