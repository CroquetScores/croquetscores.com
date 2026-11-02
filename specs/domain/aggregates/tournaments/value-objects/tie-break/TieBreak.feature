Feature: How the players of a block level on matches won are told apart

  A block's players are placed by the share of their matches they have won.
  Where players are level on that, the block's regulations say how they are
  told apart, and there are three ways: net games then net hoops then who beat
  who, who beat who alone, and other, which is no known way. Which of them a
  block goes by is for its manager to say, since blocks of one tournament can
  be run under different regulations.

  A tie break is known by a code: the name of the way, in lower case with a
  hyphen between the words. The code is what anything that is not a reader goes
  by, such as the record of a block; the words a reader sees for each are the
  site's own, in the reader's language, and are not the tie break's to say.

  A code that is none of the three is refused rather than taken as the nearest,
  since a block placed by a way nobody has written would be placed by a guess.
  A tie break is picked from a list rather than typed, so a code is taken
  exactly as it is written.

  What each way does to the order of the players is the placing of a block's
  players, and is specified with it (`placingsOfBlock.feature`).

  Rule: There are three tie breaks

    Scenario Outline: A tie break there is is accepted
      When the tie break "<code>" is made
      Then it is not refused

      Examples:
        | code                             |
        | net-games-net-hoops-who-beat-who |
        | who-beat-who                     |
        | other                            |

    Scenario Outline: A code that is no tie break is refused
      When the tie break "<code>" is made
      Then it is refused for breaking "TieBreak.Unknown"

      Examples:
        | code         |
        | net-hoops    |
        | Who-Beat-Who |
        | other-ways   |

    Scenario: No code at all is refused
      When the tie break "" is made
      Then it is refused for breaking "TieBreak.Missing"

  Rule: A tie break is known by its code

    Scenario: A tie break's code is kept as it was given
      Given the tie break "who-beat-who"
      Then the tie break's code is "who-beat-who"

    Scenario: Tie breaks with the same code are the same tie break
      Given the tie break "other"
      When it is compared with the tie break "other"
      Then they are the same tie break

    Scenario: Tie breaks with different codes are different tie breaks
      Given the tie break "other"
      When it is compared with the tie break "who-beat-who"
      Then they are different tie breaks

  Rule: A block goes by net games then net hoops then who beat who unless it is told otherwise

    This is how blocks were placed before a block could be told, so a block
    that was never told keeps its order.

    Scenario: The tie break a block goes by unless told otherwise
      When the tie break a block goes by unless told otherwise is asked for
      Then the tie break's code is "net-games-net-hoops-who-beat-who"
