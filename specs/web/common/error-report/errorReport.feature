@postgres
Feature: The administrator is emailed when the site fails, but not more than four times in an hour

  When the server fails on a request, in a way nobody asked it to and the
  caller could not have helped (`errors.feature`), somebody has to find out.
  The reader is shown a reference and the log has the cause, but nobody reads
  the log until they are told there is something in it. So the administrator
  is emailed.

  Only that failure is told. A request refused for breaking its rules, a page
  that is not there, and a caller asking for what it may not have are the
  caller's mistakes, and the database being out of reach has an email of its
  own (`databaseUnavailable.feature`). Emailing about those would bury the
  failures that are the site's own.

  A site that is broken tends to fail on every request, so unlimited it would
  send one email for each, which fills the administrator's inbox, may get the
  site's mail provider to stop sending, and says no more after the first few
  than before. So at most 4 are sent in any hour. A failure after the fourth is
  logged as every failure is, and is not emailed about; the next is emailed
  about once an hour has passed since the first of the four.

  The email says when, what was asked for, and the reference the reader was
  given, so that the log's entry can be found. It does not say what the
  failure was: a failure's message can carry what somebody typed, and the log
  is where that is kept.

  What was asked for is the address without its query, which can carry a
  link that signs somebody in.

  The count is kept in the running site's own memory and the email goes
  straight to whatever sends email, not through the email queue. A failure can
  be the database, which the queue is in, and a queue that was failing could
  not report that it was. A site that is restarted forgets, and where more than
  one copy is running each counts for itself, so there may be a few more than
  4 in an hour. That is accepted, as it is for the database being unreachable.

  Whatever goes wrong with telling the administrator is logged and not shown,
  and a try that failed counts as a try, so that a mail server that is down is
  not asked again by every request.

  These scenarios use the same example routes as `errors.feature`.

  Background:
    Given the application is built
    And the site's administrator's email address is "administrator@example.com"

  Rule: A failure of the server is emailed to the administrator

    Scenario: The administrator is emailed
      Given an example page that fails
      When the example page is asked for
      Then an email is sent to "administrator@example.com"

    Scenario: The email says the site failed
      Given an example page that fails
      When the example page is asked for
      Then the email sent to "administrator@example.com" says the site failed

    Scenario: The email says when
      Given the server's clock reads "2026-09-19T10:00:00Z"
      And an example page that fails
      When the example page is asked for
      Then the email sent to "administrator@example.com" names the moment "2026-09-19T10:00:00Z"

    Scenario: The email says what was asked for
      Given an example page that fails
      When the example page is asked for
      Then the email sent to "administrator@example.com" names the address asked for

    Scenario: The email does not say what came after the question mark
      Given an example page that fails
      When the example page is asked for with "token=secret" after the question mark
      Then the email sent to "administrator@example.com" does not name "secret"

    Scenario: The email gives the reference the reader was given
      Given an example page that fails
      When the example page is asked for
      Then the email sent to "administrator@example.com" gives the reference the reader was given

    Scenario: The email does not say what the failure was
      Given an example page that fails with the words "a password nobody should see"
      When the example page is asked for
      Then the email sent to "administrator@example.com" does not name "a password nobody should see"

    Scenario: An API route that fails is emailed about too
      Given an example API route that fails
      When the example API route is asked for
      Then an email is sent to "administrator@example.com"

    Scenario: The email does not go through the queue
      Given an example page that fails
      When the example page is asked for
      Then nothing is queued to be sent

    Scenario: The reader is still given the answer when the email cannot be sent
      Given an example page that fails
      And emails cannot be sent
      When the example page is asked for
      Then the page says the server failed

  Rule: What is the caller's mistake is not emailed

    Scenario: A page that is not there is not emailed about
      When a page that is not there is asked for
      Then no email is sent

    Scenario: A request that breaks a rule is not emailed about
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example API route that sends the example command for the range it is given
      And an example range
      And it starts at 5
      And it ends at 1
      When the example range is sent to the example route
      Then no email is sent

    Scenario: The database being out of reach is emailed about in its own words, not as a failure
      Given the database cannot be reached
      And an example page that reads from the database
      When the example page is asked for
      Then the email sent to "administrator@example.com" says the database cannot be reached
      And the email sent to "administrator@example.com" does not say the site failed

  Rule: Not more than 4 are sent in an hour

    Scenario: 4 failures in an hour are emailed about
      Given an example page that fails
      And the example page is asked for
      And the example page is asked for
      And the example page is asked for
      When the example page is asked for
      Then 4 emails are sent to "administrator@example.com"

    Scenario: A fifth failure in the hour is not
      Given an example page that fails
      And the example page is asked for
      And the example page is asked for
      And the example page is asked for
      And the example page is asked for
      When the example page is asked for
      Then 4 emails are sent to "administrator@example.com"

    Scenario: A fifth failure is still logged
      Given an example page that fails
      And the example page is asked for
      And the example page is asked for
      And the example page is asked for
      And the example page is asked for
      When the example page is asked for
      Then the log says "Unhandled error" 5 times

    Scenario: A failure is emailed about again once an hour has passed since the first
      Given an example page that fails
      And the example page is asked for
      And 30 minutes have passed
      And the example page is asked for
      And the example page is asked for
      And the example page is asked for
      And 31 minutes have passed
      When the example page is asked for
      Then 5 emails are sent to "administrator@example.com"

    Scenario: The hour is counted back from the failure, so 59 minutes is not enough
      Given an example page that fails
      And the example page is asked for
      And the example page is asked for
      And the example page is asked for
      And the example page is asked for
      And 59 minutes have passed
      When the example page is asked for
      Then 4 emails are sent to "administrator@example.com"

    Scenario: An API route and a page share the one count
      Given an example page that fails
      And an example API route that fails
      And the example page is asked for
      And the example page is asked for
      And the example API route is asked for
      And the example API route is asked for
      When the example page is asked for
      Then 4 emails are sent to "administrator@example.com"

    Scenario: A failure to send counts as one of the 4
      Given an example page that fails
      And emails cannot be sent
      And the example page is asked for
      And the example page is asked for
      And the example page is asked for
      And the example page is asked for
      And emails can be sent again
      When the example page is asked for
      Then no email is sent
