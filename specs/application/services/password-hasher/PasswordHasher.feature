Feature: Keeping a password as something it can be checked against, and never as itself

  An account's password is never kept. What is kept is a hash of it: something
  a password typed later can be checked against, and that cannot be turned back
  into the password by anyone who gets hold of it. The password itself is never
  logged, never written anywhere, and never handed back.

  Hashing the same password twice gives two different hashes, each made with a
  salt of its own, so two accounts with the same password cannot be told apart
  by their hashes, and a table of hashes worked out in advance is no use against
  either of them.

  A password is checked as the reader meant it rather than as their keyboard
  happened to spell it. An accented letter can be typed as one character or as
  a letter followed by an accent, and the two look the same to whoever typed
  them, so both are taken as the same password. Nothing else is changed: case,
  spaces and every other character count.

  Which passwords are allowed is not the hasher's to say. That is a rule of the
  account's, specified with it. The hasher hashes whatever it is given.

  Checking a password when there is no hash to check it against — somebody
  signing in with an email address nobody registered — does not match, and takes
  as long as checking one against a real hash. Signing in is required to fail
  the same way, and in the same time, whether the address is unknown or the
  password is wrong, so that nobody can find out which addresses have accounts
  by timing the answer. The hasher is where that time is spent.

  A hash made some older way — at a lower cost than today's, or brought over
  from the old site — goes on being checked the way it was made, and a match
  says that the hash should be made again. Only when a password matches is
  there a password to make it from, so that is when it is said; whoever keeps
  the hash makes the new one and keeps it instead, and the older ways empty out
  as readers sign in. A password that does not match says nothing about the
  hash, since there is nothing to be done with it.

  This feature describes what the application wants of a hasher rather than any
  one way of hashing, and every implementation is held to these scenarios. The
  step definitions decide what is behind them.

  Rule: A password matches the hash made from it, and nothing else does

    Scenario: The password a hash was made from matches it
      Given a password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      And "correct horse battery staple" is checked against the hash
      Then it matches

    Scenario: A different password does not match
      Given a password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      And "correct horse battery stapler" is checked against the hash
      Then it does not match

    Scenario: The same password in a different case does not match
      Given a password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      And "Correct Horse Battery Staple" is checked against the hash
      Then it does not match

    Scenario: A long password differing only in its last character does not match
      Given a password hasher
      And a password of 100 characters ending in "a"
      When the password is hashed
      And the same password ending in "b" is checked against the hash
      Then it does not match

  Rule: A match says whether the hash should be made again

    Scenario: A hash made today need not be made again
      Given a password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      And "correct horse battery staple" is checked against the hash
      Then it matches
      And the hash need not be made again

    Scenario: A password that does not match says nothing about making the hash again
      Given a password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      And "wrong horse battery staple" is checked against the hash
      Then it does not match
      And the hash need not be made again

  Rule: A password is checked as it was meant, however its accents were typed

    Scenario: An accent typed as part of its letter matches one typed after it
      Given a password hasher
      And the password "café au lait" with its accent typed as part of the letter
      When the password is hashed
      And "café au lait" with its accent typed after the letter is checked against the hash
      Then it matches

  Rule: A hash gives nothing of the password away

    Scenario: The hash does not hold the password
      Given a password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      Then the hash does not contain "correct horse battery staple"

    Scenario: The same password hashed twice gives two different hashes
      Given a password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      And the password is hashed again
      Then the two hashes differ

    Scenario: Both hashes of the same password match it
      Given a password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      And the password is hashed again
      And "correct horse battery staple" is checked against the second hash
      Then it matches

  Rule: A password checked against no hash does not match, and takes as long as one checked against a hash

    Scenario: There being no hash does not match
      Given a password hasher
      When "correct horse battery staple" is checked against no hash
      Then it does not match

    Scenario: There being no hash takes as long as there being one
      Given a password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      And "wrong horse battery staple" is checked against the hash
      And "wrong horse battery staple" is checked against no hash
      Then checking against no hash took at least half as long as checking against the hash

  Rule: A hash nobody can read matches nothing

    A hash that cannot be read — cut short, from somewhere else, written by
    hand — is a mistake in whatever stored it. It matches nothing rather than
    failing, so that signing in with it fails the way any wrong password does
    and says nothing more about the account to whoever is trying.

    Scenario: A hash that cannot be read does not match
      Given a password hasher
      When "correct horse battery staple" is checked against the hash "not a hash"
      Then it does not match
