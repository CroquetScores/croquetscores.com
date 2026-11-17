# The Scoring Fraction Percentage tables published by Croquet England for
# Advantage Golf Croquet (Standard, Long and Short Game Tables, page two of
# https://www.croquet.org.uk/?d=4101, ?d=4102 and ?d=4103, each marked
# "Draft v2") were checked in full on 18 November 2026. The three tables are
# identical to the pixel. Every one of their 225 cells, for targets 3 to 20,
# is the exact fraction of hoops over target as a percentage, rounded to the
# nearest whole number, and rounded up where it falls exactly halfway. There
# are eight such cells, and all eight are rounded up: 1/8, 3/8, 5/8 and 7/8,
# and 2/16, 6/16, 10/16 and 14/16. So the rule below is round half up, and
# the examples are those cells, with a spread of the others that round up or
# down.
Feature: A player's scoring fraction in an Advantage Golf Croquet game

  In Advantage Golf Croquet the two players of a game have different targets,
  so hoops scored cannot be compared with each other. A player's scoring
  fraction is the hoops they scored over their target, and it is shown as a
  percentage, which is how a game stopped by time is won and how the players
  of a block are told apart.

  Croquet England publishes the percentage for every hoops and target in a
  table, rounded to a whole number. A scorer is not asked to type it: the
  site works it out the same way, so that a game is never put down with a
  percentage that differs from the table's.

  Rule: A scoring fraction is a percentage rounded to the nearest whole number, halves up

    Scenario Outline: A percentage is the hoops over the target
      When the scoring fraction of <hoops> hoops with a target of <target> is worked out
      Then the percentage is <percentage>

      Examples:
        | hoops | target | percentage |
        | 0     | 6      | 0          |
        | 6     | 6      | 100        |
        | 5     | 6      | 83         |
        | 5     | 8      | 63         |
        | 1     | 6      | 17         |
        | 2     | 6      | 33         |
        | 4     | 9      | 44         |
        | 5     | 9      | 56         |
        | 1     | 13     | 8          |
        | 1     | 14     | 7          |
        | 3     | 16     | 19         |
        | 1     | 19     | 5          |
        | 1     | 20     | 5          |

    Scenario Outline: A percentage exactly halfway is rounded up
      When the scoring fraction of <hoops> hoops with a target of <target> is worked out
      Then the percentage is <percentage>

      Examples:
        | hoops | target | percentage |
        | 1     | 8      | 13         |
        | 3     | 8      | 38         |
        | 5     | 8      | 63         |
        | 7     | 8      | 88         |
        | 2     | 16     | 13         |
        | 6     | 16     | 38         |
        | 10    | 16     | 63         |
        | 14    | 16     | 88         |

  Rule: Hoops and a target are whole numbers, and the hoops are no more than the target

    A player who reaches their target has won and the game is over, so there
    is no scoring more hoops than the target. A target of nothing would be a
    game already won, and a fraction of it cannot be worked out.

    Scenario Outline: Hoops and a target that cannot make a fraction are refused
      When the scoring fraction of <hoops> hoops with a target of <target> is worked out
      Then it is refused for breaking "<code>"

      Examples:
        | hoops | target | code                             |
        | 2.5   | 6      | ScoringFraction.HoopsNotWhole    |
        | -1    | 6      | ScoringFraction.HoopsNegative    |
        | 3     | 6.5    | ScoringFraction.TargetNotWhole   |
        | 0     | 0      | ScoringFraction.TargetTooSmall   |
        | 7     | 6      | ScoringFraction.HoopsAboveTarget |
