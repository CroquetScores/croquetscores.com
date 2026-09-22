Feature: Hashing a command's password before its transaction is opened

  A password is never kept, only a hash of it, and that hash is slow to make on
  purpose: it costs a measurable slice of a second and a good deal of memory,
  so that whoever steals a table of hashes pays that for every guess they make.
  The cost is the whole point of it, and it is paid every time a password is
  set.

  Where it is paid is what this is about. A handler that hashes for itself
  hashes from inside the transaction its command is running in, so that slice
  of a second is a pooled database connection held doing nothing, with the rows
  the command has already touched locked for the whole of it. Enough passwords
  set at once and every connection is being held by something that is not using
  the database, and the rest of the site waits for one. So the hashing is done
  in front of the transaction instead: the hash is made before a connection is
  borrowed, and the handler is handed the hash rather than the means to make
  one.

  It stands behind validation, and behind the asking of whether the password
  has been breached. A password breaking its own rules — missing, or shorter
  than a password may be — is refused without anything being spent on it, and a
  password already known to have been breached is refused without being hashed:
  the cost is worth paying only for a password that is going to be kept, and a
  hash of a breached password is a thing that need never exist.

  A command that sets a password says so, and says which of its fields holds
  it, which is the same saying the breached password check reads. Saying so is
  the command's because only the command knows what it is doing with the
  password it carries: signing in carries one too, and hashing that one would
  spend the slice of a second and answer nothing, since what signing in does
  with a password is check it against the hash already kept.

  The hash goes on with the command, so that its handler has it without asking
  anybody for it. A handler given a command that sets a password and no hash
  for it has been put together with nothing in front of it, which is a mistake
  in the code rather than anything to tell whoever sent the command, and what
  it says about that is specified with the handler.

  Hashing this early means hashing before anything is known about the rest of
  the command, so a password is hashed for a command its handler is about to
  refuse for some other reason — a link that has expired, an address already
  confirmed. That is a cost paid for work that comes to nothing, and it is
  accepted, because the alternative is paying the same cost while holding a
  connection that everything else is queuing for. What it costs is the site's
  own processor and nothing that anything else is waiting on.

  This feature is written with the mediator's example command, which sets a
  password when a scenario gives it one, and the other command, which never
  sets one; with a hasher the scenario can read afterwards; and with a
  behaviour standing in for the transaction, so that what does and does not
  reach a transaction can be said without opening one.

  Background:
    Given a mediator whose commands' passwords are hashed

  Rule: A command setting a password is handed the hash of it

    Scenario: The handler is given a hash of the password the command sets
      Given a handler registered for the example command
      And an example command
      And it sets the password "correct horse battery staple"
      When the example command is sent
      Then the handler was given a hash of "correct horse battery staple"

    Scenario: A command setting a password goes on to its handler
      Given a handler registered for the example command that answers "recorded"
      And an example command
      And it sets the password "correct horse battery staple"
      When the example command is sent
      Then the answer is "recorded"

  Rule: The password hashed is the one the command says it sets

    Hashed as it will be kept, which is with the whitespace at either end taken
    off: a password is trimmed wherever one is made from what a command
    carries. A password typed with a space after it would otherwise be kept as
    the hash of something nobody will ever type again, and its owner locked out
    by the very thing they typed.

    Scenario: The password the command sets is the password hashed
      Given a handler registered for the example command
      And an example command
      And it sets the password "correct horse battery staple"
      When the example command is sent
      Then the password hashed was "correct horse battery staple"

    Scenario: The spaces around a password are not part of what is hashed
      Given a handler registered for the example command
      And an example command
      And it sets the password "  correct horse battery staple  "
      When the example command is sent
      Then the password hashed was "correct horse battery staple"

    Scenario: A field the command sets no password from is not hashed
      Given a handler registered for the example command
      And an example command
      And it sets the password "correct horse battery staple"
      And it also carries "hunter2 and more" in a field it sets no password from
      When the example command is sent
      Then the password hashed was "correct horse battery staple"

  Rule: A command that sets no password is not hashed

    Scenario: A command that sets no password is handled
      Given a handler registered for the other command that answers "recorded"
      When the other command is sent
      Then the answer is "recorded"

    Scenario: Nothing is hashed for a command that sets no password
      Given a handler registered for the other command
      When the other command is sent
      Then no password was hashed

  Rule: The password is hashed before anything behind the hashing runs

    This is the whole reason for the behaviour, so it is said as an order of
    events rather than left to follow from where the behaviour was registered.
    A hash that happened to be made inside the transaction would pass every
    other scenario here and still hold a connection for as long as the hashing
    takes, which is the thing this was written to stop.

    Scenario: The password is hashed before the transaction is opened
      Given a command behaviour called "the transaction"
      And a handler registered for the example command
      And an example command
      And it sets the password "correct horse battery staple"
      When the example command is sent
      Then the first thing to happen is "the password is hashed"
      And the next thing to happen is "the transaction, going in"
      And the next thing to happen is "the handler"
      And the next thing to happen is "the transaction, coming out"
      And nothing else happens

  Rule: The password is hashed whatever its handler goes on to do

    The hash is made before the handler has looked at anything else the command
    carries, so it is made for a command that is about to be refused as much as
    for one that is about to be carried out. There is nothing to be done about
    that from here: whether the command is worth carrying out is the handler's
    to say, and it cannot say so until it is inside the transaction this stands
    in front of.

    Scenario: A password is hashed for a command its handler refuses
      Given a handler registered for the example command that fails
      And an example command
      And it sets the password "correct horse battery staple"
      When the example command is sent
      Then the password hashed was "correct horse battery staple"

    Scenario: A command whose handler fails fails with the handler's own failure
      Given a handler registered for the example command that fails
      And an example command
      And it sets the password "correct horse battery staple"
      When the example command is sent
      Then sending it fails with the handler's own failure
