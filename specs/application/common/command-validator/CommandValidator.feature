Feature: A command's validator names the command it validates

  A command validator holds the rules for what one kind of command may carry,
  and answers with every rule a command breaks, each with the fields of the
  command it reads. Which rules those are, and the order the broken ones come
  back in, are the command's own, written with the domain's rules for whatever
  it carries; what the validation behaviour does with the answer is specified
  with the behaviour.

  The fields are the command's own even where a rule was written for something
  smaller that the command carries in one of them — an email address, a name —
  so that whoever shows a rule knows which of the command's fields it is about
  without being told a second time.

  What every validator shares is that it names the kind of command it is for,
  so registering it needs nothing but the validator, and it is never asked
  about any command but the one it says.

  This feature is written with the mediator's example requests and the
  validator's example range, which exist only to exercise what every validator
  shares.

  Background:
    Given a mediator whose requests are validated

  Rule: A validator is registered by the command it names, and validates only that

    Scenario: A validator registered on its own is asked about the command it names
      Given a handler registered for the example command
      And a validator that validates the example command
      And the validator is registered
      And an example range
      And it starts at -1
      When the example command is sent for the example range
      Then it is refused with "Request.Invalid"

    Scenario: A validator is not asked about a command other than the one it names
      Given a handler registered for the other command
      And a validator that validates the example command
      And the validator is registered
      When the other command is sent
      Then the answer is "handled"
