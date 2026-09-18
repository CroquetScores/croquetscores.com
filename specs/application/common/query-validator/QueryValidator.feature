Feature: A query's validator names the query it validates

  A query validator holds the rules for what one kind of query may carry, and
  answers with every rule a query breaks, each with the fields of the query it
  reads. Which rules those are, and the order the broken ones come back in, are
  the query's own, written with the domain's rules for whatever it carries;
  what the validation behaviour does with the answer is specified with the
  behaviour.

  The fields are the query's own even where a rule was written for something
  smaller that the query carries in one of them, so that whoever shows a rule
  knows which of the query's fields it is about without being told a second
  time.

  What every validator shares is that it names the kind of query it is for, so
  registering it needs nothing but the validator, and it is never asked about
  any query but the one it says.

  This feature is written with the mediator's example requests and the
  validator's example range, which exist only to exercise what every validator
  shares.

  Background:
    Given a mediator whose requests are validated

  Rule: A validator is registered by the query it names, and validates only that

    Scenario: A validator registered on its own is asked about the query it names
      Given a handler registered for the example query
      And a validator that validates the example query
      And the validator is registered
      And an example range
      And it starts at -1
      When the example query is asked for the example range
      Then it is refused with "Request.Invalid"

    Scenario: A validator is not asked about a query other than the one it names
      Given a handler registered for the other query
      And a validator that validates the example query
      And the validator is registered
      When the other query is asked
      Then the answer is "found"
