@postgres
Feature: An administrator runs any tournament as its managers do

  An account that administers the site can do anything a tournament's
  managers can, to every tournament (`onlyManagers.feature`), without being
  made one of its managers. Whatever asks is told who is asking by the account
  it is asked by, which asks as an administrator while it holds the
  Administrator role (`asker.feature`), so what a manager may ask, an
  administrator may: changing the tournament, which is recorded as theirs,
  being answered what only a manager or a scorer is, and adding a game's
  score. An administrator is
  not among the managers answered, since being let through makes nobody a
  manager. Once the role is taken away, the account is refused as anybody
  with no part in the tournament is.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"

  Rule: An administrator changes any tournament

    Scenario: An administrator archives a tournament they do not manage
      When the reader signed in to the account for "admin@example.com" archives the tournament "Spring Open"
      Then the tournament is archived

    Scenario: What an administrator changes is recorded as theirs
      When the reader signed in to the account for "admin@example.com" archives the tournament "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "admin@example.com"

  Rule: An administrator is answered what only a manager is

    Scenario: An administrator is answered the managers of a tournament
      When the reader signed in to the account for "admin@example.com" lists the managers of "Spring Open"
      Then 1 manager is answered

    Scenario: An administrator is not among the managers answered
      When the reader signed in to the account for "admin@example.com" lists the managers of "Spring Open"
      Then the first manager answered is "Ollie Organiser"

    Scenario: An administrator is answered the scores of a competition
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "admin@example.com" lists the scores of "Block A" of "Spring Open"
      Then no scores are answered

    Scenario: An administrator is answered the players of a competition
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "admin@example.com" lists the players of "Block A" of "Spring Open"
      Then no players of the competition are answered

    Scenario: An administrator is answered the players of a test
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "admin@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then the first team answered is "Australia"

  Rule: An administrator adds a game's score as a scorer can

    Scenario: An administrator adds a game
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "admin@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26 to 17

  Rule: Only an account holding the role is let through

    Scenario: An account the role was taken from is refused a change
      Given "admin@example.com" has had the role "Administrator" taken away
      When the reader signed in to the account for "admin@example.com" archives the tournament "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: An account the role was taken from is refused what only a manager is answered
      Given "admin@example.com" has had the role "Administrator" taken away
      When the reader signed in to the account for "admin@example.com" lists the managers of "Spring Open"
      Then it is refused with "Tournament.NotAManager"
