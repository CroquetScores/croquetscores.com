Feature: Changing what a competition's player carries forward

  A player in a competition may carry results forward into it: the matches,
  games and hoops they bring from play it did not score
  (`CarryForward.feature`). A player is entered carrying nothing forward
  (`CompetitionPlayer.feature`), and is given a carry forward afterwards, as many
  times as it needs correcting. Each time says all six counts again, so a
  count left out is taken away. The player keeps their id and their order.

  A carry forward is for the standings a player's results are counted into,
  and a block and a Swiss have them. A knockout has none: it is decided by
  its draw, and who goes through is who won, whatever they brought with them.
  So giving a player in a knockout a carry forward is refused with
  `Competition.NoStandings`, rather than kept where nothing would ever count
  it.

  A carry forward can be given at any time, before or after the player has
  played, since what they bring is what it was whatever has been played
  since. A withdrawn player can only have their withdrawal reversed, so
  giving one a carry forward is refused as the player refuses it
  (`CompetitionPlayer.feature`). A carry forward that breaks a rule is refused
  as a carry forward refuses it.

  The player is found by their id. An id that is no player's in the
  competition is refused.

  Giving a player the carry forward they already have records nothing,
  because nothing happened: a form sent twice is not a mistake worth refusing.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a competition with no players
    And the tournament player "Sam Someone" was entered in it

  Rule: A carry forward given is recorded, and is what the player carries forward

    Scenario: Giving a player a carry forward records it
      Given the competition is rebuilt from its stream
      And the carry forward is to have match wins of 3
      When the player "Sam Someone" is given the carry forward
      Then it has recorded 1 event
      And the first thing it recorded is a player's carry forward being changed

    Scenario Outline: A player given a carry forward carries forward each count of it
      Given the competition is rebuilt from its stream
      And the carry forward is to have <count> of <number>
      When the player "Sam Someone" is given the carry forward
      Then the competition's player "Sam Someone" carries forward <count> of <number>

      Examples:
        | count         | number |
        | match wins    | 3      |
        | match losses  | 1      |
        | game wins     | 7      |
        | game losses   | 4      |
        | hoops for     | 112    |
        | hoops against | 86     |

    Scenario: A player given a carry forward keeps their order
      Given the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      And the carry forward is to have match wins of 3
      When the player "Sam Someone" is given the carry forward
      Then the competition's first player is "Sam Someone"

    Scenario: A player given a carry forward is still in the competition
      Given the competition is rebuilt from its stream
      And the carry forward is to have match wins of 3
      When the player "Sam Someone" is given the carry forward
      Then the competition has the tournament player "Sam Someone"

    Scenario: A competition rebuilt after a carry forward was given has it
      Given the player "Sam Someone" was given a carry forward of match wins of 3
      When the competition is rebuilt from its stream
      Then the competition's player "Sam Someone" carries forward match wins of 3

    Scenario: A player entered carries nothing forward
      When the competition is rebuilt from its stream
      Then the competition's player "Sam Someone" carries nothing forward

  Rule: Each carry forward says every count again

    Scenario: A count left out of a carry forward is taken away
      Given the player "Sam Someone" was given a carry forward of match wins of 3
      And the competition is rebuilt from its stream
      And the carry forward is to have game wins of 7
      When the player "Sam Someone" is given the carry forward
      Then the competition's player "Sam Someone" carries forward nothing in match wins

    Scenario: A carry forward of no counts takes away what was carried forward
      Given the player "Sam Someone" was given a carry forward of match wins of 3
      And the competition is rebuilt from its stream
      And the carry forward is to have no counts
      When the player "Sam Someone" is given the carry forward
      Then the competition's player "Sam Someone" carries nothing forward

    Scenario: Changing a count to 0 records it
      Given the player "Sam Someone" was given a carry forward of match wins of 3
      And the competition is rebuilt from its stream
      And the carry forward is to have match wins of 0
      When the player "Sam Someone" is given the carry forward
      Then it has recorded 1 event

  Rule: Giving a player the carry forward they have records nothing

    Scenario: Giving a player the carry forward they have records nothing
      Given the player "Sam Someone" was given a carry forward of match wins of 3
      And the competition is rebuilt from its stream
      And the carry forward is to have match wins of 3
      When the player "Sam Someone" is given the carry forward
      Then it has recorded 0 events

    Scenario: Giving a player who carries nothing forward no carry forward records nothing
      Given the competition is rebuilt from its stream
      And the carry forward is to have no counts
      When the player "Sam Someone" is given the carry forward
      Then it has recorded 0 events

    Scenario: Giving a player the carry forward they have is not refused
      Given the player "Sam Someone" was given a carry forward of match wins of 3
      And the competition is rebuilt from its stream
      And the carry forward is to have match wins of 3
      When the player "Sam Someone" is given the carry forward
      Then it is not refused

  Rule: A carry forward can be given whatever has been played

    Scenario: A player who has played can be given a carry forward
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      And the carry forward is to have match wins of 3
      When the player "Sam Someone" is given the carry forward
      Then the competition's player "Sam Someone" carries forward match wins of 3

  Rule: What the player and the carry forward refuse is theirs to refuse

    Scenario: Giving a withdrawn player a carry forward is refused
      Given the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      And the carry forward is to have match wins of 3
      When the player "Sam Someone" is given the carry forward
      Then it is refused for breaking "CompetitionPlayer.Withdrawn"

    Scenario: A carry forward that breaks a rule is refused as a carry forward refuses it
      Given the competition is rebuilt from its stream
      And the carry forward is to have hoops for of -1
      When the player "Sam Someone" is given the carry forward
      Then it is refused for breaking "CarryForward.HoopsForBelowZero"

  Rule: Only a player there is can be given a carry forward

    Scenario: Giving a carry forward to a player the competition does not have is refused
      Given the competition is rebuilt from its stream
      And the carry forward is to have match wins of 3
      When the player "competition-player/123e4567-e89b-42d3-a456-426614174000" is given the carry forward by their id
      Then it is refused with "Competition.NoSuchPlayer"

  Rule: Only a competition with standings carries anything forward

    Scenario: A player in a Swiss can be given a carry forward
      Given the competition is a Swiss
      And the competition is rebuilt from its stream
      And the carry forward is to have match wins of 3
      When the player "Sam Someone" is given the carry forward
      Then the competition's player "Sam Someone" carries forward match wins of 3

    Scenario: Giving a player in a knockout a carry forward is refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the competition is rebuilt from its stream
      And the carry forward is to have match wins of 3
      When the player "Sam Someone" is given the carry forward
      Then it is refused with "Competition.NoStandings"
