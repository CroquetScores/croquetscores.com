Feature: Asking whether a password is among those known to have been breached

  A password that has appeared in a breach is one an attacker will try first,
  however long it is, so the site refuses it wherever a password is set. Which
  passwords have been breached is not something the site can know for itself:
  it asks an outside service, and this is what the application wants of that
  asking.

  The answer is yes or no, and only that. The check is never told what to do
  about it. Refusing the password, or suspending registering while the service
  is down, is the caller's to say, and is specified with the caller.

  A password is checked as the reader meant it rather than as their keyboard
  happened to spell it, as the password hasher checks it: an accented letter
  typed as one character or as a letter followed by an accent is the same
  password. Nothing else is changed, and the check is told nothing of what a
  password may be — that is the password's own rule — so it asks about whatever
  it is given.

  When the service cannot be reached, the check says so with
  `BreachedPasswords.Unreachable`, rather than guessing: a password nobody
  checked is neither allowed nor refused.

  This feature describes what the application wants of the check rather than
  any one service, and every implementation is held to these scenarios. The
  step definitions decide what is behind them.

  Rule: A password is found only among those known to have been breached

    Scenario: A breached password is found
      Given a breached password check
      And "password123456" is known to have been breached
      When "password123456" is checked
      Then it is found to have been breached

    Scenario: A password not among them is not found
      Given a breached password check
      And "password123456" is known to have been breached
      When "correct horse battery staple" is checked
      Then it is not found to have been breached

    Scenario: The same password in a different case is not found
      Given a breached password check
      And "password123456" is known to have been breached
      When "Password123456" is checked
      Then it is not found to have been breached

  Rule: A password is checked as it was meant, however its accents were typed

    Scenario: An accent typed after its letter is found as one typed as part of it
      Given a breached password check
      And "café au lait" with its accent typed as part of the letter is known to have been breached
      When "café au lait" with its accent typed after the letter is checked
      Then it is found to have been breached

  Rule: A service that cannot be reached is said to be, not guessed at

    Scenario: A service that cannot be reached refuses the check
      Given a breached password check
      And the service cannot be reached
      When "correct horse battery staple" is checked
      Then the check is refused with "BreachedPasswords.Unreachable"
