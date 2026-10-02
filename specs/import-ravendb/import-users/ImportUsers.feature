@postgres
Feature: Importing the old sites' users as accounts

  The old sites, croquetscores.com and gateballscores.com, kept their users in
  RavenDB. Each user who finished signing up there is brought over as an
  account here (`bringOver.feature`), so its owner signs in with the password
  they already have and is not asked to register again.

  A user who never confirmed their email address never finished signing up,
  and is left behind. Nobody has shown the address is theirs, and bringing it
  over would give somebody an account they never asked for. Where they ran a
  tournament, it is brought over as run by a forgotten account in their place
  (`ImportTournaments.feature`), which holds nothing of them.

  The old sites kept a hash of each password, and it is imported as the
  password hasher imports one (`ImportedPasswordHasher.feature`), which is how
  signing in comes to check it the old sites' way.

  Which account each user became is kept, by the website and the document the
  user was, so that whatever is imported after the users — tournaments and the
  people who ran them — can find the account a user's document now means. It
  is kept with the email address the user had, which is how a user already
  imported is known, and the whole record goes when importing is finished.

  Background:
    Given the users are imported

  Rule: A user who confirmed their email address is brought over

    Scenario: A confirmed user becomes an account
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then an account is reached at "someone@example.com"

    Scenario: The account is called what the user was called
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then the account at "someone@example.com" is called "Sam Someone"

    Scenario: The account is confirmed
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then the account at "someone@example.com" is confirmed

    Scenario: The account was brought over when the user confirmed
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then the account at "someone@example.com" was brought over at "2014-03-01T09:00:00Z"

    Scenario: The account's password is the one the user had
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user's password was "correct horse battery staple"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then "correct horse battery staple" is the password of the account at "someone@example.com"

    Scenario: Which account the user became is kept
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then "users/1" on "croquetscores.com" is kept as the account at "someone@example.com"

    Scenario: The user's email address is kept with which account they became
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then "users/1" on "croquetscores.com" is kept with the email address "someone@example.com"

  Rule: A user who never confirmed their email address is left behind

    Scenario: An unconfirmed user becomes no account
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user never confirmed their email address
      When the user is imported
      Then no account is reached at "someone@example.com"

    Scenario: An unconfirmed user is not kept as any account
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user never confirmed their email address
      When the user is imported
      Then "users/1" on "croquetscores.com" is not kept as any account

    Scenario: Leaving an unconfirmed user behind is not refused
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user never confirmed their email address
      When the user is imported
      Then importing the user is not refused

  Rule: A name too short to be accepted says it was imported, and is otherwise left as it was

    A name shorter than 3 characters is refused here, and the old sites
    accepted some. Rather than leave the user behind, " - Imported" is added
    to the name, as it is to every name the import brings over that is too
    short, which makes it long enough and tells the account's owner where it
    came from the next time they look at their profile. Nothing else about a
    name is changed: the case it was written in is its owner's.

    Scenario: A name shorter than 3 characters says it was imported
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Al"
      And the user's email address is "al@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then the account at "al@example.com" is called "Al - Imported"

    Scenario: A name of 3 characters is left as it was
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam"
      And the user's email address is "sam@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then the account at "sam@example.com" is called "Sam"

    Scenario: A name all in small letters is left as it was
      Given a user "users/1" on "croquetscores.com"
      And the user is called "sam someone"
      And the user's email address is "someone@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then the account at "someone@example.com" is called "sam someone"

    Scenario: A name all in capitals is left as it was
      Given a user "users/1" on "croquetscores.com"
      And the user is called "SAM SOMEONE"
      And the user's email address is "someone@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then the account at "someone@example.com" is called "SAM SOMEONE"

  Rule: A user whose email address was imported already is the account already made

    A user with an email address already imported is the same person: one on
    both old sites, or one site's user stored twice. They are kept as the
    account already made and not brought over again, since no two accounts
    hold one address. The address is the same address whatever case it was
    written in.

    Scenario: A second user at an address already imported becomes no second account
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      And the user is imported
      And a user "users/7" on "gateballscores.com"
      And the user is called "Samuel Someone"
      And the user's email address is "Someone@Example.com"
      And the user confirmed their email address at "2016-05-01T09:00:00Z"
      When the user is imported
      Then the account at "someone@example.com" is called "Sam Someone"

    Scenario: A second user at an address already imported is kept as the account already made
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      And the user is imported
      And a user "users/7" on "gateballscores.com"
      And the user is called "Samuel Someone"
      And the user's email address is "Someone@Example.com"
      And the user confirmed their email address at "2016-05-01T09:00:00Z"
      When the user is imported
      Then "users/7" on "gateballscores.com" is kept as the account at "someone@example.com"

  Rule: A user who cannot be brought over is refused, naming why

    What the import does with a refusal — keeping it and going on to the next
    user — is `runImporter.feature`'s. Here it is only that the user is
    refused, and nothing of them is kept.

    Scenario: A user with no name is refused
      Given a user "users/1" on "croquetscores.com"
      And the user is called ""
      And the user's email address is "someone@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then importing the user is refused with "PersonName.Missing"

    Scenario: A user with an email address that is not one is refused
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone at example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then importing the user is refused with "EmailAddress.NoAt"

    Scenario: A user with a password hash the old sites could not have made is refused
      Given a user "users/1" on "croquetscores.com"
      And the user is called "Sam Someone"
      And the user's email address is "someone@example.com"
      And the user's password hash is "not an old hash"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then importing the user is refused with "OldSitePassword.Unreadable"

    Scenario: A user refused is not kept as any account
      Given a user "users/1" on "croquetscores.com"
      And the user is called ""
      And the user's email address is "someone@example.com"
      And the user confirmed their email address at "2014-03-01T09:00:00Z"
      When the user is imported
      Then "users/1" on "croquetscores.com" is not kept as any account
