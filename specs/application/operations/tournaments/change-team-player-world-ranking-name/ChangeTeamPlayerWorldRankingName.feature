@postgres
Feature: Changing a team player's world ranking name alone

  A player in a team's world ranking name is changed alone as a tournament
  player's is (`ChangePlayerWorldRankingName.feature`): by an account that
  holds the World Ranking Officer role, whatever part it has in the
  tournament, or by the tournament's managers; anybody else, a scorer among
  them, is refused with `Tournament.NotAManagerOrRankingOfficer`. The
  tournament, the team and the player are named by their ids; a tournament
  there is not is refused as
  `ChangeTeamPlayerWorldRankingName.NoSuchTournament`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
    And "ranker@example.com" has an account, confirmed, called "Rae Ranker"
    And "ranker@example.com" has been given the role "World Ranking Officer"

  Rule: A world ranking officer or a manager changes it

    Scenario: A world ranking officer changes a team player's world ranking name
      When the reader signed in to the account for "ranker@example.com" changes the world ranking name of the player "Sam Someone" of the team "Australia" of "Spring Tests" to "Samuel Someone"
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Samuel Someone"

    Scenario: A manager changes a team player's world ranking name
      When the reader signed in to the account for "organiser@example.com" changes the world ranking name of the player "Sam Someone" of the team "Australia" of "Spring Tests" to "Samuel Someone"
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Samuel Someone"

  Rule: Nobody else changes it

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" changes the world ranking name of the player "Sam Someone" of the team "Australia" of "Spring Tests" to "Samuel Someone"
      Then it is refused with "Tournament.NotAManagerOrRankingOfficer"

  Rule: The world ranking name must break none of its own rules

    Scenario: A world ranking name that breaks a rule is refused for it
      When the reader signed in to the account for "ranker@example.com" changes the world ranking name of the player "Sam Someone" of the team "Australia" of "Spring Tests" to "Sa"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "WorldRankingName.TooShort"

  Rule: Only a tournament there is can have a player's world ranking name changed

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "ranker@example.com" changes the world ranking name of the player "Sam Someone" of the team "Australia" of a tournament there is not to "Samuel Someone"
      Then it is refused with "ChangeTeamPlayerWorldRankingName.NoSuchTournament"
