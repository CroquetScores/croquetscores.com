Feature: The subtitle a tournament has

  A tournament can have a subtitle: whatever its organisers want a reader to
  know that has no field of its own, such as where to park or when lunch is.
  A subtitle is written in Markdown, so that an organiser can make a list or a
  link or put a word in bold without anything more than the keyboard.

  A subtitle is shown on a page, and a page shows HTML as HTML, so a subtitle
  is kept with every piece of HTML taken out. Taking it out when the subtitle
  is made, rather than when it is shown, means no page can forget to, and
  nothing kept is ever something a page must not show. A tag is taken out and
  what it held is kept, so "<b>early</b>" leaves "early": the organiser meant
  the word. A script or a style is taken out with what it holds, since what it
  holds was never meant to be read. A comment is taken out whole, and so is a
  declaration such as "<!DOCTYPE html>". A comment, a declaration or a tag
  left open, with nothing to end it, is taken out with everything after it: a
  Markdown page can pass one through as it stands, and a browser would then
  read whatever the page puts after the subtitle as the rest of it.

  Taking out one piece of HTML can bring two halves of another together, as
  "<<b></b>script>" does, so taking out goes on until there is nothing left to
  take. A subtitle with any HTML left in it would be worse than none.

  Markdown is kept exactly as it was written, because it is what the subtitle
  is written in. That includes a link or an email address written between
  angle brackets, such as "<https://example.com>" or "<entries@example.com>":
  each looks like a tag, and is Markdown's own way of writing a link. What
  begins a tag is what a browser takes to begin one, a "<" or "</" followed by
  a letter, so anything else that begins that way is a tag, whatever its name
  holds: "<x!y onmouseover=...>" is one to a browser, and its attributes would
  count. A "<" that begins no tag, as in "a < b" or "x<3", is text, and is
  kept.

  The one thing Markdown can say that a page must not show is a link that runs
  a script when it is followed, such as "[the draw](javascript:alert(1))". So
  "javascript:" is taken out wherever it is written, in a link or out of one,
  and the link is left pointing nowhere that runs anything. "vbscript:" is
  taken out in the same way: only old browsers run it, and nothing is lost by
  not finding out which ones still do. Each is taken out however a browser
  would still read it: in capitals, with whitespace between its letters, with
  its colon escaped by a backslash as Markdown lets any punctuation be, or
  with its letters written as character references, such as "&#106;". Like
  HTML, they are taken out until there are none left, since taking out one can
  bring the halves of another together. The cost is that a subtitle naming
  either in passing loses the word; a tournament's subtitle has little reason
  to.

  A subtitle is at most 2000 characters, counted as a reader counts them, so
  that an accented letter is one character however it was typed. The subtitle
  is measured as it was given, less the whitespace at either end, and before
  anything is taken out of it. So HTML counts toward the 2000, and a subtitle
  too long is refused without first being cleaned up, which is the slow part
  and would be slowest for exactly the subtitles that are then refused.

  Whitespace at either end is taken off, and the lines in between are kept as
  they were written, since Markdown reads meaning into them. A subtitle is
  optional, so a subtitle that is nothing once its HTML and the whitespace
  around it are gone is no subtitle at all, rather than refused.

  Rule: Markdown is kept as it was written

    Scenario: A subtitle in Markdown is kept as it was written
      When the subtitle "Parking is **behind** the clubhouse." is made
      Then the subtitle is "Parking is **behind** the clubhouse."

    Scenario: A link between angle brackets is Markdown, and is kept
      When the subtitle "See <https://example.com> for the draw." is made
      Then the subtitle is "See <https://example.com> for the draw."

    Scenario: An email address between angle brackets is Markdown, and is kept
      When the subtitle "Write to <entries@example.com> to enter." is made
      Then the subtitle is "Write to <entries@example.com> to enter."

    Scenario: A less-than sign that begins no tag is kept
      When the subtitle "Handicaps < 2 play on lawn 1." is made
      Then the subtitle is "Handicaps < 2 play on lawn 1."

    Scenario: A less-than sign followed by a digit begins no tag, and is kept
      When the subtitle "Handicaps<3 play on lawn 1." is made
      Then the subtitle is "Handicaps<3 play on lawn 1."

    Scenario: The lines of a subtitle are kept as they were written
      When the subtitle is made from:
        """
        Bring:

        - a hat
        - sunscreen
        """
      Then the subtitle reads:
        """
        Bring:

        - a hat
        - sunscreen
        """

  Rule: Every piece of HTML is taken out

    Scenario: A tag is taken out, and what it held is kept
      When the subtitle "Play starts <b>early</b>." is made
      Then the subtitle is "Play starts early."

    Scenario: A tag with attributes is taken out
      When the subtitle 'See <a href="https://example.com">the draw</a>.' is made
      Then the subtitle is "See the draw."

    Scenario: A tag that closes itself is taken out
      When the subtitle "Lunch<br/>at noon." is made
      Then the subtitle is "Lunchat noon."

    Scenario: A tag whose name holds more than letters and digits is taken out
      When the subtitle "Welcome.<x!y onmouseover=alert(1)>hover me" is made
      Then the subtitle is "Welcome.hover me"

    Scenario: A tag whose name holds a quotation mark is taken out
      When the subtitle 'Welcome.<x"y onmouseover=alert(1)>hover me' is made
      Then the subtitle is "Welcome.hover me"

    Scenario: A link between angle brackets with anything after its address is a tag, and is taken out
      When the subtitle "Welcome.<https://example.com onmouseover=alert(1)>hover me" is made
      Then the subtitle is "Welcome.hover me"

    Scenario: A tag in capitals is taken out
      When the subtitle "Play starts <B>early</B>." is made
      Then the subtitle is "Play starts early."

    Scenario: A script is taken out with what it holds
      When the subtitle "Welcome.<script>alert(1)</script>" is made
      Then the subtitle is "Welcome."

    Scenario: A style is taken out with what it holds
      When the subtitle "Welcome.<style>body { display: none }</style>" is made
      Then the subtitle is "Welcome."

    Scenario: A comment is taken out whole
      When the subtitle "Welcome.<!-- not for readers -->" is made
      Then the subtitle is "Welcome."

    Scenario: A comment is taken out whole, even when it holds a greater-than sign
      When the subtitle "Welcome.<!-- lawn 1 > lawn 2 -->" is made
      Then the subtitle is "Welcome."

    Scenario: A comment that closes as soon as it opens takes nothing after it
      When the subtitle "Welcome.<!-->Lunch at noon." is made
      Then the subtitle is "Welcome.Lunch at noon."

    Scenario: A comment left open is taken out with everything after it
      When the subtitle "Welcome.<!-- not for readers" is made
      Then the subtitle is "Welcome."

    Scenario: A tag left open is taken out with everything after it
      When the subtitle "Welcome.<div onmouseover=alert(1) title=lunch" is made
      Then the subtitle is "Welcome."

    Scenario: A declaration is taken out whole
      When the subtitle "<!DOCTYPE html>Welcome." is made
      Then the subtitle is "Welcome."

    Scenario: A declaration left open is taken out with everything after it
      When the subtitle "Welcome.<!DOCTYPE html" is made
      Then the subtitle is "Welcome."

    Scenario: HTML that taking out other HTML brings together is taken out too
      When the subtitle "Welcome.<<b></b>script>alert(1)</script>" is made
      Then the subtitle is "Welcome."

  Rule: A link that runs a script is taken out

    Scenario: A link to a script is left pointing at nothing that runs
      When the subtitle "See [the draw](javascript:alert(1))." is made
      Then the subtitle is "See [the draw](alert(1))."

    Scenario: A link to a script between angle brackets is taken out, and what is left of it is a tag
      When the subtitle "See <javascript:alert(1)>." is made
      Then the subtitle is "See ."

    Scenario: A link to a script given by reference is taken out
      When the subtitle is made from:
        """
        See [the draw][1].

        [1]: javascript:alert(1)
        """
      Then the subtitle reads:
        """
        See [the draw][1].

        [1]: alert(1)
        """

    Scenario: A link to a Visual Basic script is taken out
      When the subtitle "See [the draw](vbscript:msgbox(1))." is made
      Then the subtitle is "See [the draw](msgbox(1))."

    Scenario: A link to a Visual Basic script in capitals is taken out
      When the subtitle "See [the draw](VBScript:msgbox(1))." is made
      Then the subtitle is "See [the draw](msgbox(1))."

    Scenario: A link to a script in capitals is taken out
      When the subtitle "See [the draw](JavaScript:alert(1))." is made
      Then the subtitle is "See [the draw](alert(1))."

    Scenario: A link to a script with whitespace between its letters is taken out
      When the subtitle "See [the draw](java script:alert(1))." is made
      Then the subtitle is "See [the draw](alert(1))."

    Scenario: A link to a script with its letters written as character references is taken out
      When the subtitle "See [the draw](&#106;ava&#x73;cript&colon;alert(1))." is made
      Then the subtitle is "See [the draw](alert(1))."

    Scenario: A link to a script with its colon escaped is taken out
      When the subtitle "See [the draw](javascript\:alert(1))." is made
      Then the subtitle is "See [the draw](alert(1))."

    Scenario: A link to a script that taking out another brings together is taken out too
      When the subtitle "See [the draw](javajavascript:script:alert(1))." is made
      Then the subtitle is "See [the draw](alert(1))."

    Scenario: A link to a script that taking out HTML brings together is taken out too
      When the subtitle "See [the draw](java<b></b>script:alert(1))." is made
      Then the subtitle is "See [the draw](alert(1))."

    Scenario: A link to anywhere else is kept
      When the subtitle "See [the draw](https://example.com/draw)." is made
      Then the subtitle is "See [the draw](https://example.com/draw)."

  Rule: A subtitle is at most 2000 characters

    Scenario: A subtitle of 2000 characters is accepted
      When a subtitle of 2000 characters is made
      Then it is not refused

    Scenario: A subtitle of more than 2000 characters is refused
      When a subtitle of 2001 characters is made
      Then it is refused for breaking "TournamentSubtitle.TooLong"

    Scenario: A subtitle of 2000 accented letters, each with its accent typed after it, is accepted
      When a subtitle of 2000 accented letters is made with each accent typed after its letter
      Then it is not refused

    Scenario: The spaces around a subtitle do not count toward its length
      When a subtitle of 2000 characters with spaces around it is made
      Then it is not refused

    Scenario: HTML counts toward the length of a subtitle
      When a subtitle of 1995 characters followed by "<b></b>" is made
      Then it is refused for breaking "TournamentSubtitle.TooLong"

  Rule: Whitespace at either end is taken off

    Scenario: A subtitle with spaces around it is kept without them
      When the subtitle "  Bring a hat.  " is made
      Then the subtitle is "Bring a hat."

    Scenario: Whitespace left at an end once HTML is taken out is taken off
      When the subtitle "Bring a hat. <b></b>" is made
      Then the subtitle is "Bring a hat."

  Rule: A subtitle that is nothing is no subtitle

    Scenario: No subtitle at all is no subtitle
      When the subtitle "" is made
      Then there is no subtitle

    Scenario: A subtitle that is nothing but whitespace is no subtitle
      When the subtitle "   " is made
      Then there is no subtitle

    Scenario: A subtitle that is nothing but HTML is no subtitle
      When the subtitle "<script>alert(1)</script>" is made
      Then there is no subtitle
