@postgres
Feature: Changing what a player in a tournament's team is

  A manager of the tournament can correct a player in one of its teams: their
  name, said again, and the account they are signed in to is who changed them.
  The tournament, the team and the player are each named by their id. A
  tournament there is not is refused as `UpdateTeamPlayer.NoSuchTournament`,
  and a team or a player it does not have is the tournament's and the team's
  to refuse. Only the tournament's managers can: anybody else, a scorer among
  them, is refused with `Tournament.NotAManager` (`onlyManagers.feature`).

  The name is asked its own rules on the way in, as it is when a player is
  added (`AddTeamPlayer.feature`), and a request that breaks one is refused
  with `Request.Invalid` and the first rule it breaks. What the tournament and
  the team ask is theirs to refuse (`updateTeamPlayer.feature`).

  A player's games in a test name them by their id, so a player whose name is
  corrected is corrected in every score of theirs (`GamesOfCompetition.feature`).

  A forgotten account changes nobody, and is refused with `Account.Forgotten`.

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

  Rule: A sound change is kept

    Scenario: The player has their new name
      Given the update calls the player "Samantha Someone"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then the team "Australia" has the player "Samantha Someone"

    Scenario: Changing the player is recorded as done by whoever asked
      Given the update calls the player "Samantha Someone"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

  Rule: The name must break none of its own rules

    Scenario: A name that breaks a rule is refused for it
      Given the update calls the player "Sa"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "PersonName.TooShort"

  Rule: What the tournament and the team ask is theirs to refuse

    Scenario: A name another player in the team has is refused as the team refuses it
      Given "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And the update calls the player "Alex Another"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Team.PlayerNameTaken"

    Scenario: Updating an archived player is refused as the player refuses it
      Given "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      And the update calls the player "Samantha Someone"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused for breaking "TeamPlayer.Archived"

    Scenario: Updating a player the team does not have is refused as the team refuses it
      Given the update calls the player "Samantha Someone"
      When the reader signed in to the account for "organiser@example.com" updates a player the team "Australia" of "Spring Tests" does not have
      Then it is refused with "Team.NoSuchPlayer"

  Rule: Only a player in a tournament there is can be changed

    Scenario: Updating a player in a tournament there is not is refused
      Given the update calls the player "Samantha Someone"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" of the team "Australia" of a tournament there is not
      Then it is refused with "UpdateTeamPlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      And the update calls the player "Samantha Someone"
      When the reader signed in to the account for "someone@example.com" updates the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      And the update calls the player "Samantha Someone"
      When the reader signed in to the account for "scorer@example.com" updates the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account changes nobody

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      And the update calls the player "Samantha Someone"
      When the reader signed in to that account updates the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Account.Forgotten"
