Feature: What a comment says

  A comment in a commentary is written in Markdown, so that a writer can make
  a word bold, start a list or link to a result without knowing anything of
  HTML. It is kept as it was typed, HTML and all. HTML is not Markdown here:
  a comment is drawn with HTML turned off (`commentary.feature`), so whatever
  HTML was typed in it is shown as the characters it is, and runs nothing,
  whoever reads it. Taking the tags out as a comment was kept was tried, and
  given up: telling a tag from words in angle brackets, and from a link
  written in Markdown as "<https://example.com>", as a browser would, was
  more than a comment needs and the source of fault after fault, and drawing
  with HTML turned off is what keeps a page safe, whatever is kept.

  A comment is between 1 and 10,000 characters, counted as a reader counts
  them. A comment is a few lines written on a phone at the side of a lawn,
  and 10,000 characters is several screens of them: enough for a long report
  of a day's play, and short of a page that has to be scrolled past to reach
  the next comment.

  Whitespace at either end is taken off, and the comment kept without it, so
  that a comment of nothing but spaces is missing. Whitespace within it is
  kept as it was written, since a line break or an indent can be Markdown.

  Rule: A comment is kept as it was typed, HTML and all

    Scenario: A comment in Markdown is kept as it was written
      When the comment "Sam is **two hoops** up" is made
      Then the comment is written "Sam is **two hoops** up"

    Scenario: HTML in a comment is kept as it was typed
      When the comment "Sam is <b>two hoops</b> up" is made
      Then the comment is written "Sam is <b>two hoops</b> up"

    Scenario: A script in a comment is kept as the characters it is
      When the comment "Well played<script>alert(1)</script>" is made
      Then the comment is written "Well played<script>alert(1)</script>"

    Scenario: A link written in Markdown between angle brackets is kept
      When the comment "See <https://example.com/draw>" is made
      Then the comment is written "See <https://example.com/draw>"

  Rule: A comment is between 1 and 10,000 characters

    Scenario Outline: A comment of an allowed length is accepted
      When a comment of <length> characters is made
      Then it is not refused

      Examples:
        | length |
        | 1      |
        | 10000  |

    Scenario: A comment longer than 10,000 characters is refused
      When a comment of 10001 characters is made
      Then it is refused for breaking "CommentText.TooLong"

    Scenario: No comment at all is refused
      When the comment "" is made
      Then it is refused for breaking "CommentText.Missing"

  Rule: Characters are counted as a reader counts them

    Scenario: A comment of 10,000 letters, each with its accent typed after it, is accepted
      When a comment of 10000 accented letters is made with each accent typed after its letter
      Then it is not refused

  Rule: Whitespace at either end is not part of the comment

    Scenario: A comment with spaces around it is kept without them
      When the comment "  Well played  " is made
      Then the comment is written "Well played"

    Scenario: A comment that is nothing but whitespace is missing
      When the comment "   " is made
      Then it is refused for breaking "CommentText.Missing"

    Scenario: A line break within a comment is kept
      When the comment "Day one:\n\n- Sam beat Alex" is made
      Then the comment is written "Day one:\n\n- Sam beat Alex"
