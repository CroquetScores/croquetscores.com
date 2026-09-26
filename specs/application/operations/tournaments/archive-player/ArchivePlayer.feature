@postgres
Feature: Archiving a tournament's player

  A manager of the tournament can archive a tournament's player, and the
  account they are signed in to is who archived them. The tournament and the
  player are each named by their id. A tournament there is not is refused as
  `ArchivePlayer.NoSuchTournament`, and a player the tournament does not have
  is the tournament's to refuse. Only the tournament's managers can: anybody
  else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  A player who has played any games cannot be archived, and whether they have
  is not the tournament's to know (`archivePlayer.feature`). The application
  asks its games (`Games.feature`). Nothing records games yet, so they say
  that nobody has played any; a scenario about a player who has stands in
  games that say so. Archiving a player who is archived records nothing.

  A forgotten account archives nobody, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"

  Rule: A player who has played no games is kept archived

    Scenario: The player is kept archived
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then the tournament's player "Sam Someone" is archived

    Scenario: Archiving the player is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: Archiving an archived player records nothing
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then nothing more is recorded of the tournament

  Rule: The application's games say whether a player has played any

    Scenario: A player the games say has played is refused as the player refuses them
      Given games that say the player "Sam Someone" in "Spring Open" has played
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then it is refused for breaking "TournamentPlayer.HasGames"

    Scenario: A player the games say has played is not archived
      Given games that say the player "Sam Someone" in "Spring Open" has played
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then the tournament's player "Sam Someone" is not archived

  Rule: Only a player there is, in a tournament there is, can be archived

    Scenario: Archiving a player the tournament does not have is refused as the tournament refuses it
      When the reader signed in to the account for "organiser@example.com" archives a player "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchPlayer"

    Scenario: Archiving a player in a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in a tournament there is not
      Then it is refused with "ArchivePlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" archives the player "Sam Someone" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" archives the player "Sam Someone" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account archives nobody

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account archives the player "Sam Someone" in "Spring Open"
      Then it is refused with "Account.Forgotten"
