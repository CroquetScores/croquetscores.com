@postgres
Feature: Taking somebody off a tournament's scorers

  A manager of a tournament can take any scorer off it, and the account they
  are signed in to is who did. Only the tournament's managers can: anybody
  else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`). The tournament is named by its id; one there is
  not is refused as `RemoveScorer.NoSuchTournament`.

  The scorer taken off is named by their account's id, as a manager taken off
  is (`RemoveManager.feature`). Taking off an account that does not score the
  tournament records nothing (`removeScorer.feature`).

  A forgotten account takes nobody off, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"

  Rule: Somebody taken off the scorers no longer scores the tournament

    Scenario: The account taken off no longer scores the tournament
      When the reader signed in to the account for "organiser@example.com" takes "scorer@example.com" off the scorers of "Spring Open"
      Then the account for "scorer@example.com" does not score the tournament

    Scenario: Taking a scorer off is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" takes "scorer@example.com" off the scorers of "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: Taking off an account that does not score records nothing
      Given "organiser@example.com" has taken "scorer@example.com" off the scorers of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" takes "scorer@example.com" off the scorers of "Spring Open"
      Then nothing more is recorded of the tournament

  Rule: Only a manager of the tournament can ask for this

    Scenario: A scorer cannot take themselves off
      When the reader signed in to the account for "scorer@example.com" takes "scorer@example.com" off the scorers of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: Only a tournament there is can have a scorer taken off

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" takes "scorer@example.com" off the scorers of a tournament there is not
      Then it is refused with "RemoveScorer.NoSuchTournament"

  Rule: A forgotten account takes nobody off

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account takes "scorer@example.com" off the scorers of "Spring Open"
      Then it is refused with "Account.Forgotten"
