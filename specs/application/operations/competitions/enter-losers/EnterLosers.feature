@postgres
Feature: Entering the losers of a round of one knockout in another

  A manager of the tournament fills a knockout for those beaten in an earlier
  round of another, rather than entering them one at a time (issue 401). The
  tournament, the knockout the losers come from, the round and the knockout
  they go into are each named by their id, and the account the manager is
  signed in to is who entered them. Using it is optional: the knockout
  can still be filled player by player.

  The losers of the round are who `knockoutLosers.feature` says, and they are
  entered in that order, the first match's loser in the first place. A loser
  who is a bye, because they withdrew or because nobody was drawn in the
  place, is entered as a bye in the place of the match, so that the others keep
  their order.

  Everything else is refused as entering a player is (`EnterPlayer.feature`):
  anybody who is not a manager with `Tournament.NotAManager`, an archived
  tournament with `Tournament.Archived`, a competition the tournament does not
  have with `Tournament.NoSuchCompetition`, an archived one with
  `Tournament.CompetitionArchived`, and a forgotten account with
  `Account.Forgotten`. The knockout the losers come from has to be a knockout,
  or it is refused with `EnterLosers.NotAKnockout`, and a round it does not
  have is refused with `EnterLosers.NoSuchRound`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the knockout "Main" of 4 places to "Spring Open"
    And "organiser@example.com" has added the knockout "Plate" of 2 places to "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
    And "organiser@example.com" has added the player "Kim Keeper" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Main" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Main" of "Spring Open"
    And "organiser@example.com" has entered the player "Pat Player" in "Main" of "Spring Open"
    And "organiser@example.com" has entered the player "Kim Keeper" in "Main" of "Spring Open"

  Rule: The losers of a round are entered in the order of the matches they lost

    Scenario: The losers of the first round are the players of the other knockout
      Given "Sam Someone" has beaten "Alex Another" in "Main" of "Spring Open"
      And "Kim Keeper" has beaten "Pat Player" in "Main" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters the losers of the first round of "Main" in "Plate" of "Spring Open"
      Then the first player of "Plate" of "Spring Open" is "Alex Another"
      And the second player of "Plate" of "Spring Open" is "Pat Player"

    Scenario: The loser of a match not yet decided is not entered
      Given "Sam Someone" has beaten "Alex Another" in "Main" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters the losers of the first round of "Main" in "Plate" of "Spring Open"
      Then the first player of "Plate" of "Spring Open" is "Alex Another"
      And "Plate" of "Spring Open" has no second player

  Rule: A loser who is a bye is entered as a bye

    Scenario: A loser who withdrew is entered as a bye in their place
      Given "Sam Someone" has beaten "Alex Another" in "Main" of "Spring Open"
      And "Kim Keeper" has beaten "Pat Player" in "Main" of "Spring Open"
      And "Pat Player" has withdrawn from "Main" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters the losers of the first round of "Main" in "Plate" of "Spring Open"
      Then the first player of "Plate" of "Spring Open" is "Alex Another"
      And the second player of "Plate" of "Spring Open" is a bye

  Rule: A knockout is the only competition the losers come from

    Scenario: A competition that is not a knockout is refused
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters the losers of the first round of "Block A" in "Plate" of "Spring Open"
      Then it is refused for breaking "EnterLosers.NotAKnockout"

    Scenario: A round the knockout does not have is refused
      When the reader signed in to the account for "organiser@example.com" enters the losers of the third round of "Main" in "Plate" of "Spring Open"
      Then it is refused for breaking "EnterLosers.NoSuchRound"
