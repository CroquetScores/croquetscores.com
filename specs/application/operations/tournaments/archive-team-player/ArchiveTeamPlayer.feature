@postgres
Feature: Archiving a player in a tournament's team

  A manager of the tournament can archive a player in one of its teams, and
  the account they are signed in to is who archived them. The tournament, the
  team and the player are each named by their id. A tournament there is not
  is refused as `ArchiveTeamPlayer.NoSuchTournament`, and a team or a player
  it does not have is the tournament's and the team's to refuse. Only the
  tournament's managers can: anybody else, a scorer among them, is refused
  with `Tournament.NotAManager` (`onlyManagers.feature`).

  A player who has played any games in use, in any of the tournament's tests,
  cannot be archived (a test with games in use is never archived, so none of
  them is in an archived test: `archiveCompetition.feature`), and whether they have is not
  the tournament's to know (`archiveTeamPlayer.feature`). The application asks
  its games (`Games.feature`), as it does for a tournament's player
  (`ArchivePlayer.feature`). An archived game counts for nothing, so a player
  whose only games are archived is archived, and those games are not restored
  until the player is (`gamesInATest.feature`).

  A player in a team is in no competition (`TeamPlayer.feature`), so there is
  nothing to remove them from, and archiving them is the tournament's one
  event. Archiving a player who is archived records nothing.

  A forgotten account archives nobody, and is refused with
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
    And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"

  Rule: A player in a team who has played no games is kept archived

    Scenario: The player is kept archived
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then the team "Australia"'s player "Sam Someone" is archived

    Scenario: Archiving the player is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: Archiving an archived player records nothing
      Given "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then nothing more is recorded of the tournament

    Scenario: A player whose only game is archived is kept archived
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Chris Third" in "AUS v ENG" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then the team "Australia"'s player "Sam Someone" is archived

  Rule: A player in a team who has played in any of the tournament's tests cannot be archived

    Scenario: A player who has won a game is refused as the player refuses them
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused for breaking "TeamPlayer.HasGames"

    Scenario: A player who has lost a game is refused
      Given "Chris Third" has beaten "Sam Someone" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused for breaking "TeamPlayer.HasGames"

    Scenario: A player who has played is not archived
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then the team "Australia"'s player "Sam Someone" is not archived

  Rule: What the tournament and the team refuse is theirs to refuse

    Scenario: Archiving a player the team does not have is refused as the team refuses it
      When the reader signed in to the account for "organiser@example.com" archives a player the team "Australia" of "Spring Tests" does not have
      Then it is refused with "Team.NoSuchPlayer"

    Scenario: Archiving a player in an archived team is refused as the team refuses it
      Given "organiser@example.com" has added the team "Scotland" to "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "Scotland" of "Spring Tests"
      And "organiser@example.com" has archived the team "Scotland" in "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the player "Kim Keeper" of the team "Scotland" of "Spring Tests"
      Then it is refused for breaking "Team.Archived"

    Scenario: Archiving a player in an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.Archived"

  Rule: Only a player in a tournament there is can be archived

    Scenario: Archiving a player in a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" of the team "Australia" of a tournament there is not
      Then it is refused with "ArchiveTeamPlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" archives the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" archives the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account archives nobody

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account archives the player "Sam Someone" of the team "Australia" of "Spring Tests"
      Then it is refused with "Account.Forgotten"
