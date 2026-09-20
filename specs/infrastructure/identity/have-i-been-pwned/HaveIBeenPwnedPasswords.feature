Feature: Checking a password against Have I Been Pwned

  The application's breached password check asks Have I Been Pwned, which keeps
  the passwords found in known breaches. Everything the application wants of
  the check is specified with the check, and this one is held to those
  scenarios. What is here is what asking an outside service adds: what leaves
  the site, and what is made of an answer that is not an answer.

  Neither the password nor the whole of its hash leaves the site. The password
  is hashed with SHA-1, and only the first five characters of that hash are
  sent. The service answers with the rest of every breached hash that begins
  with those five, and the check looks among them for the rest of its own. So
  the service learns only that the password is one of several hundred, and
  never which — and it is the check that tells those hundred apart, since an
  answer with something in it says only that some password shares those five
  characters.

  The service is given only so long to answer, set when the check is made: a
  few seconds in the site, so that nobody registering waits longer than that on
  it. Answering later than that, answering with a failure, or answering with
  anything but a list of hashes — a page from a proxy, say, or nothing at all,
  since every five characters begin several hundred breached hashes — are all
  the service not being reached, and are said to be, rather than read as the
  password not being found.

  These scenarios stand a fake of the service up in its place, which answers as
  the scenario says and records what it was asked. They give the check as
  little time to wait as it can be given, so that a fake told to answer late
  need not be slow.

  Background:
    Given a fake of Have I Been Pwned

  Rule: Only the first five characters of the password's hash leave the site

    Scenario: The service is asked for the first five characters of the hash
      When "correct horse battery staple" is checked
      Then the fake was asked about the first 5 characters of its SHA-1

    Scenario: The service is not told the password
      When "correct horse battery staple" is checked
      Then nothing the fake was sent contains "correct horse battery staple"

    Scenario: The service is not told the whole hash
      When "correct horse battery staple" is checked
      Then nothing the fake was sent contains the whole of its SHA-1

  Rule: A password is found by the rest of its hash, not by its first five characters

    Scenario: A password sharing only the first five characters of a breached hash is not found
      Given a breached hash sharing the first 5 characters of the SHA-1 of "correct horse battery staple" is known
      When "correct horse battery staple" is checked
      Then it is not found to have been breached

    Scenario: A breached password is found among the hashes sharing its first five characters
      Given "correct horse battery staple" is known to have been breached
      And a breached hash sharing the first 5 characters of the SHA-1 of "correct horse battery staple" is known
      When "correct horse battery staple" is checked
      Then it is found to have been breached

  Rule: A service that cannot be reached is said to be, not guessed at

    Scenario: A service that answers too late
      Given the fake answers only after the check has stopped waiting
      When "correct horse battery staple" is checked
      Then the check is refused with "BreachedPasswords.Unreachable"

    Scenario: A service that answers with a failure
      Given the fake answers with a failure
      When "correct horse battery staple" is checked
      Then the check is refused with "BreachedPasswords.Unreachable"

    Scenario: A service that answers with something other than a list
      Given the fake answers with a page rather than a list
      When "correct horse battery staple" is checked
      Then the check is refused with "BreachedPasswords.Unreachable"

    Scenario: A service that answers with nothing at all
      Given the fake answers with nothing
      When "correct horse battery staple" is checked
      Then the check is refused with "BreachedPasswords.Unreachable"
