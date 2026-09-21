@browser @postgres
Feature: A reader signs in with their email address and password

  The sign in page, /account/sign-in, asks for an email address and a
  password, and both are trimmed where they are typed, as they are when
  registering, so that a password registered without its stray space is
  signed in with it the same way.

  A reader who gives the right password for a confirmed account is signed in,
  and taken back to the page that sent them to sign in, or to the home page if
  none did. Only a page on this site is gone back to: an address that named
  another site would let a link to this sign in page send a reader anywhere,
  looking as though this site had sent them. So what is gone back to has to be
  a path, beginning with one slash and followed by neither another slash nor a
  backslash, which browsers read as a slash, and holding no control character
  anywhere in it, such as a tab or a line break, which browsers strip from an
  address before reading it, so that a slash, a tab and a slash would reach
  the browser as two slashes; anything else — another site's address, one
  beginning with two slashes, or a slash and a backslash, or a scheme such as
  javascript: — goes to the home page instead. What is left is judged by the
  one guard the site has for going back somewhere (`theme.feature`), which
  resolves it the way a browser would; the two rules above are this page's own,
  and are stricter, because a reader is sent here by a page of ours and
  anything that does not look like what those pages send was not sent by one.

  A wrong password and an address with no account are refused alike, with one
  message above the fields that does not say which it was, and what was typed
  of the email address is put back. Which accounts exist must not be found out
  from this page, and how long the answer takes is specified with signing in.

  An account whose email address is not yet confirmed has no password to be
  given, so it is refused like any other address nobody can sign in to: the
  password is asked for by confirming, not by registering
  (`ConfirmEmailAddress.feature`). A reader whose link never arrived asks for
  a new one from the new confirmation link page, with the link they hold.

  Where a reader is taken back to is said in the page's own address, as the
  scenarios below say it. What puts it there is each page that sends a reader
  here, and is specified with those pages as they are built.

  An attempt is counted as it is made rather than once it has failed, and
  forgotten again if it works. Counted afterwards, attempts sent all at once
  would every one of them count before any had been written down, each would
  find the address under its limit, and a limit of ten would stop nobody
  willing to send eleven at once — and checking a password, which is slow on
  purpose, is exactly how long that gap would be. Counting holds the address,
  and the address it came from, until the attempt is written: the two
  scenarios below say what is counted, and what is left when it works, but
  neither can show the holding, since the moment it guards cannot be made wide
  enough from a browser.

  Signing in is limited, so that the page cannot be used to guess passwords. An
  email address that has failed to sign in 10 times in an hour is held for the
  rest of that hour: whoever signs in to it is told to try again later, even
  with the right password, since a limit that let the right password through
  would stop nobody guessing. It is counted whether or not the address has an
  account, so that being held says nothing about it either, and it is counted
  as the address is found, trimmed and in lower case, so that writing it
  another way does not count afresh. The cost is that anybody can keep somebody
  else out of their account for an hour by failing to sign in to it; the forgot
  password page is untouched by it, and is the way in meanwhile. An IP address
  that has failed 30 times in an hour is told to try again later, whichever
  address it gives. Behind a proxy, the IP address is found as it is for the
  forgot password page.

  Nobody needs to be signed in, and none of it needs scripting.

  Each scenario has a database and an application of its own. What one
  scenario registers, and how often it has failed from this browser's IP
  address, must not be there for the next to find.

  Rule: The page needs no scripting

    Scenario: The sign in page does not send a reader without scripting away
      Given a viewport 1200 pixels wide
      When the sign in page is opened with scripting off
      Then the sign in page is shown

  Rule: The page asks for an email address and a password, and points elsewhere for the rest

    Scenario Outline: The page asks for each
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the dialog asks for <what>

      Examples:
        | what             |
        | an email address |
        | a password       |

    Scenario: The page links to the forgot password page
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the page links to the forgot password page

    Scenario: The page links to the register page
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the page links to the register page

  Rule: Every field is trimmed where it is typed, the password included

    Scenario: An email address typed with spaces around it signs in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open
      When the reader signs in as "  someone@example.com  " with the password "correct horse battery staple"
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: A password typed with spaces around it signs in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "  correct horse battery staple  "
      Then the reader is signed in to the account for "someone@example.com"

  Rule: The right password for a confirmed account signs the reader in

    Scenario: The right password signs the reader in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: An email address in another case signs in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open
      When the reader signs in as "Someone@Example.com" with the password "correct horse battery staple"
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: An account brought over from the old site signs in with its old password
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account brought over from the old site, with the password "correct horse battery staple"
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the reader is signed in to the account for "someone@example.com"

  Rule: Signing in goes back to the page that sent the reader, if it is on this site

    Scenario: A reader signing in with nowhere to go back to arrives at the home page
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the home page is shown

    Scenario: A reader sent to sign in is taken back once signed in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open, to go back to "/account/forget-account"
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the reader is taken to "/account/forget-account"

    Scenario Outline: A sign in page asked to go back anywhere but a path on this site sends the reader home
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open, to go back to "<where>"
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the home page is shown

      Examples:
        | where                      |
        | https://elsewhere.example/ |
        | //elsewhere.example/       |
        | /\\elsewhere.example/      |
        | \\\\elsewhere.example/     |
        | javascript:alert(1)        |
        | account/forget-account     |

    Scenario: A sign in page asked to go back to a path with a tab after its first slash sends the reader home
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open, to go back to a slash, a tab, and "/elsewhere.example/"
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the home page is shown

    Scenario: A sign in page asked to go back to a path with a line break after its first slash sends the reader home
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open, to go back to a slash, a line break, and "/elsewhere.example/"
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the home page is shown

    Scenario: A sign in page asked to go back to a path on this site with a tab in it sends the reader home
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open, to go back to "/account/forget-account", a tab, and "x"
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the home page is shown

  Rule: A wrong password and an unknown email address are refused alike

    Scenario: A wrong password is refused
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "not the right password"
      Then the dialog says the message for "SignIn.Failed"

    Scenario: An email address with no account is refused the same
      Given a viewport 1200 pixels wide
      And the sign in page is open
      When the reader signs in as "nobody@example.com" with the password "correct horse battery staple"
      Then the dialog says the message for "SignIn.Failed"

    Scenario: A refused reader is not signed in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "not the right password"
      Then the reader is signed out

    Scenario: What was typed is put back, except the password
      Given a viewport 1200 pixels wide
      And the sign in page is open
      When the reader signs in as "nobody@example.com" with the password "correct horse battery staple"
      Then the email address field holds "nobody@example.com"
      And the password field is empty

  Rule: Signing in is limited, by email address and by IP address, and the limit gives nothing away

    Scenario: An email address that has failed 10 times in an hour is told to try later
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And signing in as "someone@example.com" has failed 10 times in the last hour
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the reader is told to try again later

    Scenario: An email address held by the limit is not signed in with the right password
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And signing in as "someone@example.com" has failed 10 times in the last hour
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the reader is signed out

    Scenario: An email address written another way counts toward the same limit
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And signing in as "someone@example.com" has failed 10 times in the last hour
      And the sign in page is open
      When the reader signs in as "  SOMEONE@Example.com  " with the password "correct horse battery staple"
      Then the reader is told to try again later

    Scenario: An email address with no account is held the same
      Given a viewport 1200 pixels wide
      And signing in as "nobody@example.com" has failed 10 times in the last hour
      And the sign in page is open
      When the reader signs in as "nobody@example.com" with the password "correct horse battery staple"
      Then the reader is told to try again later

    Scenario: An hour later, an email address can sign in again
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And signing in as "someone@example.com" has failed 10 times in the last hour
      And an hour and a minute have passed
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: An attempt that fails is counted
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "not the right password"
      Then signing in as "someone@example.com" has been counted 1 time

    Scenario: Signing in that succeeds does not count toward the limit
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then signing in as "someone@example.com" has been counted 0 times

    Scenario: An IP address that has failed 30 times in an hour is told to try later
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And this IP address has failed to sign in 30 times in the last hour
      And the sign in page is open
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the reader is told to try again later

    Scenario: Another IP address is not held to this one's limit
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And this IP address has failed to sign in 30 times in the last hour
      And the sign in page is open from another IP address
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the reader is signed in to the account for "someone@example.com"

  Rule: The page is in the reader's language

    Scenario: Every word in the dialog is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the sign in page is opened
      Then every word in the dialog is in the test locale
