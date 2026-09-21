@postgres
Feature: Remembering which requests have already been carried out

  A request can arrive twice. Somebody presses a form's button again because
  the page is taking its time; somebody goes back and sends it once more; an
  app with a poor connection sends again what it never got an answer to; or an
  answer is lost on its way back, leaving nobody able to say whether the work
  happened. In every one of those the second arrival is the same request, not
  a new one, and carries the id whoever asked gave the first.

  So the id is claimed. Claiming says whether this request is one nobody has
  carried out, and remembers it as carried out when it is. A request whose
  claim is refused has already happened, and whoever asked is to be answered
  as the first asking was.

  Not every command needs this, and one that does not should not ask. A
  command that changes something already there is caught without it, because
  the event store refuses a second append expecting the version the first
  moved past; and one whose work is already the same done twice — confirming
  an address that is confirmed, forgetting an account that is forgotten —
  costs nothing when it happens again. What needs claiming is a command that
  mints something new each time it is sent, such as an account, or one that
  writes to somebody, since a second email in an inbox is a second email
  however little else changed.

  Claiming is a question and an answer in one act rather than two. Asked
  first and marked after, two of the same request sent at once would both be
  told nobody had carried it out, which is the very thing being prevented.

  The moment a request says it was asked for is kept with the claim, so that
  what is remembered carries the same moment as everything else the request
  recorded, rather than one read from a clock somewhere underneath.

  This feature describes what the application wants of the remembering rather
  than any one place to keep it, and every implementation is held to these
  scenarios. How long a claim is remembered for is not here: it is each
  implementation's to say, and each says so with itself.

  These scenarios run against Postgres, because that is where the one
  implementation keeps them. What stands behind "a record of handled requests"
  is the step definitions' to decide, and another implementation would be put
  behind the same words.

  Background:
    Given a record of handled requests
    And the moment "2026-09-19T10:00:00Z"

  Rule: A request is carried out once

    Scenario: A request nobody has carried out is claimed
      When the request "a-request" is claimed
      Then it is claimed

    Scenario: The same request claimed again is not claimed
      Given the request "a-request" has been claimed
      When the request "a-request" is claimed
      Then it is not claimed

    Scenario: Another request is claimed
      Given the request "a-request" has been claimed
      When the request "another-request" is claimed
      Then it is claimed

    Scenario: A request claimed again is still not claimed a third time
      Given the request "a-request" has been claimed
      And the request "a-request" has been claimed again
      When the request "a-request" is claimed
      Then it is not claimed

  Rule: Whether a request has been carried out can be asked without claiming it

    A page that shows what a link is worth asks before it does anything, and
    must not spend the link by asking: a link that sets a password is spent by
    a setting that was kept (`SetNewPassword.feature`), and a reader who only
    opened the page has set nothing.

    Scenario: A request nobody has carried out has not been handled
      When the request "a-request" is asked about
      Then it has not been handled

    Scenario: A request that was claimed has been handled
      Given the request "a-request" has been claimed
      When the request "a-request" is asked about
      Then it has been handled

    Scenario: Asking about a request does not claim it
      Given the request "a-request" is asked about
      When the request "a-request" is claimed
      Then it is claimed

  Rule: Two of the same request at once are claimed once

    Only one of them is to go on and do the work. Which one is nobody's to
    say; that exactly one is told it may is the whole of it.

    Scenario: Two claims of one request at once
      When the request "a-request" is claimed twice at once
      Then one of the two claims was refused
