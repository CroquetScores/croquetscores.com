Feature: The group a test is played in

  An event between many teams is often played in groups, each team meeting
  the others of its group, as "Group A" and "Group B", or as a section of a
  draw, as "Final". A test may say which group it is in (`addTest.feature`),
  so that a reader of the Tests tab can tell the groups apart
  (`tests-tab.feature`). It is optional, since an event between two teams has
  no groups.

  A group is named by what the manager types, between 1 and 254 characters,
  counted as a reader counts them, as a competition's name is
  (`CompetitionName.feature`): a group is often a letter alone. Whitespace at
  either end is taken off, and a group that is nothing but whitespace is no
  group, as what a player represents is (`TournamentPlayer.feature`), since
  a field left blank says the test is in none.

  The tests in a group have a page of their own (`group.feature`), found by
  the group's slug, made from its name as a competition's is (`Slug.feature`),
  so that "Block A" is found at "block-a". A group whose name has no letter or
  digit in it, as "?", makes no slug, and so has no page to be found at; it
  is a group all the same, since the name is what the manager typed, and is
  no group only to whatever needs it to be found.

  Rule: A group is between 1 and 254 characters

    Scenario Outline: A group of an allowed length is accepted
      When a test group of <length> characters is made
      Then it is not refused

      Examples:
        | length |
        | 1      |
        | 254    |

    Scenario: A group longer than 254 characters is refused
      When a test group of 255 characters is made
      Then it is refused for breaking "TestGroup.TooLong"

  Rule: Whitespace at either end is not part of the group

    Scenario: A group with spaces around it is kept without them
      When the test group "  Group A  " is made
      Then the test group is written "Group A"

    Scenario: A group that is nothing but whitespace is no group
      When the test group "   " is made
      Then there is no test group

    Scenario: An empty group is no group
      When the test group "" is made
      Then there is no test group

  Rule: A group's slug is made from its name

    Scenario: A group's slug is made from its name
      When the test group "Tier 2 Championship" is made
      Then the test group's slug is "tier-2-championship"

    Scenario: A group whose name has no letter or digit has no slug
      When the test group "?" is made
      Then the test group has no slug
