Feature: The name a tournament is known by

  A tournament has a name: what a reader looks for to find it, such as
  "Spring Open". It is between 3 and 254 characters, counted as a reader
  counts them, as a person's name is. The fewest is 3 rather than a
  competition's 1 because a tournament is found among every tournament there
  is, not among a handful on one page, and a letter alone finds nothing.

  Whitespace at either end of a name is taken off before anything is asked of
  it, and the name is kept without it. A name that is nothing but whitespace
  is missing.

  A name is not written all in lower case or all in capitals. It is shown on
  every page of the tournament and in every list of tournaments, and one typed
  with the caps lock on, or with no capitals at all, looks like a mistake on
  every one of them. Whether a name is either is judged by its letters that
  have a case, so the digits and punctuation in it count for nothing, and a
  name written in a script with no capitals, such as Chinese, is neither.

  A tournament is found at an address made from its name
  (`tournament-address`), and a name with no letter or digit in it, such as
  "?????", makes none (`Slug.feature`), so it is refused as a name rather than
  left to fail where the tournament is created. A slug takes the accents off
  letters, so a name of nothing but accents makes none either, and is refused
  the same: what is asked is whether a slug can be made of the name, as the
  slug would make it.

  Two tournaments may be called the same thing, since the same tournament is
  played every year. What tells them apart is their address, and that is the
  tournament's to make, not the name's.

  Rule: A tournament name is between 3 and 254 characters

    Scenario Outline: A tournament name of an allowed length is accepted
      When a tournament name of <length> characters is made
      Then it is not refused

      Examples:
        | length |
        | 3      |
        | 254    |

    Scenario: A tournament name shorter than 3 characters is refused
      When a tournament name of 2 characters is made
      Then it is refused for breaking "TournamentName.TooShort"

    Scenario: A tournament name longer than 254 characters is refused
      When a tournament name of 255 characters is made
      Then it is refused for breaking "TournamentName.TooLong"

    Scenario: No tournament name at all is refused
      When the tournament name "" is made
      Then it is refused for breaking "TournamentName.Missing"

  Rule: A character is counted as a reader counts it

    Scenario: A tournament name of 3 letters, each with its accent typed after it, is accepted
      When a tournament name of 3 accented letters is made with each accent typed after its letter
      Then it is not refused

    Scenario: A tournament name of 254 letters, each with its accent typed after it, is accepted
      When a tournament name of 254 accented letters is made with each accent typed after its letter
      Then it is not refused

  Rule: Whitespace at either end is taken off first

    Scenario: A tournament name with spaces around it is kept without them
      When the tournament name "  Spring Open  " is made
      Then the tournament name is written "Spring Open"

    Scenario: A tournament name that is nothing but whitespace is missing
      When the tournament name "   " is made
      Then it is refused for breaking "TournamentName.Missing"

    Scenario: A tournament name of 2 characters with spaces around it is too short
      When the tournament name "  Ab  " is made
      Then it is refused for breaking "TournamentName.TooShort"

  Rule: A tournament name is not all in lower case or all in capitals

    Scenario Outline: A name with both capitals and lower case is accepted
      When the tournament name "<name>" is made
      Then it is not refused

      Examples:
        | name              |
        | Spring Open       |
        | NZ Open           |
        | Spring Open 2026  |
        | Ōtaki Invitation  |

    Scenario Outline: A name all in lower case is refused
      When the tournament name "<name>" is made
      Then it is refused for breaking "TournamentName.AllLowerCase"

      Examples:
        | name             |
        | spring open      |
        | spring open 2026 |
        | ōtaki open       |

    Scenario Outline: A name all in capitals is refused
      When the tournament name "<name>" is made
      Then it is refused for breaking "TournamentName.AllCapitals"

      Examples:
        | name             |
        | SPRING OPEN      |
        | SPRING OPEN 2026 |
        | ŌTAKI OPEN       |

    Scenario Outline: A name with no letter that has a case is accepted
      When the tournament name "<name>" is made
      Then it is not refused

      Examples:
        | name     |
        | 李小龍杯 |
        | 2026     |

  Rule: A tournament name has a letter or a digit in it

    Scenario Outline: A name with neither a letter nor a digit is refused
      When the tournament name "<name>" is made
      Then it is refused for breaking "TournamentName.NoLetterOrDigit"

      Examples:
        | name  |
        | ????? |
        | ———   |
        | 🏆🏆🏆 |
        | ͺͺͺ   |

    Scenario Outline: A name with a letter or a digit is accepted
      When the tournament name "<name>" is made
      Then it is not refused

      Examples:
        | name   |
        | ?? 1   |
        | 🏆 Cup |
        | 李小龍 |
