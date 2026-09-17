Feature: Holding the rules for a kind of value in one place

  The rules for a kind of value are asked two different questions. Somebody who
  typed a candidate is owed everything wrong with it at once, rather than one
  fault per attempt. A value about to be made from a candidate needs only to know
  whether it may be, and a candidate that breaks a rule by then is a mistake in
  the code that got it there, so the first rule broken is reason enough to refuse.

  A validator holds the rules once and answers both, so the two answers can never
  disagree about what is valid.

  Rules are reported as codes. A code is the contract; the words somebody reads
  are the caller's business. Which codes there are belongs to whoever declares
  the rules, not to the validator.

  This feature is written with an example range, which exists only to exercise
  the validator. A range has a start, an end and a step, any of which may be
  missing. Its rules, in the order they are declared:

    Range.StartMissing     the start is missing
    Range.EndMissing       the end is missing
    Range.StartNegative    the start is below zero
    Range.StepNotPositive  a step is given and is not above zero
    Range.EndBeforeStart   the end is below the start

  The last reads two fields, the start and the end. The others read one each.

  Rule: Checking reports every rule broken, in the order the rules are declared

    Scenario: A candidate that breaks no rule is valid
      Given an example range
      And it starts at 1
      And it ends at 5
      When the example range is checked
      Then no rule is broken

    Scenario: A candidate that breaks one rule is told which
      Given an example range
      And it starts at 1
      When the example range is checked
      Then the first rule broken is "Range.EndMissing"
      And no other rule is broken

    Scenario: A candidate that breaks several rules is told each, in the order they were declared
      Given an example range
      And it starts at -1
      When the example range is checked
      Then the first rule broken is "Range.EndMissing"
      And the next rule broken is "Range.StartNegative"
      And no other rule is broken

  Rule: A rule that reads several fields says nothing while any of them is broken

    Comparing a field that is already wrong can only produce a second complaint
    about the same mistake, and one that would send whoever reads it looking in
    the wrong place. So a rule reading several fields waits until each of them is
    valid, and is considered after every rule that reads one.

    Scenario: A rule reading several fields is reported when they are all valid
      Given an example range
      And it starts at 5
      And it ends at 3
      When the example range is checked
      Then the first rule broken is "Range.EndBeforeStart"
      And no other rule is broken

    Scenario: A rule reading several fields says nothing when one of them is missing
      Given an example range
      And it ends at 3
      When the example range is checked
      Then the first rule broken is "Range.StartMissing"
      And no other rule is broken

    Scenario: A rule reading several fields says nothing when one of them breaks a rule
      Given an example range
      And it starts at -5
      And it ends at -7
      When the example range is checked
      Then the first rule broken is "Range.StartNegative"
      And no other rule is broken

    Scenario: A broken field the rule does not read leaves it to be reported, after every rule reading one field
      Given an example range
      And it starts at 5
      And it ends at 3
      And it steps by 0
      When the example range is checked
      Then the first rule broken is "Range.StepNotPositive"
      And the next rule broken is "Range.EndBeforeStart"
      And no other rule is broken

  Rule: Requiring a candidate to be valid refuses it on the first rule broken

    Scenario: A valid candidate is not refused
      Given an example range
      And it starts at 1
      And it ends at 5
      When the example range is required to be valid
      Then it is not refused

    Scenario: A candidate that breaks several rules is refused for the first
      Given an example range
      And it starts at -1
      When the example range is required to be valid
      Then it is refused for breaking "Range.EndMissing"

  Rule: A refusal names the rule broken and nothing else

    A refusal is a defect in the calling code, and is likely to be logged. It
    carries the code so that whoever catches it can tell which rule, and says
    nothing about the candidate, which may be something somebody typed.

    Scenario: A refusal's message is only the code
      Given an example range
      And it starts at -1
      When the example range is required to be valid
      Then the refusal's message is only "Range.EndMissing"

    Scenario: A refusal can be told apart from any other failure
      Given an example range
      And it starts at -1
      When the example range is required to be valid
      Then the refusal is a validation refusal
