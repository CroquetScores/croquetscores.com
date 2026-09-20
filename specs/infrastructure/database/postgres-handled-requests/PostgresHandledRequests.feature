@postgres
Feature: Keeping handled requests in Postgres

  Everything the application wants of remembering handled requests is
  specified with the remembering, and this is held to those scenarios. What
  is here is what keeping them in Postgres adds: what decides, what a request
  that was not kept leaves behind, and how long a claim is remembered.

  The insert is what decides. A claim is one write against a primary key on
  the id, and the key is what says whether this request had been carried out:
  the row went in, or it did not. Asking first and inserting after would leave
  a gap in which the other of two claims inserted, and both would be told they
  might go on.

  A claim is written in the transaction of the request that made it, which is
  what makes it true that a request is remembered if and only if its work was
  kept. A request that fails after claiming takes its claim down with it, and
  is claimed again when it is sent again — which is right: nothing happened,
  so nothing is to be answered as though it had.

  A claim is forgotten once it is more than 24 hours old, and the forgetting
  is done by claiming: every claim takes out what has gone stale, as sending
  what is queued takes out the emails given up long enough ago. Nothing to
  schedule, nothing under `scripts/` for somebody to remember to run, and no
  sweeping on a table nothing is writing to.

  24 hours because it has to outlast the longest gap between a request being
  sent and sent again — a button pressed twice is seconds, a page gone back to
  is minutes, an app holding a request until it has a connection again can be
  hours — and because it is how long the link registering emails works for. A
  request arriving later than its link lasted is not that request finishing;
  whoever sends it needs a new link whatever is remembered here.

  Because the forgetting rides on claiming, it is in the claiming request's
  transaction too, and a request that fails leaves what it swept where it was.
  That costs nothing: the next claim sweeps it again.

  Background:
    Given a record of handled requests kept in Postgres
    And the moment "2026-09-19T10:00:00Z"

  Rule: A claim is remembered only if the request that made it was kept

    Scenario: A request that fails after claiming is not remembered
      Given the request "a-request" was claimed by a request that then failed
      When the request "a-request" is claimed
      Then it is claimed

    Scenario: A request that was kept is remembered
      Given the request "a-request" has been claimed
      When the request "a-request" is claimed
      Then it is not claimed

  Rule: A claim is forgotten once it is more than 24 hours old

    Scenario: A claim made 23 hours ago is still remembered
      Given the request "a-request" was claimed at "2026-09-18T11:00:00Z"
      When the request "a-request" is claimed
      Then it is not claimed

    Scenario: A claim made 25 hours ago is forgotten
      Given the request "a-request" was claimed at "2026-09-18T09:00:00Z"
      When the request "a-request" is claimed
      Then it is claimed

    Scenario: A claim made exactly 24 hours ago is still remembered
      Given the request "a-request" was claimed at "2026-09-18T10:00:00Z"
      When the request "a-request" is claimed
      Then it is not claimed

    Scenario: Claiming takes the stale ones out
      Given the request "an-old-request" was claimed at "2026-09-18T09:00:00Z"
      And the request "a-recent-request" was claimed at "2026-09-19T09:00:00Z"
      When the request "a-request" is claimed
      Then "an-old-request" is no longer remembered
      And "a-recent-request" is still remembered

    Scenario: A claim is forgotten by the age of the request that made it
      Given the request "an-old-request" was claimed at "2026-09-18T09:00:00Z"
      When the request "a-request" is claimed as asked for at "2026-09-18T09:30:00Z"
      Then "an-old-request" is still remembered
