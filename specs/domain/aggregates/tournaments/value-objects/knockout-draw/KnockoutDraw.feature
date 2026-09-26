Feature: The shape of a knockout's draw

  A knockout is played in rounds. Each match has a winner, who goes through
  to the next round, until one player is left. So a knockout's draw has a
  place for each of a number of players that halves exactly, round by round,
  down to one: 2, 4, 8, 16 and so on. A draw with fewer players than places
  fills the rest with byes, and those are the draw's to place, not its
  shape's.

  A draw has at least 2 places, since a knockout of one player has no match
  in it.

  Each round is played as the best of some number of games, and the rounds
  need not be the same: an early round is often the best of 1 and the final
  the best of 3. So a draw has one best-of for each round, the first round
  first, and exactly as many as it has rounds: a draw of 8 places has three
  rounds. Each round's best-of is odd, because somebody has to go through and
  an even number of games can be shared. What else a best-of must be is the
  best-of's to say.

  Rule: A draw has a number of places that halves down to one

    Scenario Outline: A draw whose places halve down to one is accepted
      Given a draw of <places> places
      And the best-of for each of its <rounds> rounds is 1
      When the knockout draw is made
      Then the draw has <places> places

      Examples:
        | places | rounds |
        | 2      | 1      |
        | 8      | 3      |
        | 64     | 6      |

    Scenario Outline: A draw whose places do not halve down to one is refused
      Given a draw of <places> places
      And the best-of for each of its <rounds> rounds is 1
      When the knockout draw is made
      Then it is refused for breaking "KnockoutDraw.PlacesDoNotHalve"

      Examples:
        | places | rounds |
        | 3      | 2      |
        | 12     | 4      |

    Scenario: A draw of 1 place is refused
      Given a draw of 1 place
      And no best-ofs
      When the knockout draw is made
      Then it is refused for breaking "KnockoutDraw.TooFewPlaces"

    Scenario: A draw of 0 places is refused
      Given a draw of 0 places
      And no best-ofs
      When the knockout draw is made
      Then it is refused for breaking "KnockoutDraw.TooFewPlaces"

  Rule: A draw has one best-of for each round, the first round first

    Scenario: Each round is the best of what was given for it
      Given a draw of 4 places
      And the best-of for the first round is 1
      And the best-of for the second round is 3
      When the knockout draw is made
      Then the first round is the best of 1
      And the second round is the best of 3

    Scenario: A draw with fewer best-ofs than rounds is refused
      Given a draw of 8 places
      And the best-of for the first round is 1
      And the best-of for the second round is 1
      When the knockout draw is made
      Then it is refused for breaking "KnockoutDraw.WrongNumberOfRounds"

    Scenario: A draw with more best-ofs than rounds is refused
      Given a draw of 2 places
      And the best-of for the first round is 1
      And the best-of for the second round is 3
      When the knockout draw is made
      Then it is refused for breaking "KnockoutDraw.WrongNumberOfRounds"

  Rule: Each round is the best of an odd number of games

    Scenario: A round that is the best of an even number is refused
      Given a draw of 4 places
      And the best-of for the first round is 1
      And the best-of for the second round is 2
      When the knockout draw is made
      Then it is refused for breaking "KnockoutDraw.EvenBestOf"

    Scenario: A round's best-of that could not be one is refused as a best-of is
      Given a draw of 2 places
      And the best-of for the first round is 0
      When the knockout draw is made
      Then it is refused for breaking "BestOf.TooSmall"
