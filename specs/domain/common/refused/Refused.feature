Feature: Refusing, by a code

  Whatever will not do what it was asked says so by throwing a refusal: an
  account asked to sign in when it is forgotten, a handler sent a link that has
  been spent, a store asked to read an event nobody named. Each kind of
  refusal is its own kind of error, so that whoever catches one can tell it
  from the rest, and each names what went wrong by a code.

  The code is the contract. It is what whoever asked decides by, what a page
  turns into words, and what a scenario says it expects. The message is only
  for whoever reads the log, and a refusal that happened because something
  else failed carries that as its cause, so the log can say both.

  Every kind of refusal is made the same way, so that none of them can say
  its code, its name or its cause differently from the rest. This feature is
  written with an example kind, which exists only to exercise what they share.

  Rule: A refusal says what was refused, and why

    Scenario: A refusal says its code
      When the example is refused with "Example.Refused" and the message "It would not."
      Then the refusal's code is "Example.Refused"

    Scenario: A refusal says its message
      When the example is refused with "Example.Refused" and the message "It would not."
      Then the refusal's message is "It would not."

    Scenario: A refusal is named after its kind
      When the example is refused with "Example.Refused" and the message "It would not."
      Then the refusal is named "ExampleRefused"

    Scenario: A refusal is its own kind of error
      When the example is refused with "Example.Refused" and the message "It would not."
      Then the refusal is of the example kind

  Rule: A refusal caused by another failure carries it

    Scenario: A refusal carries the failure that caused it
      When the example is refused with "Example.Refused" because the store failed
      Then the refusal's cause is the store's failure

    Scenario: A refusal with no cause carries none
      When the example is refused with "Example.Refused" and the message "It would not."
      Then the refusal has no cause
