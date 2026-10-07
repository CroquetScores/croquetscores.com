@postgres
Feature: Changing a tournament player's world ranking name alone

  An account that holds the World Ranking Officer role may change the world
  ranking name of any player in any tournament, and nothing else about them,
  whether or not it has a part in the tournament; so may the tournament's
  managers (`changeWorldRankingName.feature`). The account the reader is
  signed in to is who changed it. Anybody else, a scorer among them, is
  refused with `Tournament.NotAManagerOrRankingOfficer`.

  The tournament and the player are named by their ids; a tournament there is
  not is refused as `ChangePlayerWorldRankingName.NoSuchTournament`. The world
  ranking name is asked its own rules on the way in, and one that breaks one
  is refused with `Request.Invalid` and the first rule it breaks. A forgotten
  account changes nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "ranker@example.com" has an account, confirmed, called "Rae Ranker"
    And "ranker@example.com" has been given the role "World Ranking Officer"

  Rule: A world ranking officer or a manager changes it

    Scenario: A world ranking officer changes a player's world ranking name
      When the reader signed in to the account for "ranker@example.com" changes the world ranking name of the player "Sam Someone" of "Spring Open" to "Samuel Someone"
      Then the tournament's player "Sam Someone" has the world ranking name "Samuel Someone"

    Scenario: What a world ranking officer changes is recorded as theirs
      When the reader signed in to the account for "ranker@example.com" changes the world ranking name of the player "Sam Someone" of "Spring Open" to "Samuel Someone"
      Then the last thing the tournament recorded was caused by the account for "ranker@example.com"

    Scenario: A manager changes a player's world ranking name
      When the reader signed in to the account for "organiser@example.com" changes the world ranking name of the player "Sam Someone" of "Spring Open" to "Samuel Someone"
      Then the tournament's player "Sam Someone" has the world ranking name "Samuel Someone"

  Rule: Nobody else changes it

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" changes the world ranking name of the player "Sam Someone" of "Spring Open" to "Samuel Someone"
      Then it is refused with "Tournament.NotAManagerOrRankingOfficer"

    Scenario: An account the role was taken from is refused
      Given "ranker@example.com" has had the role "World Ranking Officer" taken away
      When the reader signed in to the account for "ranker@example.com" changes the world ranking name of the player "Sam Someone" of "Spring Open" to "Samuel Someone"
      Then it is refused with "Tournament.NotAManagerOrRankingOfficer"

  Rule: The world ranking name must break none of its own rules

    Scenario: A world ranking name that breaks a rule is refused for it
      When the reader signed in to the account for "ranker@example.com" changes the world ranking name of the player "Sam Someone" of "Spring Open" to "Sa"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "WorldRankingName.TooShort"

  Rule: Only a tournament there is can have a player's world ranking name changed

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "ranker@example.com" changes the world ranking name of the player "Sam Someone" of a tournament there is not to "Samuel Someone"
      Then it is refused with "ChangePlayerWorldRankingName.NoSuchTournament"

  Rule: A forgotten account changes nothing

    Scenario: A forgotten account is refused
      Given the account for "ranker@example.com" is taken hold of
      And the account for "ranker@example.com" has been forgotten
      When the reader signed in to that account changes the world ranking name of the player "Sam Someone" of "Spring Open" to "Samuel Someone"
      Then it is refused with "Account.Forgotten"
