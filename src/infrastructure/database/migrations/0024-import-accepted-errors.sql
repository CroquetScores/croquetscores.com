-- What the import from the old sites refuses that has been looked at and
-- accepted: the old site's, not wrong, and with nothing to put right. An error
-- is accepted for one document and one refusal's code, whichever of the
-- document's games or players it names, with why, and is then not kept among
-- the import's errors (ImportDatabase.feature). Made with the site's own
-- tables, and filled here rather than by the import, since an import empties
-- the database and applies every migration again: what is accepted is there
-- again each time.
create table import_accepted_errors (
    document_id text not null,
    code        text not null,
    why         text not null,
    primary key (document_id, code)
);

insert into import_accepted_errors (document_id, code, why) values
    ('croquetscores.com/knockouts/10088', 'Competition.NotDrawnToMeet',
     'Play-offs between players knocked out in the first round, kept beside '
     'the draw, which the site''s knockout has no place for.'),
    ('croquetscores.com/knockouts/867', 'Competition.NotDrawnToMeet',
     'A play-off for third place between the losers of its semi-finals, '
     'kept beside the final, which the site''s knockout has no place for.');
