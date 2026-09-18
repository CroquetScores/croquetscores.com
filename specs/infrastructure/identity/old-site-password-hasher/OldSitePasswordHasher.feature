Feature: Checking a password the way the old site did

  The accounts brought over from the old site bring hashes the old site made,
  and a password can only be checked against one by doing exactly what the old
  site did. This is that, and nothing more: it is used only to check a password
  against a hash imported from the old site, and goes when none are left.

  The old site hashed a password with SHA-1, over the account's own salt
  followed by the password with a salt shared by the whole site added to its
  end, the password written as UTF-16 with the low byte first. The account's
  salt is sixteen random bytes. It kept the two together in one string of 52
  characters: the first 4 characters of the salt in base64, then the 28 of the
  hash, then the other 20 of the salt. The site-wide salt is a setting, like
  any other secret, and is never written into the repository.

  The old site did nothing to a password before hashing it: no trimming, no
  change of case, and no treating an accent the same however it was typed. So
  neither does this. A password with an accent in it matches only as it was
  typed on the old site, which is why the new site's way of taking accents is
  not applied before it.

  The pairs of passwords and hashes here were made by the .NET Framework
  itself, with the old site's own code and a salt made up for these scenarios,
  so that the scenarios hold this to what the old site did rather than to
  somebody's reading of it, and the real site-wide salt stays out of them.

  Background:
    Given the old site's hasher, with the site-wide salt "{00000000-5CE4-4A10-8000-000000000001}"

  Rule: A password matches the hash the old site made of it

    Scenario: A password matches its old hash
      When "correct horse battery staple" is checked against the old hash "AAECmBF4MaltcWJT64kXAT85IblmL+A=AwQFBgcICQoLDA0ODw=="
      Then it matches

    Scenario: A different password does not match
      When "correct horse battery stapler" is checked against the old hash "AAECmBF4MaltcWJT64kXAT85IblmL+A=AwQFBgcICQoLDA0ODw=="
      Then it does not match

    Scenario: The same password in a different case does not match
      When "Correct Horse Battery Staple" is checked against the old hash "AAECmBF4MaltcWJT64kXAT85IblmL+A=AwQFBgcICQoLDA0ODw=="
      Then it does not match

    Scenario: The same password with a space after it does not match
      When "correct horse battery staple " is checked against the old hash "AAECmBF4MaltcWJT64kXAT85IblmL+A=AwQFBgcICQoLDA0ODw=="
      Then it does not match

  Rule: A password with an accent matches only as it was typed on the old site

    Scenario: An accent typed as part of its letter matches the hash made that way
      When "café au lait" with its accent typed as part of the letter is checked against the old hash "AAEChO7uo/Kk+9LYlDio7vpD8JoYS6Y=AwQFBgcICQoLDA0ODw=="
      Then it matches

    Scenario: An accent typed after its letter matches the hash made that way
      When "café au lait" with its accent typed after the letter is checked against the old hash "AAECyOPLQWiYcZwkxyPncghWQPRM0L4=AwQFBgcICQoLDA0ODw=="
      Then it matches

    Scenario: An accent typed the other way does not match
      When "café au lait" with its accent typed after the letter is checked against the old hash "AAEChO7uo/Kk+9LYlDio7vpD8JoYS6Y=AwQFBgcICQoLDA0ODw=="
      Then it does not match

  Rule: The site-wide salt is part of every hash

    Scenario: A password checked with a different site-wide salt does not match
      Given the old site's hasher, with the site-wide salt "{00000000-5CE4-4A10-8000-000000000002}"
      When "correct horse battery staple" is checked against the old hash "AAECmBF4MaltcWJT64kXAT85IblmL+A=AwQFBgcICQoLDA0ODw=="
      Then it does not match

    Scenario: The old site's hasher cannot be made without a site-wide salt
      When the old site's hasher is made with no site-wide salt
      Then it is refused with "OldSitePassword.SaltMissing"

  Rule: An old hash that is not the old site's shape cannot be read

    Scenario Outline: An old hash of the wrong shape is refused
      When the old hash "<hash>" is read
      Then it is refused with "OldSitePassword.Unreadable"

      Examples:
        | hash                                                  |
        | AAECmBF4MaltcWJT64kXAT85IblmL+A=AwQFBgcICQoLDA0ODw=   |
        | AAECmBF4MaltcWJT64kXAT85IblmL+A=AwQFBgcICQoLDA0ODw=== |
        | AAEC!!!!MaltcWJT64kXAT85IblmL+A=AwQFBgcICQoLDA0ODw==  |
