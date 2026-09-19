Feature: An email address an account can be reached at

  An account is reached at its email address, and is found by it: registering
  asks whether an address already has an account, and asking for a way back in
  asks which account an address belongs to. So an address is checked when it
  is given, and is held in the one form it is compared in.

  Whitespace at either end of an address is taken off before anything is
  asked of it, and the address is kept without it. A space typed or pasted
  around an address is nobody's meaning, and an address refused for one, or
  kept with one, would be a different address from the one its reader meant.
  So an address that is nothing but whitespace is missing, and a space is
  only refused where it stays: inside the address.

  An address is checked by what it must have, rather than by a regular
  expression: one @, something before it, and after it a domain of at least
  two parts, none of them empty, with no spaces within it, and no longer than
  mail systems will carry: 254 bytes, as they count it, written as UTF-8. That
  is 254 characters of plain letters and digits, and fewer of anything else,
  since an accented letter takes two bytes or more; an address counted in
  characters could pass here and be refused by every mail server it was sent
  to, and the email confirming it would never arrive. It is not proved to
  exist — only an email that arrives does that — and an address that passes
  here may still be nobody's.

  Two addresses that differ only in case are the same address. Mail systems
  treat them so in practice, and a reader who registers as Someone@Example.com
  and signs in as someone@example.com is the same reader. So is one who types
  an accented letter as one character on one keyboard and as a letter with
  its accent after it on another: the two are the same letter written two
  ways, and the address is the same address. So an address is compared, and
  found, in lower case and in one way of writing each letter, and the form it
  was given in is kept for writing to it.

  Rule: An address is checked by what it must have

    Scenario Outline: An address that is well made is accepted
      When the email address "<address>" is made
      Then it is not refused

      Examples:
        | address                         |
        | someone@example.com             |
        | some.one+tag@mail.example.co.uk |
        | Someone@Example.com             |

    Scenario Outline: An address that is not is refused
      When the email address "<address>" is made
      Then it is refused for breaking "<code>"

      Examples:
        | address               | code                         |
        |                       | EmailAddress.Missing         |
        | someone.example.com   | EmailAddress.NoAt            |
        | some@one@example.com  | EmailAddress.MoreThanOneAt   |
        | @example.com          | EmailAddress.NothingBeforeAt |
        | someone@              | EmailAddress.NoDomain        |
        | someone@example       | EmailAddress.NoDomain        |
        | someone@example.      | EmailAddress.NoDomain        |
        | someone@.example.com  | EmailAddress.NoDomain        |
        | someone@example..com  | EmailAddress.NoDomain        |
        | some one@example.com  | EmailAddress.HasSpaces       |

    Scenario: An address of 254 characters is accepted
      When an email address of 254 characters is made
      Then it is not refused

    Scenario: An address longer than 254 characters is refused
      When an email address of 255 characters is made
      Then it is refused for breaking "EmailAddress.TooLong"

    Scenario: An address of fewer than 254 characters but more than 254 bytes is refused
      When an email address of 200 accented letters before the @ is made
      Then it is refused for breaking "EmailAddress.TooLong"

    Scenario: An address of accented letters that fits in 254 bytes is accepted
      When an email address of 121 accented letters before the @ is made
      Then it is not refused

  Rule: Two addresses that differ only in case, or in how a letter was typed, are the same address

    Scenario: Addresses differing only in case are the same
      Given the email address "Someone@Example.com"
      When it is compared with "someone@example.com"
      Then they are the same address

    Scenario: Addresses differing only in how an accented letter was typed are the same
      Given the email address "josé@example.com" with its accent typed after the letter
      When it is compared with "josé@example.com"
      Then they are the same address

    Scenario: The address is written as it was given
      Given the email address "Someone@Example.com"
      Then it is written "Someone@Example.com"

  Rule: Whitespace at either end is taken off first

    Scenario: An address with spaces around it is accepted
      When the email address "  someone@example.com  " is made
      Then it is not refused

    Scenario: An address with spaces around it is kept without them
      Given the email address "  someone@example.com  "
      Then it is written "someone@example.com"

    Scenario: An address that is nothing but whitespace is missing
      When the email address "   " is made
      Then it is refused for breaking "EmailAddress.Missing"

    Scenario: An address of 254 characters with spaces around it is accepted
      When an email address of 254 characters with spaces around it is made
      Then it is not refused
