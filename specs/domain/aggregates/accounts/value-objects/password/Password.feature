Feature: What a password must be, before it is hashed

  A password is held only long enough to be checked and hashed: it is never
  kept, logged or handed back, and nothing here writes it anywhere.

  What is asked of it follows NIST's advice, with a longer minimum: at least 12
  characters, counted as a reader counts them, and no rules about which kinds
  of character it must have, since those make passwords harder to remember
  without making them harder to guess. Whether it is among the passwords known
  to have been breached is asked of an outside service, and so is not the
  password's own rule: it is asked where the password is used, and specified
  there.

  Whitespace at either end of a password is taken off before any of this, and
  the password is kept without it, whatever typed it: every form trims it as
  it is typed as well, and the password trims it again, so that a password
  reaching here any other way is treated the same. So a password that begins
  or ends with a space loses it, which leaves an account imported from the
  old site, whose password did, to set a new one; that is specified with the
  register page. A password that is nothing but whitespace is missing.

  Rule: A password is at least 12 characters

    Scenario: A password of 12 characters is accepted
      When a password of 12 characters is made
      Then it is not refused

    Scenario: A password of 11 characters is refused
      When a password of 11 characters is made
      Then it is refused for breaking "Password.TooShort"

    Scenario: A letter with its accent typed after it counts as one character
      When a password of 11 accented letters is made with each accent typed after its letter
      Then it is refused for breaking "Password.TooShort"

    Scenario: No password at all is refused
      When the password "" is made
      Then it is refused for breaking "Password.Missing"

  Rule: Nothing is asked of which kinds of character it has

    Scenario: A password of nothing but lower-case letters is accepted
      When the password "correcthorsebattery" is made
      Then it is not refused

  Rule: A password gives nothing of itself away

    Scenario: A password written out does not show itself
      Given the password "correct horse battery staple" is made
      When it is written out
      Then what is written does not contain "correct horse battery staple"

  Rule: Whitespace at either end is taken off first

    Scenario: A password with spaces around it is kept without them
      Given the password "  correct horse battery staple  " is made
      Then its words are "correct horse battery staple"

    Scenario: The spaces around a password do not count toward its length
      When the password "  eleven char  " is made
      Then it is refused for breaking "Password.TooShort"

    Scenario: A password that is nothing but whitespace is missing
      When the password "              " is made
      Then it is refused for breaking "Password.Missing"
