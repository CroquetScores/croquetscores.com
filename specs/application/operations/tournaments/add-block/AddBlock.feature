@postgres
Feature: Adding a block to a tournament

  A manager of the tournament can add a block to it, and the account they are
  signed in to is who added it. The tournament is named by its id; one there
  is not is refused as `AddBlock.NoSuchTournament`. The block is given a new
  id, and the answer is that id. Only the tournament's managers can: anybody
  else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  The block's name, what each of its matches is the best of and the rounds it
  is played in are asked their own rules on the way in, and a request that breaks one is refused with
  `Request.Invalid` and the first rule it breaks. What the tournament asks of
  a competition — a name no other has, a slug unlike every other's, an order
  above the rest — is the tournament's (`addBlock.feature`), and what is said
  here of adding a block is said of adding a knockout (`AddKnockout.feature`)
  and a Swiss (`AddSwiss.feature`) too.

  How the block is played and counted is asked as well: whether it is played
  under handicap, allows drawn results and counts towards the world rankings
  (`competitionRules.feature`). What the tournament refuses of those
  together is the tournament's to refuse, and so is said here as it refuses.

  A forgotten account adds nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: A sound block is added and kept

    Scenario: The block is one of the tournament's competitions
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then the tournament's competition "Block A" is a block

    Scenario: The block is the best of what it was added as
      Given the block is to be the best of 2
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then the tournament's competition "Block A" is the best of 2

    Scenario: The block is played in the rounds it was added as
      Given the block is to be played in 2 rounds
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then the tournament's competition "Block A" is played in 2 rounds

    Scenario: The answer is the block's id
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then it is answered with the id of the tournament's competition "Block A"

    Scenario: The block is given its slug by the tournament
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then the tournament's competition "Block A" has the slug "block-a"

    Scenario: Adding the block is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

  Rule: How the block is played and counted is kept

    Scenario: A block asked to be played under handicap is
      Given the competition is to be played under handicap
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then the tournament's competition "Block A" is played under handicap

    Scenario: A block asked to allow drawn results does
      Given the competition is to allow drawn results
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then the tournament's competition "Block A" allows drawn results

    Scenario: A block asked nothing counts towards the world rankings
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then the tournament's competition "Block A" counts towards the world rankings

    Scenario: A block asked not to count towards the world rankings does not
      Given the competition is said not to count towards the world rankings
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then the tournament's competition "Block A" does not count towards the world rankings

    Scenario: A block played under handicap asked to count towards the world rankings is refused as the tournament refuses it
      Given the competition is to be played under handicap
      And the competition is said to count towards the world rankings
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then it is refused with "Tournament.HandicapInWorldRankings"

  Rule: Each value must break none of its own rules

    Scenario Outline: A value that breaks a rule is refused for it
      Given the block is to be the best of <games>
      When the reader signed in to the account for "organiser@example.com" adds the block "<name>" to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | name    | games | code                    |
        |         | 1     | CompetitionName.Missing |
        | ???     | 1     | CompetitionName.NoLetterOrDigit |
        | Block A | 0     | BestOf.TooSmall         |

    Scenario: A number of rounds that could not be one is refused for it
      Given the block is to be played in 0 rounds
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Rounds.TooSmall"

    Scenario: A block that breaks a rule is not added
      Given the block is to be the best of 0
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then the tournament has no competitions

  Rule: What the tournament asks of its competitions is the tournament's to refuse

    Scenario: A name another competition has is refused as the tournament refuses it
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the block "block a" to "Spring Open"
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: Adding a block to a tournament played by teams is refused as the tournament refuses it
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Tests"
      Then it is refused with "Tournament.PlayedByTeams"

    Scenario: Adding a block to an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to "Spring Open"
      Then it is refused with "Tournament.Archived"

  Rule: Only a tournament there is can have a block added

    Scenario: Adding a block to a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" adds the block "Block A" to a tournament there is not
      Then it is refused with "AddBlock.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" adds the block "Block A" to "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" adds the block "Block A" to "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account adds nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account adds the block "Block A" to "Spring Open"
      Then it is refused with "Account.Forgotten"
