@browser @postgres
Feature: The section bar of the administrator's pages

  Every one of the administrator's pages (`administrator.feature`) has a
  section bar, which is for moving between pages (`LAYOUT.md`). It leads back
  to the tournaments, as Tournaments, which is where an administrator runs a
  tournament as its managers do; to the accounts, as Accounts, which is the
  first of the administrator's own pages; and to the page where the players
  the world rankings know are imported, as World Rankings
  (`importWorldRankingPlayers.feature`); and to the documents the import from
  the old sites refused, as Import Errors (`importErrors.feature`), which
  comes fourth, after World Rankings; to the server's log, as Logs
  (`logs.feature`), which comes fifth, after Import Errors; and to the page
  where whether the site may use its database is seen and set, as Database
  Access (`databaseStatus.feature`), which comes sixth.

  Tournaments comes first, since it is the admin an administrator came from,
  then Accounts, and World Rankings after it. It leads to /admin/, the admin's own address for the
  tournaments, rather than to /admin, which is only sent on to it.

  The page being read is marked, as the section bar marks the section being
  read: Accounts on the accounts page and on any page beneath it, and World
  Rankings on the page where the players are imported. The
  administrator's pages at /admin/administrator itself are none of the
  sections, so nothing is marked there. Tournaments is never marked here,
  since the tournaments are not one of the administrator's pages and have a
  section bar of their own.

  The sections' names and the bar's own name are words of the reader's
  language.

  The admin draws the pages itself, so every scenario here runs scripts, and
  they are read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "admin@example.com" has an account, confirmed, with the password "another horse battery staple"
    And "admin@example.com" has been given the role "Administrator"
    And the reader has signed in as "admin@example.com" with the password "another horse battery staple"

  Rule: The administrator's pages lead to the tournaments, the accounts and the world rankings

    Scenario: The administrator's pages have a section bar
      When the page at "/admin/administrator" is opened
      Then the page has a section bar

    Scenario: The section bar offers the tournaments
      When the page at "/admin/administrator" is opened
      Then the section "Tournaments" is offered

    Scenario: The section bar offers the accounts
      When the page at "/admin/administrator" is opened
      Then the section "Accounts" is offered

    Scenario: Tournaments comes first
      When the page at "/admin/administrator" is opened
      Then the first section is "Tournaments"

    Scenario: Accounts comes second
      When the page at "/admin/administrator" is opened
      Then the second section is "Accounts"

    Scenario: The section bar offers the world rankings
      When the page at "/admin/administrator" is opened
      Then the section "World Rankings" is offered

    Scenario: World Rankings comes third
      When the page at "/admin/administrator" is opened
      Then the third section is "World Rankings"

    Scenario: The section bar offers the import errors
      When the page at "/admin/administrator" is opened
      Then the section "Import Errors" is offered

    Scenario: Import Errors comes fourth
      When the page at "/admin/administrator" is opened
      Then the fourth section is "Import Errors"

    Scenario: Import Errors leads to the page of the documents the import refused
      When the page at "/admin/administrator" is opened
      Then the section "Import Errors" leads to "/admin/administrator/import-errors"

    Scenario: Pressing Import Errors opens the page of the documents the import refused
      Given the page at "/admin/administrator" is open
      When the section "Import Errors" is pressed
      Then the address is "/admin/administrator/import-errors"

    Scenario: The section bar offers the logs
      When the page at "/admin/administrator" is opened
      Then the section "Logs" is offered

    Scenario: Logs comes fifth
      When the page at "/admin/administrator" is opened
      Then the fifth section is "Logs"

    Scenario: Logs leads to the page of the server's log
      When the page at "/admin/administrator" is opened
      Then the section "Logs" leads to "/admin/administrator/logs"

    Scenario: Pressing Logs opens the page of the server's log
      Given the page at "/admin/administrator" is open
      When the section "Logs" is pressed
      Then the address is "/admin/administrator/logs"

    Scenario: The section bar offers the database access
      When the page at "/admin/administrator" is opened
      Then the section "Database Access" is offered

    Scenario: Database Access comes sixth
      When the page at "/admin/administrator" is opened
      Then the sixth section is "Database Access"

    Scenario: Database Access leads to the page where access is seen and set
      When the page at "/admin/administrator" is opened
      Then the section "Database Access" leads to "/admin/administrator/database-status"

    Scenario: Database Access is marked on the page where access is seen and set
      When the page at "/admin/administrator/database-status" is opened
      Then the section "Database Access" is marked as current

    Scenario: Tournaments leads to the admin's tournaments
      When the page at "/admin/administrator" is opened
      Then the section "Tournaments" leads to "/admin/"

    Scenario: Accounts leads to the accounts page
      When the page at "/admin/administrator" is opened
      Then the section "Accounts" leads to "/admin/administrator/accounts"

    Scenario: World Rankings leads to the page where the players are imported
      When the page at "/admin/administrator" is opened
      Then the section "World Rankings" leads to "/admin/administrator/import-world-ranking-players"

    Scenario: Pressing Accounts opens the accounts page
      Given the page at "/admin/administrator" is open
      When the section "Accounts" is pressed
      Then the address is "/admin/administrator/accounts"

    Scenario: Pressing Tournaments opens the admin's tournaments
      Given the page at "/admin/administrator" is open
      When the section "Tournaments" is pressed
      Then the address is "/admin/"

    Scenario: Pressing World Rankings opens the page where the players are imported
      Given the page at "/admin/administrator" is open
      When the section "World Rankings" is pressed
      Then the address is "/admin/administrator/import-world-ranking-players"

    Scenario: Nothing is marked on the administrator's pages themselves
      When the page at "/admin/administrator" is opened
      Then the section "Accounts" is not marked as current

    Scenario: World Rankings is not marked on the administrator's pages themselves
      When the page at "/admin/administrator" is opened
      Then the section "World Rankings" is not marked as current

    Scenario: The section bar is in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/admin/administrator" is opened
      Then the first section is in the test locale

  Rule: A page beneath them has the same section bar, with its section marked

    Scenario: The accounts page has a section bar
      When the page at "/admin/administrator/accounts" is opened
      Then the page has a section bar

    Scenario: Accounts is marked on the accounts page
      When the page at "/admin/administrator/accounts" is opened
      Then the section "Accounts" is marked as current

    Scenario: Tournaments is not marked on the accounts page
      When the page at "/admin/administrator/accounts" is opened
      Then the section "Tournaments" is not marked as current

    Scenario: Accounts is marked on a page beneath the accounts page
      When the page at "/admin/administrator/accounts/someone" is opened
      Then the section "Accounts" is marked as current

    Scenario: World Rankings is not marked on the accounts page
      When the page at "/admin/administrator/accounts" is opened
      Then the section "World Rankings" is not marked as current

    Scenario: The page where the players are imported has a section bar
      When the page at "/admin/administrator/import-world-ranking-players" is opened
      Then the page has a section bar

    Scenario: World Rankings is marked on the page where the players are imported
      When the page at "/admin/administrator/import-world-ranking-players" is opened
      Then the section "World Rankings" is marked as current

    Scenario: Accounts is not marked on the page where the players are imported
      When the page at "/admin/administrator/import-world-ranking-players" is opened
      Then the section "Accounts" is not marked as current

    Scenario: The page of the documents the import refused has a section bar
      When the page at "/admin/administrator/import-errors" is opened
      Then the page has a section bar

    Scenario: Import Errors is marked on the page of the documents the import refused
      When the page at "/admin/administrator/import-errors" is opened
      Then the section "Import Errors" is marked as current

    Scenario: Import Errors is marked on the page of one document
      When the page at "/admin/administrator/import-errors/users%2F1-A" is opened
      Then the section "Import Errors" is marked as current

    Scenario: The page of the server's log has a section bar
      When the page at "/admin/administrator/logs" is opened
      Then the page has a section bar

    Scenario: Logs is marked on the page of the server's log
      When the page at "/admin/administrator/logs" is opened
      Then the section "Logs" is marked as current

    Scenario: Import Errors is not marked on the page of the server's log
      When the page at "/admin/administrator/logs" is opened
      Then the section "Import Errors" is not marked as current

    Scenario: Accounts is not marked on the page of the documents the import refused
      When the page at "/admin/administrator/import-errors" is opened
      Then the section "Accounts" is not marked as current
