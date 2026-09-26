@postgres
Feature: Adding a Swiss to a tournament

  A Swiss is added as a block is (`AddBlock.feature`), by a manager of the
  tournament, to a tournament named by its id, and given a new id that is the
  answer. A tournament there is not is refused as `AddSwiss.NoSuchTournament`.
  A Swiss is added with a name and what each of its matches is the best of,
  each asked its own rules on the way in. Only the tournament's managers can:
  anybody else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  This says again only enough of what adding a block says to show that it
  holds for a Swiss.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: A sound Swiss is added and kept

    Scenario: The Swiss is one of the tournament's competitions
      When the reader signed in to the account for "organiser@example.com" adds the Swiss "Swiss" to "Spring Open"
      Then the tournament's competition "Swiss" is a Swiss

    Scenario: The Swiss is the best of what it was added as
      Given the Swiss is to be the best of 2
      When the reader signed in to the account for "organiser@example.com" adds the Swiss "Swiss" to "Spring Open"
      Then the tournament's competition "Swiss" is the best of 2

    Scenario: The answer is the Swiss's id
      When the reader signed in to the account for "organiser@example.com" adds the Swiss "Swiss" to "Spring Open"
      Then it is answered with the id of the tournament's competition "Swiss"

  Rule: Each value must break none of its own rules

    Scenario: A best-of that could not be one is refused for it
      Given the Swiss is to be the best of 0
      When the reader signed in to the account for "organiser@example.com" adds the Swiss "Swiss" to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "BestOf.TooSmall"

  Rule: What the tournament asks is the tournament's to refuse

    Scenario: A name another competition has is refused as the tournament refuses it
      Given "organiser@example.com" has added the block "Swiss" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the Swiss "Swiss" to "Spring Open"
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: Adding a Swiss to a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" adds the Swiss "Swiss" to a tournament there is not
      Then it is refused with "AddSwiss.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" adds the Swiss "Swiss" to "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" adds the Swiss "Swiss" to "Spring Open"
      Then it is refused with "Tournament.NotAManager"
