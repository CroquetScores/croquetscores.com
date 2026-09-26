@postgres
Feature: Archiving a tournament's competition

  A manager of the tournament can archive a tournament's competition, of
  whatever kind, and the account they are signed in to is who archived it. The
  tournament and the competition are each named by their id. A tournament
  there is not is refused as `ArchiveCompetition.NoSuchTournament`, and a
  competition the tournament does not have is the tournament's to refuse. Only
  the tournament's managers can: anybody else, a scorer among them, is refused
  with `Tournament.NotAManager` (`onlyManagers.feature`).

  A competition that has any games cannot be archived, and whether it has is
  not the tournament's to know (`archiveCompetition.feature`). The
  application asks its games. Nothing records games yet, so the application's
  games say that no competition has any (`Games.feature`); a scenario
  about one that has stands in games that say so. Archiving a competition that
  is archived records nothing.

  A forgotten account archives nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"

  Rule: A competition that has no games is kept archived

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

  Rule: The application's games say whether a competition has any

    Scenario: A competition the games say has games is refused as the tournament refuses it
      Given games that say the competition "Block A" in "Spring Open" has games
      When the reader signed in to the account for "organiser@example.com" archives the competition "Block A" in "Spring Open"
      Then it is refused with "Tournament.CompetitionHasGames"

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
