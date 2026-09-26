@postgres
Feature: Taking somebody off a tournament's managers

  A manager of a tournament can take any manager off, themselves among them,
  and the account they are signed in to is who did. Only the tournament's
  managers can: anybody else is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`). The tournament is named by its id; one there is
  not is refused as `RemoveManager.NoSuchTournament`.

  The manager taken off is named by their account's id, since the managers
  are chosen from those the tournament has rather than typed. A tournament
  always has a manager, so taking off the last one is refused as the
  tournament refuses it (`removeManager.feature`). Taking off an account that
  does not manage the tournament records nothing.

  A forgotten account takes nobody off, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"

  Rule: Somebody taken off the managers no longer manages the tournament

    Scenario: The account taken off no longer manages the tournament
      When the reader signed in to the account for "organiser@example.com" takes "someone@example.com" off the managers of "Spring Open"
      Then the account for "someone@example.com" does not manage the tournament

    Scenario: A manager taken off can no longer change the tournament
      Given "organiser@example.com" has taken "someone@example.com" off the managers of "Spring Open"
      When the reader signed in to the account for "someone@example.com" archives the tournament "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A manager can take themselves off
      When the reader signed in to the account for "someone@example.com" takes "someone@example.com" off the managers of "Spring Open"
      Then the account for "someone@example.com" does not manage the tournament

    Scenario: Taking a manager off is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" takes "someone@example.com" off the managers of "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

  Rule: What the tournament asks is the tournament's to refuse

    Scenario: Taking off the last manager is refused as the tournament refuses it
      Given "organiser@example.com" has taken "someone@example.com" off the managers of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" takes "organiser@example.com" off the managers of "Spring Open"
      Then it is refused with "Tournament.LastManager"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "other@example.com" has an account, confirmed, called "Alex Another"
      When the reader signed in to the account for "other@example.com" takes "someone@example.com" off the managers of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: Only a tournament there is can have a manager taken off

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" takes "someone@example.com" off the managers of a tournament there is not
      Then it is refused with "RemoveManager.NoSuchTournament"

  Rule: A forgotten account takes nobody off

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account takes "someone@example.com" off the managers of "Spring Open"
      Then it is refused with "Account.Forgotten"
