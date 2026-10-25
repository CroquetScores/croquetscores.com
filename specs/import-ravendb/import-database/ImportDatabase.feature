@postgres
Feature: The database an import empties and fills

  An import is run over and over while it is being written, and what the last
  run left would be imported a second time on top of itself. So an import
  begins by emptying the database it writes into, which is the site's
  (`loadImportConfig.feature`): every table in it is dropped, in whatever
  schema it is, and every migration is applied again. The migration runner
  never drops anything, and must not, so the dropping is kept apart from it,
  reached only by an import and by "npm run db:drop-tables".

  Tables of the import's own are made with the rest: one keeping what could
  not be imported, and one each keeping what the old sites' users,
  tournaments, tournament players and competitions became, so that whatever
  is imported after them can find them. A user may have become a forgotten
  account, which is kept too, and every tournament read is kept, whatever
  became of it, so that a document naming one never read can be found. None
  is a migration's, because the site has no use for them, and all go when
  importing is finished.

  Background:
    Given an import's database

  Rule: Emptying the database leaves nothing the last import made

    Scenario: An account kept before emptying is gone after it
      Given an account for "someone@example.com" is brought over from the old site
      When the import's database is emptied
      Then no account is reached at "someone@example.com"

    Scenario: An error kept before emptying is gone after it
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/users/2" saying "Refused"
      When the import's database is emptied
      Then no error is kept for "croquetscores.com/users/2"

    Scenario: A user kept before emptying is gone after it
      Given the import's database is emptied
      And "users/1" on "croquetscores.com" is kept as an account at "someone@example.com"
      When the import's database is emptied
      Then "users/1" on "croquetscores.com" is not kept as any account

    Scenario: A tournament kept before emptying is gone after it
      Given the import's database is emptied
      And "tournaments/12" on "croquetscores.com" was kept as a tournament
      When the import's database is emptied
      Then "tournaments/12" on "croquetscores.com" is not kept as any tournament

    Scenario: A tournament read before emptying is gone after it
      Given the import's database is emptied
      And "tournaments/14" on "croquetscores.com" was kept as read
      When the import's database is emptied
      Then "tournaments/14" on "croquetscores.com" is not kept as read

    Scenario: A forgotten account kept before emptying is gone after it
      Given the import's database is emptied
      And "users/4" on "croquetscores.com" was kept as a forgotten account
      When the import's database is emptied
      Then "users/4" on "croquetscores.com" is not kept as any account

    Scenario: A tournament player kept before emptying is gone after it
      Given the import's database is emptied
      And player 7 of "tournaments/12" on "croquetscores.com" was kept as a tournament player
      When the import's database is emptied
      Then player 7 of "tournaments/12" on "croquetscores.com" is not kept as any player

    Scenario: A competition kept before emptying is gone after it
      Given the import's database is emptied
      And "blocks/30" on "croquetscores.com" was kept as a competition
      When the import's database is emptied
      Then "blocks/30" on "croquetscores.com" is not kept as any competition

    Scenario: A table no migration made is gone after emptying
      Given a table "left_over" nobody migrated
      When the import's database is emptied
      Then there is no table "left_over"

    Scenario: A table in another schema is gone after emptying
      Given a schema "elsewhere"
      And a table "elsewhere.left_over" nobody migrated
      When the import's database is emptied
      Then there is no table "elsewhere.left_over"

  Rule: Emptying the database makes every table again

    Scenario: Every migration is applied again
      When the import's database is emptied
      Then every migration has been applied

  Rule: The users imported are found by their email address, whatever its case

    An address is compared here as the site compares it, since an address
    this took for a new one the site would take for one it already has, and
    the second account would be refused rather than kept as the first.

    Scenario: A user kept is found by the address they were kept with
      Given the import's database is emptied
      And "users/1" on "croquetscores.com" is kept as an account at "someone@example.com"
      When the account imported for "someone@example.com" is looked for
      Then the account kept for "users/1" on "croquetscores.com" is found

    Scenario: A user kept is found by their address in another case
      Given the import's database is emptied
      And "users/1" on "croquetscores.com" is kept as an account at "someone@example.com"
      When the account imported for "Someone@Example.COM" is looked for
      Then the account kept for "users/1" on "croquetscores.com" is found

    Scenario: A user kept is found by their address with space around it
      Given the import's database is emptied
      And "users/1" on "croquetscores.com" is kept as an account at "someone@example.com"
      When the account imported for " someone@example.com " is looked for
      Then the account kept for "users/1" on "croquetscores.com" is found

    Scenario: A user kept with space around their address is found by it
      Given the import's database is emptied
      And "users/1" on "croquetscores.com" is kept as an account at " someone@example.com "
      When the account imported for "someone@example.com" is looked for
      Then the account kept for "users/1" on "croquetscores.com" is found

    Scenario: An address nobody was kept with finds no account
      Given the import's database is emptied
      And "users/1" on "croquetscores.com" is kept as an account at "someone@example.com"
      When the account imported for "nobody@example.com" is looked for
      Then no account imported is found

  Rule: The errors kept are counted, wherever they were kept from

    The import ends by saying how many errors it kept. A document refused
    while its tournament brings it over is kept by the tournament
    (`ImportWholeTournaments.feature`), not by whoever read the tournament, so
    adding up what each collection's reading was refused would leave it out.
    The count is asked of what was kept instead.

    Scenario: Every error kept is counted
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/users/2" saying "Refused"
      And an error is kept for "croquetscores.com/blocks/1" saying "Refused"
      When the errors kept are counted
      Then 2 errors are counted

    Scenario: No error kept counts none
      Given the import's database is emptied
      When the errors kept are counted
      Then 0 errors are counted

  Rule: An error is kept with the tournament and competition it is of, where they are known

    The administrator's page for a document the import refused links to the
    tournament it is of, on the site and on the old site, and says what the
    competition it was is called (`importError.feature`). So an error is kept
    with the tournament's address and name, the competition's name, and the
    paths its document can be read at on the site and on the old site,
    where whatever refused the document knew them. One refused before any
    tournament was known, as a tournament refused itself is, is kept with
    none.

    Scenario: An error is kept with its tournament
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/blocks/30" saying "Refused" of the competition "A Block" of the tournament at "2014/ac/spring-open" called "Spring Open"
      Then the error kept for "croquetscores.com/blocks/30" is of the tournament at "2014/ac/spring-open" called "Spring Open"

    Scenario: An error is kept with its competition
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/blocks/30" saying "Refused" of the competition "A Block" of the tournament at "2014/ac/spring-open" called "Spring Open"
      Then the error kept for "croquetscores.com/blocks/30" is of the competition "A Block"

    Scenario: An error is kept with where its document is on each site
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/blocks/30" saying "Refused" at "2014/ac/spring-open/competitions/a-block" on the new site and "2014/ac/spring-open/competition/block-a" on the old site
      Then the error kept for "croquetscores.com/blocks/30" is at "2014/ac/spring-open/competitions/a-block" on the new site and "2014/ac/spring-open/competition/block-a" on the old site

    Scenario: An error kept knowing no tournament is of none
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/tournaments/12" saying "Refused"
      Then the error kept for "croquetscores.com/tournaments/12" is of no tournament

  Rule: An error is kept with what went wrong said for a person, where there is a saying

    The administrator's pages show, above what the code that failed wrote,
    what went wrong said for a person, as "Game Tim 26 beat Trev 0 in Spring
    Open - Knockout because they are not drawn to play each other."
    (`importCompetition.feature`). It is kept with the error, where whatever
    refused the document said it so, and is none otherwise.

    Scenario: An error is kept with what went wrong said for a person
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/blocks/30" saying "Refused", said for a person as "Game Tim 26 beat Trev 0"
      Then the summary kept for "croquetscores.com/blocks/30" names "Game Tim 26 beat Trev 0"

    Scenario: An error kept with no saying has none
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/blocks/30" saying "Refused"
      Then no summary is kept for "croquetscores.com/blocks/30"

  Rule: Whoever asks is told of each error kept, with all of it

    The import says each error it keeps in a file as it is kept
    (`ImportFiles.feature`), so that one that stops partway through still says
    what it kept before it stopped. The database tells whoever asks, once the
    error is kept, and keeps it whether anybody asked or not.

    Scenario: An error kept is told to whoever asked
      Given the import's database is emptied
      And someone asks to be told of each error kept
      And an error is kept for "croquetscores.com/blocks/30" saying "Refused"
      Then they were told of 1 error

    Scenario: What they are told is the document
      Given the import's database is emptied
      And someone asks to be told of each error kept
      And an error is kept for "croquetscores.com/blocks/30" saying "Refused"
      Then they were told of an error for "croquetscores.com/blocks/30"

    Scenario: What they are told is what went wrong
      Given the import's database is emptied
      And someone asks to be told of each error kept
      And an error is kept for "croquetscores.com/blocks/30" saying "Refused"
      Then they were told of an error saying "Refused"

    Scenario: What they are told is what it is said for a person as
      Given the import's database is emptied
      And someone asks to be told of each error kept
      And an error is kept for "croquetscores.com/blocks/30" saying "Refused", said for a person as "Game Tim 26 beat Trev 0"
      Then they were told of an error said for a person as "Game Tim 26 beat Trev 0"

    Scenario: What they are told is where it is
      Given the import's database is emptied
      And someone asks to be told of each error kept
      And an error is kept for "croquetscores.com/blocks/30" saying "Refused" at "2014/ac/spring-open/competitions/a-block" on the new site and "2014/ac/spring-open/competition/block-a" on the old site
      Then they were told of an error at "2014/ac/spring-open/competitions/a-block" on the new site and "2014/ac/spring-open/competition/block-a" on the old site

    Scenario: Each error kept is told in the order it was kept
      Given the import's database is emptied
      And someone asks to be told of each error kept
      And an error is kept for "croquetscores.com/users/2" saying "Refused"
      And an error is kept for "croquetscores.com/blocks/1" saying "Refused"
      Then they were told of "croquetscores.com/users/2" and then of "croquetscores.com/blocks/1"

    Scenario: An error is kept whether anyone asked or not
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/blocks/30" saying "Refused"
      When the errors kept are counted
      Then 1 error is counted

