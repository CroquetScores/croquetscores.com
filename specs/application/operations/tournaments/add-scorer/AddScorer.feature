@postgres
Feature: Making somebody a scorer of a tournament

  A manager of a tournament can make somebody a scorer of it, and the account
  they are signed in to is who did. Only the tournament's managers can:
  anybody else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`). The tournament is named by its id; one there is not
  is refused as `AddScorer.NoSuchTournament`.

  Whoever is made a scorer is named by their email address, taken as it is
  when somebody is made a manager (`AddManager.feature`): an address with no
  confirmed account is refused as `AddScorer.NoSuchAccount`, however it came
  to have none. A manager is not made a scorer, and is refused as the
  tournament refuses it (`addScorer.feature`). Nothing is emailed.

  A scorer enters scores, and nothing records scores yet, so what a scorer can
  do is specified with the scores when they arrive.

  A forgotten account makes nobody a scorer, and is refused with
  `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Somebody made a scorer scores the tournament

    Scenario: The account made a scorer scores the tournament
      When the reader signed in to the account for "organiser@example.com" makes "scorer@example.com" a scorer of "Spring Open"
      Then the account for "scorer@example.com" scores the tournament

    Scenario: A scorer made cannot change the tournament
      Given "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" archives the tournament "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: Making a scorer is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" makes "scorer@example.com" a scorer of "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

  Rule: Only an address with a confirmed account can be made a scorer

    Scenario: An address nobody has registered is refused
      When the reader signed in to the account for "organiser@example.com" makes "nobody@example.com" a scorer of "Spring Open"
      Then it is refused with "AddScorer.NoSuchAccount"

  Rule: What the tournament asks is the tournament's to refuse

    Scenario: Making a manager a scorer is refused as the tournament refuses it
      When the reader signed in to the account for "organiser@example.com" makes "organiser@example.com" a scorer of "Spring Open"
      Then it is refused with "Tournament.AlreadyAManager"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A scorer cannot make another scorer
      Given "other@example.com" has an account, confirmed, called "Alex Another"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" makes "other@example.com" a scorer of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: Only a tournament there is can be given a scorer

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" makes "scorer@example.com" a scorer of a tournament there is not
      Then it is refused with "AddScorer.NoSuchTournament"

  Rule: A forgotten account makes nobody a scorer

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account makes "scorer@example.com" a scorer of "Spring Open"
      Then it is refused with "Account.Forgotten"
