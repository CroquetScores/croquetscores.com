Feature: How many times each pair of a block's players meet

  A block is a round robin, and a round robin may be played more than once:
  the 2013 CNZ Nationals' Limited Doubles was a triple round robin, each pair
  meeting in three matches of the best of 3. A block says how many rounds it
  is played in, and each pair of its players plays as many matches as there
  are rounds. Every block says, and a block played once is played in 1.

  A number of rounds is a whole number from 1 up.

  Rule: A number of rounds is a whole number from 1 up

    Scenario Outline: A whole number from 1 up is accepted
      When a number of rounds of <rounds> is made
      Then the number of rounds is <rounds>

      Examples:
        | rounds |
        | 1      |
        | 2      |
        | 3      |

    Scenario: A number of rounds of 0 is refused
      When a number of rounds of 0 is made
      Then it is refused for breaking "Rounds.TooSmall"

    Scenario: A number of rounds that is not a whole number is refused
      When a number of rounds of 1.5 is made
      Then it is refused for breaking "Rounds.NotWhole"
