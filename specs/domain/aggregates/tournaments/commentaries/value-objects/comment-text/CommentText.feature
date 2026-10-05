Feature: What a comment says

  A comment in a commentary is written in Markdown, so that a writer can make
  a word bold, start a list or link to a result without knowing anything of
  HTML, and that is all a comment can be written in. HTML is not Markdown
  here: every tag in what was written is taken out before the comment is
  kept, and the words between tags are kept, so that a comment pasted from
  somewhere else keeps what it said and loses only how it was drawn there.
  A tag is one of HTML's own elements, opening or closing, as "<b>", "</p>"
  or "<img src=x>", or an HTML comment or declaration, as "<!-- -->". Angle
  brackets around anything else are not a tag, and are kept: a link written
  in Markdown as "<https://example.com/draw>", an email address as
  "<sam@example.com>", or words a writer put in brackets of that shape. A tag
  that breaks a line where it is drawn, as "<br>", "<p>" or "<li>" does, is
  taken out for a line break, so that words either side of it are not run
  together and paragraphs stay paragraphs in Markdown; any other is taken
  out for nothing, as "<b>" is. A tag left by taking out another typed inside
  it, as "<<b>script>" leaves "<script>", is taken out as well. The tags are
  taken out in one reading of what was typed, however they are nested, so
  that a comment of tags inside one another, typed to keep the site busy,
  costs no more to read than any comment of its length.
  A comment never carries HTML of its own into a page, whoever reads it, and
  it is taken out once, when the comment is made, rather than every time it
  is read, so what is kept is what is shown.

  What is left is between 1 and 10,000 characters, counted as a reader
  counts them. A comment is a few lines written on a phone at the side of a
  lawn, and 10,000 characters is several screens of them: enough for a long
  report of a day's play, and short of a page that has to be scrolled past
  to reach the next comment.

  Whitespace at either end is taken off, and the comment kept without it,
  after the tags are taken out, so that a comment that was nothing but tags
  and spaces is missing. Whitespace within it is kept as it was written,
  since a line break or an indent can be Markdown.

  Rule: Every HTML tag is taken out, and the words between them kept

    Scenario: A comment with no HTML in it is kept as it was written
      When the comment "Sam is **two hoops** up" is made
      Then the comment is written "Sam is **two hoops** up"

    Scenario: A tag is taken out and the words inside it kept
      When the comment "Sam is <b>two hoops</b> up" is made
      Then the comment is written "Sam is two hoops up"

    Scenario: A script is taken out as any tag is
      When the comment "Well played<script>alert(1)</script>" is made
      Then the comment is written "Well playedalert(1)"

    Scenario: A tag with attributes is taken out
      When the comment "<a href=\"https://example.com\" onclick=\"steal()\">Results</a>" is made
      Then the comment is written "Results"

    Scenario: A tag that is never closed is taken out
      When the comment "Lawn 3 <img src=x onerror=steal()> is slow" is made
      Then the comment is written "Lawn 3  is slow"

    Scenario: A link written in Markdown is kept
      When the comment "See [the draw](https://example.com/draw)" is made
      Then the comment is written "See [the draw](https://example.com/draw)"

    Scenario: A link written in Markdown between angle brackets is kept
      When the comment "See <https://example.com/draw>" is made
      Then the comment is written "See <https://example.com/draw>"

    Scenario: An email address between angle brackets is kept
      When the comment "Write to <sam@example.com>" is made
      Then the comment is written "Write to <sam@example.com>"

    Scenario: Words between angle brackets that are no HTML element are kept
      When the comment "Sam<Tim on lawn 3, score 7>5" is made
      Then the comment is written "Sam<Tim on lawn 3, score 7>5"

    Scenario: A line break written as a tag is kept as a line break
      When the comment "Hoop 1<br>Hoop 2" is made
      Then the comment is written "Hoop 1\nHoop 2"

    Scenario: Paragraphs written as tags are kept as paragraphs
      When the comment "<p>First</p><p>Second</p>" is made
      Then the comment is written "First\n\nSecond"

    Scenario: A tag left by taking out another inside it is taken out too
      When the comment "<<b>script>alert(1)" is made
      Then the comment is written "alert(1)"

    Scenario: A tag left by taking out a tag inside its name is taken out too
      When the comment "<scr<b>ipt>alert(1)" is made
      Then the comment is written "alert(1)"

    Scenario: Many tags typed inside one another are taken out within a second
      When a comment of 100000 tags typed inside one another is made
      Then it was made within a second

    Scenario: An HTML comment is taken out
      When the comment "Well played<!-- hidden -->" is made
      Then the comment is written "Well played"

    Scenario: A tag in capitals is taken out
      When the comment "Sam is <B>two hoops</B> up" is made
      Then the comment is written "Sam is two hoops up"

    Scenario: A less-than sign that begins no tag is kept
      When the comment "Sam needs < 3 hoops" is made
      Then the comment is written "Sam needs < 3 hoops"

  Rule: What is left is between 1 and 10,000 characters

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

    Scenario: A comment that was nothing but tags is missing
      When the comment "<p></p>" is made
      Then it is refused for breaking "CommentText.Missing"

    Scenario: Tags taken out do not count towards the length
      When a comment of 10000 characters wrapped in "<p>" is made
      Then it is not refused

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

    Scenario: A comment that is nothing but tags and whitespace is missing
      When the comment " <br> <br> " is made
      Then it is refused for breaking "CommentText.Missing"

    Scenario: A line break within a comment is kept
      When the comment "Day one:\n\n- Sam beat Alex" is made
      Then the comment is written "Day one:\n\n- Sam beat Alex"
