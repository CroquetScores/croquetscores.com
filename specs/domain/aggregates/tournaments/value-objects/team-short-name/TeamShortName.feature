Feature: The short name a team is known by

  A team has a short name as well as its name (`TeamName.feature`): what it is
  called where there is room for little more than a word, as "NZ" for New
  Zealand. A test is called by the short names of its two teams, as "NZ v AUS"
  (`addTest.feature`), and that is what the section bar leads to it by
  (`TournamentSections.feature`), so a short name has to fit in a bar that
  holds every test of the tournament on a phone.

  It is between 1 and 10 characters, counted as a reader counts them. Ten is
  enough for any country's code and for a short word such as "Canterbury",
  and two of them either side of " v " still fit a phone's width. It is kept
  as it was typed, capitals and all: "NZ" and "Nz" are what their manager
  wrote. A tournament's name is refused all in capitals, since it looks like
  a mistake with the caps lock on (`TournamentName.feature`), but a short name
  is most often a code, as "AUS" or "NZ" is, and a code is written in
  capitals. So a short name all in capitals is accepted, and so is one all in
  lower case, as anything typed in so few letters may be.

  A short name is never longer than its team's name, counted as a reader
  counts them, since a short name longer than the name it shortens is the
  two typed the wrong way round. The short name does not know its team's
  name, so that is the team's to refuse (`Team.feature`).

  A team is found at an address made from its short name (`addTeam.feature`),
  and an address is made of letters and digits, so a short name with neither,
  as "***", is refused rather than leaving the team nowhere to be found.

  Whitespace at either end is taken off before anything is asked of it, and
  the short name is kept without it. A short name that is nothing but
  whitespace is missing.

  Two teams in the same tournament with the same short name would make tests
  that could not be told apart, but a short name does not know which
  tournament it is in, so that is the tournament's to refuse
  (`addTeam.feature`).

  Rule: A short name is between 1 and 10 characters

    Scenario Outline: A short name of an allowed length is accepted
      When a team short name of <length> characters is made
      Then it is not refused

      Examples:
        | length |
        | 1      |
        | 10     |

    Scenario: A short name longer than 10 characters is refused
      When a team short name of 11 characters is made
      Then it is refused for breaking "TeamShortName.TooLong"

    Scenario: No short name at all is refused
      When the team short name "" is made
      Then it is refused for breaking "TeamShortName.Missing"

  Rule: A short name has a letter or a digit in it

    Scenario Outline: A short name with neither a letter nor a digit is refused
      When the team short name "<short name>" is made
      Then it is refused for breaking "TeamShortName.NoLetterOrDigit"

      Examples:
        | short name |
        | ***        |
        | —          |

    Scenario Outline: A short name with a letter or a digit is accepted
      When the team short name "<short name>" is made
      Then it is not refused

      Examples:
        | short name |
        | A-1        |
        | 2          |
        | É          |

  Rule: Characters are counted as a reader counts them

    Scenario: A short name of 10 letters, each with its accent typed after it, is accepted
      When a team short name of 10 accented letters is made with each accent typed after its letter
      Then it is not refused

  Rule: A short name is kept as it was typed, without whitespace at either end

    Scenario: A short name is kept in the capitals it was typed in
      When the team short name "Nz" is made
      Then the team short name is written "Nz"

    Scenario: A short name all in capitals is accepted
      When the team short name "AUS" is made
      Then the team short name is written "AUS"

    Scenario: A short name all in lower case is accepted
      When the team short name "aus" is made
      Then the team short name is written "aus"

    Scenario: A short name with spaces around it is kept without them
      When the team short name "  NZ  " is made
      Then the team short name is written "NZ"

    Scenario: A short name that is nothing but whitespace is missing
      When the team short name "   " is made
      Then it is refused for breaking "TeamShortName.Missing"

    Scenario: A short name of 10 characters with spaces around it is accepted
      When a team short name of 10 characters with spaces around it is made
      Then it is not refused
