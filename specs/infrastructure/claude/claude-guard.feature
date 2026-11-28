Feature: Claude Code is stopped from editing what is never edited

  `AI.md` says what is never done to the database's schema and to the tables
  the import keeps, and a line in a document can be set aside by whoever
  reads it. This is the same rule held where it cannot be: a hook asked
  before every edit, which refuses with the reason and leaves the edit
  undone. It reads what Claude Code is about to do, as the hook is given it,
  and decides on that and nothing else.

  It sees an edit made with the editing tools, one edit or several at once,
  and a whole file written. It does not see a file changed through the shell
  (`sed -i`, a redirect, a script), which no request to an editing tool says.

  Rule: The first migration is never edited

    `0001-initial.sql` is the schema as it was when the site first went live,
    and a database that has applied it is told so by its name. A change is a
    migration after it.

    Scenario: An edit to it is refused
      Given the tool is "Edit"
      And the file is "src/infrastructure/database/migrations/0001-initial.sql"
      When the guard is asked
      Then the guard refuses
      And the guard says "0001-initial.sql is never edited"

    Scenario: A whole new copy of it is refused
      Given the tool is "Write"
      And the file is "src/infrastructure/database/migrations/0001-initial.sql"
      When the guard is asked
      Then the guard refuses

    Scenario: A path written as Windows writes it is refused
      Given the tool is "Edit"
      And the file is "d:\source\repos\CroquetScores\croquetscores.com\src\infrastructure\database\migrations\0001-initial.sql"
      When the guard is asked
      Then the guard refuses

    Scenario: A path in other letters is refused, as Windows reads it the same
      Given the tool is "Edit"
      And the file is "src/infrastructure/database/Migrations/0001-Initial.sql"
      When the guard is asked
      Then the guard refuses

    Scenario: A path from inside the migrations folder is refused
      Given the tool is "Edit"
      And the file is "migrations/0001-initial.sql"
      When the guard is asked
      Then the guard refuses

    Scenario: Several edits at once to it are refused
      Given the tool is "MultiEdit"
      And the file is "src/infrastructure/database/migrations/0001-initial.sql"
      And the new text is "SELECT 1;"
      When the guard is asked
      Then the guard refuses

    Scenario: A file only named like it is allowed
      Given the tool is "Edit"
      And the file is "docs/0001-initial.sql.md"
      When the guard is asked
      Then the guard allows

    Scenario: A later migration may be edited
      Given the tool is "Edit"
      And the file is "src/infrastructure/database/migrations/0003-changed-at.sql"
      And the new text is "ALTER TABLE tournaments ADD COLUMN note text;"
      When the guard is asked
      Then the guard allows

  Rule: A migration never touches a table the import keeps

    Tables whose names begin with `import` are what the import from the old
    sites keeps, and nothing else reads them. A migration does not alter,
    rename, empty or drop one, and does not write to one or add to it an index
    or a trigger. Where one looks wrong, the thing to do is say so, and the
    refusal says that.

    It is a statement that changes one that is refused, and not a mention of
    one: a comment, or a query that only reads one, changes nothing.

    Scenario Outline: A migration that changes one is refused
      Given the tool is "Write"
      And the file is "src/infrastructure/database/migrations/0099-tidy.sql"
      And the new text is "<text>"
      When the guard is asked
      Then the guard refuses
      And the guard says "say so and leave it"

      Examples:
        | text                                                                  |
        | ALTER TABLE import_errors DROP COLUMN reason;                         |
        | DROP TABLE imported_users;                                            |
        | DROP TABLE IF EXISTS imported_users;                                  |
        | TRUNCATE imported_tournaments;                                        |
        | TRUNCATE TABLE imported_tournaments;                                  |
        | ALTER TABLE IMPORTED_PLAYERS RENAME TO players;                       |
        | ALTER TABLE public.import_errors ADD COLUMN note text;                |
        | ALTER TABLE ONLY import_errors ADD COLUMN note text;                  |
        | DELETE FROM import_errors WHERE true;                                 |
        | UPDATE imported_users SET name = 'x';                                 |
        | INSERT INTO imported_players (id) VALUES (1);                         |
        | CREATE INDEX by_name ON imported_users (name);                        |
        | CREATE UNIQUE INDEX by_name ON imported_users (name);                 |
        | CREATE TRIGGER t BEFORE INSERT ON imported_users EXECUTE FUNCTION f(); |
        | SELECT 1; ALTER TABLE imported_competitions ADD COLUMN a int;         |

    Scenario: Several edits at once, one of which changes one, are refused
      Given the tool is "MultiEdit"
      And the file is "src/infrastructure/database/migrations/0099-tidy.sql"
      And the new text is "ALTER TABLE tournaments ADD COLUMN note text;"
      And another new text is "DROP TABLE imported_users;"
      When the guard is asked
      Then the guard refuses

    Scenario Outline: A migration that only mentions one is allowed
      Given the tool is "Write"
      And the file is "src/infrastructure/database/migrations/0099-notes.sql"
      And the new text is "<text>"
      When the guard is asked
      Then the guard allows

      Examples:
        | text                                                      |
        | -- the import_errors table is left as it is               |
        | /* ALTER TABLE imported_users DROP COLUMN x; */ SELECT 1; |
        | CREATE VIEW names AS SELECT name FROM imported_users;     |
        | ALTER TABLE tournaments ADD COLUMN important_note text;   |

    Scenario: The import's own code may name them
      Given the tool is "Edit"
      And the file is "src/infrastructure/imports/ImportErrors.ts"
      And the new text is "DELETE FROM import_errors"
      When the guard is asked
      Then the guard allows

  Rule: Anything else is let through

    The guard is asked before every edit, so what it knows nothing about it
    leaves alone, and a request it cannot read is not a reason to stop work.

    Scenario: An edit to ordinary source is allowed
      Given the tool is "Edit"
      And the file is "src/domain/common/Uuid.ts"
      When the guard is asked
      Then the guard allows

    Scenario: A tool that is not an edit is allowed
      Given the tool is "Bash"
      When the guard is asked
      Then the guard allows

    Scenario: A request that is not readable is allowed
      Given the guard is sent "this is not a request"
      When the guard is asked
      Then the guard allows
