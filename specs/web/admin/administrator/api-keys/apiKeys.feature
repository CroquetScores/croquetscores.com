@browser @postgres
Feature: The API keys page, where an administrator changes the limits of a key

  The API keys page (/admin/administrator/api-keys) is one of the
  administrator's pages (`administrator.feature`), under their section bar
  (`AdministratorSections.feature`). It is where an administrator raises, for
  one partner, how much of the site's work a key may use, without any code
  changing (`ChangeApiKeyLimits.feature`).

  Each key that works, of every account, is listed under the name of the
  account it belongs to, the names in alphabetical order, in a table with a row
  for each key: what it is called, with what it may do beneath that
  (`ApiKeysOfEveryAccount.feature`), then two fields holding the requests it
  may make a minute and a day, and Save. Never the key itself,
  which the site does not keep. A key revoked works for nobody and is not
  there.

  A limit that is not a whole number above none is refused beneath its field,
  by its code, and changes nothing (`ApiKeyLimits.NoneAMinute`,
  `ApiKeyLimits.NoneADay`). A reader who is not an administrator is refused by
  the site, as the accounts page is (`accounts.feature`).

  The admin draws the page itself, so every scenario here runs scripts.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator", with the password "another horse battery staple"
    And "admin@example.com" has been given the role "Administrator"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And the reader has signed in as "admin@example.com" with the password "another horse battery staple"

  Rule: Every key that works is listed with whose it is

    Scenario: With no keys the page says there are none
      When the API keys administrator page is opened
      Then the page says no keys work

    Scenario: A key is listed under its account's name and its label
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      When the API keys administrator page is opened
      Then the key "Sam Someone: CroquetUniverse" is on the page

    Scenario: A key that may only read says so
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      When the API keys administrator page is opened
      Then the key "Sam Someone: CroquetUniverse" may only read

    Scenario: A key that may write says so
      Given "someone@example.com" has made a key labelled "CroquetUniverse" that may write
      When the API keys administrator page is opened
      Then the key "Sam Someone: CroquetUniverse" may read and write

    Scenario: A key shows the requests it may make a minute
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      When the API keys administrator page is opened
      Then the requests a minute of the key "Sam Someone: CroquetUniverse" are "60"

    Scenario: A key shows the requests it may make a day
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      When the API keys administrator page is opened
      Then the requests a day of the key "Sam Someone: CroquetUniverse" are "10000"

  Rule: The keys are grouped by the name of their account

    Scenario: Two keys of one account are under one heading
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      And "someone@example.com" has made a key labelled "Inter-Counties"
      When the API keys administrator page is opened
      Then the page has 1 heading for accounts

    Scenario: Each account has its own heading
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      And "another@example.com" has an account, confirmed, called "Alex Another"
      And "another@example.com" has made a key labelled "Inter-Counties"
      When the API keys administrator page is opened
      Then the page has 2 headings for accounts

  Rule: An administrator changes the limits of one key

    Scenario: The requests a minute typed are kept
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      And the API keys administrator page is open
      And "120" is typed for the requests a minute of the key "Sam Someone: CroquetUniverse"
      When Save is pressed for the key "Sam Someone: CroquetUniverse"
      And the API keys administrator page is opened
      Then the requests a minute of the key "Sam Someone: CroquetUniverse" are "120"

    Scenario: The requests a day typed are kept
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      And the API keys administrator page is open
      And "20000" is typed for the requests a day of the key "Sam Someone: CroquetUniverse"
      When Save is pressed for the key "Sam Someone: CroquetUniverse"
      And the API keys administrator page is opened
      Then the requests a day of the key "Sam Someone: CroquetUniverse" are "20000"

    Scenario: The page shows the new requests a day as soon as they are saved
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      And the API keys administrator page is open
      And "20000" is typed for the requests a day of the key "Sam Someone: CroquetUniverse"
      When Save is pressed for the key "Sam Someone: CroquetUniverse"
      Then the requests a day of the key "Sam Someone: CroquetUniverse" are "20000"

    Scenario: Another key keeps its limits
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      And "someone@example.com" has made a key labelled "Inter-Counties"
      And the API keys administrator page is open
      And "120" is typed for the requests a minute of the key "Sam Someone: CroquetUniverse"
      When Save is pressed for the key "Sam Someone: CroquetUniverse"
      And the API keys administrator page is opened
      Then the requests a minute of the key "Sam Someone: Inter-Counties" are "60"

  Rule: A limit that breaks a rule is said beneath its field and changes nothing

    Scenario: No requests a minute is refused beneath the field
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      And the API keys administrator page is open
      And "0" is typed for the requests a minute of the key "Sam Someone: CroquetUniverse"
      When Save is pressed for the key "Sam Someone: CroquetUniverse"
      Then the key "Sam Someone: CroquetUniverse" is refused with "ApiKeyLimits.NoneAMinute"

    Scenario: No requests a day is refused beneath the field
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      And the API keys administrator page is open
      And "none" is typed for the requests a day of the key "Sam Someone: CroquetUniverse"
      When Save is pressed for the key "Sam Someone: CroquetUniverse"
      Then the key "Sam Someone: CroquetUniverse" is refused with "ApiKeyLimits.NoneADay"

    Scenario: A refused limit changes nothing
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      And the API keys administrator page is open
      And "0" is typed for the requests a minute of the key "Sam Someone: CroquetUniverse"
      And Save is pressed for the key "Sam Someone: CroquetUniverse"
      When the API keys administrator page is opened
      Then the requests a minute of the key "Sam Someone: CroquetUniverse" are "60"

  Rule: Only an administrator is told whose keys there are

    Scenario: A reader who is not an administrator is refused
      Given "someone@example.com" has made a key labelled "CroquetUniverse"
      And the API keys administrator page is open
      And the key "Sam Someone: CroquetUniverse" is on the page
      And "admin@example.com" has had the role "Administrator" taken away
      When Save is pressed for the key "Sam Someone: CroquetUniverse"
      Then the page says it was refused with "Account.NotAnAdministrator"
