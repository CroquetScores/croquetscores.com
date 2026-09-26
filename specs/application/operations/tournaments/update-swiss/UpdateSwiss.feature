@postgres
Feature: Changing what a tournament's Swiss is

  A Swiss is updated as a block is (`UpdateBlock.feature`), by a manager of
  the tournament, and a tournament there is not is refused as
  `UpdateSwiss.NoSuchTournament`. An update says the Swiss's name and what it
  is the best of again, each asked its own rules on the way in. Only the
  tournament's managers can: anybody else, a scorer among them, is refused
  with `Tournament.NotAManager` (`onlyManagers.feature`).

  This says again only enough of what updating a block says to show that it
  holds for a Swiss.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the Swiss "Swiss" to "Spring Open"

  Rule: A sound update is kept

    Scenario: The Swiss is kept as it was updated
      Given the update calls the competition "Swiss Stage"
      When the reader signed in to the account for "organiser@example.com" updates the Swiss "Swiss" in "Spring Open"
      Then the tournament has the competition "Swiss Stage"

    Scenario: The Swiss is the best of what it was updated to
      Given the update makes the competition the best of 3
      When the reader signed in to the account for "organiser@example.com" updates the Swiss "Swiss" in "Spring Open"
      Then the tournament's competition "Swiss" is the best of 3

  Rule: Each value must break none of its own rules

    Scenario: A best-of that could not be one is refused for it
      Given the update makes the competition the best of 0
      When the reader signed in to the account for "organiser@example.com" updates the Swiss "Swiss" in "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "BestOf.TooSmall"

  Rule: What the tournament asks is the tournament's to refuse

    Scenario: Updating a block as a Swiss is refused as the tournament refuses it
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the update calls the competition "Block One"
      When the reader signed in to the account for "organiser@example.com" updates the Swiss "Block A" in "Spring Open"
      Then it is refused with "Tournament.NotASwiss"

    Scenario: Updating a Swiss in a tournament there is not is refused
      Given the update calls the competition "Swiss Stage"
      When the reader signed in to the account for "organiser@example.com" updates the Swiss "Swiss" in a tournament there is not
      Then it is refused with "UpdateSwiss.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the update calls the competition "Swiss Stage"
      When the reader signed in to the account for "someone@example.com" updates the Swiss "Swiss" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And the update calls the competition "Swiss Stage"
      When the reader signed in to the account for "scorer@example.com" updates the Swiss "Swiss" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"
