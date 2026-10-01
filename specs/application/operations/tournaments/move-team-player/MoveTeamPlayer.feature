@postgres
Feature: Moving a player in a tournament's team up or down

  A manager of the tournament can move a player in one of its teams up or
  down a place within the team, and the account they are signed in to is who
  moved them. The tournament, the team and the player are each named by their
  id, and the way to move them is up or down. A tournament there is not is
  refused as `MoveTeamPlayer.NoSuchTournament`, a way that is neither up nor
  down is refused with `Request.Invalid` and `MoveTeamPlayer.NoSuchDirection`,
  and what the tournament and the team refuse — a team or a player they do not
  have, an archived player or team, an archived tournament — is theirs to
  refuse (`moveTeamPlayer.feature`). Only the tournament's managers can:
  anybody else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  Moving the first player up or the last down records nothing, since there is
  nowhere for them to go.

  A forgotten account moves nobody, and is refused with `Account.Forgotten`.

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
    And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"

  Rule: A player moved is kept in their new place in the team

    Scenario: A player moved up is kept first
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" of the team "Australia" of "Spring Tests" up
      Then the team "Australia"'s first player is "Alex Another"

    Scenario: A player moved down is kept second
      When the reader signed in to the account for "organiser@example.com" moves the player "Sam Someone" of the team "Australia" of "Spring Tests" down
      Then the team "Australia"'s second player is "Sam Someone"

    Scenario: Moving the player is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" of the team "Australia" of "Spring Tests" up
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: Moving the first player up records nothing
      When the reader signed in to the account for "organiser@example.com" moves the player "Sam Someone" of the team "Australia" of "Spring Tests" up
      Then nothing more is recorded of the tournament

  Rule: The way to move them is up or down

    Scenario: A way that is neither is refused
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" of the team "Australia" of "Spring Tests" "sideways"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "MoveTeamPlayer.NoSuchDirection"

  Rule: What the tournament and the team refuse is theirs to refuse

    Scenario: Moving an archived player is refused as the player refuses it
      Given "organiser@example.com" has archived the player "Alex Another" of the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" of the team "Australia" of "Spring Tests" up
      Then it is refused for breaking "TeamPlayer.Archived"

    Scenario: Moving a player the team does not have is refused as the team refuses it
      When the reader signed in to the account for "organiser@example.com" moves a player the team "Australia" of "Spring Tests" does not have up
      Then it is refused with "Team.NoSuchPlayer"

    Scenario: Moving a player in an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" of the team "Australia" of "Spring Tests" up
      Then it is refused with "Tournament.Archived"

  Rule: Only a player in a tournament there is can be moved

    Scenario: Moving a player in a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" of the team "Australia" of a tournament there is not up
      Then it is refused with "MoveTeamPlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" moves the player "Alex Another" of the team "Australia" of "Spring Tests" up
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" moves the player "Alex Another" of the team "Australia" of "Spring Tests" up
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account moves nobody

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account moves the player "Alex Another" of the team "Australia" of "Spring Tests" up
      Then it is refused with "Account.Forgotten"
