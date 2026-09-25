@postgres
Feature: Keeping emails to be sent in the same transaction as what they are about

  An email about something that happened — an account registered, a way back in
  asked for — must be queued if and only if what happened is kept. Sending it
  from inside the command would send it before the command was committed, and it
  would have gone even if the command then failed. So a command puts the email
  in a queue, a table written in the command's own transaction, and something
  outside any request sends what is in the queue and takes out what it sent.

  An email that is sent at all is sent once in all but one case. It is not sent
  at all when every try fails and it is given up, or when its account is
  forgotten before it goes; both are below. One that fails to send stays in the
  queue to be tried again later, and is not taken out; one that sends is taken
  out, and never tried again. Two senders at once do not both take the same
  email. The case is a sender stopping after the mail provider has taken an
  email and before it is taken out of the queue: the email is sent again, since
  nothing can tell it went. Sending twice is the lesser harm, and an email about
  an account is written to be safe to read twice.

  An email is queued with what it is — its kind, such as the email confirming
  an address — the address it goes to, the language it is to be written in,
  and whatever fills it in, such as the link to follow, with the moment that
  link stops working when it has one. It holds no words. They
  are written when it is sent, by the email writer the queue is given, which
  is handed the kind, the language and what fills it in, and hands back a
  subject and a body. The queue knows what an email is and when it goes; what
  it says is the web layer's, alongside every other word the site shows a
  reader, and is specified with the writer (`emailWriter.feature`). The queue
  names only what it asks of a writer, which the application declares, so
  that nothing here reaches into the web layer.

  An email about an account is queued in the same transaction as what it is
  about, and after it: the account's key is made as its registering is kept, so
  by the time anything queues an email about it the key is there. An account
  with no key is therefore one that has been forgotten, and an email about it
  is not queued at all, rather than queued to be given up when nothing can read
  it.

  An email address is never kept as it was given, and the queue is no
  exception. An email about an account is queued with the account, and what it
  holds — the address it goes to and whatever fills it in — is encrypted with
  the account's own key, as the account's name and address are. So an account
  forgotten before its email is sent leaves an email nobody can read: it is
  not sent, and is taken out. An email with no account to belong to — to an
  address nobody has registered, or to the administrator — is encrypted with
  the site's key instead, and is not touched by forgetting anything; changing
  the site's key re-encrypts those along with the account keys. An email
  given up is kept for 30 days to be looked at, and then taken out, so that
  nothing stays in the queue for good.

  Sending is handed the moment it is sending at, and sends what is due by
  then, rather than reading a clock, because nothing below the web layer reads
  one. What runs the sending, and how often, is the web layer's
  (`emailQueueSending.feature`).

  Background:
    Given an email queue

  Rule: An email is queued with the command, or not at all

    Scenario: An email queued by a command that is kept is in the queue
      Given a command that queues the email "Email.ConfirmAddress" for "someone@example.com"
      When the command is sent
      Then the email "Email.ConfirmAddress" is queued for "someone@example.com"

    Scenario: An email queued by a command that fails is not in the queue
      Given a command that queues the email "Email.ConfirmAddress" for "someone@example.com"
      And the command fails after queueing it
      When the command is sent
      Then nothing is queued to be sent

  Rule: What is in the queue is sent once

    Scenario: A queued email is sent
      Given the email "Email.ConfirmAddress" has been queued for "someone@example.com"
      When what is queued is sent
      Then "someone@example.com" was sent the email "Email.ConfirmAddress"

    Scenario: A sent email is taken out of the queue
      Given the email "Email.ConfirmAddress" has been queued for "someone@example.com"
      When what is queued is sent
      Then nothing is queued to be sent

    Scenario: An email that fails to send stays to be tried again
      Given the email "Email.ConfirmAddress" has been queued for "someone@example.com"
      And sending will fail
      When what is queued is sent
      Then the email "Email.ConfirmAddress" is queued for "someone@example.com"

    Scenario: Two senders at once send an email once
      Given the email "Email.ConfirmAddress" has been queued for "someone@example.com"
      When what is queued is sent by two senders at once
      Then "someone@example.com" was sent 1 email

  Rule: Emails due at the same moment are listed and sent in the order they were queued

    The queue is read by when each email is due, and two emails can be due at
    the same moment: queued by one request, which has one moment, or by two
    requests in the same instant. Nothing but the order they were queued in
    says which came first, and it matters: an email saying an account has moved
    away from an address, followed by one to confirm that address for a new
    account, says something false read in the other order. So the order they
    were queued in is kept, and is the order they are listed and sent in.

    It was found because the scenarios' clock stands still, so everything one
    scenario queues is due at the same moment, and a step asking for the newest
    email to an address was answered by chance. A queue that broke the tie
    another way would pass a scenario of two emails half the time, so these
    queue twenty, which a queue ordered by anything else puts back in order by
    chance too seldom to count.

    Scenario: Emails due at the same moment are listed in the order they were queued
      Given 20 emails have been queued for "someone@example.com", one after another, due at the same moment
      When what is queued is listed
      Then the emails are listed in the order they were queued

    Scenario: Emails due at the same moment are sent in the order they were queued
      Given 20 emails have been queued for "someone@example.com", one after another, due at the same moment
      When what is queued is sent
      Then the emails were sent in the order they were queued

  Rule: What is queued cannot be read without its key

    Scenario: A queued email about an account does not hold its address
      Given an account for "someone@example.com"
      When the email "Email.ConfirmAddress" is queued for the account
      Then no row of the queue contains "someone@example.com"

    Scenario: A queued email about an account does not hold what fills it in
      Given an account for "someone@example.com"
      When the email "Email.ConfirmAddress" is queued for the account with the link "https://croquetscores.com/account/confirm-email-address?link=abc123"
      Then no row of the queue contains "abc123"

    Scenario: A queued email with no account does not hold its address
      When the email "Email.RegisterInstead" has been queued for "nobody@example.com"
      Then no row of the queue contains "nobody@example.com"

  Rule: An email whose account is forgotten before it is sent is not sent

    Scenario: An email queued before its account is forgotten is not sent
      Given an account for "someone@example.com"
      And the email "Email.ConfirmAddress" is queued for the account
      And the account is forgotten
      When what is queued is sent
      Then "someone@example.com" was sent 0 emails

    Scenario: An email queued before its account is forgotten is taken out
      Given an account for "someone@example.com"
      And the email "Email.ConfirmAddress" is queued for the account
      And the account is forgotten
      When what is queued is sent
      Then nothing is queued to be sent
      And the queue holds 0 emails

  Rule: An email given up is kept for 30 days, and then taken out

    Scenario: An email given up 29 days ago is still kept
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" at "2026-09-19T10:00:00Z"
      And sending will fail
      And sending the email has been tried 6 times, each as soon as it was due
      When what is queued is sent at "2026-10-18T16:00:00Z"
      Then the email "Email.ConfirmAddress" for "someone@example.com" is given up

    Scenario: An email given up 31 days ago is taken out
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" at "2026-09-19T10:00:00Z"
      And sending will fail
      And sending the email has been tried 6 times, each as soon as it was due
      When what is queued is sent at "2026-10-20T16:00:00Z"
      Then the queue holds 0 emails

  Rule: An email is written by the writer the queue is given, when it is sent

    A writer that cannot write an email — one for a kind it has no words for,
    say — is a mistake in the site rather than in anything a reader did, and
    it may be put right before the email is given up. So an email its writer
    refuses is tried again like one the mail provider refused, and given up
    the same way.

    Scenario: The writer is asked for the email's kind
      Given the email "Email.ConfirmAddress" has been queued for "someone@example.com"
      When what is queued is sent
      Then the writer was asked to write "Email.ConfirmAddress"

    Scenario: The writer is asked for the email's language
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" in "en-XA"
      When what is queued is sent
      Then the writer was asked to write it in "en-XA"

    Scenario: The writer is given what fills the email in
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" with the link "https://croquetscores.com/account/confirm-email-address?link=abc123"
      When what is queued is sent
      Then the writer was given the link "https://croquetscores.com/account/confirm-email-address?link=abc123"

    Scenario: What is sent has the subject the writer wrote
      Given the email "Email.ConfirmAddress" has been queued for "someone@example.com"
      When what is queued is sent
      Then the email sent to "someone@example.com" has the subject the writer wrote

    Scenario: What is sent has the body the writer wrote
      Given the email "Email.ConfirmAddress" has been queued for "someone@example.com"
      When what is queued is sent
      Then the email sent to "someone@example.com" has the body the writer wrote

    Scenario: An email the writer cannot write is not sent
      Given the email "Email.ConfirmAddress" has been queued for "someone@example.com"
      And the writer cannot write it
      When what is queued is sent
      Then "someone@example.com" was sent 0 emails

    Scenario: An email the writer cannot write stays to be tried again
      Given the email "Email.ConfirmAddress" has been queued for "someone@example.com"
      And the writer cannot write it
      When what is queued is sent
      Then the email "Email.ConfirmAddress" is queued for "someone@example.com"

  Rule: An email that fails is tried again later, five times at most, and never after its link stops working

    Trying again at once would find a provider that is down still down, and
    trying again every time the queue is sent would try an address the
    provider refuses every few seconds for ever. So each failure makes an
    email wait before it is due again, each wait four times the one before,
    starting at a minute: tried again after 1, 4, 16, 64 and 256 minutes.
    That spreads five tries again over nearly six hours, long enough to
    outlast an ordinary outage, and the last lands while a reader waiting on
    a link is still likely to want it.

    An email whose link stops working before it can be sent is given up then
    rather than sent: a link to forget an account lasts 15 minutes, and one to
    set a new password an hour, and the waits above would carry either past
    its end, to arrive as an email whose one use is gone. So an email is
    never sent after the moment its link stops working.

    An email nothing can read — one sealed with a key the store no longer has,
    or a row changed where it sits — is counted as a try that failed, and is
    tried again and given up like any other. It cannot go, but refusing
    outright would be worse than useless: it is the soonest due, so every
    sending after it would pick it first and refuse again, and nothing behind
    it in the queue would ever go.

    After its fifth try again fails, an email is given up. It is not taken
    out at once. It stays, no longer due, for 30 days, so that someone can see
    what failed to go and why, rather than it vanishing as though it had been
    sent.

    Scenario: An email is due as soon as it is queued
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" at "2026-09-19T10:00:00Z"
      When what is queued is sent at "2026-09-19T10:00:00Z"
      Then "someone@example.com" was sent the email "Email.ConfirmAddress"

    Scenario: An email that fails is not tried again before its wait is over
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" at "2026-09-19T10:00:00Z"
      And sending will fail
      And what is queued is sent at "2026-09-19T10:00:00Z"
      When what is queued is sent at "2026-09-19T10:00:59Z"
      Then sending the email to "someone@example.com" has been tried 1 time

    Scenario: An email that fails is tried again once its wait is over
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" at "2026-09-19T10:00:00Z"
      And sending will fail
      And what is queued is sent at "2026-09-19T10:00:00Z"
      And sending will succeed
      When what is queued is sent at "2026-09-19T10:01:00Z"
      Then "someone@example.com" was sent the email "Email.ConfirmAddress"

    Scenario: An email that is sent on a later try is taken out of the queue
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" at "2026-09-19T10:00:00Z"
      And sending will fail
      And what is queued is sent at "2026-09-19T10:00:00Z"
      And sending will succeed
      When what is queued is sent at "2026-09-19T10:01:00Z"
      Then nothing is queued to be sent

    Scenario Outline: Each wait is four times the one before
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" at "2026-09-19T10:00:00Z"
      And sending will fail
      And sending the email has been tried <tries> times, each as soon as it was due
      Then the email is due again <wait> after it last failed

      Examples:
        | tries | wait        |
        | 1     | 1 minute    |
        | 2     | 4 minutes   |
        | 3     | 16 minutes  |
        | 4     | 64 minutes  |
        | 5     | 256 minutes |

    Scenario: An email whose link has stopped working is not sent
      Given the email "Email.ConfirmForgetting" is queued for "someone@example.com" at "2026-09-19T10:00:00Z" with a link that works until "2026-09-19T10:15:00Z"
      And sending will fail
      And what is queued is sent at "2026-09-19T10:00:00Z"
      And sending will succeed
      When what is queued is sent at "2026-09-19T10:16:00Z"
      Then "someone@example.com" was sent 0 emails

    Scenario: An email whose link has stopped working is given up
      Given the email "Email.ConfirmForgetting" is queued for "someone@example.com" at "2026-09-19T10:00:00Z" with a link that works until "2026-09-19T10:15:00Z"
      And sending will fail
      And what is queued is sent at "2026-09-19T10:00:00Z"
      And sending will succeed
      When what is queued is sent at "2026-09-19T10:16:00Z"
      Then the email "Email.ConfirmForgetting" for "someone@example.com" is given up

    Scenario: An email whose link still works is sent
      Given the email "Email.ConfirmForgetting" is queued for "someone@example.com" at "2026-09-19T10:00:00Z" with a link that works until "2026-09-19T10:15:00Z"
      And sending will fail
      And what is queued is sent at "2026-09-19T10:00:00Z"
      And sending will succeed
      When what is queued is sent at "2026-09-19T10:14:00Z"
      Then "someone@example.com" was sent the email "Email.ConfirmForgetting"

    Scenario: An email that fails its fifth try again is given up
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" at "2026-09-19T10:00:00Z"
      And sending will fail
      When sending the email has been tried 6 times, each as soon as it was due
      Then the email "Email.ConfirmAddress" for "someone@example.com" is given up

    Scenario: An email that is given up is not queued to be sent
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" at "2026-09-19T10:00:00Z"
      And sending will fail
      When sending the email has been tried 6 times, each as soon as it was due
      Then nothing is queued to be sent

    Scenario: An email that is given up is not tried again
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" at "2026-09-19T10:00:00Z"
      And sending will fail
      And sending the email has been tried 6 times, each as soon as it was due
      When what is queued is sent at "2026-09-20T10:00:00Z"
      Then sending the email to "someone@example.com" has been tried 6 times

    Scenario: An email nothing can read is not sent
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" at "2026-09-19T10:00:00Z"
      And what is kept of the email has been altered in the database
      When what is queued is sent at "2026-09-19T10:00:00Z"
      Then "someone@example.com" was sent 0 emails

    Scenario: An email nothing can read is counted as a try that failed
      Given the email "Email.ConfirmAddress" is queued for "someone@example.com" at "2026-09-19T10:00:00Z"
      And what is kept of the email has been altered in the database
      When what is queued is sent at "2026-09-19T10:00:00Z"
      Then sending the email has been tried 1 time

    Scenario: An email nothing can read does not stop what is behind it going
      Given the email "Email.ConfirmAddress" is queued for "nobody@example.com" at "2026-09-19T10:00:00Z"
      And what is kept of the email has been altered in the database
      And the email "Email.SetNewPassword" is queued for "someone@example.com" at "2026-09-19T10:01:00Z"
      When what is queued is sent at "2026-09-19T10:01:00Z"
      Then "someone@example.com" was sent the email "Email.SetNewPassword"
