Feature: How many matches a test is expected to have

  A test is played as a number of matches between its teams' players, set
  before it begins by the event it is part of. A test says how many it is expected to have
  (`addTest.feature`), so that whoever reads its scores can see how far
  through it is. It is a whole number from 1 up, since a test of no matches is
  no test.

  It is what is expected, not a limit. A test is cut short by rain or a team
  conceding, and a match is replayed, so a test is not refused a game for
  having had as many matches as it was expected to have.

  Rule: Expected matches are a whole number from 1 up

    Scenario Outline: A whole number from 1 up is accepted
      When the expected matches <matches> are made
      Then the expected matches are <matches>

      Examples:
        | matches |
        | 1       |
        | 21      |

    Scenario: No matches at all is refused
      When the expected matches 0 are made
      Then it is refused for breaking "ExpectedMatches.TooSmall"

    Scenario: Fewer than none is refused
      When the expected matches -1 are made
      Then it is refused for breaking "ExpectedMatches.TooSmall"

    Scenario: A number that is not whole is refused
      When the expected matches 1.5 are made
      Then it is refused for breaking "ExpectedMatches.NotWhole"
