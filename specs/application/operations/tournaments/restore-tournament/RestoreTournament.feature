@postgres
Feature: Restoring an archived tournament

  A manager of the tournament can restore it once it is archived, and the
  account they are signed in to is who restored it. The tournament is named by
  its id; one there is not is refused as `RestoreTournament.NoSuchTournament`.
  Only the tournament's managers can: anybody else, a scorer among them, is
  refused with `Tournament.NotAManager` (`onlyManagers.feature`).

  What restoring does is the tournament's to say (`restore.feature`).
  Restoring one that is not archived records nothing. A forgotten account
  restores nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: A tournament restored is kept not archived

    Scenario: The tournament is kept not archived
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" restores the tournament "Spring Open"
      Then the tournament is not archived

    Scenario: Restoring the tournament is recorded as done by whoever asked
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" restores the tournament "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: Restoring a tournament that is not archived records nothing
      When the reader signed in to the account for "organiser@example.com" restores the tournament "Spring Open"
      Then nothing more is recorded of the tournament

  Rule: Only a tournament there is can be restored

    Scenario: Restoring a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" restores a tournament there is not
      Then it is refused with "RestoreTournament.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "someone@example.com" restores the tournament "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "scorer@example.com" restores the tournament "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account restores nothing

    Scenario: A forgotten account is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      And the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account restores the tournament "Spring Open"
      Then it is refused with "Account.Forgotten"
