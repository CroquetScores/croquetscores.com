@postgres
Feature: The site says so when it cannot reach its database

  Everything the site knows is in its database: the events, what is read from
  them, the sessions, the email queue. When it cannot be reached — it is
  restarting, the network between has gone, the connections have run out —
  there is nothing a page can honestly show, and nothing a reader or a program
  could have done differently.

  That is not the server being built wrongly (`errors.feature`), and it is not
  the reader's mistake. It is the site being unable to answer just now, and it
  is said as that, with `Database.Unreachable`: the reader is told the site is
  unavailable and to try again later, and a program is told the same by code,
  so that it can wait and ask again rather than give up or report a fault in
  what it sent.

  Only the database being gone is the database being unreachable. A call to
  another service that fails while a request holds its connection is that
  service failing, and a request that is merely waiting for a connection
  because every one is busy is the site being busy: neither is the reader told
  the database is down, nor the administrator emailed that it is.

  Nothing about the database is told to the reader. What went wrong, and where
  the database is, is for whoever reads the log.

  The administrator is emailed, but not through the email queue, which is in
  the database and so is down with it. The email goes straight to whatever
  sends email, and how long ago the administrator was last told is kept in
  the running site's own memory, since there is nowhere else to keep it. At
  most one is sent in each stretch of time the site is set to wait, 30
  minutes where nobody has said otherwise
  (`DATABASE_UNREACHABLE_EMAIL_INTERVAL_MINUTES`).

  Memory is a weaker place to count from than the database, and the
  difference is accepted. A site that is restarted forgets, so a restart in
  the middle of an outage may send one more; and where more than one copy of
  the site is running, each counts for itself and may send one. That is a few
  emails, and a count that needed the database could not be kept when it
  matters.

  Nothing stays unavailable. Each request asks for a connection afresh, so
  everything works again the moment the database answers, with nobody having
  to lift anything.

  These scenarios stand in for the database with one the scenario can take
  down and bring back, and use the same example routes as `errors.feature`.

  Background:
    Given the application is built with the site's own events and read models

  Rule: A page is answered as the site being unavailable, not as the server failing

    Scenario: A page asked for while the database is down says the site is unavailable
      Given the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the reader is told the site is unavailable

    Scenario: The page says to try again later
      Given the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the page says to try again later

    Scenario: The page does not say the server failed
      Given the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the page does not say the server failed

    Scenario: The page is still a page of the site
      Given the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the page has the site's heading
      And the page has a way back to the home page

    Scenario: Every word on the page is in the test locale
      Given the database cannot be reached
      And an example page that reads from the database
      And the reader's browser asks for "en-XA"
      When the example page is asked for
      Then every word on the page is in the test locale

  Rule: An API request is answered with the code, so that a program can wait and ask again

    Scenario: An API request asked while the database is down says it is unreachable
      Given the database cannot be reached
      And an example API route that reads from the database
      When the example API route is asked for
      Then the route answers that the site is unavailable
      And the answer says "Database.Unreachable"

    Scenario: The answer says when to ask again
      Given the database cannot be reached
      And an example API route that reads from the database
      When the example API route is asked for
      Then the answer says how long to wait before asking again

    Scenario: The answer does not say where the database is
      Given the database cannot be reached
      And an example API route that reads from the database
      When the example API route is asked for
      Then the answer does not name the database's address

  Rule: Writing is refused as readily as reading

    A command that cannot be recorded must not look as though it was. The
    reader is told it was not done, and what they sent is not kept anywhere
    the site could mistake for having been saved.

    Scenario: A command sent while the database is down is not accepted
      Given a validator registered for the example command
      And a handler registered for the example command
      And the database cannot be reached
      And an example API route that sends the example command for the range it is given
      And an example range
      And it starts at 1
      And it ends at 5
      When the example range is sent to the example route
      Then the route answers that the site is unavailable
      And the answer says "Database.Unreachable"

    Scenario: A page that was part way through writing when the database went is refused whole
      Given an example page that writes twice to the database
      And the database goes after the first write
      When the example page is asked for
      Then the reader is told the site is unavailable
      And nothing the page wrote is there when the database is back

  Rule: A reader whose session cannot be looked up is neither signed out nor told who they are

    Sessions are in the database, so the same outage that stops the page also
    stops the site finding out who is asking. That is not the same as nobody
    being signed in. The reader's cookie is a session that exists and cannot be
    read just now, and ending it would sign them out of an account they never
    left, which they would meet as having to sign in again when the site is
    back.

    So the cookie is left as it is, and the page claims nothing either way: it
    does not offer the ways in, which would tell a signed-in reader they are
    not, and it does not offer the account's own pages, which would tell a
    stranger they are somebody. Signing in is refused as unavailable like
    everything else, since there is nowhere to start a session.

    Scenario: A signed-in reader is told the site is unavailable
      Given "someone@example.com" has an account, confirmed
      And the reader is signed in as "someone@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the reader is told the site is unavailable

    Scenario: A signed-in reader's cookie is not taken away
      Given "someone@example.com" has an account, confirmed
      And the reader is signed in as "someone@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the answer does not take the session cookie away

    Scenario: A signed-in reader is still signed in when the database is back
      Given "someone@example.com" has an account, confirmed
      And the reader is signed in as "someone@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And the database can be reached again
      When the example page is asked for
      Then the reader is still signed in as "someone@example.com"

    Scenario: The page does not offer the ways in
      Given "someone@example.com" has an account, confirmed
      And the reader is signed in as "someone@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the account menu does not offer the ways in

    Scenario: The page does not offer the account's own pages
      Given "someone@example.com" has an account, confirmed
      And the reader is signed in as "someone@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the account menu does not offer the account's own pages

    Scenario: A reader with no session is told the same as one with a session
      Given the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the reader is told the site is unavailable

    Scenario: Signing in is refused as unavailable
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the database cannot be reached
      When "someone@example.com" signs in with the password "correct horse battery staple"
      Then the reader is told the site is unavailable

    Scenario: No session is started by a refused signing in
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the database cannot be reached
      And "someone@example.com" signs in with the password "correct horse battery staple"
      When the database can be reached again
      Then the reader is not signed in

  Rule: An unavailable answer is kept by nobody

    A reader who is told to try again later will try again later, and a cache
    that kept the answer would show them the same one after the database is
    back. It is the one answer here that is certain to be out of date.

    Scenario: An unavailable page is kept for the one reader only
      Given the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the answer is kept for the one reader only

    Scenario: An unavailable API answer is kept by nobody
      Given the database cannot be reached
      And an example API route that reads from the database
      When the example API route is asked for
      Then the answer is kept by nobody

  Rule: The administrator is emailed, and told at most once in the time the site is set to wait

    Where nothing is set, that is 30 minutes, and these scenarios say so.

    Scenario: The administrator is emailed
      Given the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then an email is sent to "administrator@example.com"

    Scenario: The email says the database could not be reached
      Given the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the email sent to "administrator@example.com" says the database cannot be reached

    Scenario: The email says when
      Given the server's clock reads "2026-09-19T10:00:00Z"
      And the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the email sent to "administrator@example.com" names the moment "2026-09-19T10:00:00Z"

    Scenario: The email does not go through the queue
      Given the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      When the database can be reached again
      Then nothing is queued to be sent

    Scenario: A page asked for twice in half an hour is emailed about once
      Given the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And 29 minutes have passed
      When the example page is asked for
      Then 1 email is sent to "administrator@example.com"

    Scenario: A page asked for again after half an hour is emailed about again
      Given the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And 31 minutes have passed
      When the example page is asked for
      Then 2 emails are sent to "administrator@example.com"

    Scenario: An API request and a page share the one count
      Given the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      And an example API route that reads from the database
      And the example page is asked for
      When the example API route is asked for
      Then 1 email is sent to "administrator@example.com"

    Scenario: Requests stamped a moment apart and out of order tell once
      Given the server's clock reads "2026-09-19T10:05:00Z"
      And the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And the server's clock reads "2026-09-19T10:00:00Z"
      When the example page is asked for
      Then 1 email is sent to "administrator@example.com"

    Scenario: A request stamped far ahead does not silence the site
      Given the server's clock reads "2026-09-20T10:00:00Z"
      And the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And the server's clock reads "2026-09-19T10:00:00Z"
      When the example page is asked for
      Then 2 emails are sent to "administrator@example.com"

    Scenario: A site restarted in the middle of an outage may tell the administrator again
      Given the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And the site is restarted
      When the example page is asked for
      Then 2 emails are sent to "administrator@example.com"

  Rule: How long the site waits is set in its configuration

    Someone running the site knows better than this file how often they can
    bear to be written to, and how long their outages tend to be. So it is
    theirs to set, in whole minutes, and the site takes nothing else for it. A
    blank setting is a setting nobody has filled in, and means the 30 minutes;
    it does not mean none.

    A value that is not a whole number of minutes, or is less than one, stops
    the site starting, rather than quietly meaning 30:
    somebody who wrote "5m" wanted five and ought to be told so. Every problem
    in the configuration is named at once, as for the other settings.

    Scenario: A blank setting waits 30 minutes
      Given the database unreachable email interval is blank
      And the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And 29 minutes have passed
      When the example page is asked for
      Then 1 email is sent to "administrator@example.com"

    Scenario: A shorter setting is waited out
      Given the database unreachable email interval is 5 minutes
      And the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And 6 minutes have passed
      When the example page is asked for
      Then 2 emails are sent to "administrator@example.com"

    Scenario: A shorter setting still holds within its own time
      Given the database unreachable email interval is 5 minutes
      And the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And 4 minutes have passed
      When the example page is asked for
      Then 1 email is sent to "administrator@example.com"

    Scenario: A longer setting is waited out
      Given the database unreachable email interval is 120 minutes
      And the site's administrator's email address is "administrator@example.com"
      And the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And 119 minutes have passed
      When the example page is asked for
      Then 1 email is sent to "administrator@example.com"

    Scenario Outline: A setting that is not a whole number of minutes stops the site starting
      Given the database unreachable email interval is "<setting>"
      When the configuration is loaded
      Then the configuration is refused
      And the configuration names the setting "DATABASE_UNREACHABLE_EMAIL_INTERVAL_MINUTES"

      Examples:
        | setting |
        | 0       |
        | -5      |
        | 2.5     |
        | 5m      |
        | soon    |

  Rule: The reader is answered without waiting for the administrator to be told

    A mail provider that is slow, or does not answer, must not be what the
    reader waits on while the site is already unable to do what they asked.

    Scenario: A page is answered while the email is still being sent
      Given the site's administrator's email address is "administrator@example.com"
      And emails are held up
      And the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the reader is told the site is unavailable

  Rule: A failure that only looks like the database is not told as the database

    Scenario: A call to another service that fails inside a request is still the server failing
      Given an example page that fails reaching another service while it holds the database
      When the example page is asked for
      Then the page says the server failed
      And the page does not say the site is unavailable

    Scenario: It is not told to the administrator as the database being down
      Given the site's administrator's email address is "administrator@example.com"
      And an example page that fails reaching another service while it holds the database
      When the example page is asked for
      Then no email is sent

  Rule: A failure to email the administrator is not the reader's to meet

    The email is the site's own affair, as ReportUnreachableService's is: the
    reader is owed the answer to what they asked, which is that it cannot be
    done just now. And a try that failed counts as a try. Otherwise a mail
    server that is down as well would be asked again by every request while
    the database is down, which is when the site can least afford it.

    Scenario: A page is still answered when the email cannot be sent
      Given the site's administrator's email address is "administrator@example.com"
      And emails cannot be sent
      And the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the reader is told the site is unavailable

    Scenario: The failure is logged
      Given the site's administrator's email address is "administrator@example.com"
      And emails cannot be sent
      And the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the log says "Database.Unreachable"

    Scenario: A try that failed is not tried again within half an hour
      Given the site's administrator's email address is "administrator@example.com"
      And emails cannot be sent
      And the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And emails can be sent again
      When the example page is asked for
      Then no email is sent

  Rule: The database being unreachable is logged

    Scenario: The database being unreachable is logged
      Given the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the log says "Database.Unreachable"

  Rule: The site works again the moment the database answers

    Scenario: A page asked for after the database is back is answered
      Given the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And the database can be reached again
      When the example page is asked for
      Then the example page is answered

    Scenario: An API request asked for after the database is back is answered
      Given the database cannot be reached
      And an example API route that reads from the database
      And the example API route is asked for
      And the database can be reached again
      When the example API route is asked for
      Then the route answers

    Scenario: The site does not need to be restarted
      Given the database cannot be reached
      And an example page that reads from the database
      And the example page is asked for
      And the example page is asked for
      And the database can be reached again
      When the example page is asked for
      Then the example page is answered

  Rule: A failure that is not the database is still the server failing

    The two must not be confused. Calling every failure "unavailable" would
    tell a reader to try again later about a fault that trying again will not
    mend, and would hide it from the administrator's own eye.

    Scenario: A request nobody handles is still the server failing while the database is up
      Given an example API route that sends the example command for the range it is given
      And an example range
      And it starts at 1
      And it ends at 5
      When the example range is sent to the example route
      Then the route answers that the server failed
      And the answer gives a reference to find it by

    Scenario: A query the database refuses is still the server failing
      Given an example page that asks the database for something that is not there
      When the example page is asked for
      Then the page says the server failed
      And the page does not say the site is unavailable
