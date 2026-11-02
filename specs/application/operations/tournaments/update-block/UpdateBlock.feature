@postgres
Feature: Changing what a tournament's block is

  A manager of the tournament can correct a tournament's block, and the
  account they are signed in to is who corrected it. The tournament and the
  block are each named by their id. A tournament there is not is refused as
  `UpdateBlock.NoSuchTournament`, and a competition the tournament does not
  have, or one that is not a block, is the tournament's to refuse
  (`updateBlock.feature`). Only the tournament's managers can: anybody else, a
  scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  An update says the block's name and what it is the best of again, each
  asked its own rules on the way in, and the rounds it is played in again. It
  may say the tie break the block goes by, asked its own rule as well, and
  says none to leave the block going by what it went by. The block keeps its
  slug and its order.
  An update that changes nothing records nothing. What is said here of
  updating a block is said of updating a knockout (`UpdateKnockout.feature`)
  and a Swiss (`UpdateSwiss.feature`) too.

  A forgotten account changes nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"

  Rule: A sound update is kept

    Scenario: The block is kept as it was updated
      Given the update calls the competition "Block One"
      When the reader signed in to the account for "organiser@example.com" updates the block "Block A" in "Spring Open"
      Then the tournament has the competition "Block One"

    Scenario: The block keeps its slug
      Given the update calls the competition "Block One"
      When the reader signed in to the account for "organiser@example.com" updates the block "Block A" in "Spring Open"
      Then the tournament's competition "Block One" has the slug "block-a"

    Scenario: The block is the best of what it was updated to
      Given the update makes the competition the best of 3
      When the reader signed in to the account for "organiser@example.com" updates the block "Block A" in "Spring Open"
      Then the tournament's competition "Block A" is the best of 3

    Scenario: The block is played in the rounds it was updated to
      Given the update makes the competition played in 3 rounds
      When the reader signed in to the account for "organiser@example.com" updates the block "Block A" in "Spring Open"
      Then the tournament's competition "Block A" is played in 3 rounds

    Scenario: Updating the block is recorded as done by whoever asked
      Given the update calls the competition "Block One"
      When the reader signed in to the account for "organiser@example.com" updates the block "Block A" in "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: An update that changes nothing records nothing
      Given the update calls the competition "Block A"
      When the reader signed in to the account for "organiser@example.com" updates the block "Block A" in "Spring Open"
      Then nothing more is recorded of the tournament

  Rule: How the block tells apart players level on matches won is kept

    Scenario: The block goes by the tie break it was updated to
      Given the update makes the block go by the tie break "who-beat-who"
      When the reader signed in to the account for "organiser@example.com" updates the block "Block A" in "Spring Open"
      Then the tournament's competition "Block A" goes by the tie break "who-beat-who"

    Scenario: An update that says no tie break leaves the block going by what it went by
      Given the update calls the competition "Block One"
      When the reader signed in to the account for "organiser@example.com" updates the block "Block A" in "Spring Open"
      Then the tournament's competition "Block One" goes by the tie break "net-games-net-hoops-who-beat-who"

  Rule: Each value must break none of its own rules

    Scenario: A best-of that could not be one is refused for it
      Given the update makes the competition the best of 0
      When the reader signed in to the account for "organiser@example.com" updates the block "Block A" in "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "BestOf.TooSmall"

    Scenario: A tie break that is none of them is refused for it
      Given the update makes the block go by the tie break "net-hoops"
      When the reader signed in to the account for "organiser@example.com" updates the block "Block A" in "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "TieBreak.Unknown"

    Scenario: A number of rounds that could not be one is refused for it
      Given the update makes the competition played in 0 rounds
      When the reader signed in to the account for "organiser@example.com" updates the block "Block A" in "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Rounds.TooSmall"

  Rule: What the tournament asks is the tournament's to refuse

    Scenario: Updating a knockout as a block is refused as the tournament refuses it
      Given "organiser@example.com" has added the knockout "Main Event" to "Spring Open"
      And the update calls the competition "Main Draw"
      When the reader signed in to the account for "organiser@example.com" updates the block "Main Event" in "Spring Open"
      Then it is refused with "Tournament.NotABlock"

    Scenario: Updating a competition the tournament does not have is refused as the tournament refuses it
      Given the update calls the competition "Block One"
      When the reader signed in to the account for "organiser@example.com" updates a block "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: Updating a block in a tournament there is not is refused
      Given the update calls the competition "Block One"
      When the reader signed in to the account for "organiser@example.com" updates the block "Block A" in a tournament there is not
      Then it is refused with "UpdateBlock.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the update calls the competition "Block One"
      When the reader signed in to the account for "someone@example.com" updates the block "Block A" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And the update calls the competition "Block One"
      When the reader signed in to the account for "scorer@example.com" updates the block "Block A" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account changes nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      And the update calls the competition "Block One"
      When the reader signed in to that account updates the block "Block A" in "Spring Open"
      Then it is refused with "Account.Forgotten"
