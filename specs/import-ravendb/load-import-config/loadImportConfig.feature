Feature: What the import from the old sites is configured with

  The import reads the old sites' RavenDB databases and writes into the
  site's own Postgres database, the one the site is served from, so that what
  it brings over is there for the site to read. It empties that database
  first, dropping every table in it (`ImportDatabase.feature`).

  It needs the site's two account keys, the same ones as the site that will be
  served from what it writes, because every account it brings over is sealed
  with the one and found by the other. And it needs the salt the old sites
  added to every password, without which no password it brings over could
  ever be checked.

  Where RavenDB is and which of its databases are read have the old sites'
  own as defaults: one server on the machine the import runs on, and the two
  sites.

  Background:
    Given the setting "DATABASE_URL" is "postgres://site:site@localhost:5432/site"
    And the setting "ACCOUNT_ENCRYPTION_KEY" is "the site's key"
    And the setting "ACCOUNT_EMAIL_ADDRESS_HASH_KEY" is "the site's hash key"
    And the setting "OLD_SITE_PASSWORD_SALT" is "the old sites' salt"

  Rule: The import is written into the site's database

    Scenario: The import's database is the site's
      When the import's settings are read
      Then the import writes into "postgres://site:site@localhost:5432/site"

  Rule: The import has what it needs to bring accounts over

    Scenario Outline: A setting the import needs cannot be left out
      Given the setting "<setting>" is ""
      When the import's settings are read
      Then reading them is refused, naming "<setting>"

      Examples:
        | setting                        |
        | DATABASE_URL                   |
        | ACCOUNT_ENCRYPTION_KEY         |
        | ACCOUNT_EMAIL_ADDRESS_HASH_KEY |
        | OLD_SITE_PASSWORD_SALT         |

    Scenario: The old sites' salt is kept as it was given
      When the import's settings are read
      Then the old sites' salt is "the old sites' salt"

  Rule: RavenDB is where the old sites kept it, unless it is said to be elsewhere

    Scenario: RavenDB is on this machine unless it is said to be elsewhere
      When the import's settings are read
      Then RavenDB is at "http://127.0.0.1:8080/"

    Scenario: RavenDB is where its setting says
      Given the setting "RAVENDB_URL" is "http://raven.example.com:8080/"
      When the import's settings are read
      Then RavenDB is at "http://raven.example.com:8080/"

    Scenario: Both old sites are read unless others are named
      When the import's settings are read
      Then the RavenDB databases read are "croquetscores.com, gateballscores.com"

    Scenario: The RavenDB databases read are the ones their setting names
      Given the setting "RAVENDB_DATABASES" is "gateballscores.com"
      When the import's settings are read
      Then the RavenDB databases read are "gateballscores.com"

    Scenario: The RavenDB databases named are read without the space around them
      Given the setting "RAVENDB_DATABASES" is " croquetscores.com , gateballscores.com "
      When the import's settings are read
      Then the RavenDB databases read are "croquetscores.com, gateballscores.com"
