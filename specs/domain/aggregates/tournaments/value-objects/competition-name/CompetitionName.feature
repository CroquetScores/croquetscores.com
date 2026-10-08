Feature: The name a competition is known by

  A competition has a name: what the players look for on the tournament's page
  to find their games. It is between 1 and 254 characters, counted as a reader
  counts them, as a person's name is. The fewest is 1 rather than a person's 3
  because a block is often called by a letter alone, and "A" is a whole name
  for one.

  Whitespace at either end of a name is taken off before anything is asked of
  it, and the name is kept without it. A name that is nothing but whitespace
  is missing.

  A competition is found at a slug made from its name (`addBlock.feature`),
  and a name with no letter or digit in it, such as "???", makes no slug
  (`Slug.feature`), so it is refused as a name rather than left to fail where
  the competition is added. A slug takes the accents off letters, so a name of
  nothing but an accent makes none either, and is refused the same: what is
  asked is whether a slug can be made of the name, as the slug would make it.

  Two competitions in the same tournament called the same thing could not be
  told apart, but a name does not know which tournament it is in, so that is
  the tournament's to refuse and not the name's.

  Rule: A competition name is between 1 and 254 characters

    Scenario Outline: A competition name of an allowed length is accepted
      When a competition name of <length> characters is made
      Then it is not refused

      Examples:
        | length |
        | 1      |
        | 254    |

    Scenario: A competition name longer than 254 characters is refused
      When a competition name of 255 characters is made
      Then it is refused for breaking "CompetitionName.TooLong"

    Scenario: No competition name at all is refused
      When the competition name "" is made
      Then it is refused for breaking "CompetitionName.Missing"

  Rule: A competition name has a letter or a digit in it

    Scenario Outline: A name with neither a letter nor a digit is refused
      When the competition name "<name>" is made
      Then it is refused for breaking "CompetitionName.NoLetterOrDigit"

      Examples:
        | name |
        | ???  |
        | —    |
        | 🏆   |
        | ͺ    |

    Scenario Outline: A name with a letter or a digit is accepted
      When the competition name "<name>" is made
      Then it is not refused

      Examples:
        | name    |
        | A       |
        | 1       |
        | Block 1 |
        | 李      |

  Rule: A character is counted as a reader counts it

    Scenario: A competition name of 254 letters, each with its accent typed after it, is accepted
      When a competition name of 254 accented letters is made with each accent typed after its letter
      Then it is not refused

  Rule: Whitespace at either end is taken off first

    Scenario: A competition name with spaces around it is kept without them
      When the competition name "  Block A  " is made
      Then the competition name is written "Block A"

    Scenario: A competition name that is nothing but whitespace is missing
      When the competition name "   " is made
      Then it is refused for breaking "CompetitionName.Missing"

    Scenario: A competition name of 254 characters with spaces around it is accepted
      When a competition name of 254 characters with spaces around it is made
      Then it is not refused
