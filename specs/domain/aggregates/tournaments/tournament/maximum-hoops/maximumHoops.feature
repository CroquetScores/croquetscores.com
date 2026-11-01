Feature: The most hoops a game in a competition is played to

  Each of a tournament's competitions says for itself the most hoops a game
  in it is played to, since one tournament can hold a 26 point block beside a
  14 point one, as short croquet is. Whoever reads a block's results can then
  tell a game that ended on 14 from one that was meant to go on to 26. A
  block, a knockout, a Swiss and a test each have it. The tournament itself
  has none.

  A competition that is not said to have one has the usual for its sport: 26
  in association croquet and 13 in golf croquet. A competition can also be
  said to have none, for a game that is not played to a number of hoops at all.
  That is different from not saying, which is why the two are kept apart.

  A number of hoops is a whole number of at least 1. Anything else is refused
  by `Tournament.MaximumHoopsInvalid`, rather than quietly made into something
  the manager did not mean.

  What a competition has when it is added is what adding it says, and updating
  it says it again, as it says its other values: one that is not said is as an
  added competition's would be. An update that says nothing of its rules leaves
  the maximum as it was, and one that changes nothing records nothing.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: A competition not said to have a maximum has the usual for its sport

    Scenario Outline: A block added without saying has the usual for its sport
      Given a stream where a tournament was created in the sport "<sport>"
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then the tournament's competition "Block A" has a maximum of <hoops> hoops

      Examples:
        | sport | hoops |
        | ac    | 26    |
        | gc    | 13    |

  Rule: A competition can be said to have a maximum

    Scenario: A block said to have a maximum of 14 hoops has it
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is said to have a maximum of 14 hoops
      When the block "Block A" is added
      Then the tournament's competition "Block A" has a maximum of 14 hoops

    Scenario: A block with a maximum does not give it to the tournament's next block
      Given a stream where a tournament was created in the sport "ac"
      And the block "Block A" was added to it with a maximum of 14 hoops
      And the tournament is rebuilt from the stream
      When the block "Block B" is added
      Then the tournament's competition "Block B" has a maximum of 26 hoops

  Rule: A competition can be said to have no maximum

    Scenario: A block said to have no maximum has none
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is said to have no maximum number of hoops
      When the block "Block A" is added
      Then the tournament's competition "Block A" has no maximum number of hoops

  Rule: A maximum is a whole number of at least 1

    Scenario Outline: A block said to have a maximum that is not one is refused
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is said to have a maximum of <hoops> hoops
      When the block "Block A" is added
      Then it is refused with "Tournament.MaximumHoopsInvalid"

      Examples:
        | hoops |
        | 0     |
        | -1    |
        | 13.5  |

    Scenario: A block refused for its maximum records nothing
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is said to have a maximum of 0 hoops
      When the block "Block A" is added
      Then it has recorded 0 events

  Rule: Updating a competition says its maximum again

    Scenario: An update that says nothing of its rules leaves the maximum as it was
      Given a stream where a tournament was created in the sport "ac"
      And the block "Block A" was added to it with a maximum of 14 hoops
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the block "Block A" is updated
      Then the tournament's competition "Block One" has a maximum of 14 hoops

    Scenario: An update can change the maximum
      Given a stream where a tournament was created in the sport "ac"
      And the block "Block A" was added to it as "competition/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the update says the competition has a maximum of 18 hoops
      When the block "Block A" is updated
      Then the tournament's competition "Block A" has a maximum of 18 hoops

    Scenario: An update that says other rules but not the maximum says it is the usual
      Given a stream where a tournament was created in the sport "ac"
      And the block "Block A" was added to it with a maximum of 14 hoops
      And the tournament is rebuilt from the stream
      And the update allows drawn results in the competition
      When the block "Block A" is updated
      Then the tournament's competition "Block A" has a maximum of 26 hoops

    Scenario: An update that says the maximum it already has records nothing
      Given a stream where a tournament was created in the sport "ac"
      And the block "Block A" was added to it with a maximum of 14 hoops
      And the tournament is rebuilt from the stream
      And the update says the competition has a maximum of 14 hoops
      When the block "Block A" is updated
      Then it has recorded 0 events

  Rule: A knockout, a Swiss and a test each have one

    Scenario: A knockout said to have a maximum has it
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is said to have a maximum of 14 hoops
      When the knockout "Main Event" is added
      Then the tournament's competition "Main Event" has a maximum of 14 hoops

    Scenario: A Swiss said to have a maximum has it
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is said to have a maximum of 14 hoops
      When the Swiss "Swiss" is added
      Then the tournament's competition "Swiss" has a maximum of 14 hoops

  Rule: A rebuilt tournament has each competition as it was added

    Scenario: A competition added with a maximum has it when the tournament is rebuilt
      Given a stream where a tournament was created in the sport "ac"
      And the block "Block A" was added to it with a maximum of 14 hoops
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Block A" has a maximum of 14 hoops

    Scenario: A competition added with no maximum has none when the tournament is rebuilt
      Given a stream where a tournament was created in the sport "ac"
      And the block "Block A" was added to it with no maximum number of hoops
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Block A" has no maximum number of hoops
