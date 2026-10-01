Feature: The name a team is known by

  A team has a name: the whole of what it is called, as "New Zealand" or
  "Canterbury Croquet Club", read on the team's own page and wherever a team
  is chosen from a list. It is between 1 and 254 characters, counted as a
  reader counts them, as a competition's name is (`CompetitionName.feature`):
  a team can be called by a letter alone as a block can.

  Whitespace at either end of a name is taken off before anything is asked of
  it, and the name is kept without it. A name that is nothing but whitespace
  is missing.

  Two teams in the same tournament called the same thing could not be told
  apart, but a name does not know which tournament it is in, so that is the
  tournament's to refuse and not the name's (`addTeam.feature`).

  Rule: A team name is between 1 and 254 characters

    Scenario Outline: A team name of an allowed length is accepted
      When a team name of <length> characters is made
      Then it is not refused

      Examples:
        | length |
        | 1      |
        | 254    |

    Scenario: A team name longer than 254 characters is refused
      When a team name of 255 characters is made
      Then it is refused for breaking "TeamName.TooLong"

    Scenario: No team name at all is refused
      When the team name "" is made
      Then it is refused for breaking "TeamName.Missing"

  Rule: Characters are counted as a reader counts them

    Scenario: A team name of 254 letters, each with its accent typed after it, is accepted
      When a team name of 254 accented letters is made with each accent typed after its letter
      Then it is not refused

  Rule: Whitespace at either end is not part of the name

    Scenario: A team name with spaces around it is kept without them
      When the team name "  New Zealand  " is made
      Then the team name is written "New Zealand"

    Scenario: A team name that is nothing but whitespace is missing
      When the team name "   " is made
      Then it is refused for breaking "TeamName.Missing"

    Scenario: A team name of 254 characters with spaces around it is accepted
      When a team name of 254 characters with spaces around it is made
      Then it is not refused
