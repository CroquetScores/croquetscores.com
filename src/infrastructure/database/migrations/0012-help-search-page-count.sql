-- How many pages the fingerprint was made for, so that an index that has lost
-- some of them is seen to have, and is made again, instead of being taken for
-- the help it was made from because the fingerprint still matches. The row
-- there already says nothing of its pages, so it says none: the first start
-- after this makes the index again, once.
alter table help_search_state
    add column page_count integer not null default 0;
