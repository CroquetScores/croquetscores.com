@postgres
Feature: Changing what a tournament's team is

  A manager of the tournament can correct one of its teams: its name, its
  short name and the flag it flies, said again together, and the account they
  are signed in to is who changed it. The tournament and the team are each
  named by their id. A tournament there is not is refused as
  `UpdateTeam.NoSuchTournament`, and a team the tournament does not have is
  the tournament's to refuse. Only the tournament's managers can: anybody
  else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  Each value is asked its own rules on the way in, as it is when a team is
  added (`AddTeam.feature`), and a request that breaks one is refused with
  `Request.Invalid` and the first rule it breaks. What the tournament asks —
  a name and a short name no other team has, a team not archived, a
  tournament not archived — is the tournament's to refuse
  (`updateTeam.feature`), and so is giving each test the team is in its new
  name.

  A forgotten account changes nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"

  Rule: A sound change is kept

    Scenario: The team has its new name
      Given the update calls the team "Australia A"
      When the reader signed in to the account for "organiser@example.com" updates the team "Australia" in "Spring Tests"
      Then the tournament has the team "Australia A"

    Scenario: The team has its new short name
      Given the update has the team known for short as "Oz"
      When the reader signed in to the account for "organiser@example.com" updates the team "Australia" in "Spring Tests"
      Then the tournament's team "Australia" is known for short as "Oz"

    Scenario: The team flies its new flag
      Given the update has the team fly the flag "au"
      When the reader signed in to the account for "organiser@example.com" updates the team "Australia" in "Spring Tests"
      Then the tournament's team "Australia" flies the flag "au"

    Scenario: A test the team is in is called by its new short name
      Given "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the update has the team known for short as "Oz"
      When the reader signed in to the account for "organiser@example.com" updates the team "Australia" in "Spring Tests"
      Then the tournament has the competition "Oz v ENG"

    Scenario: Changing the team is recorded as done by whoever asked
      Given the update calls the team "Australia A"
      When the reader signed in to the account for "organiser@example.com" updates the team "Australia" in "Spring Tests"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

  Rule: Each value must break none of its own rules

    Scenario: A short name that breaks a rule is refused for it
      Given the update has the team known for short as "Australasia"
      When the reader signed in to the account for "organiser@example.com" updates the team "Australia" in "Spring Tests"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "TeamShortName.TooLong"

  Rule: What the tournament refuses is the tournament's to refuse

    Scenario: A name another team has is refused as the tournament refuses it
      Given "organiser@example.com" has added the team "England" to "Spring Tests"
      And the update calls the team "England"
      When the reader signed in to the account for "organiser@example.com" updates the team "Australia" in "Spring Tests"
      Then it is refused with "Tournament.TeamNameTaken"

    Scenario: Updating an archived team is refused as the tournament refuses it
      Given "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      And the update calls the team "Australia A"
      When the reader signed in to the account for "organiser@example.com" updates the team "Australia" in "Spring Tests"
      Then it is refused for breaking "Team.Archived"

    Scenario: Updating a team the tournament does not have is refused as the tournament refuses it
      Given the update calls the team "Australia A"
      When the reader signed in to the account for "organiser@example.com" updates a team "Spring Tests" does not have
      Then it is refused with "Tournament.NoSuchTeam"

  Rule: Only a team in a tournament there is can be changed

    Scenario: Updating a team in a tournament there is not is refused
      Given the update calls the team "Australia A"
      When the reader signed in to the account for "organiser@example.com" updates the team "Australia" in a tournament there is not
      Then it is refused with "UpdateTeam.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      And the update calls the team "Australia A"
      When the reader signed in to the account for "someone@example.com" updates the team "Australia" in "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      And the update calls the team "Australia A"
      When the reader signed in to the account for "scorer@example.com" updates the team "Australia" in "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account changes nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      And the update calls the team "Australia A"
      When the reader signed in to that account updates the team "Australia" in "Spring Tests"
      Then it is refused with "Account.Forgotten"
