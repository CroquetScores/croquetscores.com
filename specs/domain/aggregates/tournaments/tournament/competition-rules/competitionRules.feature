Feature: How a competition is played and counted

  Each of a tournament's competitions says for itself whether it is played
  with handicaps, whether it allows drawn results, and whether it counts
  towards the world rankings, since one tournament can hold a handicap block
  beside a level one, or a test that may be drawn beside a knockout that
  cannot be. A block, a knockout, a Swiss and a test each have all three. The
  tournament itself has none.

  A competition is not played with handicaps, and does not allow drawn
  results, unless it is said to. A game on equal points with no mark saying
  who won is kept only in a competition that allows drawn results
  (`Game.feature`). A knockout needs a winner of every match, so it has the
  field like the others, but a drawn game still does not decide a match.

  A competition counts towards the world rankings only when its sport has
  them, it is not played with handicaps, and it does not allow drawn results:
  a handicap result says nothing about who is better, and neither does a drawn
  one. It does count unless it is said not to. Saying one counts when it
  cannot is refused rather than quietly undone, since whoever said so meant
  something the competition cannot be, by `Tournament.NoWorldRankings`,
  `Tournament.HandicapInWorldRankings` or `Tournament.DrawsInWorldRankings`.

  What a competition is when it is added is what adding it says, and updating
  it says all three again, as it says its other values: one that is not said
  is as an added competition's would be. An update that says nothing of them
  leaves them as they were, and one that changes nothing records nothing.

  Where the tournament's sport is later changed to one without world rankings,
  a competition keeps what it says, and it is the rankings that are not
  available for the sport (`PublicRankingsOfTournament.feature`).

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: A competition is played under handicap only when it is said to be

    Scenario: A block added without saying is not played under handicap
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then the tournament's competition "Block A" is not played under handicap

    Scenario: A block said to be played under handicap is
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the competition is to be played under handicap
      When the block "Block A" is added
      Then the tournament's competition "Block A" is played under handicap

  Rule: A competition allows drawn results only when it is said to

    Scenario: A block added without saying does not allow drawn results
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then the tournament's competition "Block A" does not allow drawn results

    Scenario: A block said to allow drawn results does
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the competition is to allow drawn results
      When the block "Block A" is added
      Then the tournament's competition "Block A" allows drawn results

    Scenario: A block allowing drawn results does not make the tournament's next block allow them
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it allowing drawn results
      And the tournament is rebuilt from the stream
      When the block "Block B" is added
      Then the tournament's competition "Block B" does not allow drawn results

  Rule: Only a competition in a sport with world rankings, not under handicap and not allowing drawn results counts towards them

    Scenario Outline: A block in a sport with world rankings counts towards them unless it is said not to
      Given a stream where a tournament was created in the sport "<sport>"
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then the tournament's competition "Block A" counts towards the world rankings

      Examples:
        | sport |
        | ac    |
        | gc    |

    Scenario: A block said not to count towards the world rankings does not
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is said not to count towards the world rankings
      When the block "Block A" is added
      Then the tournament's competition "Block A" does not count towards the world rankings

    Scenario: A block played under handicap and added without saying does not count towards the world rankings
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is to be played under handicap
      When the block "Block A" is added
      Then the tournament's competition "Block A" does not count towards the world rankings

    Scenario: A block allowing drawn results and added without saying does not count towards the world rankings
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is to allow drawn results
      When the block "Block A" is added
      Then the tournament's competition "Block A" does not count towards the world rankings

    Scenario: A block played under handicap said to count towards the world rankings is refused
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is to be played under handicap
      And the competition is said to count towards the world rankings
      When the block "Block A" is added
      Then it is refused with "Tournament.HandicapInWorldRankings"

    Scenario: A block allowing drawn results said to count towards the world rankings is refused
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is to allow drawn results
      And the competition is said to count towards the world rankings
      When the block "Block A" is added
      Then it is refused with "Tournament.DrawsInWorldRankings"

    Scenario: A block in a sport without world rankings added without saying does not count towards them
      Given a stream where a tournament was created in the sport "rc"
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then the tournament's competition "Block A" does not count towards the world rankings

    Scenario: A block in a sport without world rankings said to count towards them is refused
      Given a stream where a tournament was created in the sport "rc"
      And the tournament is rebuilt from the stream
      And the competition is said to count towards the world rankings
      When the block "Block A" is added
      Then it is refused with "Tournament.NoWorldRankings"

  Rule: A refused competition is not added

    Scenario: A block refused for its rules records nothing
      Given a stream where a tournament was created in the sport "rc"
      And the tournament is rebuilt from the stream
      And the competition is said to count towards the world rankings
      When the block "Block A" is added
      Then it has recorded 0 events

  Rule: Updating a competition says its rules again

    Scenario: An update that says nothing of them leaves them as they were
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it played under handicap
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the block "Block A" is updated
      Then the tournament's competition "Block One" is played under handicap

    Scenario: An update can play a block under handicap
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it as "competition/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the update plays the competition under handicap
      When the block "Block A" is updated
      Then the tournament's competition "Block A" is played under handicap

    Scenario: An update that does not say a rule says it is as an added block's would be
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it played under handicap
      And the tournament is rebuilt from the stream
      And the update allows drawn results in the competition
      When the block "Block A" is updated
      Then the tournament's competition "Block A" is not played under handicap

    Scenario: An update can allow drawn results
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it as "competition/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the update allows drawn results in the competition
      When the block "Block A" is updated
      Then the tournament's competition "Block A" allows drawn results

    Scenario: An update that plays a counting block under handicap leaves it not counting
      Given a stream where a tournament was created in the sport "ac"
      And the block "Block A" was added to it as "competition/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the update plays the competition under handicap
      When the block "Block A" is updated
      Then the tournament's competition "Block A" does not count towards the world rankings

    Scenario: An update that plays a block under handicap while saying it counts is refused
      Given a stream where a tournament was created in the sport "ac"
      And the block "Block A" was added to it as "competition/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the update plays the competition under handicap
      And the update says the competition counts towards the world rankings
      When the block "Block A" is updated
      Then it is refused with "Tournament.HandicapInWorldRankings"

    Scenario: An update that says the rules it already has records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it played under handicap
      And the tournament is rebuilt from the stream
      And the update plays the competition under handicap
      When the block "Block A" is updated
      Then it has recorded 0 events

  Rule: A knockout, a Swiss and a test each have them

    Scenario: A knockout can be played under handicap
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the competition is to be played under handicap
      When the knockout "Main Event" is added
      Then the tournament's competition "Main Event" is played under handicap

    Scenario: A knockout allowing drawn results is one that allows them
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the competition is to allow drawn results
      When the knockout "Main Event" is added
      Then the tournament's competition "Main Event" allows drawn results

    Scenario: A knockout said not to count towards the world rankings does not
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is said not to count towards the world rankings
      When the knockout "Main Event" is added
      Then the tournament's competition "Main Event" does not count towards the world rankings

    Scenario: A knockout updated to be played under handicap is
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it
      And the tournament is rebuilt from the stream
      And the update plays the competition under handicap
      When the knockout "Main Event" is updated
      Then the tournament's competition "Main Event" is played under handicap

    Scenario: A Swiss can be played under handicap
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the competition is to be played under handicap
      When the Swiss "Swiss" is added
      Then the tournament's competition "Swiss" is played under handicap

    Scenario: A Swiss allowing drawn results does not count towards the world rankings
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is to allow drawn results
      When the Swiss "Swiss" is added
      Then the tournament's competition "Swiss" does not count towards the world rankings

    Scenario: A Swiss updated to allow drawn results does
      Given a stream where a tournament was created as "Spring Open"
      And the Swiss "Swiss" was added to it
      And the tournament is rebuilt from the stream
      And the update allows drawn results in the competition
      When the Swiss "Swiss" is updated
      Then the tournament's competition "Swiss" allows drawn results

  Rule: A rebuilt tournament has each competition as it was added

    Scenario: A competition added with rules has them when the tournament is rebuilt
      Given a stream where a tournament was created in the sport "ac"
      And the block "Block A" was added to it played under handicap
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Block A" is played under handicap
