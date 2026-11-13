Feature: The settings the site is started with

  Settings are read once, at startup, and a site whose settings are unusable
  does not start: it says which, and every one at once, rather than being found
  out on the first request that needs one. Most of what is checked is specified
  where the setting is used (`trustedProxy.feature` for the proxies it
  believes); this is what belongs to no one place.

  The administrator is who the site's emails are sent from, and who is told
  when something the site needs cannot be reached
  (`databaseUnavailable.feature`) or a backup has run (`backupCli.feature`).
  They are one setting, `ADMINISTRATOR_EMAIL_ADDRESS`, because they are one
  person's address: an email that comes from the administrator and tells the
  administrator something is the site talking to the person who runs it.

  The site always has one. A site with nobody to send from would have a mail
  server refuse every email, and the first anyone would know of it is readers
  waiting for a link that never comes; a site with nobody to tell would be down
  and silent. A development machine has one too, an address that goes nowhere,
  since an email there is written to a file rather than sent.

  Rule: The site has an administrator

    Scenario: A site with an administrator starts
      Given the administrator's email address is "administrator@example.com"
      When the settings are loaded
      Then they are accepted

    Scenario: A site with none does not start
      Given there is no administrator's email address
      When the settings are loaded
      Then they are refused
      And the refusal names the setting "ADMINISTRATOR_EMAIL_ADDRESS"

    Scenario: A site with a blank one does not start
      Given the administrator's email address is ""
      When the settings are loaded
      Then they are refused
      And the refusal names the setting "ADMINISTRATOR_EMAIL_ADDRESS"

  Rule: The people who hold the site's passwords are named, and may be nobody

    They are the people the page for taking the site over writes to
    (`AskForEmergencyAccess.feature`). They are a setting and not written in
    the code, because the code is public and their addresses are not meant to
    be. A development machine names nobody, and the page then says it has
    nobody to ask rather than the site refusing to start.

    A setting that is not an address stops the site starting, as any other
    does, since a mistyped one would be an emergency asked of nobody.

    Scenario: A site with nobody named starts
      Given the administrator's email address is "administrator@example.com"
      And nobody is named as an emergency contact
      When the settings are loaded
      Then they are accepted

    Scenario: A site with nobody named has no emergency contacts
      Given the administrator's email address is "administrator@example.com"
      And nobody is named as an emergency contact
      When the settings are loaded
      Then there are no emergency contacts

    Scenario: A site with two named starts
      Given the administrator's email address is "administrator@example.com"
      And the emergency contacts' email addresses are "first@example.com, second@example.com"
      When the settings are loaded
      Then they are accepted

    Scenario: The first one named is the first emergency contact
      Given the administrator's email address is "administrator@example.com"
      And the emergency contacts' email addresses are "first@example.com, second@example.com"
      When the settings are loaded
      Then the first emergency contact is "first@example.com"

    Scenario: The second one named is the second emergency contact
      Given the administrator's email address is "administrator@example.com"
      And the emergency contacts' email addresses are "first@example.com, second@example.com"
      When the settings are loaded
      Then the second emergency contact is "second@example.com"

    Scenario: Somebody named twice is one emergency contact
      Given the administrator's email address is "administrator@example.com"
      And the emergency contacts' email addresses are "first@example.com, FIRST@example.com"
      When the settings are loaded
      Then there is only one emergency contact

    Scenario: A setting that is not an address does not start
      Given the administrator's email address is "administrator@example.com"
      And the emergency contacts' email addresses are "first@example.com, not an address"
      When the settings are loaded
      Then they are refused
      And the refusal names the setting "EMERGENCY_CONTACT_EMAIL_ADDRESSES"
