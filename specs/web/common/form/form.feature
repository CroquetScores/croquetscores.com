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
  range — a start, an end and a step — and a passphrase, and sends them in an
  example request of its own. The passphrase has rules of its own, written for
  a passphrase alone rather than for the request that carries it:

    Passphrase.Missing    nothing is given
    Passphrase.TooShort   something is given, and it is under 12 characters

  The form has three more rules that no catalogue anywhere has words for,
  which exist so that what a form does with such a rule can be seen. Two of
  them read the passphrase and are broken together, so that one place has two
  of them to say; the third reads the start and the end:

    Example.Unworded        the passphrase is "unworded passphrase"
    Example.AlsoUnworded    the passphrase is "unworded passphrase"
    Example.UnwordedRange   a start is given, and the end is the same

  The words the example form shows for each rule are in the reader's language,
  and are named here by the rule's code, never by their wording.

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

  Rule: A rule written for something the request carries goes beneath the field that carries it

    Scenario: A passphrase left empty says so
      Given "1" is typed into the start field
      And "5" is typed into the end field
      When the dialog is submitted
      Then the passphrase field says the message for "Passphrase.Missing"

    Scenario: A passphrase that is too short says so
      Given "1" is typed into the start field
      And "5" is typed into the end field
      And "open sesame" is typed into the passphrase field
      When the dialog is submitted
      Then the passphrase field says the message for "Passphrase.TooShort"

    Scenario: A passphrase long enough says nothing
      Given "1" is typed into the start field
      And "-3" is typed into the step field
      And "correct horse battery" is typed into the passphrase field
      When the dialog is submitted
      Then the passphrase field has no message

  Rule: A rule the catalogue has no words for is still said

    A rule is said in words looked up by its code, in the reader's language and
    then in the site's first, so a rule is only unworded when neither has
    anything (`language.feature`). That is a mistake in the catalogue rather
    than in what was typed, and it is whoever added the rule who has to put it
    right.

    Until they do, the reader broke a rule and is owed saying so. The form says
    it in the catalogue's words for a rule it cannot name: something here is not
    right, and where to look. Showing the form again with nothing marked would
    read as a button that did nothing, and an error page would say the site is
    broken when what is wrong is what was typed.

    Where it is said does not change. A rule with no words goes beneath its
    field where it reads one, and above the fields where it reads more, as any
    other rule does.

    Two such rules in the same place say it once. They are the same sentence,
    and a reader told twice that something is not right learns nothing the
    second time and would look for a second fault.

    Scenario: A rule with no words is said beneath the field it reads
      Given "1" is typed into the start field
      And "5" is typed into the end field
      And "unworded passphrase" is typed into the passphrase field
      When the dialog is submitted
      Then the passphrase field says the message for "form.otherwise"

    Scenario: A field whose only broken rule has no words is marked as wrong
      Given "1" is typed into the start field
      And "5" is typed into the end field
      And "unworded passphrase" is typed into the passphrase field
      When the dialog is submitted
      Then the passphrase field is marked as wrong

    Scenario: Two rules with no words are said once
      Given "1" is typed into the start field
      And "5" is typed into the end field
      And "unworded passphrase" is typed into the passphrase field
      When the dialog is submitted
      Then the passphrase field says one message

    Scenario: A rule with no words about more than one field is said above the fields
      Given "7" is typed into the start field
      And "7" is typed into the end field
      And "correct horse battery" is typed into the passphrase field
      When the dialog is submitted
      Then the message for "form.otherwise" is above the fields

    Scenario: A form refused only by a rule with no words is shown again
      Given "7" is typed into the start field
      And "7" is typed into the end field
      And "correct horse battery" is typed into the passphrase field
      When the dialog is submitted
      Then the form is shown again as refused

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

  Rule: Only text that was typed is put back

    A browser sends what was typed in each field as text, once. Anything else
    that arrives under a field's name — the field sent twice, or a body that is
    not a form's at all — was not typed into the form. It is not put back, and
    the form is not made to fail on it: the form is shown again as though
    nothing had been typed there.

    Scenario: A field sent twice is shown empty
      Given the form sends the start field twice
      And "-1" is typed into the start field
      When the dialog is submitted
      Then the start field is empty

    Scenario: A field sent twice does not make the form fail
      Given the form sends the start field twice
      And "-1" is typed into the start field
      When the dialog is submitted
      Then the form is shown again as refused

    Scenario: A body that is not a form's is answered with the form
      When a body that is not a form's is sent to the example form
      Then the sender is answered with the form, refused

  Rule: The reader is taken to the first thing that needs attention

    A form can carry a notice, something the reader needs telling before
    anything else, and a reader arriving at one is ordinarily taken to it. Once
    something on the form needs attention, that comes first: the reader is
    taken to it, and the notice is still there to read.

    Scenario: The first field that broke a rule is where the reader is taken
      Given "1" is typed into the start field
      And "3" is typed into the step field
      When the dialog is submitted
      Then the reader is taken to the end field

    Scenario: A rule about more than one field is where the reader is taken when it is the only one
      Given "5" is typed into the start field
      And "1" is typed into the end field
      And "correct horse battery" is typed into the passphrase field
      When the dialog is submitted
      Then the reader is taken to the message above the fields

    Scenario: A notice does not take the reader from the field that needs attention
      Given the example form is open with a notice
      And "1" is typed into the start field
      And "3" is typed into the step field
      When the dialog is submitted
      Then the reader is taken to the end field
