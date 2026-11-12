@postgres
Feature: A summary of the last day's log, emailed to the administrator each morning

  The administrator reads the server's log once a day to learn what went
  wrong while nobody was looking (`operations.md`), and a task that depends on
  being remembered is one that is missed on the days it matters. This script
  does the reading and says what it found, so that the day starts with an
  email and not with a job. Cron runs it at five in the morning on the server,
  as it runs the export of the tournaments (`exportTournamentsCli.feature`).

      npm run summarise:log

  It is told nothing. It reads the entries written in the last 24 hours at
  Warn or more severe, from the log kept in the database
  (`PostgresServerLog.feature`), and has Claude write a summary of them, which
  is emailed to `ADMINISTRATOR_EMAIL_ADDRESS`.

  A summary is not the log. It groups entries that are the same fault into
  one, says how many there were and when the first and the last were written,
  puts what most needs looking at first, and gives the reference of an
  entry so that it can be found at /admin/administrator/logs
  (`logs.feature`). The log is where the administrator goes to see more, and
  the email says where to look.

  An email is sent on a quiet day too, saying that nothing was written at Warn
  or more severe. This is deliberate and goes against the export, which says
  nothing when it worked. The export has the repository's newest commit to be
  looked at, and this has nothing: no email that could mean either "nothing
  went wrong" or "the script did not run" leaves the administrator to guess
  which, so a day with no email is the one that is looked into.

  What is sent to Claude is the entries and not what the site holds. An email
  address in an entry is replaced before the entries leave the server, since
  the log is a record of what readers did and the summary does not need to
  know who they were. Claude is given no way to do anything but write the
  summary, so that an entry that was written by a reader, such as an address
  they asked for, cannot instruct it to do something else.

  Claude is not always there. Where the summary cannot be written, the email is
  still sent, saying so, with how many entries there were at each severity and
  the message of the newest few, so that a day is never lost because the
  summary was. Where the email cannot be sent the script ends with a failure,
  which cron records in the log of the last run (`exporting-tournaments.md` §3
  is the same).

  Background:
    Given a migrated database
    And a server log kept in the database
    And the moment "2026-10-09T05:00:00Z"
    And the administrator is "croquetscores@gmail.com"
    And a Claude that writes the summary "Two payments were refused."

  Rule: The last 24 hours of the log are read, from Warn

    Scenario: An entry from the last day is summarised
      Given an entry written at "2026-10-08T06:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then Claude was given the entry "Payment refused"

    Scenario: An entry from before the last day is not summarised
      Given an entry written at "2026-10-08T04:59:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then Claude was not given the entry "Payment refused"

    Scenario: An entry at Warn is summarised
      Given an entry written at "2026-10-09T04:00:00Z" saying "Careful" at the severity Warn
      When the summary is run
      Then Claude was given the entry "Careful"

    Scenario: An entry less severe than Warn is not summarised
      Given an entry written at "2026-10-09T04:00:00Z" saying "Chatter" at the severity Info
      When the summary is run
      Then Claude was not given the entry "Chatter"

  Rule: A very long day is cut at the newest 300 entries

    An outage can write thousands of lines, which would be more than Claude
    can be given and would cost more than the summary is worth. The newest are
    what the administrator most needs, and Claude is told that there were
    more, so that it does not say the day was quieter than it was.

    Scenario: 300 entries are given
      Given 300 entries written at "2026-10-09T04:00:00Z" at the severity Error
      When the summary is run
      Then Claude was given 300 entries

    Scenario: No more than 300 entries are given
      Given 301 entries written at "2026-10-09T04:00:00Z" at the severity Error
      When the summary is run
      Then Claude was given 300 entries

    Scenario: Claude is told where there were more
      Given 301 entries written at "2026-10-09T04:00:00Z" at the severity Error
      When the summary is run
      Then Claude was told there were more entries than it was given

    Scenario: Claude is not told so where there were not
      Given 300 entries written at "2026-10-09T04:00:00Z" at the severity Error
      When the summary is run
      Then Claude was not told there were more entries than it was given

  Rule: An email address is not sent to Claude

    Scenario: An email address in an entry is replaced
      Given an entry written at "2026-10-09T04:00:00Z" saying "Refused for ada@example.com" at the severity Error
      When the summary is run
      Then Claude was not given the text "ada@example.com"

    Scenario: The rest of the entry is still sent
      Given an entry written at "2026-10-09T04:00:00Z" saying "Refused for ada@example.com" at the severity Error
      When the summary is run
      Then Claude was given the text "Refused for"

    Scenario: An email address carried in the entry's other details is replaced
      Given an entry written at "2026-10-09T04:00:00Z" saying "Refused" at the severity Error with the reference "ada@example.com"
      When the summary is run
      Then Claude was not given the text "ada@example.com"

  Rule: Claude is asked for a summary and for nothing else

    Scenario: Claude is given no tools
      Given an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then Claude was given no way to act

  Rule: The summary is emailed to the administrator

    Scenario: The email is to the administrator
      Given an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then an email was sent to "croquetscores@gmail.com"

    Scenario: The email carries what Claude wrote
      Given an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then the email says "Two payments were refused."

    Scenario: What Claude wrote is shown as text and not read as a page
      Given a Claude that writes the summary "<script>alert(1)</script>"
      And an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then the email does not contain "<script>"

    Scenario: The email's subject says how many entries there were
      Given an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then the email's subject says 1 entry

    Scenario: The email's subject says when it is for
      Given an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then the email's subject says "2026-10-09"

    Scenario: The script ends well
      Given an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then the summary script exits with success

  Rule: A quiet day is emailed too

    Scenario: An email is sent where there is nothing to summarise
      When the summary is run
      Then an email was sent to "croquetscores@gmail.com"

    Scenario: The email says there was nothing
      When the summary is run
      Then the email says that nothing was written at Warn or more severe

    Scenario: Claude is not asked to summarise nothing
      When the summary is run
      Then Claude was not asked

  Rule: A day is not lost because the summary could not be written

    Scenario: The email is sent where Claude cannot be reached
      Given a Claude that cannot be reached
      And an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then an email was sent to "croquetscores@gmail.com"

    Scenario: The email says the summary could not be written
      Given a Claude that cannot be reached
      And an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then the email says that the summary could not be written

    Scenario: The email says how many entries there were at a severity
      Given a Claude that cannot be reached
      And an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      And an entry written at "2026-10-09T04:01:00Z" saying "Careful" at the severity Warn
      When the summary is run
      Then the email says there was 1 entry at Error

    Scenario: The email gives the newest messages
      Given a Claude that cannot be reached
      And an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then the email says "Payment refused"

    Scenario: An email address is not in the email that Claude was not there to summarise
      Given a Claude that cannot be reached
      And an entry written at "2026-10-09T04:00:00Z" saying "Refused for ada@example.com" at the severity Error
      When the summary is run
      Then the email does not contain "ada@example.com"

    Scenario: A summary that is empty is the same as one that could not be written
      Given a Claude that writes the summary ""
      And an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then the email says that the summary could not be written

  Rule: A failure to send is a failure of the script

    Scenario: The script ends in failure where the email cannot be sent
      Given email cannot be sent
      And an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then the summary script exits with failure

    Scenario: The script says why where the email cannot be sent
      Given email cannot be sent
      And an entry written at "2026-10-09T04:00:00Z" saying "Payment refused" at the severity Error
      When the summary is run
      Then the summary script says the administrator could not be told

  Rule: A log that cannot be read is told to the administrator

    Scenario: The administrator is emailed where the log cannot be read
      Given the log cannot be read
      When the summary is run
      Then an email was sent to "croquetscores@gmail.com"

    Scenario: The email says the log could not be read
      Given the log cannot be read
      When the summary is run
      Then the email says that the log could not be read

    Scenario: The script ends in failure where the log cannot be read
      Given the log cannot be read
      When the summary is run
      Then the summary script exits with failure
