Feature: Hashing passwords with argon2id

  The application's password hasher is argon2id: the form of Argon2 that
  withstands both guessing on specialised hardware and reading what the hash
  left behind in memory, and the one recommended for passwords. Everything the
  application wants of a hasher is specified with the hasher, and this one is
  held to those scenarios. What is here is what choosing argon2id adds.

  Its cost is set at the least that is currently recommended — 19 MiB of memory,
  2 passes and 1 lane — so that each guess costs an attacker that much, and a
  reader signing in waits a moment rather than a while. A hash records the cost
  it was made with, so raising the cost later leaves every hash already kept
  still able to be checked, each at the cost it was made with; and a hash made
  at less than today's cost says, when its password matches, that it should be
  made again. So does one made with a different number of lanes: more lanes
  are not more cost, and fewer are not less, so a hash not made with today's
  is made again with them.

  Rule: A hash is argon2id, at no less than the recommended cost

    Scenario: The hash says it was made with argon2id
      Given the argon2 password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      Then the hash says it was made with "argon2id"

    Scenario: The hash costs at least 19 MiB of memory
      Given the argon2 password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      Then the hash says it costs at least 19456 KiB of memory

    Scenario: The hash costs at least 2 passes
      Given the argon2 password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      Then the hash says it costs at least 2 passes

  Rule: A hash made at a lower cost can still be checked, and should be made again

    Scenario: A password matches a hash made at a lower cost than today's
      Given the argon2 password hasher
      And the password "correct horse battery staple"
      And a hash of it made at 8192 KiB of memory and 1 pass
      When "correct horse battery staple" is checked against that hash
      Then it matches

    Scenario: A hash made at a lower cost than today's should be made again
      Given the argon2 password hasher
      And the password "correct horse battery staple"
      And a hash of it made at 8192 KiB of memory and 1 pass
      When "correct horse battery staple" is checked against that hash
      Then the hash should be made again

    Scenario: A hash made with a different number of lanes should be made again
      Given the argon2 password hasher
      And the password "correct horse battery staple"
      And a hash of it made with 2 lanes
      When "correct horse battery staple" is checked against that hash
      Then the hash should be made again
