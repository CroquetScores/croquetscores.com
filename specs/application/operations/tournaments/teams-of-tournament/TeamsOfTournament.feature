@postgres
Feature: The teams of a tournament, as a manager lists them

  A manager lists a tournament's teams to find one, correct it, put the teams
  in order, archive them and restore them (`teams-tab.feature`), and to choose
  the two a test is between (`test.feature`). So the application answers with
  every team the tournament has, archived ones among them, in the
  tournament's order, lowest first (`addTeam.feature`). An archived team is
  put last when archived (`archiveTeam.feature`), so the archived come after
  those in use.

  Each is answered with its id, its name, its short name, the flag it flies,
  if any, its slug, which is where its page is found under the tournament,
  and whether it is archived. Each is answered with whether it is in a test in
  use too, since such a team cannot be archived (`archiveTeam.feature`), so
  that a list offering to archive a team offers it only where archiving would
  be done. The tournament knows its tests, so it is the tournament that is
  asked.

  It answers the account the reader is signed in to, and never one the reader
  chose. Only the tournament's managers can ask, since the teams are theirs
  to manage: anybody else, a scorer among them, is refused with
  `Tournament.NotAManager`. A tournament there is not is refused as
  `TeamsOfTournament.NoSuchTournament`. A Standard tournament has no teams,
  and is answered with none rather than refused, since asking what it has is
  not a mistake.

  A forgotten account lists nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"

  Rule: Every team is answered, in the tournament's order

    Scenario: A tournament with no teams is answered with none
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then no teams are answered

    Scenario: A team added is answered
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the team "Australia" is answered

    Scenario: The teams are in the order they were added, whatever their names
      Given "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the first team answered is "England"

    Scenario: A team moved is answered in the place it was moved to
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has moved the team "England" in "Spring Tests" up
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the first team answered is "England"

    Scenario: An archived team comes after those in use
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the first team answered is "England"

    Scenario: A Standard tournament is answered with no teams
      Given the tournament is to be played in the format "Standard"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Open"
      Then no teams are answered

  Rule: Each team is answered with what it is

    Scenario: A team is answered with its short name
      Given the team is to be known for short as "Oz"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the team "Australia" is answered known for short as "Oz"

    Scenario: A team is answered with the flag it flies
      Given the team is to fly the flag "au"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the team "Australia" is answered flying the flag "au"

    Scenario: A team flying no flag is answered flying none
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the team "Australia" is answered flying no flag

    Scenario: A team is answered with its slug
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the team "Australia" is answered with the slug "aus"

    Scenario: An archived team is answered as archived
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the team "Australia" is answered as archived

    Scenario: A team not archived is answered as not archived
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the team "Australia" is answered as not archived

  Rule: Each team is answered with whether it is in a test in use

    Scenario: A team in no test is answered as in none
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the team "Australia" is answered as in no test

    Scenario: A team in a test is answered as in one
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the team "England" is answered as in a test

    Scenario: A team whose only test is archived is answered as in none
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the teams of "Spring Tests"
      Then the team "Australia" is answered as in no test

  Rule: Only a manager of a tournament there is can list them

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" lists the teams of a tournament there is not
      Then it is refused with "TeamsOfTournament.NoSuchTournament"

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" lists the teams of "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" lists the teams of "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account lists nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account lists the teams of "Spring Tests"
      Then it is refused with "Account.Forgotten"
