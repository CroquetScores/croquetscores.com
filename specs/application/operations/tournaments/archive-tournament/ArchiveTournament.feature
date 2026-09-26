@postgres
Feature: Archiving a tournament

  A manager of the tournament can archive it, and the account they are signed
  in to is who archived it. The tournament is named by its id; one there is
  not is refused as `ArchiveTournament.NoSuchTournament`. Only the
  tournament's managers can: anybody else, a scorer among them, is refused
  with `Tournament.NotAManager` (`onlyManagers.feature`).

  What archiving does is the tournament's to say (`archive.feature`): it is
  kept, and set aside. Archiving one that is archived records nothing. A
  forgotten account archives nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: A tournament archived is kept archived

    Scenario: The tournament is kept archived
      When the reader signed in to the account for "organiser@example.com" archives the tournament "Spring Open"
      Then the tournament is archived

    Scenario: Archiving the tournament is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" archives the tournament "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: An archived tournament is still found where it was
      When the reader signed in to the account for "organiser@example.com" archives the tournament "Spring Open"
      Then the tournament is found at "2026/ac/spring-open"

    Scenario: Archiving an archived tournament records nothing
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the tournament "Spring Open"
      Then nothing more is recorded of the tournament

  Rule: Only a tournament there is can be archived

    Scenario: Archiving a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" archives a tournament there is not
      Then it is refused with "ArchiveTournament.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" archives the tournament "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" archives the tournament "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account archives nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account archives the tournament "Spring Open"
      Then it is refused with "Account.Forgotten"
