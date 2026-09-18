Feature: Refusing a request that breaks its rules before anything acts on it

  Most requests carry something somebody typed: a name, a score, a range of
  dates. Each kind of request has rules for what it may carry, held once in a
  validator beside the request. The validation behaviour asks those rules about
  every request on its way in, and one that breaks any of them goes no further:
  its handler never sees it, and nor does anything behind it in the line of
  behaviours — the transaction a command would otherwise open among them — so a
  request that was never going to be carried out costs nothing but the asking.

  Somebody who typed the request is owed everything wrong with it at once,
  rather than one fault per attempt. So a refused request is refused with every
  rule it breaks, in the order the rules are declared, which is what checking a
  candidate against its validator gives. The rules themselves, and what order
  they come in, are specified with the validator; what is here is what the
  behaviour does with the answer.

  Commands and queries are validated alike. Each side of the mediator has its
  own line of behaviours, and validation stands in both.

  This feature is written with the mediator's example command and example
  query, each asking for an example range, and with the validator's example
  range and its rules, all of which exist only to exercise the behaviour.

  Background:
    Given a mediator whose requests are validated

  Rule: A request that breaks no rule goes on to its handler

    Scenario: A command that breaks no rule is handled
      Given a validator registered for the example command
      And a handler registered for the example command that answers "recorded"
      And an example range
      And it starts at 1
      And it ends at 5
      When the example command is sent for the example range
      Then the answer is "recorded"

    Scenario: A query that breaks no rule is answered
      Given a validator registered for the example query
      And a handler registered for the example query that answers "found"
      And an example range
      And it starts at 1
      And it ends at 5
      When the example query is asked for the example range
      Then the answer is "found"

  Rule: A request that breaks a rule is refused with every rule it breaks

    Scenario: A command that breaks a rule is refused
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example range
      And it starts at 1
      When the example command is sent for the example range
      Then it is refused with "Request.Invalid"

    Scenario: A command is refused with every rule it breaks, in the order they are declared
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example range
      And it starts at -1
      When the example command is sent for the example range
      Then the first rule broken is "Range.EndMissing"
      And the next rule broken is "Range.StartNegative"
      And no other rule is broken

    Scenario: A refusal says which fields each rule broken reads
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example range
      And it starts at 5
      And it ends at 3
      When the example command is sent for the example range
      Then the first rule broken is "Range.EndBeforeStart"
      And it reads the field "start"
      And it reads the field "end"
      And it reads no other field

    Scenario: A query that breaks a rule is refused with every rule it breaks
      Given a validator registered for the example query
      And a handler registered for the example query
      And an example range
      And it starts at -1
      When the example query is asked for the example range
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Range.EndMissing"
      And the next rule broken is "Range.StartNegative"
      And no other rule is broken

  Rule: Nothing after validation sees a request that breaks a rule

    Scenario: The handler of a command that breaks a rule is not called
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example range
      And it starts at 1
      When the example command is sent for the example range
      Then the example command's handler has not been called

    Scenario: The handler of a query that breaks a rule is not called
      Given a validator registered for the example query
      And a handler registered for the example query
      And an example range
      And it starts at 1
      When the example query is asked for the example range
      Then the example query's handler has not been called

    Scenario: A behaviour behind validation never sees a command that breaks a rule
      Given a command behaviour called "behind validation"
      And a validator registered for the example command
      And a handler registered for the example command
      And an example range
      And it starts at 1
      When the example command is sent for the example range
      Then nothing called "behind validation" happens

  Rule: A request with no validator goes on unchecked

    Not every request carries anything to check, and one that does not should
    not have to be given rules that say so. A request nobody gave a validator is
    passed on as it is. That is not a way for anything invalid to get in:
    whatever the handler makes from what the request carries is required to be
    valid where it is made, and fails there — as a mistake in the code that let
    it through, rather than as something to tell whoever sent it.

    Scenario: A command with no validator is handled
      Given a handler registered for the example command that answers "recorded"
      And an example range
      And it starts at -1
      When the example command is sent for the example range
      Then the answer is "recorded"

  Rule: A request has at most one validator

    Two validators for one request would leave which rules apply, and in which
    order the rules broken come back, to the order they happened to be
    registered in. That is a mistake in how the application was put together,
    and is refused when it is made.

    Scenario: A second validator for the same command is refused
      Given a validator registered for the example command
      When another validator is registered for the example command
      Then registering it is refused with "Validation.AlreadyValidated"

    Scenario: A second validator for the same query is refused
      Given a validator registered for the example query
      When another validator is registered for the example query
      Then registering it is refused with "Validation.AlreadyValidated"
