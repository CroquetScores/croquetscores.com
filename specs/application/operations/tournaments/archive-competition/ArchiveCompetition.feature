@postgres
Feature: Archiving a tournament's competition

  A manager of the tournament can archive a tournament's competition, of
  whatever kind, and the account they are signed in to is who archived it. The
  tournament and the competition are each named by their id. A tournament
  there is not is refused as `ArchiveCompetition.NoSuchTournament`, and a
  competition the tournament does not have is the tournament's to refuse. Only
  the tournament's managers can: anybody else, a scorer among them, is refused
  with `Tournament.NotAManager` (`onlyManagers.feature`).

  A block, a knockout or a Swiss is archived whether or not it has games,
  which are kept with it (`archiveCompetition.feature`). A test with any game
  in use is not: it is refused with `Tournament.TestHasGamesInUse`, so the
  application asks its games what has been played in a test (`Games.feature`),
  as it does to update one. An archived game counts for nothing. Archiving a
  competition that is archived records nothing.

  A forgotten account archives nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"

  Rule: A competition archived is kept archived

    Scenario: The competition is kept archived
      When the reader signed in to the account for "organiser@example.com" archives the competition "Block A" in "Spring Open"
      Then the tournament's competition "Block A" is archived

    Scenario: Archiving the competition is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" archives the competition "Block A" in "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: Archiving an archived competition records nothing
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the competition "Block A" in "Spring Open"
      Then nothing more is recorded of the tournament

  Rule: A test with games in use is not archived

    Scenario: A test with a game is refused
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the competition "AUS v ENG" in "Spring Tests"
      Then it is refused with "Tournament.TestHasGamesInUse"

    Scenario: A test whose only game is archived is archived
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Pat Player" beating "Kim Keeper" in "AUS v ENG" of "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" archives the competition "AUS v ENG" in "Spring Tests"
      Then the tournament's competition "AUS v ENG" is archived

  Rule: A block with games is archived

    Scenario: A block with a game is archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the competition "Block A" in "Spring Open"
      Then the tournament's competition "Block A" is archived

  Rule: Only a competition there is, in a tournament there is, can be archived

    Scenario: Archiving a competition the tournament does not have is refused as the tournament refuses it
      When the reader signed in to the account for "organiser@example.com" archives a competition "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: Archiving a competition in a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" archives the competition "Block A" in a tournament there is not
      Then it is refused with "ArchiveCompetition.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" archives the competition "Block A" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" archives the competition "Block A" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account archives nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account archives the competition "Block A" in "Spring Open"
      Then it is refused with "Account.Forgotten"
