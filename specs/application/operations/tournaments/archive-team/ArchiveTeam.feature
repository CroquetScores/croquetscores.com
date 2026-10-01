@postgres
Feature: Archiving a tournament's team

  A manager of the tournament can archive one of its teams, and the account
  they are signed in to is who archived it. The tournament and the team are
  each named by their id. A tournament there is not is refused as
  `ArchiveTeam.NoSuchTournament`, and what the tournament refuses — a team it
  does not have, a team in a test in use, any in an archived tournament — is
  the tournament's to refuse (`archiveTeam.feature`). The tournament knows its
  own tests, so the application asks nothing else first. Only the
  tournament's managers can: anybody else, a scorer among them, is refused
  with `Tournament.NotAManager` (`onlyManagers.feature`).

  A team archived keeps its players, and they are archived with it in all but
  name: nothing can be done to them until the team is restored
  (`Team.feature`). Archiving a team that is archived records nothing.

  A forgotten account archives nothing, and is refused with
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
    And "organiser@example.com" has added the team "England" to "Spring Tests"

  Rule: A team in no test in use is kept archived

    Scenario: The team is kept archived
      When the reader signed in to the account for "organiser@example.com" archives the team "Australia" in "Spring Tests"
      Then the tournament's team "Australia" is archived

    Scenario: Archiving the team is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" archives the team "Australia" in "Spring Tests"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: Archiving an archived team records nothing
      Given "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the team "Australia" in "Spring Tests"
      Then nothing more is recorded of the tournament

    Scenario: A team whose only test is archived is kept archived
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the team "Australia" in "Spring Tests"
      Then the tournament's team "Australia" is archived

  Rule: What the tournament refuses is the tournament's to refuse

    Scenario: Archiving a team in a test is refused as the tournament refuses it
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the team "Australia" in "Spring Tests"
      Then it is refused for breaking "Team.InATest"

    Scenario: A team refused is not archived
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the team "Australia" in "Spring Tests"
      Then the tournament's team "Australia" is not archived

    Scenario: Archiving a team the tournament does not have is refused as the tournament refuses it
      When the reader signed in to the account for "organiser@example.com" archives a team "Spring Tests" does not have
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: Archiving a team in an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the team "Australia" in "Spring Tests"
      Then it is refused with "Tournament.Archived"

  Rule: Only a team in a tournament there is can be archived

    Scenario: Archiving a team in a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" archives the team "Australia" in a tournament there is not
      Then it is refused with "ArchiveTeam.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" archives the team "Australia" in "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" archives the team "Australia" in "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account archives nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account archives the team "Australia" in "Spring Tests"
      Then it is refused with "Account.Forgotten"
