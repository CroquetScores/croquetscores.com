@postgres
Feature: The managers of a tournament, as a manager lists them

  A manager lists a tournament's managers to see who else runs it and to take
  one off, so the application answers with every account that manages it, in
  the order they were made managers, whoever created it first. Each is
  answered with its account's id, which is what taking one off names it by
  (`RemoveManager.feature`), and its name, which is what a reader knows
  somebody by. Each also says whether it is the account asking, since taking
  oneself off is taking away one's own way back to the tournament.

  A forgotten account's name can no longer be read, and a forgotten account
  that was a manager still is one until somebody takes it off. So it is
  listed, with no name, and said to be forgotten, so that it can be taken off.

  It answers the account the reader is signed in to, and never one the reader
  chose. Only the tournament's managers can ask, since the list is for
  managing them: anybody else, a scorer among them, is refused with
  `Tournament.NotAManager`. A tournament there is not is refused as
  `ManagersOfTournament.NoSuchTournament`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Every manager is answered, in the order they were made

    Scenario: The account that created the tournament is listed
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Ollie Organiser" is listed

    Scenario: A manager made is listed
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Sam Someone" is listed

    Scenario: Whoever created the tournament is listed first
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the first manager listed is "Ollie Organiser"

    Scenario: A manager taken off is not listed
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And "organiser@example.com" has taken "someone@example.com" off the managers of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Sam Someone" is not listed

    Scenario: A scorer is not listed
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Sam Someone" is not listed

  Rule: The account asking is said to be the one asking

    Scenario: The account asking is said to be itself
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Ollie Organiser" is said to be the reader

    Scenario: Another manager is not said to be the reader
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Sam Someone" is not said to be the reader

  Rule: A forgotten account that manages the tournament is listed as forgotten

    Scenario: A forgotten manager is listed as forgotten
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the second manager listed is forgotten

    Scenario: A forgotten manager is listed with no name
      Given "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When the reader signed in to the account for "organiser@example.com" lists the managers of "Spring Open"
      Then the manager "Sam Someone" is not listed

  Rule: Only a manager of a tournament there is can list them

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" lists the managers of a tournament there is not
      Then it is refused with "ManagersOfTournament.NoSuchTournament"

    Scenario: A reader who does not manage the tournament is refused
      When the reader signed in to the account for "someone@example.com" lists the managers of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "someone@example.com" lists the managers of "Spring Open"
      Then it is refused with "Tournament.NotAManager"
