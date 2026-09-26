Feature: How many games a match is the best of

  A match in a competition is played as the best of some number of games: the
  best of 1 is a single game, and the best of 3 is won by whoever wins two. A
  best-of is a whole number from 1 up.

  A best-of may be even. In a block or a Swiss a player is ranked by the games
  they win, so a match of two games that is shared one each is a result like
  any other. A knockout is different, since somebody has to go through, and
  that is the knockout's to ask, not the best-of's.

  Rule: A best-of is a whole number from 1 up

    Scenario Outline: A whole number from 1 up is accepted
      When a best-of of <games> is made
      Then the best-of is <games>

      Examples:
        | games |
        | 1     |
        | 2     |
        | 3     |

    Scenario: A best-of of 0 is refused
      When a best-of of 0 is made
      Then it is refused for breaking "BestOf.TooSmall"

    Scenario: A best-of that is not a whole number is refused
      When a best-of of 1.5 is made
      Then it is refused for breaking "BestOf.NotWhole"

  Rule: A best-of says whether it is odd

    Scenario Outline: An odd best-of is odd
      Given a best-of of <games>
      Then the best-of is odd

      Examples:
        | games |
        | 1     |
        | 3     |

    Scenario: An even best-of is not odd
      Given a best-of of 2
      Then the best-of is not odd
