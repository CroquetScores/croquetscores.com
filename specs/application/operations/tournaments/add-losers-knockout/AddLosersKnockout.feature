@postgres
Feature: Adding a knockout that takes the losers of another knockout's round

  A manager of the tournament adds a knockout that takes the losers of a
  round of another of its knockouts (`addLosersKnockout.feature`), naming the
  tournament, the knockout and the round, the first round being the first.
  The new knockout is given an id of its own, which is the answer. A
  tournament there is not is refused as `AddLosersKnockout.NoSuchTournament`.
  Which rounds the knockout has, and whether it is one at all, are the
  tournament's to say. Only the tournament's managers can: anybody else, a
  scorer among them, is refused with `Tournament.NotAManager`.

  Matches of that round may be decided already. Their losers are put into the
  new knockout as it is added, rather than only when the next game is, so that
  adding it late loses nobody. Afterwards each game added to the knockout that
  decides a match puts that match's loser in (`AddGame.feature`).

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
    And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
    And "organiser@example.com" has added the knockout "Main Event" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Main Event" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Main Event" of "Spring Open"
    And "organiser@example.com" has entered the player "Chris Third" in "Main Event" of "Spring Open"
    And "organiser@example.com" has entered the player "Pat Fourth" in "Main Event" of "Spring Open"

  Rule: A losers knockout is added and kept

    Scenario: The knockout is one of the tournament's competitions
      When the reader signed in to the account for "organiser@example.com" adds the losers knockout "Plate" to "Spring Open" for the losers of the first round of "Main Event"
      Then the tournament's competition "Plate" is a knockout

    Scenario: The knockout has a place for each match of the round
      When the reader signed in to the account for "organiser@example.com" adds the losers knockout "Plate" to "Spring Open" for the losers of the first round of "Main Event"
      Then the tournament's competition "Plate" has a draw of 2 places

    Scenario: The answer is the knockout's id
      When the reader signed in to the account for "organiser@example.com" adds the losers knockout "Plate" to "Spring Open" for the losers of the first round of "Main Event"
      Then it is answered with the id of the tournament's competition "Plate"

  Rule: Losers already out of the round are put in as the knockout is added

    Scenario: The loser of a decided match is in the new knockout
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Main Event" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the losers knockout "Plate" to "Spring Open" for the losers of the first round of "Main Event"
      Then the competition "Plate" of "Spring Open" has the player "Alex Another"

    Scenario: The winner of a decided match is not
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Main Event" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the losers knockout "Plate" to "Spring Open" for the losers of the first round of "Main Event"
      Then the competition "Plate" of "Spring Open" does not have the player "Sam Someone"

    Scenario: The loser of a match not yet decided is not
      When the reader signed in to the account for "organiser@example.com" adds the losers knockout "Plate" to "Spring Open" for the losers of the first round of "Main Event"
      Then the competition "Plate" of "Spring Open" does not have the player "Sam Someone"
      And the competition "Plate" of "Spring Open" does not have the player "Alex Another"

  Rule: What the tournament asks is the tournament's to refuse

    Scenario: The final has no losers to send on
      When the reader signed in to the account for "organiser@example.com" adds the losers knockout "Plate" to "Spring Open" for the losers of the second round of "Main Event"
      Then it is refused with "Tournament.NoSuchRound"

    Scenario: A name another competition has is refused
      When the reader signed in to the account for "organiser@example.com" adds the losers knockout "Main Event" to "Spring Open" for the losers of the first round of "Main Event"
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: Adding a losers knockout to a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" adds the losers knockout "Plate" to a tournament there is not
      Then it is refused with "AddLosersKnockout.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" adds the losers knockout "Plate" to "Spring Open" for the losers of the first round of "Main Event"
      Then it is refused with "Tournament.NotAManager"
