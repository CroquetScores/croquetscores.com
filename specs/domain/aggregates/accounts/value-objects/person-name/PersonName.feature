Feature: The name an account is known by

  An account has a name: what the reader is called when the site speaks to
  them, and what the people running a tournament see beside their scores. It
  is between 3 and 254 characters, counted as a reader counts them — an
  accented letter, or a letter with a mark added, is one character however it
  was typed — so that a name is not refused or let through for how its
  keyboard spelled it.

  Whitespace at either end of a name is taken off before anything is asked of
  it, and the name is kept without it, so that its length is the length of
  the name and not of the spaces typed around it. A name that is nothing but
  whitespace is missing.

  Nothing else is asked of a name. People's names are not a shape that rules
  can be written for, and every rule written for them turns somebody away.

  Rule: A name is between 3 and 254 characters

    Scenario Outline: A name of an allowed length is accepted
      When a name of <length> characters is made
      Then it is not refused

      Examples:
        | length |
        | 3      |
        | 254    |

    Scenario: A name shorter than 3 characters is refused
      When a name of 2 characters is made
      Then it is refused for breaking "PersonName.TooShort"

    Scenario: A name longer than 254 characters is refused
      When a name of 255 characters is made
      Then it is refused for breaking "PersonName.TooLong"

    Scenario: No name at all is refused
      When the name "" is made
      Then it is refused for breaking "PersonName.Missing"

  Rule: A character is counted as a reader counts it

    Scenario: A letter with its accent typed after it counts as one character
      When the name "Zö" is made with its accent typed after the letter
      Then it is refused for breaking "PersonName.TooShort"

    Scenario: A name of 254 letters, each with its accent typed after it, is accepted
      When a name of 254 accented letters is made with each accent typed after its letter
      Then it is not refused

    Scenario: Names that are anything but Latin letters are accepted
      When the name "李小龍" is made
      Then it is not refused

  Rule: Whitespace at either end is taken off first

    Scenario: A name with spaces around it is kept without them
      Given the name "  Sam Someone  " is made
      Then the name is written "Sam Someone"

    Scenario: The spaces around a name do not count toward its length
      When the name "  Sa  " is made
      Then it is refused for breaking "PersonName.TooShort"

    Scenario: A name that is nothing but whitespace is missing
      When the name "   " is made
      Then it is refused for breaking "PersonName.Missing"

    Scenario: A name of 254 characters with spaces around it is accepted
      When a name of 254 characters with spaces around it is made
      Then it is not refused
