Feature: What a manager's note says

  A note a tournament's managers write has a description beneath its title,
  as an issue on GitHub has, written in Markdown, so that a manager can make
  a word bold, start a list or link to the draw without knowing anything of
  HTML. It is kept as it was typed, HTML and all, as a comment is
  (`CommentText.feature`), and for the same reason: a note is drawn with HTML
  turned off (`note.feature`), so HTML typed in it is shown as the characters
  it is and runs nothing, whoever reads it.

  A description is optional, as an issue's is: a title of "Play starts at
  9:30" may say all a note has to. A description of nothing is no
  description, rather than a mistake.

  A description is at most 750,000 characters, counted as a reader counts
  them. That is far more than a note of the day's news needs, and is meant
  to be: a manager may paste in the whole of a tournament's conditions of
  play, or its regulations, rather than be made to cut them down. The limit
  is there so that a note has an end, not to keep it short.

  Whitespace at either end is taken off, and the description kept without
  it, so that one of nothing but spaces is no description. Whitespace within
  it is kept as it was written, since a line break or an indent can be
  Markdown.

  Rule: A description is kept as it was typed, HTML and all

    Scenario: A description in Markdown is kept as it was written
      When the manager note description "Lunch is at **noon**" is made
      Then the manager note description is written "Lunch is at **noon**"

    Scenario: HTML in a description is kept as it was typed
      When the manager note description "Lunch is at <b>noon</b>" is made
      Then the manager note description is written "Lunch is at <b>noon</b>"

  Rule: A description is optional

    Scenario: No description at all is no description
      When the manager note description "" is made
      Then there is no manager note description

    Scenario: A description that is nothing but whitespace is no description
      When the manager note description "   " is made
      Then there is no manager note description

  Rule: A description is at most 750,000 characters

    Scenario: A description of 750,000 characters is accepted
      When a manager note description of 750000 characters is made
      Then it is not refused

    Scenario: A description longer than 750,000 characters is refused
      When a manager note description of 750001 characters is made
      Then it is refused for breaking "ManagerNoteDescription.TooLong"

  Rule: Characters are counted as a reader counts them

    Scenario: A description of 750,000 letters, each with its accent typed after it, is accepted
      When a manager note description of 750000 accented letters is made with each accent typed after its letter
      Then it is not refused

  Rule: Whitespace at either end is not part of the description

    Scenario: A description with spaces around it is kept without them
      When the manager note description "  Lunch is at noon  " is made
      Then the manager note description is written "Lunch is at noon"

    Scenario: A line break within a description is kept
      When the manager note description "Order of play:\n\n- Sam v Alex" is made
      Then the manager note description is written "Order of play:\n\n- Sam v Alex"
