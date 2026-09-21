Feature: The notes a tournament has

  A tournament can have notes: whatever its organisers want a reader to know
  that has no field of its own, such as where to park or when lunch is. Notes
  are written in Markdown, so that an organiser can make a list or a link or
  put a word in bold without anything more than the keyboard.

  Notes are shown on a page, and a page shows HTML as HTML, so notes are kept
  with every piece of HTML taken out. Taking it out when the notes are made,
  rather than when they are shown, means no page can forget to, and nothing
  kept is ever something a page must not show. A tag is taken out and what it
  held is kept, so "<b>early</b>" leaves "early": the organiser meant the word.
  A script or a style is taken out with what it holds, since what it holds was
  never meant to be read. A comment is taken out whole, and so is a
  declaration such as "<!DOCTYPE html>". A comment, a declaration or a tag
  left open, with nothing to end it, is taken out with everything after it: a
  Markdown page can pass one through as it stands, and a browser would then
  read whatever the page puts after the notes as the rest of it.

  Taking out one piece of HTML can bring two halves of another together, as
  "<scr<b></b>ipt>" does, so taking out goes on until there is nothing left to
  take. Notes with any HTML left in them would be worse than none.

  Markdown is kept exactly as it was written, because it is what the notes are
  written in. That includes a link written between angle brackets, such as
  "<https://example.com>": it looks like a tag, and is Markdown's own way of
  writing a link. A "<" that begins no tag, as in "a < b", is text, and is
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
  bring the halves of another together. The cost is that notes naming either
  in passing lose the word; notes about a tournament have little reason to.

  Notes are at most 2000 characters, counted as a reader counts them, so that
  an accented letter is one character however it was typed. The notes are
  measured as they were given, less the whitespace at either end, and before
  anything is taken out of them. So HTML counts toward the 2000, and notes too
  long are refused without first being cleaned up, which is the slow part and
  would be slowest for exactly the notes that are then refused.

  Whitespace at either end is taken off, and the lines in between are kept as
  they were written, since Markdown reads meaning into them. Notes are
  optional, so notes that are nothing once their HTML and the whitespace
  around them are gone are no notes at all, rather than refused.

  Rule: Markdown is kept as it was written

    Scenario: Notes in Markdown are kept as they were written
      When the notes "Parking is **behind** the clubhouse." are made
      Then the notes are "Parking is **behind** the clubhouse."

    Scenario: A link between angle brackets is Markdown, and is kept
      When the notes "See <https://example.com> for the draw." are made
      Then the notes are "See <https://example.com> for the draw."

    Scenario: A less-than sign that begins no tag is kept
      When the notes "Handicaps < 2 play on lawn 1." are made
      Then the notes are "Handicaps < 2 play on lawn 1."

    Scenario: The lines of notes are kept as they were written
      When the notes are made from:
        """
        Bring:

        - a hat
        - sunscreen
        """
      Then the notes read:
        """
        Bring:

        - a hat
        - sunscreen
        """

  Rule: Every piece of HTML is taken out

    Scenario: A tag is taken out, and what it held is kept
      When the notes "Play starts <b>early</b>." are made
      Then the notes are "Play starts early."

    Scenario: A tag with attributes is taken out
      When the notes 'See <a href="https://example.com">the draw</a>.' are made
      Then the notes are "See the draw."

    Scenario: A tag that closes itself is taken out
      When the notes "Lunch<br/>at noon." are made
      Then the notes are "Lunchat noon."

    Scenario: A tag in capitals is taken out
      When the notes "Play starts <B>early</B>." are made
      Then the notes are "Play starts early."

    Scenario: A script is taken out with what it holds
      When the notes "Welcome.<script>alert(1)</script>" are made
      Then the notes are "Welcome."

    Scenario: A style is taken out with what it holds
      When the notes "Welcome.<style>body { display: none }</style>" are made
      Then the notes are "Welcome."

    Scenario: A comment is taken out whole
      When the notes "Welcome.<!-- not for readers -->" are made
      Then the notes are "Welcome."

    Scenario: A comment is taken out whole, even when it holds a greater-than sign
      When the notes "Welcome.<!-- lawn 1 > lawn 2 -->" are made
      Then the notes are "Welcome."

    Scenario: A comment that closes as soon as it opens takes nothing after it
      When the notes "Welcome.<!-->Lunch at noon." are made
      Then the notes are "Welcome.Lunch at noon."

    Scenario: A comment left open is taken out with everything after it
      When the notes "Welcome.<!-- not for readers" are made
      Then the notes are "Welcome."

    Scenario: A tag left open is taken out with everything after it
      When the notes "Welcome.<div onmouseover=alert(1) title=lunch" are made
      Then the notes are "Welcome."

    Scenario: A declaration is taken out whole
      When the notes "<!DOCTYPE html>Welcome." are made
      Then the notes are "Welcome."

    Scenario: A declaration left open is taken out with everything after it
      When the notes "Welcome.<!DOCTYPE html" are made
      Then the notes are "Welcome."

    Scenario: HTML that taking out other HTML brings together is taken out too
      When the notes "Welcome.<scr<b></b>ipt>alert(1)</script>" are made
      Then the notes are "Welcome."

  Rule: A link that runs a script is taken out

    Scenario: A link to a script is left pointing at nothing that runs
      When the notes "See [the draw](javascript:alert(1))." are made
      Then the notes are "See [the draw](alert(1))."

    Scenario: A link to a script between angle brackets is taken out
      When the notes "See <javascript:alert(1)>." are made
      Then the notes are "See <alert(1)>."

    Scenario: A link to a script given by reference is taken out
      When the notes are made from:
        """
        See [the draw][1].

        [1]: javascript:alert(1)
        """
      Then the notes read:
        """
        See [the draw][1].

        [1]: alert(1)
        """

    Scenario: A link to a Visual Basic script is taken out
      When the notes "See [the draw](vbscript:msgbox(1))." are made
      Then the notes are "See [the draw](msgbox(1))."

    Scenario: A link to a Visual Basic script in capitals is taken out
      When the notes "See [the draw](VBScript:msgbox(1))." are made
      Then the notes are "See [the draw](msgbox(1))."

    Scenario: A link to a script in capitals is taken out
      When the notes "See [the draw](JavaScript:alert(1))." are made
      Then the notes are "See [the draw](alert(1))."

    Scenario: A link to a script with whitespace between its letters is taken out
      When the notes "See [the draw](java script:alert(1))." are made
      Then the notes are "See [the draw](alert(1))."

    Scenario: A link to a script with its letters written as character references is taken out
      When the notes "See [the draw](&#106;ava&#x73;cript&colon;alert(1))." are made
      Then the notes are "See [the draw](alert(1))."

    Scenario: A link to a script with its colon escaped is taken out
      When the notes "See [the draw](javascript\:alert(1))." are made
      Then the notes are "See [the draw](alert(1))."

    Scenario: A link to a script that taking out another brings together is taken out too
      When the notes "See [the draw](javajavascript:script:alert(1))." are made
      Then the notes are "See [the draw](alert(1))."

    Scenario: A link to a script that taking out HTML brings together is taken out too
      When the notes "See [the draw](java<b></b>script:alert(1))." are made
      Then the notes are "See [the draw](alert(1))."

    Scenario: A link to anywhere else is kept
      When the notes "See [the draw](https://example.com/draw)." are made
      Then the notes are "See [the draw](https://example.com/draw)."

  Rule: Notes are at most 2000 characters

    Scenario: Notes of 2000 characters are accepted
      When notes of 2000 characters are made
      Then it is not refused

    Scenario: Notes of more than 2000 characters are refused
      When notes of 2001 characters are made
      Then it is refused for breaking "TournamentNotes.TooLong"

    Scenario: Notes of 2000 accented letters, each with its accent typed after it, are accepted
      When notes of 2000 accented letters are made with each accent typed after its letter
      Then it is not refused

    Scenario: The spaces around notes do not count toward their length
      When notes of 2000 characters with spaces around them are made
      Then it is not refused

    Scenario: HTML counts toward the length of notes
      When notes of 1995 characters followed by "<b></b>" are made
      Then it is refused for breaking "TournamentNotes.TooLong"

  Rule: Whitespace at either end is taken off

    Scenario: Notes with spaces around them are kept without them
      When the notes "  Bring a hat.  " are made
      Then the notes are "Bring a hat."

    Scenario: Whitespace left at an end once HTML is taken out is taken off
      When the notes "Bring a hat. <b></b>" are made
      Then the notes are "Bring a hat."

  Rule: Notes that are nothing are no notes

    Scenario: No notes at all are no notes
      When the notes "" are made
      Then there are no notes

    Scenario: Notes that are nothing but whitespace are no notes
      When the notes "   " are made
      Then there are no notes

    Scenario: Notes that are nothing but HTML are no notes
      When the notes "<script>alert(1)</script>" are made
      Then there are no notes
