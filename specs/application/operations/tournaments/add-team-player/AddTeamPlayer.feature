@postgres
Feature: Adding a player to a tournament's team

  A manager of the tournament can add a player to one of its teams, and the
  account they are signed in to is who added them. The tournament and the
  team are each named by their id. A tournament there is not is refused as
  `AddTeamPlayer.NoSuchTournament`, and a team the tournament does not have
  is the tournament's to refuse. The player is given a new id, and the answer
  is that id. Only the tournament's managers can: anybody else, a scorer
  among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  The player's name is asked its own rules on the way in, and a request that
  breaks one is refused with `Request.Invalid` and the first rule it breaks.
  What the tournament and the team ask — that no other player in the team has
  their name, archived or not, however capitalised, and that the team is not
  archived — is theirs to refuse (`addTeamPlayer.feature`).

  A forgotten account adds nobody, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"

  Rule: A sound player is added to the team and kept

    Scenario: The player is one of the team's players
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to the team "Australia" of "Spring Tests"
      Then the team "Australia" has the player "Sam Someone"

    Scenario: The answer is the player's id
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to the team "Australia" of "Spring Tests"
      Then it is answered with the id of the player "Sam Someone" of the team "Australia"

    Scenario: The player has the world ranking name they were added with
      Given the player is to have the world ranking name "Samuel Someone"
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to the team "Australia" of "Spring Tests"
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Samuel Someone"

    Scenario: Adding the player is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to the team "Australia" of "Spring Tests"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

  Rule: The name and the world ranking name must break none of their own rules

    Scenario Outline: A name that breaks a rule is refused for it
      When the reader signed in to the account for "organiser@example.com" adds the player "<name>" to the team "Australia" of "Spring Tests"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | name | code                |
        |      | PersonName.Missing  |
        | Sa   | PersonName.TooShort |
        | Bye  | TeamPlayer.NamedBye |

    Scenario: A world ranking name that breaks a rule is refused for it
      Given the player is to have the world ranking name "Sa"
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to the team "Australia" of "Spring Tests"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "WorldRankingName.TooShort"

    Scenario: A player who breaks a rule is not added
      When the reader signed in to the account for "organiser@example.com" adds the player "Sa" to the team "Australia" of "Spring Tests"
      Then the team "Australia" has no players

  Rule: What the tournament and the team ask is theirs to refuse

    Scenario: A name another player in the team has is refused as the team refuses it
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the player "SAM SOMEONE" to the team "Australia" of "Spring Tests"
      Then it is refused with "Team.PlayerNameTaken"

    Scenario: Adding a player to an archived team is refused as the team refuses it
      Given "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to the team "Australia" of "Spring Tests"
      Then it is refused for breaking "Team.Archived"

    Scenario: Adding a player to a team the tournament does not have is refused as the tournament refuses it
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to a team "Spring Tests" does not have
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: Adding a player to a team in an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.Archived"

  Rule: Only a team in a tournament there is can have a player added

    Scenario: Adding a player to a team in a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to the team "Australia" of a tournament there is not
      Then it is refused with "AddTeamPlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" adds the player "Sam Someone" to the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" adds the player "Sam Someone" to the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account adds nobody

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account adds the player "Sam Someone" to the team "Australia" of "Spring Tests"
      Then it is refused with "Account.Forgotten"
