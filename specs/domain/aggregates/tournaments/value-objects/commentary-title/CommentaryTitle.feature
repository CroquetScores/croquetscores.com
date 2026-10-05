Feature: The title a commentary is known by

  A commentary is one writer's account of a tournament as it is played, and
  it has a title, as "Day one on the croquet lawns", which heads its page and
  is what a reader chooses it by from the tournament's list of them. A title
  is between 1 and 100 characters, counted as a reader counts them, as a
  team's name is (`TeamName.feature`). It is held to 100, as the old site
  held it, so that it fits a line of the list on a phone.

  A title is plain text, kept as it was typed. It is not written in
  Markdown, as a comment is (`CommentText.feature`), and HTML typed in it is
  kept too, as a comment's is: a title is drawn as the characters it is
  wherever it is shown, so "**Day one**" is shown with its asterisks rather
  than in bold, and "<b>Day one</b>" with its angle brackets
  (`commentary.feature`).

  Whitespace at either end of a title is taken off before anything else is
  asked of it, and the title is kept without it. A title that is nothing but
  whitespace is missing.

  A commentary is found at a slug made from its title
  (`startCommentary.feature`), and a title with no letter or digit in it,
  such as "???" or a trophy drawn as an emoji, makes no slug (`Slug.feature`),
  so it is refused as a title rather than left to fail where the commentary
  is started. A slug takes the accents off letters, so a title of nothing but
  an accent makes none either, and is refused the same: what is asked is
  whether a slug can be made of the title, as the slug would make it.

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

  Rule: A title is kept as it was typed, HTML and all

    Scenario: HTML in a title is kept as it was typed
      When the commentary title "Day <b>one</b>" is made
      Then the commentary title is written "Day <b>one</b>"

  Rule: A commentary title has a letter or a digit in it

    Scenario Outline: A title with neither a letter nor a digit is refused
      When the commentary title "<title>" is made
      Then it is refused for breaking "CommentaryTitle.NoLetterOrDigit"

      Examples:
        | title |
        | ???   |
        | —     |
        | 🏆    |
        | ͺ     |

    Scenario Outline: A title with a letter or a digit is accepted
      When the commentary title "<title>" is made
      Then it is not refused

      Examples:
        | title    |
        | 🏆 Day 1 |
        | 1        |
        | 李       |

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
