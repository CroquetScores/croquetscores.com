@postgres
Feature: The database an import empties and fills

  An import is run over and over while it is being written, and what the last
  run left would be imported a second time on top of itself. So an import
  begins by emptying the database it writes into, which is the site's
  (`loadImportConfig.feature`): every table in it is dropped, in whatever
  schema it is, and every migration is applied again. The migration runner
  never drops anything, and must not, so the dropping is here, where nothing
  but an import reaches it.

  Two tables of the import's own are made with the rest: one keeping what
  could not be imported, and one keeping which account each of the old sites'
  users became. Neither is a migration's, because the site has no use for
  them, and both go when importing is finished.

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
