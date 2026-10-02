@postgres
Feature: Restoring an archived player in a tournament's team

  A manager of the tournament can restore an archived player in one of its
  teams, and the account they are signed in to is who restored them. The
  tournament, the team and the player are each named by their id. A
  tournament there is not is refused as `RestoreTeamPlayer.NoSuchTournament`,
  and what the tournament and the team refuse — a team or a player they do
  not have, an archived team, an archived tournament — is theirs to refuse
  (`restoreTeamPlayer.feature`). Only the tournament's managers can: anybody
  else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  Restoring a player who is not archived records nothing.

  A forgotten account restores nobody, and is refused with
  `Account.Forgotten`.

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
    And "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"

  Rule: A player restored is kept restored

    Scenario: The player is kept not archived
      When the reader signed in to the account for "organiser@example.com" restores the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then the team "Australia"'s player "Sam Someone" is not archived

    Scenario: Restoring the player is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" restores the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: Restoring a player who is not archived records nothing
      Given "organiser@example.com" has restored the player "Sam Someone" of the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" restores the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then nothing more is recorded of the tournament

  Rule: What the tournament and the team refuse is theirs to refuse

    Scenario: Restoring a player in an archived team is refused as the team refuses it
      Given "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" restores the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused for breaking "Team.Archived"

    Scenario: Restoring a player the team does not have is refused as the team refuses it
      When the reader signed in to the account for "organiser@example.com" restores a player the team "Australia" of "Spring Tests" does not have
      Then it is refused with "Team.NoSuchPlayer"

    Scenario: Restoring a player in an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" restores the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.Archived"

  Rule: Only a player in a tournament there is can be restored

    Scenario: Restoring a player in a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" restores the player "Sam Someone" of the team "Australia" of a tournament there is not
      Then it is refused with "RestoreTeamPlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" restores the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" restores the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account restores nobody

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account restores the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Account.Forgotten"
