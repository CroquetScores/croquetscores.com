@browser @postgres
Feature: The site's key for accounts is changed without rewriting an event

  What is personal in an account's events is encrypted with a key of the
  account's own, and each of those keys is kept encrypted with the site's key,
  the setting ACCOUNT_ENCRYPTION_KEY (`AccountKeys.feature`). Changing the
  site's key therefore rewrites those keys and the emails waiting with no
  account to belong to, and not one event.

  Changing it is a maintenance script's, run by whoever looks after the site,
  with the key the site is using now in its settings and the new one given
  beside it. It changes everything in one transaction, so that a change that
  fails leaves every key as it was, still readable with the key the site is
  using. Once it has gone through, the setting is changed to the new key and
  the site started again. A site started with the old key is refused every
  account's key, as another site's (`AccountKeys.feature`), rather than reading
  any of them wrongly.

  The key for finding an account by its email address, ACCOUNT_EMAIL_ADDRESS_HASH_KEY,
  is not changed this way and is never changed. The hash it makes is kept in
  the event that registered the account, which is never rewritten, so a new
  key would find no account by its address. Changing it is not offered; the
  setting says so.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"

  Rule: Once the key is changed, the new key reads every account's key and the old one does not

    Scenario: The new key reads the account's key
      When the application changes the site's key to a new one
      Then the account for "organiser@example.com" has a key that the new site's key reads

    Scenario: The old key no longer reads it
      When the application changes the site's key to a new one
      Then the account for "organiser@example.com" has a key that the old site's key refuses with "AccountKeys.WrongSiteKey"

  Rule: A key that cannot be used changes nothing

    Scenario: A key of nothing is refused
      When the application changes the site's key to nothing
      Then the change is refused with "AccountKeys.SiteKeyMissing"

    Scenario: A key of nothing leaves the account's key readable with the old one
      When the application changes the site's key to nothing
      Then the account for "organiser@example.com" has a key that the old site's key reads

  Rule: A change that fails part of the way changes nothing

    Scenario: The change is refused for an email that cannot be read
      Given an email waiting with no account is altered where it is kept
      When the application changes the site's key to a new one
      Then the change is refused with "AccountKeys.Tampered"

    Scenario: The account's key is still readable with the old key
      Given an email waiting with no account is altered where it is kept
      When the application changes the site's key to a new one
      Then the account for "organiser@example.com" has a key that the old site's key reads

    Scenario: The account's key is not readable with the new key
      Given an email waiting with no account is altered where it is kept
      When the application changes the site's key to a new one
      Then the account for "organiser@example.com" has a key that the new site's key refuses with "AccountKeys.WrongSiteKey"
