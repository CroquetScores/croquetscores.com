Feature: Keeping the old site's password hashes safe until their passwords are known

  The accounts brought over from the old site bring their password hashes with
  them, made by the old site's hasher, which is far cheaper to guess against
  than argon2id. They cannot be made again today's way, because that takes the
  password, and nobody has it until its reader signs in.

  So an old hash is never kept as it is. It is imported by hashing it again,
  with argon2id at today's cost, and the result is marked as imported. The old
  site kept each account's salt in the same string as its hash; the salt is
  not a secret, and is kept with the imported hash, since a password cannot be
  put through the old hasher without it. What goes through argon2id is the old
  hash alone. An old hash the old site could not have made cannot be read, and
  is refused rather than imported. From the
  moment of the import, guessing a password costs what guessing against any
  other hash costs: each guess has to go through the old hasher and then
  through argon2id. An imported hash does not hold the old hash either, so
  nothing kept here can be used against the old site's copies.

  A password is checked against an imported hash by putting it through the old
  hasher first, and checking the result. The mark says which way a hash is
  checked, and it is checked that way only:

    - It costs one check, like any other hash, so a wrong password takes as
      long whether its account was imported or not, and nobody can tell which
      accounts came from the old site by timing the answer.
    - The old hash itself is not a password. Tried the other way first, an
      imported hash would match the old hash typed in as a password, and anyone
      holding a copy of the old site's database could sign in to every account
      it has without working out a single password.

  An imported hash whose password matches says that it should be made again,
  so that each is replaced by an ordinary hash the first time its reader signs
  in, and the old way empties out. The old hasher can be taken away once
  nothing marked as imported is left.

  The old hasher is given each password exactly as the old site was given it.
  How a password is checked everywhere else — an accent counting the same
  however it was typed — is not applied first, because the old site did not
  apply it, and a reader whose password has an accent in it would never match
  their own hash.

  How the old site's hasher works is specified with it. These scenarios use
  hashes it made.

  Rule: An old hash is imported by hashing it again, never kept as it is

    Scenario: An imported hash is marked as imported
      Given the old site's hash of "correct horse battery staple"
      When the old hash is imported
      Then the imported hash says it was imported

    Scenario: An imported hash does not hold the old hash
      Given the old site's hash of "correct horse battery staple"
      When the old hash is imported
      Then the imported hash does not contain the old hash

    Scenario: An old hash that cannot be read is refused
      Given an old hash "not an old hash"
      When the old hash is imported
      Then it is refused with "OldSitePassword.Unreadable"

    Scenario: An imported hash costs what today's hash costs
      Given the old site's hash of "correct horse battery staple"
      When the old hash is imported
      Then the imported hash says it costs at least 19456 KiB of memory
      And the imported hash says it costs at least 2 passes

  Rule: An imported hash matches the password the old hash was made from

    Scenario: The password the old hash was made from matches
      Given a password hasher
      And the old site's hash of "correct horse battery staple"
      When the old hash is imported
      And "correct horse battery staple" is checked against the imported hash
      Then it matches

    Scenario: A different password does not match
      Given a password hasher
      And the old site's hash of "correct horse battery staple"
      When the old hash is imported
      And "wrong horse battery staple" is checked against the imported hash
      Then it does not match

  Rule: The old hash is not a password

    Scenario: The old hash typed in as a password does not match
      Given a password hasher
      And the old site's hash of "correct horse battery staple"
      When the old hash is imported
      And the old hash is checked, as a password, against the imported hash
      Then it does not match

  Rule: A hash is checked one way only, the way its mark says

    Scenario: A wrong password against an imported hash costs one check
      Given a password hasher
      And the old site's hash of "correct horse battery staple"
      When the old hash is imported
      And "wrong horse battery staple" is checked against the imported hash
      Then argon2id was asked once

    Scenario: A wrong password against a hash made today costs one check
      Given a password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      And "wrong horse battery staple" is checked against the hash
      Then argon2id was asked once

    Scenario: A hash made today is never checked the old way
      Given a password hasher
      And the password "correct horse battery staple"
      When the password is hashed
      And "wrong horse battery staple" is checked against the hash
      Then the old hasher was not asked

  Rule: An imported hash whose password matches should be made again

    Scenario: A matching password says the imported hash should be made again
      Given a password hasher
      And the old site's hash of "correct horse battery staple"
      When the old hash is imported
      And "correct horse battery staple" is checked against the imported hash
      Then it matches
      And the hash should be made again

    Scenario: The hash made again is an ordinary one
      Given a password hasher
      And the old site's hash of "correct horse battery staple"
      When the old hash is imported
      And "correct horse battery staple" is checked against the imported hash
      And the hash is made again from "correct horse battery staple"
      Then the hash made again does not say it was imported

    Scenario: The hash made again matches the same password
      Given a password hasher
      And the old site's hash of "correct horse battery staple"
      When the old hash is imported
      And "correct horse battery staple" is checked against the imported hash
      And the hash is made again from "correct horse battery staple"
      And "correct horse battery staple" is checked against the hash made again
      Then it matches
      And the hash need not be made again

  Rule: The old hasher is given the password as the old site was given it

    Scenario: An accented password matches when typed as it was on the old site
      Given a password hasher
      And the old site's hash of "café au lait" with its accent typed after the letter
      When the old hash is imported
      And "café au lait" with its accent typed after the letter is checked against the imported hash
      Then it matches
