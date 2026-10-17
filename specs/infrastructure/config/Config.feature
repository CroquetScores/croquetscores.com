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
