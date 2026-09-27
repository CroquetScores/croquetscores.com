@postgres
Feature: The scorers of a tournament, as a manager lists them

  A manager lists a tournament's scorers to see who enters its scores and to
  take one off, so the application answers with every account that scores
  it, in the order they were made scorers. Each is answered with its
  account's id, which is what taking one off names it by
  (`RemoveScorer.feature`), and its name, which is what a reader knows
  somebody by.

  A forgotten account is not answered, though the tournament still counts it
  among its scorers until somebody takes it off: no query answers a forgotten
  account unless it is expressly asked to, and this one is not. Its name
  could not be read in any case.

  It answers the account the reader is signed in to, and never one the reader
  chose. Only the tournament's managers can ask, since the list is for
  managing its scorers: anybody else, a scorer among them, is refused with
  `Tournament.NotAManager`. A tournament there is not is refused as
  `ScorersOfTournament.NoSuchTournament`.

  A forgotten account lists nothing, and is refused with `Account.Forgotten`,
  as it is when it asks to change the tournament.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And "another@example.com" has an account, confirmed, called "Alex Another"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Every scorer is answered, in the order they were made

    Scenario: A tournament with no scorers is answered with none
      When the reader signed in to the account for "organiser@example.com" lists the scorers of "Spring Open"
      Then no scorers are answered

    Scenario: A scorer made is listed
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scorers of "Spring Open"
      Then the scorer "Sam Someone" is answered

    Scenario: The first scorer made is listed first
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has made "another@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scorers of "Spring Open"
      Then the first scorer answered is "Sam Someone"

    Scenario: A scorer taken off is not listed
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has taken "someone@example.com" off the scorers of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scorers of "Spring Open"
      Then the scorer "Sam Someone" is not answered

    Scenario: A scorer made a manager is not listed
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scorers of "Spring Open"
      Then the scorer "Sam Someone" is not answered

    Scenario: A manager is not listed
      When the reader signed in to the account for "organiser@example.com" lists the scorers of "Spring Open"
      Then the scorer "Ollie Organiser" is not answered

  Rule: A forgotten account is not answered

    Scenario: A forgotten scorer is not answered
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When the reader signed in to the account for "organiser@example.com" lists the scorers of "Spring Open"
      Then no scorers are answered

  Rule: Only a manager of a tournament there is can list them

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" lists the scorers of a tournament there is not
      Then it is refused with "ScorersOfTournament.NoSuchTournament"

    Scenario: A reader who does not manage the tournament is refused
      When the reader signed in to the account for "someone@example.com" lists the scorers of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "someone@example.com" lists the scorers of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account lists nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account lists the scorers of "Spring Open"
      Then it is refused with "Account.Forgotten"
