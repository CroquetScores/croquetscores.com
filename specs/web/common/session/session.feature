@browser @postgres
Feature: A reader stays signed in while they keep coming back

  Signing in starts a session: a cookie holding an id that means nothing by
  itself, and a row kept against the account with a hash of that id, so that
  whoever takes the table takes nothing a browser could send back. The cookie
  is `HttpOnly`, `Secure` and `SameSite=Lax`, for the reasons the theme's
  cookie is.

  A session lasts 90 days from when it was last used, and every use starts
  the 90 days again, so a reader who comes back at least once every three
  months is never asked to sign in again, and one who stops coming is signed
  out three months after their last visit. The cookie is given the same 90
  days each time it is sent, rather than only when the session starts, because
  a browser counts a cookie's life from when it was given it: one set only at
  signing in would be dropped three months later however often its reader came
  back. So it outlives closing the browser, and goes when the session does. There is no limit on how long a session used that often can
  last: making a reader sign in again every so often would ask for their
  password when nothing about them has changed. Its last use is written at
  most once an hour, rather than on every page, so that reading a page does
  not become a write to the database; the 90 days count from within an hour
  of the last visit.

  Every signing in starts a new session with a new id, and does not carry on
  one the browser already held. An id planted in a reader's browser before
  they signed in would otherwise be shared with whoever planted it.

  Signing out ends the session of the browser it is asked from, and no other:
  the reader stays signed in on every other device they use. Its row is
  deleted, not just its cookie, so a copy of the cookie taken beforehand stops
  working too. It is asked for by a form posted to /account/sign-out, not by
  a link, so that another site cannot sign a reader out by putting the link in
  an image: a post from another site is refused by the cross-site guard, and a
  link followed from one is not.

  Two things end every session an account has, on every device. Setting a new
  password by the forgot password page does, because a reader may be setting
  one since somebody else got in, and somebody else would otherwise stay in.
  And forgetting an account does, since the account can no longer be signed in
  to at all. Both are said here because they are what a session is for; each is
  specified with the page that does it, since neither can be asked for from
  here, and the scenarios for them are there.

  Each scenario has a database and an application of its own, and moves the
  clock as it needs. "Another browser" is a second browser with cookies of its
  own, standing in for another device.

  Rule: Signing in starts a session that lasts 90 days from its last use

    Scenario: A reader signed in is still signed in on the next page
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the home page is opened
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: A session not used for 89 days is still signed in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And 89 days have passed
      When the home page is opened
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: A session not used for 91 days is signed out
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And 91 days have passed
      When the home page is opened
      Then the reader is signed out

    Scenario: Using a session starts its 90 days again
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And 60 days have passed
      And the home page is opened
      And 60 days have passed
      When the home page is opened
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: A session used often enough has no end
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the home page has been opened every 60 days for 400 days
      When the home page is opened
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: Coming back gives the cookie its 90 days again
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And 60 days have passed
      When the home page is asked for again
      Then the answer gives the session's cookie its 90 days again

    Scenario: The session's cookie outlives closing the browser
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the browser is closed and opened again
      And the home page is opened
      Then the reader is signed in to the account for "someone@example.com"

  Rule: What is kept of a session cannot be sent back as one

    Scenario: The session's id is not kept as it is
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then no row of the sessions table contains the session's id

  Rule: Every signing in starts a new session

    Scenario: Signing in does not carry on an id the browser already held
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the browser holds a session id it was given before signing in
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the browser's session id is not the one it held before

    Scenario: Signing in on two browsers starts two sessions
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the reader signs in on another browser as "someone@example.com" with the password "correct horse battery staple"
      Then the account for "someone@example.com" has 2 sessions

  Rule: Signing out ends this browser's session, and no other

    Scenario: Signing out signs the reader out
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the reader signs out
      Then the reader is signed out

    Scenario: Signing out leaves the reader signed in on another browser
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the reader has signed in on another browser as "someone@example.com" with the password "correct horse battery staple"
      When the reader signs out
      Then the reader is signed in on the other browser to the account for "someone@example.com"

    Scenario: A copy of the cookie taken before signing out no longer works
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And a copy of the session's cookie has been taken
      And the reader signs out
      When the home page is opened with the copy of the cookie
      Then the reader is signed out
