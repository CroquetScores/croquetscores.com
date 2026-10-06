Feature: Counting characters as a reader counts them

  A name, a password or a tournament's subtitle is held to a length, and the
  length is counted in characters as whoever typed it sees them, not in the
  code points a computer keeps them as. A letter with its accent typed after
  it is two code points and one character; a flag, or a thumb with a skin
  tone, is several and one. Counted any other way, what somebody typed would
  be refused, or let through, for how their keyboard spelled it rather than
  for what they wrote.

  It is counted one way everywhere, so that a rule on one thing's length and
  a rule on another's mean the same by a character.

  Rule: Each character counts once, however it is kept

    Scenario Outline: Characters counted in text
      When the characters in "<text>" are counted
      Then there are <count> characters

      Examples:
        | text | count |
        | Ann  | 3     |
        | Zoë  | 3     |
        | 👍🏽   | 1     |
        | 🇳🇿   | 1     |
        | 李小龍  | 3     |

    Scenario: A letter with its accent typed after it counts once
      When the characters in "Zoë" with its accent typed after the letter are counted
      Then there are 3 characters

    Scenario: Nothing has no characters
      When the characters in "" are counted
      Then there are 0 characters
