Feature: Putting things in order, and moving them

  A team, a player, a competition is listed by an order, a number, lowest
  first. Orders are left far apart when they are given, so that something can
  be put between two others, or moved past one, by giving it one order and
  leaving every other as it is.

  Every kind of thing that is listed this way keeps the same rules about the
  number and does the same sum to find where something goes, so they are
  stated here once rather than for each kind.

  Rule: An order is a whole number the platform holds exactly, and at least 1

    Scenario Outline: Orders that are refused
      When the order "<order>" is checked
      Then the order is refused for breaking "<code>"

      Examples:
        | order            | code          |
        | 1.5              | OrderNotWhole |
        | NaN              | OrderNotWhole |
        | 9007199254740993 | OrderNotWhole |
        | 0                | OrderTooSmall |
        | -10000           | OrderTooSmall |

    Scenario Outline: Orders that are kept
      When the order "<order>" is checked
      Then the order is kept

      Examples:
        | order            |
        | 1                |
        | 10000            |
        | 9007199254740991 |

  Rule: Something put last is a step past the highest, counting every one

    Scenario: Nothing is listed yet
      Given nothing is listed
      When something is put last
      Then it is given 10000

    Scenario: Something is listed
      Given something listed at 10000
      And something listed at 30000
      And something listed at 20000
      When something is put last
      Then it is given 40000

    Scenario: A very long list
      Given 3000000 things listed
      When something is put last
      Then it is given 30000010000

  Rule: Something moved past another is given an order in the room beyond it

    Scenario Outline: Moving past a neighbour with room
      Given things listed at 10000, 20000 and 30000
      When the one at place <place> is moved <direction>
      Then it is given <order>

      Examples:
        | place | direction | order |
        | 1     | up        | 15000 |
        | 1     | down      | 25000 |
        | 0     | up        | 5000  |
        | 2     | down      | 40000 |

    Scenario: Moving past a neighbour with no room
      Given things listed at 10000, 10001 and 20000
      When the one at place 0 is moved down
      Then there is no room for it

    Scenario: Moving to the front with no room
      Given things listed at 1, 2 and 3
      When the one at place 0 is moved up
      Then there is no room for it
