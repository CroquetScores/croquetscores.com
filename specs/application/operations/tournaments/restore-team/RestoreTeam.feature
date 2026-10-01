@postgres
Feature: Restoring a tournament's archived team

  A manager of the tournament can restore one of its archived teams, and the
  account they are signed in to is who restored it. The tournament and the
  team are each named by their id. A tournament there is not is refused as
  `RestoreTeam.NoSuchTournament`, and what the tournament refuses — a team it
  does not have, any in an archived tournament — is the tournament's to
  refuse (`restoreTeam.feature`). Only the tournament's managers can: anybody
  else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  A team restored has every player it had. Restoring a team that is not
  archived records nothing.

  A forgotten account restores nothing, and is refused with
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
    And "organiser@example.com" has archived the team "Australia" in "Spring Tests"

  Rule: A team restored is kept restored

    Scenario: The team is kept not archived
      When the reader signed in to the account for "organiser@example.com" restores the team "Australia" in "Spring Tests"
      Then the tournament's team "Australia" is not archived

    Scenario: Restoring the team is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" restores the team "Australia" in "Spring Tests"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: Restoring a team that is not archived records nothing
      Given "organiser@example.com" has restored the team "Australia" in "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" restores the team "Australia" in "Spring Tests"
      Then nothing more is recorded of the tournament

  Rule: What the tournament refuses is the tournament's to refuse

    Scenario: Restoring a team the tournament does not have is refused as the tournament refuses it
      When the reader signed in to the account for "organiser@example.com" restores a team "Spring Tests" does not have
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: Restoring a team in an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" restores the team "Australia" in "Spring Tests"
      Then it is refused with "Tournament.Archived"

  Rule: Only a team in a tournament there is can be restored

    Scenario: Restoring a team in a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" restores the team "Australia" in a tournament there is not
      Then it is refused with "RestoreTeam.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" restores the team "Australia" in "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" restores the team "Australia" in "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account restores nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account restores the team "Australia" in "Spring Tests"
      Then it is refused with "Account.Forgotten"
