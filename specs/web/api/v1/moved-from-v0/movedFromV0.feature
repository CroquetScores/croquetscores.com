@postgres
Feature: An app still asking /api/v0 is sent to /api/v1

  The public API was `/api/v0` until it was accepted, and is `/api/v1` now. An
  app written against the old address would otherwise be answered "not found" the
  day the address moved, with nothing to say where it went. The old address
  answers with a redirect instead, so that the app can follow it and the person
  who wrote it can see where the API is now.

  The redirect keeps the method and the body, so that a request which changes
  something is sent again as it was and not turned into a read. It is a
  courtesy for those already calling: nothing is documented at `/api/v0`, and
  the redirect may be taken away once no one is using it.

  The site answers no cross-origin preflight at `/api/v1` either, so a request
  of that kind is not sent on: the old address says no more of it than the new.
  An app that runs in a browser has had nothing to follow here.

  No browser is needed: these scenarios send plain requests.

  Rule: An address under /api/v0 is sent to the same address under /api/v1

    Scenario: A read is sent to where it now is
      When "/api/v0/tournaments/sports" is asked without following where it is sent
      Then the answer is a redirect that keeps the method
      And it is sent to "/api/v1/tournaments/sports"

    Scenario: What was asked of the address is kept
      When "/api/v0/tournaments?year=2026" is asked without following where it is sent
      Then it is sent to "/api/v1/tournaments?year=2026"

    Scenario: A change is sent with its method kept
      When "/api/v0/tournaments" is posted without following where it is sent
      Then the answer is a redirect that keeps the method
      And it is sent to "/api/v1/tournaments"

    Scenario: A path is sent on as it was written
      When "/api/v0/tournaments/a%2Fb?x=%20" is asked without following where it is sent
      Then it is sent to "/api/v1/tournaments/a%2Fb?x=%20"

    Scenario: A doubled slash stays on the site
      When "/api/v0//example.com" is asked without following where it is sent
      Then it is sent to "/api/v1//example.com"

  Rule: Only whole segments of the old address are sent

    Scenario: An address that merely begins like it is not the API
      When "/api/v0-notes" is asked without following where it is sent
      Then the answer is not a redirect

    Scenario: A preflight is not sent on
      When "/api/v0/tournaments" is asked by a browser's preflight
      Then the answer is not a redirect
