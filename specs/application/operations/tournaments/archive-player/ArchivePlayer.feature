@postgres
Feature: Archiving a tournament's player

  A manager of the tournament can archive a tournament's player, and the
  account they are signed in to is who archived them. The tournament and the
  player are each named by their id. A tournament there is not is refused as
  `ArchivePlayer.NoSuchTournament`, and a player the tournament does not have
  is the tournament's to refuse. Only the tournament's managers can: anybody
  else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  A player who has played any games, in any of the tournament's competitions,
  archived ones among them, cannot be archived, and whether they have is not
  the tournament's to know (`archivePlayer.feature`). The application asks
  its games (`Games.feature`), which are the games its competitions keep, an
  archived game counting, since it can be restored. Archiving a player who is
  archived records nothing.

  A player archived is in no competition, so archiving one removes them from
  every competition they are in, archived competitions among them, and
  withdrawn or not (`removeArchivedPlayer.feature`). Each competition records
  the removal as done by whoever archived the player. Archiving the player
  and every removal are one command, so they are kept in the one transaction
  (`SETUP.md`): all of them are kept, or none is, and a player is never
  archived while still in a competition, nor removed from one while not
  archived. A player the tournament refuses to archive is left in every
  competition they are in, and a player one of the competitions refuses to
  remove is not archived. A knockout that has a game has its draw fixed
  (`addGame.feature`), so a player in one cannot be archived; they can be
  withdrawn from it instead. Nothing is kept of the places they had:
  restoring the player does not put them back (`RestorePlayer.feature`). The tab asks the manager first,
  naming the competitions (`players-tab.feature`); the application does not,
  since what it is asked it has been asked.

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

  Rule: A player archived is removed from every competition they are in

    Scenario: A player archived is removed from a competition they are in
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then the competition "Block A" of "Spring Open" does not have the player "Sam Someone"

    Scenario: A player archived is removed from each competition they are in
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then the competition "Block B" of "Spring Open" does not have the player "Sam Someone"

    Scenario: A player archived is removed from an archived competition
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then the competition "Block A" of "Spring Open" does not have the player "Sam Someone"

    Scenario: A player archived is removed from a competition they withdrew from
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then the competition "Block A" of "Spring Open" does not have the player "Sam Someone"

    Scenario: The other players are left in the competition
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then the competition "Block A" of "Spring Open" has the player "Alex Another"

    Scenario: The removal is recorded as done by whoever archived the player
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then the last thing the competition "Block A" of "Spring Open" recorded was caused by the account for "organiser@example.com"

    Scenario: A competition the player is not in records nothing
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then nothing more is recorded of the competition "Block A" of "Spring Open"

    Scenario: A competition records nothing when archiving is refused
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then nothing more is recorded of the competition "Block A" of "Spring Open"

    Scenario: A player the tournament refuses to archive is left in their competitions
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then the competition "Block A" of "Spring Open" has the player "Sam Someone"

  Rule: A player who has played in any of the tournament's competitions cannot be archived

    Scenario: A player who has played is refused as the player refuses them
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then it is refused for breaking "TournamentPlayer.HasGames"

    Scenario: A player who has lost a game is refused
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then it is refused for breaking "TournamentPlayer.HasGames"

    Scenario: A player who has played is not archived
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then the tournament's player "Sam Someone" is not archived

    Scenario: A player who has played is left in their competitions
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then the competition "Block A" of "Spring Open" has the player "Sam Someone"

    Scenario: A player whose only game is archived is refused
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then it is refused for breaking "TournamentPlayer.HasGames"

    Scenario: A player who has played in only one of the competitions is refused
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then it is refused for breaking "TournamentPlayer.HasGames"

    Scenario: A player who has played only in an archived competition is refused
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Sam Someone" in "Spring Open"
      Then it is refused for breaking "TournamentPlayer.HasGames"

    Scenario: A player who has not played while others have is archived
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Chris Third" in "Spring Open"
      Then the tournament's player "Chris Third" is archived

  Rule: A player in a knockout that has a game cannot be archived

    Scenario: A player in a knockout with a game is refused as the knockout refuses to remove them
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Chris Third" in "Spring Open"
      Then it is refused with "Competition.DrawFixed"

    Scenario: A player refused by a knockout is not archived
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" archives the player "Chris Third" in "Spring Open"
      Then the tournament's player "Chris Third" is not archived

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
