@browser
Feature: A form whose request breaks its rules is shown again, saying what is wrong

  A form sends what was typed as a command. When the command is refused for
  breaking its rules, the reader is not sent to an error page: the form is
  shown again, as it was, with each rule broken said beneath the field it is
  about. Whoever typed it is owed every rule at once, rather than one fault per
  attempt, and owed it where they will look — beside what they typed.

  What was typed goes back into its field, so that nothing has to be typed
  twice. A password does not: it is never written into a page, and the reader
  types it again.

  Which field a rule is about is not the form's to say. The domain declares
  it with the rule, and the refusal carries it, so a form's fields are named
  for the request's and a rule goes beneath whichever field it reads. A rule
  reading more than one field at once — a range that ends before it starts — is
  about no one of them, so it is said above the fields rather than beneath any.
  All a form supplies is the words, in the reader's language.

  A field that broke more than one rule says each of them: whoever typed it is
  owed every rule at once, including two about the same field.

  Only a field that broke a rule is marked as wrong, and only then. A form
  opened fresh says nothing: nobody has got anything wrong yet.

  The reader is taken to the first thing that needs attention, so that a
  screen reader starts there and nobody has to hunt down the page for it. The
  public pages work without scripting, and so does this.

  These scenarios use an example form, which asks for the validator's example
  range — a start, an end and a step — and a passphrase that no rule is about,
  and sends the example command. The words it shows for each rule are its
  own, in the reader's language, and are named here by the rule's code, never
  by their wording.

  Background:
    Given a viewport 1200 pixels wide
    And the example form is open

  Rule: A form says nothing until something is wrong

    Scenario: A form opened fresh has no messages
      Then no field in the dialog has a message

    Scenario: A form opened fresh marks nothing as wrong
      Then no field in the dialog is marked as wrong

  Rule: A refused form is shown again with each rule beneath its field

    Scenario: The form is shown again
      Given "-1" is typed into the start field
      And "5" is typed into the end field
      When the dialog is submitted
      Then the form is shown again as refused

    Scenario: A field that broke a rule says which, beneath itself
      Given "-1" is typed into the start field
      And "5" is typed into the end field
      When the dialog is submitted
      Then the start field says the message for "Range.StartNegative"

    Scenario: Every field that broke a rule says so
      Given "-1" is typed into the start field
      When the dialog is submitted
      Then the start field says the message for "Range.StartNegative"
      And the end field says the message for "Range.EndMissing"

    Scenario: A field that broke two rules says both
      Given "1" is typed into the start field
      And "5" is typed into the end field
      And "-3" is typed into the step field
      When the dialog is submitted
      Then the step field says the message for "Range.StepNotPositive"
      And the step field says the message for "Range.StepNotRound"

    Scenario: A field that broke a rule is marked as wrong
      Given "-1" is typed into the start field
      And "5" is typed into the end field
      When the dialog is submitted
      Then the start field is marked as wrong

    Scenario: A field that broke no rule has no message
      Given "-1" is typed into the start field
      And "5" is typed into the end field
      When the dialog is submitted
      Then the end field has no message

    Scenario: A field that broke no rule is not marked as wrong
      Given "-1" is typed into the start field
      And "5" is typed into the end field
      When the dialog is submitted
      Then the end field is not marked as wrong

    Scenario: A message is announced with its field
      Given "-1" is typed into the start field
      When the dialog is submitted
      Then every message in the dialog is announced with its field

  Rule: A rule about more than one field is said above the fields

    Scenario: A range that ends before it starts is said above the fields
      Given "5" is typed into the start field
      And "1" is typed into the end field
      When the dialog is submitted
      Then the message for "Range.EndBeforeStart" is above the fields

    Scenario: Neither field it reads is said to be wrong
      Given "5" is typed into the start field
      And "1" is typed into the end field
      When the dialog is submitted
      Then the start field has no message
      And the end field has no message

  Rule: What was typed is kept, except a password

    Scenario: What was typed is back in its field
      Given "-1" is typed into the start field
      And "5" is typed into the end field
      When the dialog is submitted
      Then the start field holds "-1"
      And the end field holds "5"

    Scenario: A password is not put back
      Given "-1" is typed into the start field
      And "open sesame" is typed into the passphrase field
      When the dialog is submitted
      Then the passphrase field is empty

  Rule: The reader is taken to the first thing that needs attention

    Scenario: The first field that broke a rule is where the reader is taken
      Given "1" is typed into the start field
      And "3" is typed into the step field
      When the dialog is submitted
      Then the reader is taken to the end field

    Scenario: A rule about more than one field is where the reader is taken when it is the only one
      Given "5" is typed into the start field
      And "1" is typed into the end field
      When the dialog is submitted
      Then the reader is taken to the message above the fields
