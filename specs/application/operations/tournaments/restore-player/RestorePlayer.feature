@postgres
Feature: Restoring a tournament's archived player

  A manager of the tournament can restore a tournament's archived player, and
  the account they are signed in to is who restored them. The tournament and
  the player are each named by their id. A tournament there is not is refused
  as `RestorePlayer.NoSuchTournament`, and a player the tournament does not
  have is the tournament's to refuse. Restoring a player who is not archived
  records nothing. Only the tournament's managers can: anybody else, a scorer
  among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  Archiving the player removed them from every competition they were in
  (`ArchivePlayer.feature`), and nothing was kept of the places they had, so
  restoring them does not put them back: they are entered again as anybody
  is.

  A forgotten account restores nobody, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"

  Rule: A player restored is kept not archived

    Scenario: The player is kept not archived
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" restores the player "Sam Someone" in "Spring Open"
      Then the tournament's player "Sam Someone" is not archived

    Scenario: Restoring the player is recorded as done by whoever asked
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" restores the player "Sam Someone" in "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: Restoring a player who is not archived records nothing
      When the reader signed in to the account for "organiser@example.com" restores the player "Sam Someone" in "Spring Open"
      Then nothing more is recorded of the tournament

  Rule: A player restored is not put back in the competitions they were removed from

    Scenario: A restored player is not in a competition they were in before being archived
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" restores the player "Sam Someone" in "Spring Open"
      Then the competition "Block A" of "Spring Open" does not have the player "Sam Someone"

  Rule: Only a player there is, in a tournament there is, can be restored

    Scenario: Restoring a player the tournament does not have is refused as the tournament refuses it
      When the reader signed in to the account for "organiser@example.com" restores a player "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchPlayer"

    Scenario: Restoring a player in a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" restores the player "Sam Someone" in a tournament there is not
      Then it is refused with "RestorePlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "someone@example.com" restores the player "Sam Someone" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "scorer@example.com" restores the player "Sam Someone" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account restores nobody

    Scenario: A forgotten account is refused
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account restores the player "Sam Someone" in "Spring Open"
      Then it is refused with "Account.Forgotten"
