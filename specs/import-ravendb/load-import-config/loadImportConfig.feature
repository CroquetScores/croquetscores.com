Feature: What the import from the old sites is configured with

  The import reads the old sites' RavenDB databases and writes into a Postgres
  database of its own, which it empties first. That database is named by a
  setting of its own, and never by the site's: an import that fell back to the
  database the site or its development server runs on would drop every table
  in it.

  It needs the site's two account keys, the same ones as the site that will be
  served from what it writes, because every account it brings over is sealed
  with the one and found by the other. And it needs the salt the old sites
  added to every password, without which no password it brings over could
  ever be checked.

  Where RavenDB is and which of its databases are read have the old sites'
  own as defaults: one server on the machine the import runs on, and the two
  sites.

  Background:
    Given the setting "IMPORT_DATABASE_URL" is "postgres://import:import@localhost:5432/import"
    And the setting "ACCOUNT_ENCRYPTION_KEY" is "the site's key"
    And the setting "ACCOUNT_EMAIL_ADDRESS_HASH_KEY" is "the site's hash key"
    And the setting "OLD_SITE_PASSWORD_SALT" is "the old sites' salt"

  Rule: The import is written into the database of its own setting

    Scenario: The import's database is the one its setting names
      When the import's settings are read
      Then the import writes into "postgres://import:import@localhost:5432/import"

    Scenario: The site's database is not the import's
      Given the setting "IMPORT_DATABASE_URL" is ""
      And the setting "DATABASE_URL" is "postgres://site:site@localhost:5432/site"
      When the import's settings are read
      Then reading them is refused, naming "IMPORT_DATABASE_URL"

  Rule: The import has what it needs to bring accounts over

    Scenario Outline: A setting the import needs cannot be left out
      Given the setting "<setting>" is ""
      When the import's settings are read
      Then reading them is refused, naming "<setting>"

      Examples:
        | setting                        |
        | IMPORT_DATABASE_URL            |
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
