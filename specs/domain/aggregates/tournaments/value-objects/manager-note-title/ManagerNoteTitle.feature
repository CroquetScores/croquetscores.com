Feature: What a manager's note is called

  A note a tournament's managers write has a title, as an issue on GitHub
  has: what a reader sees of it in the tournament's list of notes, and the
  heading it is read under. It is plain text, kept as it was typed, HTML and
  Markdown among it if any was typed; wherever it is shown it is shown as the
  characters it is.

  A title is between 1 and 100 characters, counted as a reader counts them,
  as a commentary's title is (`CommentaryTitle.feature`), so that it fits a
  line of the list on a phone. Unlike a commentary's, a note's title makes
  no slug: a note is found by its id, so a title with no letter or digit in
  it, as "???", is a title like any other.

  Whitespace at either end is taken off, and the title kept without it, so
  that a title of nothing but spaces is missing.

  Rule: A title is kept as it was typed

    Scenario: A title is kept as it was written
      When the manager note title "Lunch is at noon" is made
      Then the manager note title is written "Lunch is at noon"

    Scenario: HTML in a title is kept as the characters it is
      When the manager note title "Lunch <b>moved</b>" is made
      Then the manager note title is written "Lunch <b>moved</b>"

    Scenario: A title with no letter or digit is kept
      When the manager note title "???" is made
      Then the manager note title is written "???"

  Rule: A title is between 1 and 100 characters

    Scenario Outline: A title of an allowed length is accepted
      When a manager note title of <length> characters is made
      Then it is not refused

      Examples:
        | length |
        | 1      |
        | 100    |

    Scenario: A title longer than 100 characters is refused
      When a manager note title of 101 characters is made
      Then it is refused for breaking "ManagerNoteTitle.TooLong"

    Scenario: No title at all is refused
      When the manager note title "" is made
      Then it is refused for breaking "ManagerNoteTitle.Missing"

  Rule: Characters are counted as a reader counts them

    Scenario: A title of 100 letters, each with its accent typed after it, is accepted
      When a manager note title of 100 accented letters is made with each accent typed after its letter
      Then it is not refused

  Rule: Whitespace at either end is not part of the title

    Scenario: A title with spaces around it is kept without them
      When the manager note title "  Lunch is at noon  " is made
      Then the manager note title is written "Lunch is at noon"

    Scenario: A title of 100 characters with spaces around it is accepted
      When a manager note title of 100 characters with spaces around it is made
      Then it is not refused

    Scenario: A title that is nothing but whitespace is missing
      When the manager note title "   " is made
      Then it is refused for breaking "ManagerNoteTitle.Missing"
