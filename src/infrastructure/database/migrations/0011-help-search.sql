-- The help, made searchable (PostgresHelpSearchIndex.feature). It is built into
-- files by "npm run build:help" and read from them; this is a copy of the words
-- of those files in the form Postgres searches, made again whenever the build
-- changes, so nothing here is the only place anything is kept and the table can
-- be emptied without losing a word of the help.

create table help_search_pages (
    language_tag text     not null,
    name         text     not null,
    title        text     not null,
    headings     text     not null,
    body         text     not null,
    -- The rules of the page's language that its words were cut and stemmed by,
    -- kept with the page so that what is searched for is cut by the same ones.
    rules        regconfig not null,
    -- Weighed so that a word in a title counts for more than the same word in a
    -- heading, and in a heading for more than in a paragraph. Generated, so
    -- that it can never disagree with the words it is made from.
    document     tsvector generated always as (
        setweight(to_tsvector(rules, title), 'A') ||
        setweight(to_tsvector(rules, headings), 'B') ||
        setweight(to_tsvector(rules, body), 'C')
    ) stored,
    primary key (language_tag, name)
);

create index help_search_pages_document on help_search_pages using gin (document);

-- What the pages here were made from, so that making them again from the same
-- help can be seen to be needless. One row, kept by its key.
create table help_search_state (
    only_row    boolean primary key default true check (only_row),
    fingerprint text    not null
);
