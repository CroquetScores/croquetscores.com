@postgres
Feature: The players of a test, as its tournament's managers and scorers list them

  A manager or a scorer lists a test's players to choose who won a game in it
  and who lost (`test-score.feature`). A test has no players entered in it:
  its players are its teams' (`gamesInATest.feature`). So the application
  answers with the test's two teams, the first first, each with its name and
  its short name, and with the players of each who are in use, in the team's
  order (`addTeamPlayer.feature`). An archived player plays no game
  (`gamesInATest.feature`), so they are not answered. Each player is
  answered with their id and their name.

  The test is named by its id within its tournament. A competition the
  tournament does not have is refused with `Tournament.NoSuchCompetition`, and
  one that is not a test, which has no teams to answer, with
  `Tournament.NotATest`. A tournament there is not is refused as
  `PlayersOfTest.NoSuchTournament`. Its players are listed to enter its
  scores, which an archived tournament and an archived test have none of, so
  an archived tournament is refused with `Tournament.Archived` and an archived
  test with `Tournament.CompetitionArchived`, as entering a score in either
  is (`AddGame.feature`).

  It answers the account the reader is signed in to, and never one the reader
  chose. Only the tournament's managers and scorers can ask, since a scorer
  enters a test's scores as a manager does: anybody else is refused with
  `Tournament.NotAManagerOrScorer`.

  A forgotten account lists nothing, and is refused with `Account.Forgotten`.

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
    And "organiser@example.com" has added the team "Scotland" to "Spring Tests"
    And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the player "Kim Keeper" to the team "Scotland" of "Spring Tests"
    And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"

  Rule: The test's two teams are answered, the first first

    Scenario: The first team answered is the test's first team
      When the reader signed in to the account for "organiser@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then the first team answered is "Australia"

    Scenario: The second team answered is the test's second team
      When the reader signed in to the account for "organiser@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then the second team answered is "England"

    Scenario: A team is answered with its short name
      When the reader signed in to the account for "organiser@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then the team "Australia" is answered known for short as "AUS"

    Scenario: A team not in the test is not answered
      When the reader signed in to the account for "organiser@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then the team "Scotland" is not answered

  Rule: Each team is answered with its players in use, in the team's order

    Scenario: A team is answered with a player of its own
      When the reader signed in to the account for "organiser@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then the team "England" is answered with the player "Chris Third"

    Scenario: A team is not answered with another team's player
      When the reader signed in to the account for "organiser@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then the team "Australia" is not answered with the player "Chris Third"

    Scenario: A team's players are answered in the team's order
      Given "organiser@example.com" has moved the player "Alex Another" of the team "Australia" of "Spring Tests" up
      When the reader signed in to the account for "organiser@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then the first player of the team "Australia" answered is "Alex Another"

    Scenario: An archived player is not answered
      Given "organiser@example.com" has archived the player "Alex Another" of the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then the team "Australia" is not answered with the player "Alex Another"

    Scenario: A player added after the test was added is answered
      Given "organiser@example.com" has added the player "Pat Fourth" to the team "England" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then the team "England" is answered with the player "Pat Fourth"

  Rule: Only a manager or a scorer of a tournament there is can list the players of a test it has

    Scenario: A scorer of the tournament is answered
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then the team "England" is answered with the player "Chris Third"

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then it is refused with "Tournament.NotAManagerOrScorer"

    Scenario: A competition the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" lists the players of a test "Spring Tests" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: A competition that is not a test is refused
      Given the tournament is to be played in the format "Standard"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open" as a test
      Then it is refused with "Tournament.NotATest"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" lists the players of "AUS v ENG" of a tournament there is not
      Then it is refused with "PlayersOfTest.NoSuchTournament"

  Rule: Only a test in use, in a tournament in use, has its players listed

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then it is refused with "Tournament.Archived"

    Scenario: An archived test is refused
      Given "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of "AUS v ENG" of "Spring Tests"
      Then it is refused with "Tournament.CompetitionArchived"

  Rule: A forgotten account lists nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account lists the players of "AUS v ENG" of "Spring Tests"
      Then it is refused with "Account.Forgotten"
