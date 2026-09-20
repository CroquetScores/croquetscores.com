@postgres
Feature: What a failed request is answered with is decided in one place

  No route decides for itself what a failure looks like to whoever asked. The
  error mapping does, once, so that the same failure reads the same way
  wherever it happens.

  There are two kinds of failure, and they are told apart by whose mistake it
  was. A request that breaks its rules — a range that ends before it starts, an
  email address with no @ in it — is the caller's mistake. The caller is owed
  every rule it broke, at once, by code and with the fields each reads, so that
  it can say so to whoever typed it, beside what they typed; and it is not the
  server failing, so it is not answered or logged as one. Which fields a rule
  reads is the domain's to say, and is passed on as the domain says it.

  A request the application was not put together to take — one nobody
  registered a handler for, or one that came in by the wrong door — is the
  opposite. The caller could have done nothing differently. It is a mistake in
  how the application was built, answered as any other failure of the server's
  own: with a reference to find it by, and nothing of what went wrong, which is
  for whoever reads the log.

  A form does not come here when what it sends breaks a rule. It shows itself
  again with each rule under the field it is about, and that is specified with
  the form. What is here is everything else: the API, and a page that is not a
  form.

  These scenarios run the application against Postgres, because a request
  that breaks no rule runs in the application's transaction. They use the
  mediator's example command, the validator's example range and its rules, and
  an example route, none of which mean anything.

  Background:
    Given the application is built

  Rule: A request that breaks its rules is refused as the caller's mistake

    Scenario: An API request that breaks a rule is refused as the caller's mistake
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example API route that sends the example command for the range it is given
      And an example range
      And it starts at 1
      When the example range is sent to the example route
      Then the route refuses it as the caller's mistake
      And the refusal is "Request.Invalid"

    Scenario: The refusal names every rule the request broke, in the order they are declared
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example API route that sends the example command for the range it is given
      And an example range
      And it starts at -1
      When the example range is sent to the example route
      Then the first rule the refusal names is "Range.EndMissing"
      And the second rule the refusal names is "Range.StartNegative"
      And the refusal names no other rule

    Scenario: The refusal says which fields each rule reads
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example API route that sends the example command for the range it is given
      And an example range
      And it starts at 5
      And it ends at 3
      When the example range is sent to the example route
      Then the first rule the refusal names is "Range.EndBeforeStart"
      And the refusal says that rule reads the field "start"
      And the refusal says that rule reads the field "end"
      And the refusal says that rule reads no other field

    Scenario: A query that breaks a rule is refused the same way
      Given a validator registered for the example query
      And a handler registered for the example query
      And an example API route that asks the example query for the range it is given
      And an example range
      And it starts at 1
      When the example range is sent to the example route
      Then the route refuses it as the caller's mistake
      And the refusal is "Request.Invalid"

    Scenario: A page that breaks a rule, and is not a form, is refused as the caller's mistake
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example page that sends the example command for the range it is given
      And an example range
      And it starts at 1
      When the example range is sent to the example route
      Then the route refuses it as the caller's mistake
      And the page does not say the server failed

  Rule: A request the application was not put together to take is the server's own failure

    Scenario: An API request nobody handles is answered as the server failing
      Given an example API route that sends the example command for the range it is given
      And an example range
      And it starts at 1
      And it ends at 5
      When the example range is sent to the example route
      Then the route answers that the server failed
      And the answer gives a reference to find it by

    Scenario: What went wrong is not told to the caller
      Given an example API route that sends the example command for the range it is given
      And an example range
      And it starts at 1
      And it ends at 5
      When the example range is sent to the example route
      Then the answer does not name "Mediator.Unhandled"

  Rule: An error page is kept for nobody but the reader it was made for

    An error page wears the same shell as any other page of the site, and the
    shell carries whether the reader is signed in: the account menu opens either
    on the ways in or on the reader's own pages. A cache between the site and
    its readers that kept one would hand the next reader a page saying they are
    somebody. Every other page the site sends says who it is for in its headers;
    these were the ones that did not, and a page nobody thinks of as personal is
    where a mistake like that survives longest.

    Scenario: A page that is not there is kept for the one reader only
      When a page that is not there is asked for
      Then the answer is kept for the one reader only

    Scenario: A page that is not there says what it varies by
      When a page that is not there is asked for
      Then the answer says it varies by the reader's cookies
      And the answer says it varies by the languages the browser asks for

    Scenario: A refused page is kept for the one reader only
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example page that sends the example command for the range it is given
      And an example range
      And it starts at 1
      When the example range is sent to the example route
      Then the answer is kept for the one reader only

    Scenario: A refused page says what it varies by
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example page that sends the example command for the range it is given
      And an example range
      And it starts at 1
      When the example range is sent to the example route
      Then the answer says it varies by the reader's cookies
      And the answer says it varies by the languages the browser asks for
