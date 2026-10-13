@postgres
Feature: The site says so when its database access is turned off for maintenance

  Some maintenance cannot be done with the site using its database: a
  migration that rewrites a table, a restore, a move to another server. The
  site is then to be unavailable on purpose, for a stretch of time somebody
  has estimated, and it is to say so rather than be found failing.

  That is the site being unavailable as it is when its database cannot be
  reached (`databaseUnavailable.feature`), except that nobody has to guess. It
  is said by the same page and answered with the same status, with what is
  known added to it: that it is for maintenance, and about how many minutes
  until the site is back. A program is told by a code of its own,
  `Database.Maintenance`, so that it can tell a stretch somebody planned from
  an outage nobody did, and is told how long to wait by the same header.

  The site does not use its database at all while access is off: not to read a
  page, not to look up a session, not to record that a request was handled. It
  is turned off by a script (`databaseAccess.feature`), which keeps the
  switch where the site can read it without the database
  (`FileDatabaseAccess.feature`), and is turned on by the same script.

  The estimate is the minutes the script was given, counted from the moment it
  was turned off or from the moment it was last moved, and the page says how
  many remain, rounded up, so that a
  reader is never told "0 minutes" while the site is still down. Once the
  estimate has passed the page says it is taking longer than estimated and the
  site will be back soon, since a count of nothing is a promise nobody can
  keep. A program is told to ask again in five minutes, since by then the
  estimate is the administrator's to revise and asking more often only adds
  load to a site that is down. Nothing about where the database is or what is
  being done to it is told to the reader.

  Nobody is emailed about it. The administrator turned it off, and an email to
  say so is the outage email (`databaseUnavailable.feature`) sent about
  something the administrator did.

  The site's own stylesheet and scripts are still served, since they are files
  and not the database, so that the page is still the site's.

  These scenarios stand in for the database with one the scenario can count
  the questions asked of, and use the same example routes as `errors.feature`.

  Background:
    Given the application is built with the site's own events and read models
    And the server's clock reads "2026-10-13T10:00:00Z"

  Rule: A page asked for while access is off says the site is down for maintenance

    Scenario: A page says the site is unavailable
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      When the example page is asked for
      Then the reader is told the site is unavailable

    Scenario: A page says it is for maintenance
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      When the example page is asked for
      Then the page says the site is down for maintenance

    Scenario: A page says how many minutes are expected
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      When the example page is asked for
      Then the page says the site is expected back in 30 minutes

    Scenario: A page does not say the server failed
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      When the example page is asked for
      Then the page does not say the server failed

    Scenario: A page is still a page of the site
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      When the example page is asked for
      Then the page has the site's header and footer

    Scenario: A page's words are in the reader's language
      Given the reader's browser asks for "en-XA"
      And database access is turned off for 30 minutes
      And an example page that reads from the database
      When the example page is asked for
      Then every word on the page is in the test locale

    Scenario: A page of nothing but words is also the maintenance page
      Given database access is turned off for 30 minutes
      And an example page that does not use the database
      When the example page is asked for
      Then the page says the site is down for maintenance

  Rule: The minutes remaining count down from when access was turned off

    Scenario: Ten minutes later the page says twenty
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      And the server's clock reads "2026-10-13T10:10:00Z"
      When the example page is asked for
      Then the page says the site is expected back in 20 minutes

    Scenario: A part of a minute counts as the minute
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      And the server's clock reads "2026-10-13T10:29:30Z"
      When the example page is asked for
      Then the page says the site is expected back in 1 minute

    Scenario: After the estimate the page says it is taking longer
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      And the server's clock reads "2026-10-13T10:31:00Z"
      When the example page is asked for
      Then the page says it is taking longer than expected

    Scenario: After the estimate the page gives no minutes
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      And the server's clock reads "2026-10-13T10:31:00Z"
      When the example page is asked for
      Then the page does not say how many minutes are expected

  Rule: A program is told by a code, and how long to wait

    Scenario: An API request says it is for maintenance
      Given database access is turned off for 30 minutes
      And an example API route that reads from the database
      When the example API route is asked for
      Then the route answers that the site is unavailable
      And the answer says "Database.Maintenance"

    Scenario: The answer says how long to wait in seconds
      Given database access is turned off for 30 minutes
      And an example API route that reads from the database
      When the example API route is asked for
      Then the answer says to wait 1800 seconds before asking again

    Scenario: The answer says the minutes expected
      Given database access is turned off for 30 minutes
      And an example API route that reads from the database
      When the example API route is asked for
      Then the answer says 30 minutes are expected

    Scenario: After the estimate the answer says to try again in five minutes
      Given database access is turned off for 30 minutes
      And an example API route that reads from the database
      And the server's clock reads "2026-10-13T10:31:00Z"
      When the example API route is asked for
      Then the answer says to wait 300 seconds before asking again

    Scenario: A command is not accepted
      Given a validator registered for the example command
      And a handler registered for the example command
      And database access is turned off for 30 minutes
      And an example API route that sends the example command for the range it is given
      And an example range
      And it starts at 1
      And it ends at 5
      When the example range is sent to the example route
      Then the route answers that the site is unavailable
      And the answer says "Database.Maintenance"

  Rule: The database is not used while access is off

    Scenario: A page asks the database nothing
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      When the example page is asked for
      Then the database was asked nothing

    Scenario: A reader with a session is not looked up
      Given "someone@example.com" has an account, confirmed
      And the reader is signed in as "someone@example.com"
      And database access is turned off for 30 minutes
      And an example page that reads from the database
      When the example page is asked for
      Then the database was asked nothing

    Scenario: A reader with a session is neither signed out nor told who they are
      Given "someone@example.com" has an account, confirmed
      And the reader is signed in as "someone@example.com"
      And database access is turned off for 30 minutes
      And an example page that reads from the database
      When the example page is asked for
      Then the answer does not take the session cookie away
      And the account menu does not offer the account's own pages

    Scenario: No request is recorded as handled
      Given a validator registered for the example command
      And a handler registered for the example command
      And database access is turned off for 30 minutes
      And an example API route that sends the example command for the range it is given
      And an example range
      And it starts at 1
      And it ends at 5
      When the example range is sent to the example route
      Then no request is recorded as handled

    Scenario: Nobody is emailed
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      When the example page is asked for
      Then no email is sent to the administrator

  Rule: The site's own files are still served

    Scenario: The stylesheet is served
      Given database access is turned off for 30 minutes
      When the site's stylesheet is asked for
      Then the stylesheet is served

  Rule: The site works again the moment access is turned on

    Scenario: A page is answered once access is turned on
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      And database access is turned on
      When the example page is asked for
      Then the example page is answered

    Scenario: A page does not say it is for maintenance once access is turned on
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      And database access is turned on
      When the example page is asked for
      Then the page does not say the site is down for maintenance

    Scenario: The site is not restarted
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      And the example page is asked for
      And database access is turned on
      When the example page is asked for
      Then the example page is answered

  Rule: Moving the expected return changes what is said, counting from then

    The minutes are counted from the moment they are given, whether access is
    being turned off or the return moved (`databaseAccess.feature`), so a
    reader is told what the administrator last said.

    Scenario: The page says the minutes from now
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      And the expected return is moved to 45 minutes from now
      When the example page is asked for
      Then the page says the site is expected back in 45 minutes

    Scenario: The count goes on from when it was moved
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      And the server's clock reads "2026-10-13T10:20:00Z"
      And the expected return is moved to 45 minutes from now
      And the server's clock reads "2026-10-13T10:30:00Z"
      When the example page is asked for
      Then the page says the site is expected back in 35 minutes

    Scenario: Moving it after the first estimate has passed brings the count back
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      And the server's clock reads "2026-10-13T10:31:00Z"
      And the expected return is moved to 60 minutes from now
      When the example page is asked for
      Then the page says the site is expected back in 60 minutes

    Scenario: Moving it again says the last
      Given database access is turned off for 30 minutes
      And an example page that reads from the database
      And the expected return is moved to 45 minutes from now
      And the expected return is moved to 10 minutes from now
      When the example page is asked for
      Then the page says the site is expected back in 10 minutes

    Scenario: An API request is told how long to wait by the new minutes
      Given database access is turned off for 30 minutes
      And an example API route that reads from the database
      And the expected return is moved to 45 minutes from now
      When the example API route is asked for
      Then the answer says to wait 2700 seconds before asking again

  Rule: Turning access off again says the new estimate

    Scenario: A second estimate replaces the first
      Given database access is turned off for 30 minutes
      And database access is turned off for 90 minutes
      And an example page that reads from the database
      When the example page is asked for
      Then the page says the site is expected back in 90 minutes

  Rule: Maintenance is not the database being down

    Scenario: A database that cannot be reached says so when access is on
      Given database access is turned on
      And the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the page does not say the site is down for maintenance

    Scenario: Access off is maintenance whether or not the database can be reached
      Given database access is turned off for 30 minutes
      And the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the page says the site is down for maintenance
