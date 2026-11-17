Feature: Whether a competition is played as Advantage Golf Croquet

  Each of a tournament's competitions says for itself whether it is played as
  Advantage Golf Croquet, since one tournament can hold an Advantage block
  beside a level one. In Advantage the two players of a game have different
  targets, so a game is decided by each player's scoring fraction
  (`ScoringFraction.feature`) and not by hoops. A block, a knockout, a Swiss
  and a test each have it. The tournament itself has none.

  A competition is not played as Advantage unless it is said to be. It is a
  rule of a competition and not a sport of its own, so it is said apart from
  playing with handicaps: the handicaps are what the targets are looked up
  from, and whether they are kept is the competition's to say as it was.

  Only a golf croquet competition can be Advantage, since it is a rule of golf
  croquet. Saying otherwise is refused by `Tournament.AdvantageNotGolfCroquet`
  rather than quietly undone, since whoever said so meant something the
  competition cannot be.

  Its results say nothing of who is better, since the players have different
  targets, so an Advantage competition does not count towards the world
  rankings. It does not unless it is said to, and saying it does is refused by
  `Tournament.AdvantageInWorldRankings`, as it is for handicaps.

  What a competition is when it is added is what adding it says, and updating
  it says it again, as it says its other values: one that is not said is as an
  added competition's would be. An update that says nothing of its rules leaves
  it as it was, and one that changes nothing records nothing.

  A competition kept before Advantage could be said was not played as it. The
  event that added it says nothing of it, and it is read as not Advantage.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: A competition is Advantage only when it is said to be

    Scenario: A block added without saying is not Advantage
      Given a stream where a tournament was created in the sport "gc"
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then the tournament's competition "Block A" is not Advantage

    Scenario: A block said to be Advantage is
      Given a stream where a tournament was created in the sport "gc"
      And the tournament is rebuilt from the stream
      And the competition is said to be Advantage
      When the block "Block A" is added
      Then the tournament's competition "Block A" is Advantage

    Scenario: An Advantage block does not make the tournament's next block Advantage
      Given a stream where a tournament was created in the sport "gc"
      And the block "Block A" was added to it as Advantage
      And the tournament is rebuilt from the stream
      When the block "Block B" is added
      Then the tournament's competition "Block B" is not Advantage

  Rule: Only a golf croquet competition can be Advantage

    Scenario Outline: A block in another sport said to be Advantage is refused
      Given a stream where a tournament was created in the sport "<sport>"
      And the tournament is rebuilt from the stream
      And the competition is said to be Advantage
      When the block "Block A" is added
      Then it is refused with "Tournament.AdvantageNotGolfCroquet"

      Examples:
        | sport |
        | ac    |
        | rc    |

    Scenario: A block refused for being Advantage records nothing
      Given a stream where a tournament was created in the sport "ac"
      And the tournament is rebuilt from the stream
      And the competition is said to be Advantage
      When the block "Block A" is added
      Then it has recorded 0 events

  Rule: An Advantage competition does not count towards the world rankings

    Scenario: A block said to be Advantage and added without saying does not count towards the world rankings
      Given a stream where a tournament was created in the sport "gc"
      And the tournament is rebuilt from the stream
      And the competition is said to be Advantage
      When the block "Block A" is added
      Then the tournament's competition "Block A" does not count towards the world rankings

    Scenario: A block said to be Advantage and to count towards the world rankings is refused
      Given a stream where a tournament was created in the sport "gc"
      And the tournament is rebuilt from the stream
      And the competition is said to be Advantage
      And the competition is said to count towards the world rankings
      When the block "Block A" is added
      Then it is refused with "Tournament.AdvantageInWorldRankings"

  Rule: Updating a competition says whether it is Advantage again

    Scenario: An update that says nothing of its rules leaves it as it was
      Given a stream where a tournament was created in the sport "gc"
      And the block "Block A" was added to it as Advantage
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the block "Block A" is updated
      Then the tournament's competition "Block One" is Advantage

    Scenario: An update can make a block Advantage
      Given a stream where a tournament was created in the sport "gc"
      And the block "Block A" was added to it as "competition/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the update says the competition is Advantage
      When the block "Block A" is updated
      Then the tournament's competition "Block A" is Advantage

    Scenario: An update that says other rules but not Advantage says it is not
      Given a stream where a tournament was created in the sport "gc"
      And the block "Block A" was added to it as Advantage
      And the tournament is rebuilt from the stream
      And the update allows drawn results in the competition
      When the block "Block A" is updated
      Then the tournament's competition "Block A" is not Advantage

    Scenario: An update that says Advantage when it already is records nothing
      Given a stream where a tournament was created in the sport "gc"
      And the block "Block A" was added to it as Advantage
      And the tournament is rebuilt from the stream
      And the update says the competition is Advantage
      When the block "Block A" is updated
      Then it has recorded 0 events

  Rule: A competition with any game kept is not switched to or from Advantage

    A game in an Advantage competition is entered as hoops against a target
    and kept as a scoring fraction, and a game in any other is kept as the
    points it was typed as. The two cannot be read as each other, so a
    competition that has games would be left holding scores it could not
    count. Switching it either way is refused by `Tournament.AdvantageHasGames`.

    An archived game is a game kept, since it can be restored, and counts as
    much as any other. A withdrawn game does too. Whatever asks says whether
    the competition has any, as it says how many matches a test has started
    (`updateTest.feature`), and that it counts these is the application's
    to hold to (`UpdateBlock.feature`).

    An update that leaves it as it was is not refused for having games, so a
    block with games can still be renamed.

    Scenario: Switching a block with a game to Advantage is refused
      Given a stream where a tournament was created in the sport "gc"
      And the block "Block A" was added to it as "competition/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the competition "Block A" has a game kept
      And the update says the competition is Advantage
      When the block "Block A" is updated
      Then it is refused with "Tournament.AdvantageHasGames"

    Scenario: Switching an Advantage block with a game to not Advantage is refused
      Given a stream where a tournament was created in the sport "gc"
      And the block "Block A" was added to it as Advantage
      And the tournament is rebuilt from the stream
      And the competition "Block A" has a game kept
      And the update says the competition is not Advantage
      When the block "Block A" is updated
      Then it is refused with "Tournament.AdvantageHasGames"

    Scenario: A block refused for having games stays as it was
      Given a stream where a tournament was created in the sport "gc"
      And the block "Block A" was added to it as "competition/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the competition "Block A" has a game kept
      And the update says the competition is Advantage
      When the block "Block A" is updated
      Then the tournament's competition "Block A" is not Advantage

    Scenario: A block with a game that is left as it was can be renamed
      Given a stream where a tournament was created in the sport "gc"
      And the block "Block A" was added to it as Advantage
      And the tournament is rebuilt from the stream
      And the competition "Block A" has a game kept
      And the update calls the competition "Block One"
      And the update says the competition is Advantage
      When the block "Block A" is updated
      Then the tournament's competition "Block One" is Advantage

    Scenario: Switching a block with no game to Advantage is not refused
      Given a stream where a tournament was created in the sport "gc"
      And the block "Block A" was added to it as "competition/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the update says the competition is Advantage
      When the block "Block A" is updated
      Then the tournament's competition "Block A" is Advantage

    Scenario Outline: A knockout and a Swiss with a game are not switched either
      Given a stream where a tournament was created in the sport "gc"
      And the <kind> "Competition A" was added to it
      And the tournament is rebuilt from the stream
      And the competition "Competition A" has a game kept
      And the update says the competition is Advantage
      When the <kind> "Competition A" is updated
      Then it is refused with "Tournament.AdvantageHasGames"

      Examples:
        | kind     |
        | knockout |
        | Swiss    |

    Scenario: A test with a game is not switched either
      Given a stream where a tournament was created in the format "Teams" and the sport "gc"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      And the competition "AUS v ENG" has a game kept
      And the update says the competition is Advantage
      When the test "AUS v ENG" is updated
      Then it is refused with "Tournament.AdvantageHasGames"

  Rule: A knockout, a Swiss and a test each have it

    Scenario: A knockout said to be Advantage is
      Given a stream where a tournament was created in the sport "gc"
      And the tournament is rebuilt from the stream
      And the competition is said to be Advantage
      When the knockout "Main Event" is added
      Then the tournament's competition "Main Event" is Advantage

    Scenario: A Swiss said to be Advantage is
      Given a stream where a tournament was created in the sport "gc"
      And the tournament is rebuilt from the stream
      And the competition is said to be Advantage
      When the Swiss "Swiss" is added
      Then the tournament's competition "Swiss" is Advantage

    Scenario: A test said to be Advantage is
      Given a stream where a tournament was created in the format "Teams" and the sport "gc"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      And the competition is said to be Advantage
      When the test between "Australia" and "England" is added
      Then the tournament's competition "AUS v ENG" is Advantage

    Scenario: A knockout for the losers of an Advantage knockout is Advantage unless it is said otherwise
      Given a stream where a tournament was created in the sport "gc"
      And the knockout "Main Event" was added to it as Advantage
      And the tournament is rebuilt from the stream
      When the losers knockout "Plate" is added for the losers of the first round of "Main Event"
      Then the tournament's competition "Plate" is Advantage

  Rule: A rebuilt tournament has each competition as it was added

    Scenario: A competition added as Advantage is when the tournament is rebuilt
      Given a stream where a tournament was created in the sport "gc"
      And the block "Block A" was added to it as Advantage
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Block A" is Advantage

    Scenario Outline: A competition added by an event kept before Advantage could be said is not Advantage
      Given a stream where a tournament was created in the sport "gc"
      And the <kind> "Competition A" was added to it by an event that says nothing of Advantage
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Competition A" is not Advantage

      Examples:
        | kind     |
        | block    |
        | knockout |
        | Swiss    |

    Scenario: A test added by an event kept before Advantage could be said is not Advantage
      Given a stream where a tournament was created in the format "Teams" and the sport "gc"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it by an event that says nothing of Advantage
      When the tournament is rebuilt from the stream
      Then the tournament's competition "AUS v ENG" is not Advantage
