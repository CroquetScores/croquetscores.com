Feature: What a player carries forward

  A player can come to a competition with results it did not score, such as
  those of an earlier stage, or of games played before the competition was
  scored here, and their standings in it are to begin from them rather than
  from nothing. What they bring is their carry forward: six counts, of the
  matches they won and lost, the games they won and lost, and the hoops they
  scored and had scored against them. It belongs to the player in the
  competition (`CompetitionPlayer.feature`), since the same person can bring
  something to one competition and nothing to another. How a carry forward is
  counted into a player's standings is to be specified with the standings, and
  is not written yet.

  Each count is optional, since a player may bring some of them and not
  others, and most players bring none. A count left out is nothing carried
  forward, and is kept as nothing rather than as 0, so that whoever changes
  it later sees it as it was left. A count given is a whole number from
  0 up, since nobody wins half a match or scores fewer than no hoops.

  Each count is refused by a code of its own, such as
  `CarryForward.MatchWinsBelowZero`, rather than by one code for all six, so
  that a form asking for them can say the refusal beside the count it is
  about. The counts are asked in the order they are named here, and the first
  one broken is the one refused.

  Two carry forwards are the same when every count is, so that a player whose
  carry forward is said again unchanged has not changed.

  Rule: Each count is kept as it was given

    Scenario Outline: A count given is kept
      Given the carry forward is to have <count> of <number>
      When the carry forward is made
      Then its <count> are <number>

      Examples:
        | count         | number |
        | match wins    | 3      |
        | match losses  | 1      |
        | game wins     | 7      |
        | game losses   | 4      |
        | hoops for     | 112    |
        | hoops against | 86     |

    Scenario Outline: A count of 0 is kept as 0
      Given the carry forward is to have <count> of 0
      When the carry forward is made
      Then its <count> are 0

      Examples:
        | count         |
        | match wins    |
        | hoops against |

    Scenario: A count left out is kept as nothing
      Given the carry forward is to have match wins of 3
      When the carry forward is made
      Then its match losses are nothing

    Scenario: A carry forward of no counts carries nothing forward
      When a carry forward of no counts is made
      Then it carries nothing forward

    Scenario: A carry forward of a count of 0 carries something forward
      Given the carry forward is to have match wins of 0
      When the carry forward is made
      Then it carries something forward

  Rule: A count is a whole number from 0 up

    Scenario Outline: A count below 0 is refused for that count
      Given the carry forward is to have <count> of -1
      When the carry forward is made
      Then it is refused for breaking "<code>"

      Examples:
        | count         | code                                |
        | match wins    | CarryForward.MatchWinsBelowZero     |
        | match losses  | CarryForward.MatchLossesBelowZero   |
        | game wins     | CarryForward.GameWinsBelowZero      |
        | game losses   | CarryForward.GameLossesBelowZero    |
        | hoops for     | CarryForward.HoopsForBelowZero      |
        | hoops against | CarryForward.HoopsAgainstBelowZero  |

    Scenario Outline: A count that is not a whole number is refused for that count
      Given the carry forward is to have <count> of 1.5
      When the carry forward is made
      Then it is refused for breaking "<code>"

      Examples:
        | count         | code                               |
        | match wins    | CarryForward.MatchWinsNotWhole     |
        | match losses  | CarryForward.MatchLossesNotWhole   |
        | game wins     | CarryForward.GameWinsNotWhole      |
        | game losses   | CarryForward.GameLossesNotWhole    |
        | hoops for     | CarryForward.HoopsForNotWhole      |
        | hoops against | CarryForward.HoopsAgainstNotWhole  |

    Scenario: The first count broken is the one refused
      Given the carry forward is to have game wins of -1
      And the carry forward is to have match losses of -1
      When the carry forward is made
      Then it is refused for breaking "CarryForward.MatchLossesBelowZero"

  Rule: Two carry forwards are the same when every count is

    Scenario: Carry forwards with the same counts are the same
      Given a carry forward made with match wins of 3
      And another carry forward made with match wins of 3
      When the carry forwards are compared
      Then they are the same carry forward

    Scenario: Carry forwards with a count that differs are different
      Given a carry forward made with match wins of 3
      And another carry forward made with match wins of 2
      When the carry forwards are compared
      Then they are different carry forwards

    Scenario: A count of 0 and a count left out are different
      Given a carry forward made with match wins of 0
      And another carry forward made with no counts
      When the carry forwards are compared
      Then they are different carry forwards
