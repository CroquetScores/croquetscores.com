@postgres
Feature: The players of a tournament's team, as a manager lists them

  A manager lists a team's players to find one, correct them, put them in
  order, archive them and restore them, on the team's page
  (`team-players.feature`), so the application answers with every player the
  team has, archived ones among them. Each is answered with their id, their
  name, their world ranking name, whether they are archived, and whether they have played any games in
  use.

  They are answered in the team's order, lowest first
  (`addTeamPlayer.feature`), since that is the order a manager puts them in
  by moving them (`moveTeamPlayer.feature`). An archived player is put last
  when archived (`archiveTeamPlayer.feature`), so the archived come after
  those in use.

  Whether a player has played is not the tournament's to know
  (`archiveTeamPlayer.feature`). The application asks its games, as archiving
  a player does (`ArchiveTeamPlayer.feature`), so that a list offering to
  archive a player offers it only where archiving would be done. The games
  are those its tests keep (`Games.feature`), and an archived game counts for
  nothing.

  The team is named by its id, and a team the tournament does not have is
  refused with `Tournament.NoSuchTeam`. An archived team's players are
  answered as any team's are: the team's page refuses to open for an archived
  team (`view.feature` beneath the team), but the list is not the page.

  It answers the account the reader is signed in to, and never one the reader
  chose. Only the tournament's managers can ask, since the list is for
  managing the team's players: anybody else, a scorer among them, is refused
  with `Tournament.NotAManager`. A scorer finds a test's players another way
  (`PlayersOfTest.feature`). A tournament there is not is refused as
  `PlayersOfTeam.NoSuchTournament`.

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

  Rule: Every player in the team is answered, in the team's order

    Scenario: A team with no players is answered with none
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then no players are answered

    Scenario: A player added is listed
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then the player "Sam Someone" is answered

    Scenario: A player of another team is not listed
      Given "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then no players are answered

    Scenario: The players are in the order they were added, whatever their names
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then the first player answered is "Sam Someone"

    Scenario: A player moved is answered in the place they were moved to
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has moved the player "Alex Another" of the team "Australia" of "Spring Tests" up
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then the first player answered is "Alex Another"

    Scenario: An archived player comes after those in use
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then the first player answered is "Alex Another"

  Rule: Each player is answered with what they are

    Scenario: A player is listed with their world ranking name
      Given the player is to have the world ranking name "Samuel Someone"
      And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then the player "Sam Someone" is answered known in the world rankings as "Samuel Someone"

    Scenario: An archived player is listed as archived
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then the player "Sam Someone" is answered as archived

    Scenario: A player not archived is listed as not archived
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then the player "Sam Someone" is answered as not archived

  Rule: Each player is answered with whether they have played

    Scenario: A player who has not played is answered as not having played
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then the player "Sam Someone" is answered as not having played

    Scenario: A player who has played in a test is answered as having played
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Chris Third" has beaten "Sam Someone" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then the player "Sam Someone" is answered as having played

    Scenario: A player whose only game is archived is answered as not having played
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Chris Third" has beaten "Sam Someone" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Chris Third" beating "Sam Someone" in "AUS v ENG" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then the player "Sam Someone" is answered as not having played

  Rule: Only a manager or a world ranking officer can list the players of a team it has

    A world ranking officer may change any team player's world ranking name
    (`ChangeTeamPlayerWorldRankingName.feature`), so it may list them too,
    whatever part it has in the tournament.

    Scenario: A world ranking officer lists them
      Given "ranker@example.com" has an account, confirmed, called "Rae Ranker"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "ranker@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then the player "Sam Someone" is answered

    Scenario: A team the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" lists the players of a team "Spring Tests" does not have
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" lists the players of the team "Australia" of a tournament there is not
      Then it is refused with "PlayersOfTeam.NoSuchTournament"

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" lists the players of the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account lists nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account lists the players of the team "Australia" of "Spring Tests"
      Then it is refused with "Account.Forgotten"
