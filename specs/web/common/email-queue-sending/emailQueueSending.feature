Feature: The server sends what is queued while it is up

  An email is queued in the transaction of the command it is about, and sent
  by something outside any request (`PostgresEmailQueue.feature`). That
  something is the web server itself: every 10 seconds while it is up, it
  sends what is due by the moment its clock reads. A second process would be a
  second thing to deploy, watch and restart, and a scheduler outside the server
  cannot run often enough for a reader waiting on a link to confirm their
  address. The cost is that nothing is sent while the server is down, and what
  was due then is sent when it is next up.

  It lives in the web layer because it reads the server's clock, and nothing
  below the web layer reads one.

  A server does not start sending while its last sending is still going, so a
  slow mail provider holds up the next round rather than piling rounds on top
  of it. The 10 seconds that come up while a round is going are let pass, and
  the next round starts at the first 10 seconds to come up after it has
  finished: not the moment it finishes, and not 10 seconds after that. Two
  servers can send at once, and the queue sees to it that they do not send the
  same email.

  A sending that fails, because the database or the mail provider could not be
  reached, does not stop the sending: it is tried again on the next round.

  When the server stops, it starts no more sending, and waits for any sending
  already going to finish. Stopping it part way through is the one way an
  email gets sent twice, and a deploy is the ordinary way a server stops. So
  these scenarios ask the server to stop and then let time pass, because a
  server waiting on a round has not stopped until the round's time is up.

  It does not wait for ever. A mail provider that has stopped answering would
  otherwise hold the server up until whatever is deploying it loses patience
  and ends it where it stands, which cuts the sending off anyway and leaves the
  deploy looking as though it had failed. So the server waits 20 seconds and
  then stops: less than the 30 seconds a host commonly allows, so that it is
  the server that decides. The email being sent at that moment may be sent
  again when the server is next up, and sending twice is the lesser harm
  (`PostgresEmailQueue.feature`).

  These scenarios use the server's clock and a queue that records what it was
  asked to send and when, rather than Postgres and a mail provider.

  Background:
    Given the server's clock reads "2026-09-19T10:00:00Z"
    And a queue that records its sending

  Rule: What is due is sent every 10 seconds while the server is up

    Scenario: Nothing is sent before the first 10 seconds are up
      Given the server is started
      When 9 seconds pass
      Then the queue has been sent 0 times

    Scenario: What is due is sent once 10 seconds are up
      Given the server is started
      When 10 seconds pass
      Then the queue has been sent 1 time

    Scenario: What is due is sent again every 10 seconds
      Given the server is started
      When 30 seconds pass
      Then the queue has been sent 3 times

    Scenario: The queue is sent what is due at the moment the server's clock reads
      Given the server is started
      When 10 seconds pass
      Then the queue was last sent at "2026-09-19T10:00:10Z"

  Rule: A server sends one round at a time

    Scenario: A round is not started while the last is still going
      Given sending takes 25 seconds
      And the server is started
      When 30 seconds pass
      Then the queue has been sent 1 time

    Scenario: A round is not started the moment the last finishes
      Given sending takes 25 seconds
      And the server is started
      When 39 seconds pass
      Then the queue has been sent 1 time

    Scenario: The next round starts at the first 10 seconds to come up after the last has finished
      Given sending takes 25 seconds
      And the server is started
      When 40 seconds pass
      Then the queue has been sent 2 times

  Rule: A round that fails does not stop the sending

    Scenario: The round after a failure is still sent
      Given sending the queue will fail
      And the server is started
      When 20 seconds pass
      Then the queue has been sent 2 times

  Rule: A server that stops finishes what it is sending first

    Scenario: No round is started once the server is stopping
      Given the server is started
      And 10 seconds pass
      When the server is asked to stop
      And 30 seconds pass
      Then the queue has been sent 1 time

    Scenario: A round that is going when the server stops is finished
      Given sending takes 5 seconds
      And the server is started
      And 12 seconds pass
      When the server is asked to stop
      And 3 seconds pass
      Then the round being sent finished before the server stopped

  Rule: A server that stops waits no longer than 20 seconds for what it is sending

    Scenario: The server has not stopped while it is still waiting on a round
      Given sending takes 60 seconds
      And the server is started
      And 12 seconds pass
      When the server is asked to stop
      And 19 seconds pass
      Then the server has not stopped

    Scenario: The server stops once it has waited 20 seconds
      Given sending takes 60 seconds
      And the server is started
      And 12 seconds pass
      When the server is asked to stop
      And 20 seconds pass
      Then the server has stopped
