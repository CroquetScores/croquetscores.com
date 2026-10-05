Feature: The title a commentary is known by

  A commentary is one writer's account of a tournament as it is played, and
  it has a title, as "Day one on the croquet lawns", which heads its page and
  is what a reader chooses it by from the tournament's list of them. A title
  is between 1 and 100 characters, counted as a reader counts them, as a
  team's name is (`TeamName.feature`). It is held to 100, as the old site
  held it, so that it fits a line of the list on a phone.

  A title is plain text. It is not written in Markdown, as a comment is
  (`CommentText.feature`), and it carries no HTML: every tag in what was
  typed is taken out before the title is kept, and the words between tags
  are kept, as they are in a comment, and angle brackets around anything
  that is not one of HTML's own elements are kept as the characters they
  are (`CommentText.feature`). A title is one line, so a tag that would
  break a line, as "<br>", is a space in it. A title is drawn as the words it is,
  so "**Day one**" is shown with its asterisks rather than in bold
  (`commentary.feature`).

  Whitespace at either end of a title is taken off, after the tags are taken
  out, and before anything else is asked of it, and the title is kept
  without it. A title that is nothing but whitespace, or nothing but tags,
  is missing. The tags taken out do not count towards its 100 characters.

  A commentary is found at a slug made from its title
  (`startCommentary.feature`), and a title with no letter or digit in it,
  such as "???" or a trophy drawn as an emoji, makes no slug (`Slug.feature`),
  so it is refused as a title rather than left to fail where the commentary
  is started.

  Two commentaries in the same tournament with the same title could not be
  told apart in its list, but a title does not know which tournament it is
  in, so that is the tournament's to refuse and not the title's
  (`startCommentary.feature`).

  Rule: A commentary title is between 1 and 100 characters

    Scenario Outline: A commentary title of an allowed length is accepted
      When a commentary title of <length> characters is made
      Then it is not refused

      Examples:
        | length |
        | 1      |
        | 100    |

    Scenario: A commentary title longer than 100 characters is refused
      When a commentary title of 101 characters is made
      Then it is refused for breaking "CommentaryTitle.TooLong"

    Scenario: No commentary title at all is refused
      When the commentary title "" is made
      Then it is refused for breaking "CommentaryTitle.Missing"

  Rule: Every HTML tag is taken out, and the words between them kept

    Scenario: A tag is taken out and the words inside it kept
      When the commentary title "Day <b>one</b>" is made
      Then the commentary title is written "Day one"

    Scenario: A tag with attributes is taken out
      When the commentary title "<span onclick=\"steal()\">Day one</span>" is made
      Then the commentary title is written "Day one"

    Scenario: A tag that is never closed is taken out
      When the commentary title "Day one <img src=x onerror=steal()>" is made
      Then the commentary title is written "Day one"

    Scenario: A line break written as a tag is a space in a title
      When the commentary title "Day<br>One" is made
      Then the commentary title is written "Day One"

    Scenario: Words between angle brackets that are no HTML element are kept
      When the commentary title "Day one <morning>" is made
      Then the commentary title is written "Day one <morning>"

    Scenario: A less-than sign that begins no tag is kept
      When the commentary title "Lawn 3 < Lawn 4" is made
      Then the commentary title is written "Lawn 3 < Lawn 4"

    Scenario: A commentary title that was nothing but tags is missing
      When the commentary title "<b></b>" is made
      Then it is refused for breaking "CommentaryTitle.Missing"

    Scenario: Tags taken out do not count towards the length
      When a commentary title of 100 characters wrapped in "<b>" is made
      Then it is not refused

  Rule: A commentary title has a letter or a digit in it

    Scenario Outline: A title with neither a letter nor a digit is refused
      When the commentary title "<title>" is made
      Then it is refused for breaking "CommentaryTitle.NoLetterOrDigit"

      Examples:
        | title |
        | ???   |
        | —     |
        | 🏆    |

    Scenario Outline: A title with a letter or a digit is accepted
      When the commentary title "<title>" is made
      Then it is not refused

      Examples:
        | title    |
        | 🏆 Day 1 |
        | 1        |
        | 李       |

    Scenario: A title of nothing but tags is missing, not without a letter
      When the commentary title "<b></b>" is made
      Then it is refused for breaking "CommentaryTitle.Missing"

  Rule: Markdown in a title is kept as the characters it is

    Scenario: Markdown in a title is kept as it was typed
      When the commentary title "**Day one**" is made
      Then the commentary title is written "**Day one**"

  Rule: Characters are counted as a reader counts them

    Scenario: A commentary title of 100 letters, each with its accent typed after it, is accepted
      When a commentary title of 100 accented letters is made with each accent typed after its letter
      Then it is not refused

  Rule: Whitespace at either end is not part of the title

    Scenario: A commentary title with spaces around it is kept without them
      When the commentary title "  Day one  " is made
      Then the commentary title is written "Day one"

    Scenario: A commentary title that is nothing but whitespace is missing
      When the commentary title "   " is made
      Then it is refused for breaking "CommentaryTitle.Missing"

    Scenario: A commentary title of 100 characters with spaces around it is accepted
      When a commentary title of 100 characters with spaces around it is made
      Then it is not refused
