Feature: Asking whether a command's password has been breached before its transaction is opened

  A password that has appeared in a breach is one an attacker will try first,
  so the site refuses it wherever a password is set. Which passwords have been
  breached is not something the site can know for itself: it asks an outside
  service, and what that asking is worth is specified with the breached
  password check.

  Where the asking happens is what this is about. A handler that asks for
  itself asks from inside the transaction its command is running in, and a
  transaction held open across a request to another site holds a database
  connection for as long as that site takes to answer. A service having a slow
  afternoon is then a site with no connections left, which is a great deal
  worse than a site that cannot check a password. So the asking is done in
  front of the transaction instead: the password is checked before a connection
  is borrowed, and one that has been breached is refused without a transaction
  ever being opened.

  It stands behind validation, though. A password that breaks its own rules —
  missing, or shorter than a password may be — is refused without going near
  the network, and somebody who typed four characters is owed that answer
  rather than a wait on another site. What a password may be is the password's
  own rule, asked in front of this; what is asked here is only whether the
  password has been breached.

  A command that sets a password says so, and says which of its fields holds
  it. Saying so is the command's because only the command knows what it is
  doing with the password it carries: signing in carries one too, and checking
  that one would turn a breach into a reader locked out of the very account
  they need to get into to change it. A command that says nothing goes past
  untouched, and nothing is asked about it.

  A breached password is refused the way a password too short is refused —
  `Request.Invalid`, naming `Password.Breached` against the field it came in —
  because it is the same thing to whoever typed it: something wrong with what
  they typed, told to them beside the field they typed it into.

  This stands in the command's line alone, since nothing a query does sets a
  password.

  This feature is written with the mediator's example command, which sets a
  password when a scenario gives it one, and the other command, which never
  sets one; with a check the scenario tells what has been breached; and with a
  behaviour standing in for the transaction, so that what does and does not
  reach a transaction can be said without opening one.

  Background:
    Given a mediator whose commands' passwords are checked

  Rule: A command setting a breached password is refused

    Scenario: A command setting a breached password is refused
      Given "password123456" is known to have been breached
      And a handler registered for the example command
      And an example command
      And it sets the password "password123456"
      When the example command is sent
      Then it is refused with "Request.Invalid"

    Scenario: The refusal says the password has been breached
      Given "password123456" is known to have been breached
      And a handler registered for the example command
      And an example command
      And it sets the password "password123456"
      When the example command is sent
      Then the first rule broken is "Password.Breached"
      And no other rule is broken

    Scenario: The refusal says which field the password came in
      Given "password123456" is known to have been breached
      And a handler registered for the example command
      And an example command
      And it sets the password "password123456"
      When the example command is sent
      Then the first rule broken is "Password.Breached"
      And it reads the field "password"
      And it reads no other field

  Rule: A command setting a password not among them goes on to its handler

    Scenario: A command setting a password not among them is handled
      Given "password123456" is known to have been breached
      And a handler registered for the example command that answers "recorded"
      And an example command
      And it sets the password "correct horse battery staple"
      When the example command is sent
      Then the answer is "recorded"

  Rule: Nothing behind the check sees a command setting a breached password

    Scenario: The handler of a command setting a breached password is not called
      Given "password123456" is known to have been breached
      And a handler registered for the example command
      And an example command
      And it sets the password "password123456"
      When the example command is sent
      Then the example command's handler has not been called

    Scenario: No transaction is opened for a command setting a breached password
      Given a command behaviour called "the transaction"
      And "password123456" is known to have been breached
      And a handler registered for the example command
      And an example command
      And it sets the password "password123456"
      When the example command is sent
      Then nothing called "the transaction" happens

  Rule: The password is checked before anything behind the check runs

    This is the whole reason for the behaviour, so it is said as an order of
    events rather than left to follow from where the behaviour was registered.
    A check that happened to run inside the transaction would pass every other
    scenario here and still hold a connection open across the network, which is
    the thing this was written to stop.

    Scenario: The password is checked before the transaction is opened
      Given a command behaviour called "the transaction"
      And a handler registered for the example command
      And an example command
      And it sets the password "correct horse battery staple"
      When the example command is sent
      Then the first thing to happen is "the password is checked"
      And the next thing to happen is "the transaction, going in"
      And the next thing to happen is "the handler"
      And the next thing to happen is "the transaction, coming out"
      And nothing else happens

  Rule: The password checked is the one the command says it sets

    Scenario: The password the command sets is the password checked
      Given a handler registered for the example command
      And an example command
      And it sets the password "correct horse battery staple"
      When the example command is sent
      Then the password checked was "correct horse battery staple"

    Scenario: A field the command sets no password from is not checked
      Given "hunter2 and more" is known to have been breached
      And a handler registered for the example command that answers "recorded"
      And an example command
      And it sets the password "correct horse battery staple"
      And it also carries "hunter2 and more" in a field it sets no password from
      When the example command is sent
      Then the answer is "recorded"

  Rule: A command that sets no password is not checked

    Scenario: A command that sets no password is handled
      Given "password123456" is known to have been breached
      And a handler registered for the other command that answers "recorded"
      When the other command is sent
      Then the answer is "recorded"

    Scenario: Nothing is asked about a command that sets no password
      Given a handler registered for the other command
      When the other command is sent
      Then no password was checked

  Rule: A service that cannot be reached refuses the command rather than guessing

    A password nobody could check is neither allowed nor refused here. Letting
    it through would admit the very passwords this is here to stop, at the one
    moment nobody can tell which they are; refusing it as breached would tell
    somebody something untrue about a password that may be perfectly good, and
    send them away to think of another for no reason.

    So the check's own refusal is passed out as it came, and what to do about
    it is decided where the command was sent from. The page that sent it shows
    the form again, says the password cannot be checked just now, and leaves
    the reader's link unspent, which is specified with the page.

    Scenario: A command whose password could not be checked is refused
      Given the service cannot be reached
      And a handler registered for the example command
      And an example command
      And it sets the password "correct horse battery staple"
      When the example command is sent
      Then it is refused with "BreachedPasswords.Unreachable"

    Scenario: The handler is not called when the password could not be checked
      Given the service cannot be reached
      And a handler registered for the example command
      And an example command
      And it sets the password "correct horse battery staple"
      When the example command is sent
      Then the example command's handler has not been called

    Scenario: No transaction is opened when the password could not be checked
      Given a command behaviour called "the transaction"
      And the service cannot be reached
      And a handler registered for the example command
      And an example command
      And it sets the password "correct horse battery staple"
      When the example command is sent
      Then nothing called "the transaction" happens
