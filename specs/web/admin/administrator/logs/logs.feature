@browser @postgres
Feature: The page where an administrator reads the server's log

  The page at /admin/administrator/logs is one of the administrator's pages
  (`administrator.feature`), under their section bar
  (`AdministratorSections.feature`). It shows the server's log as it is kept
  in the database (`LogEntries.feature`), so that an administrator can look
  up what happened without being on the machine, most often from the
  reference a reader was shown on an error page.

  It is headed Logs, and lists an entry for each line, newest first: how severe
  it was, when it was written, and what it said, the severity first so that
  the eye can run down it for the errors. The line's other
  details are not in the list, because there are a great many of them; an
  entry is pressed to open and show them all, and pressed again to close.

  Above the list are the two ways to narrow it: a severity, which shows that
  severity and every more severe one, and a box to look up text in. They are
  a form that is sent with the Show button, so the page works the same
  whether it has been read once or is being returned to, and the address
  carries them (`/admin/administrator/logs?severity=Warn&text=9f1c`), which
  is how an administrator is sent a link to what to look at. The severity
  starts at Trace, which is all of it.

  A Prune button removes every entry written more than an hour ago
  (`PruneLog.feature`), and the page then says how many were removed. It asks
  first, since nothing brings an entry back.

  A reader who is not an administrator is told the page is not found, as they
  are of every page of the administrator's (`administrator.feature`).

  The admin draws the page itself, so every scenario here runs scripts, and it
  is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "admin@example.com" has an account, confirmed, with the password "another horse battery staple"
    And "admin@example.com" has been given the role "Administrator"
    And the reader has signed in as "admin@example.com" with the password "another horse battery staple"

  Rule: The page lists the entries of the log

    Scenario: The page is headed by its name
      When the page at "/admin/administrator/logs" is opened
      Then the page's heading is "Logs"

    Scenario: An entry says what it said
      Given the log has an entry "Payment refused"
      When the page at "/admin/administrator/logs" is opened
      Then the first entry says "Payment refused"

    Scenario: An entry says how severe it was
      Given the log has an entry "Broken" at the severity Error
      When the page at "/admin/administrator/logs" is opened
      Then the first entry's severity is "Error"

    Scenario: An entry's severity comes before when it was written
      Given the log has an entry "Broken" at the severity Error
      When the page at "/admin/administrator/logs" is opened
      Then the first entry's severity comes before when it was written

    Scenario: An entry says when it was written
      Given the log has an entry "Broken" written at "2026-10-09T09:00:00Z"
      When the page at "/admin/administrator/logs" is opened
      Then the first entry was written at "2026-10-09T09:00:00Z"

    Scenario: The newest entry is first
      Given the log has an entry "Earlier" written at "2026-10-09T09:00:00Z"
      And the log has an entry "Later" written at "2026-10-09T09:30:00Z"
      When the page at "/admin/administrator/logs" is opened
      Then the first entry says "Later"

    Scenario: An entry opens to show the rest of what it carried
      Given the log has an entry "Unhandled error" with the reference "9f1c"
      And the page at "/admin/administrator/logs" is open
      When the first entry is pressed
      Then the first entry's details include "9f1c"

    Scenario: An entry's details are hidden until it is pressed
      Given the log has an entry "Unhandled error" with the reference "9f1c"
      When the page at "/admin/administrator/logs" is opened
      Then the first entry's details are hidden

    Scenario: The page says so where there is nothing to show
      When the page at "/admin/administrator/logs" is opened
      Then the page says there are no log entries

    Scenario: The page does not say so where there is something to show
      Given the log has an entry "Payment refused"
      When the page at "/admin/administrator/logs" is opened
      Then the page does not say there are no log entries

  Rule: The entries can be narrowed

    Scenario: The severity starts at Trace
      When the page at "/admin/administrator/logs" is opened
      Then the severity is "Trace"

    Scenario: A more severe entry is shown for a lower severity
      Given the log has an entry "Broken" at the severity Error
      And the page at "/admin/administrator/logs" is open
      When the severity "Warn" is chosen
      And the Show button is pressed
      Then the first entry says "Broken"

    Scenario: A less severe entry is not shown
      Given the log has an entry "Chatter" at the severity Debug
      And the page at "/admin/administrator/logs" is open
      When the severity "Warn" is chosen
      And the Show button is pressed
      Then the page says there are no log entries

    Scenario: Text is looked up
      Given the log has an entry "Payment refused"
      And the log has an entry "Server listening"
      And the page at "/admin/administrator/logs" is open
      When "refused" is entered to look up
      And the Show button is pressed
      Then the first entry says "Payment refused"

    Scenario: Text that is looked up is kept in its box
      Given the page at "/admin/administrator/logs" is open
      When "refused" is entered to look up
      And the Show button is pressed
      Then the text to look up is "refused"

    Scenario: Narrowing is in the address
      Given the page at "/admin/administrator/logs" is open
      When the severity "Warn" is chosen
      And "9f1c" is entered to look up
      And the Show button is pressed
      Then the address is "/admin/administrator/logs"
      And the address's search is "?severity=Warn&text=9f1c"

    Scenario: An address that narrows is opened narrowed
      Given the log has an entry "Chatter" at the severity Debug
      When the page at "/admin/administrator/logs?severity=Error" is opened
      Then the severity is "Error"

    Scenario: An address that narrows shows only what it narrows to
      Given the log has an entry "Chatter" at the severity Debug
      When the page at "/admin/administrator/logs?severity=Error" is opened
      Then the page says there are no log entries

    Scenario: A severity the log does not write in is opened as Trace
      When the page at "/admin/administrator/logs?severity=Loud" is opened
      Then the severity is "Trace"

  Rule: The recent log can be pruned

    Scenario: Pruning asks first
      Given the page at "/admin/administrator/logs" is open
      When the Prune button is pressed
      Then the page asks whether to remove the log from before the last hour

    Scenario: Declining removes nothing
      Given the log has an entry "Old" written an hour and a minute ago
      And the page at "/admin/administrator/logs" is open
      And the Prune button is pressed
      When the pruning is declined
      Then the first entry says "Old"

    Scenario: Agreeing removes the entries from before the last hour
      Given the log has an entry "Old" written an hour and a minute ago
      And the page at "/admin/administrator/logs" is open
      And the Prune button is pressed
      When the pruning is agreed to
      Then the page says there are no log entries

    Scenario: Agreeing keeps the entries from the last hour
      Given the log has an entry "Recent" written a minute ago
      And the page at "/admin/administrator/logs" is open
      And the Prune button is pressed
      When the pruning is agreed to
      Then the first entry says "Recent"

    Scenario: The page says how many were removed
      Given the log has an entry "Old" written an hour and a minute ago
      And the log has an entry "Older" written two hours ago
      And the page at "/admin/administrator/logs" is open
      And the Prune button is pressed
      When the pruning is agreed to
      Then the page says 2 entries were removed

  Rule: The page is in the reader's language

    Scenario: The heading is in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/admin/administrator/logs" is opened
      Then the page's heading is in the test locale
