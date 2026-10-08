@browser @postgres
Feature: The page where an administrator imports the world ranking players

  The page at /admin/administrator/import-world-ranking-players is one of the
  administrator's pages (`administrator.feature`), under their section bar
  (`AdministratorSections.feature`). It is where an administrator imports the
  players the world rankings know (`ImportWorldRankingPlayers.feature`).

  It is headed Import World Ranking Players, and offers Import, which starts
  the import. Nothing is imported until Import is pressed: opening the page
  reads nothing from the world rankings, so that an administrator passing
  through does not make the site ask another site for two lists.

  Beneath Import is the import's log, which says how the import goes as it
  goes, a line for each thing the import says, in the order it says them: a
  sport's list being read, how many of its players were read, that they were
  kept, or that the list could not be read, by its code. A list that could
  not be read says too that its sport's players were left as they were,
  since that is what the administrator needs to know of it. The last line
  says the import has finished.

  Import cannot be pressed again while the import is under way, since a
  second import would only read the same lists again. Pressing it again once
  the import has finished starts another, and the log is emptied for it, so
  that it says only how the latest import went.

  An import refused before it starts, as one asked by a reader whose
  Administrator role has been taken away while the page was open, is said in
  the log by its code. An import the site fails partway through is said the
  same way, as `Unknown`, so that the log never stops without saying why.

  The admin draws the page itself, so every scenario here runs scripts, and
  it is read on a phone's width, as the rest of the admin is. A fake of the
  world rankings' site stands in for the real one.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And a fake of the world rankings
    And the association croquet list names "Keith Aiton"
    And the association croquet list names "Bill Aldridge"
    And the golf croquet list names "Bill Arliss"
    And "admin@example.com" has an account, confirmed, with the password "another horse battery staple"
    And "admin@example.com" has been given the role "Administrator"
    And the reader has signed in as "admin@example.com" with the password "another horse battery staple"

  Rule: The page offers Import, and imports nothing until it is pressed

    Scenario: The page is headed by its name
      When the page at "/admin/administrator/import-world-ranking-players" is opened
      Then the page's heading is "Import World Ranking Players"

    Scenario: The page offers Import
      When the page at "/admin/administrator/import-world-ranking-players" is opened
      Then "Import" is offered

    Scenario: Opening the page reads nothing
      When the page at "/admin/administrator/import-world-ranking-players" is opened
      Then nothing was asked of the world rankings

    Scenario: The log says nothing before Import is pressed
      When the page at "/admin/administrator/import-world-ranking-players" is opened
      Then the import's log is empty

  Rule: Import imports the players

    Scenario: Pressing Import keeps the association croquet players
      Given the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      And the import's log says it has finished
      Then "Keith Aiton" is kept among the association croquet players

    Scenario: Pressing Import keeps the golf croquet players
      Given the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      And the import's log says it has finished
      Then "Bill Arliss" is kept among the golf croquet players

  Rule: The log says how the import goes, as it goes

    Scenario: The log's first line says the association croquet list is being read
      Given the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      Then the import's log's first line says the association croquet list is being read

    Scenario: The log's second line says how many association croquet players were read
      Given the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      Then the import's log's second line says 2 association croquet players were read

    Scenario: The log's third line says the association croquet players were kept
      Given the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      Then the import's log's third line says 2 association croquet players were kept

    Scenario: The log goes on to the golf croquet list
      Given the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      Then the import's log's fourth line says the golf croquet list is being read

    Scenario: The log's last line says the import has finished
      Given the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      Then the import's log's last line says it has finished

    Scenario: The log says a line before the import has finished
      Given the world rankings hold back the golf croquet list
      And the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      Then the import's log's first line says the association croquet list is being read

    Scenario: A list that cannot be read is said by its code
      Given the world rankings answer the association croquet list with a failure
      And the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      Then the import's log's second line says the association croquet list was refused with "WorldRankingLists.Unreachable"

    Scenario: A list that cannot be read says its players were left as they were
      Given the world rankings answer the association croquet list with a failure
      And the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      Then the import's log's second line says the association croquet players were left as they were

  Rule: Import cannot be pressed while the import is under way

    Scenario: Import cannot be pressed while the import is under way
      Given the world rankings hold back the golf croquet list
      And the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      Then "Import" cannot be pressed

    Scenario: Import can be pressed again once the import has finished
      Given the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      And the import's log says it has finished
      Then "Import" can be pressed

    Scenario: Importing again empties the log first
      Given the page at "/admin/administrator/import-world-ranking-players" is open
      And "Import" is pressed
      And the import's log says it has finished
      When "Import" is pressed
      And the import's log says it has finished
      Then the import's log has 7 lines

  Rule: An import that is refused or fails is said in the log

    Scenario: Importing once the reader's role has been taken says so
      Given the page at "/admin/administrator/import-world-ranking-players" is open
      And "admin@example.com" has had the role "Administrator" taken away
      When "Import" is pressed
      Then the import's log's first line says the import was refused with "Account.NotAnAdministrator"

    Scenario: An import the site fails says so
      Given the import is answered with a server error
      And the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      Then the import's log's first line says the import was refused with "Unknown"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). A number is nobody's
    language, and neither is a code.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/admin/administrator/import-world-ranking-players" is opened
      Then every word in the admin's content is in the test locale

    Scenario: The log is in the reader's language
      Given a browser that asks for "en-XA"
      And the world rankings answer the golf croquet list with a failure
      And the page at "/admin/administrator/import-world-ranking-players" is open
      When the way to import is pressed
      And the import's log says it has finished
      Then every word in the import's log but its numbers and codes is in the test locale

  Rule: The page is laid out for a phone first

    Scenario: Import can be pressed with a thumb
      When the page at "/admin/administrator/import-world-ranking-players" is opened
      Then "Import" is at least 44 pixels tall

    Scenario: The page is no wider than the window
      Given the page at "/admin/administrator/import-world-ranking-players" is open
      When "Import" is pressed
      And the import's log says it has finished
      Then the page is no wider than the window
