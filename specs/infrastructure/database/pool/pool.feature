Feature: Making a pool for a database

  A pool is made from the address of a database, and connects to the address it
  is given. The one exception is a database named localhost.

  Where localhost is looked up as ::1 first, as it is on Windows with Docker
  Desktop, nothing answers on ::1, and node waits a quarter of a second before
  it tries 127.0.0.1. It waits on every new connection, which is one or more in
  every scenario that has a database, and on a development computer the
  scenarios were waiting on it for a fifth of their time. A database named
  localhost is on the computer the site is running on, so connecting to it as
  127.0.0.1 reaches the same one without the wait.

  Nothing else is changed. Where a database is named by any other host, the
  address was chosen by whoever set the site up, and what it connects to is not
  for a pool to second-guess.

  Rule: A database named localhost is connected to as 127.0.0.1

    Scenario: The address of a database on localhost
      Given the database address "postgres://postgres:postgres@localhost:5432/croquet_scores_development"
      When a pool is made for it
      Then the pool connects to "postgres://postgres:postgres@127.0.0.1:5432/croquet_scores_development"

    Scenario: However localhost is written
      Given the database address "postgres://postgres:postgres@LocalHost:5432/croquet_scores_development"
      When a pool is made for it
      Then the pool connects to "postgres://postgres:postgres@127.0.0.1:5432/croquet_scores_development"

  Rule: Every other host is connected to as it was written

    Scenario Outline: A database that is not named localhost
      Given the database address "postgres://postgres:postgres@<host>:5432/croquet_scores_development"
      When a pool is made for it
      Then the pool connects to "postgres://postgres:postgres@<host>:5432/croquet_scores_development"

      Examples:
        | host                  |
        | 127.0.0.1             |
        | [::1]                 |
        | database.example.com  |
        | localhost.example.com |
        | notlocalhost          |

  Rule: The rest of the address is kept as it was written

    The user, the password, the port, the database and whatever else is asked
    of the connection are the site's own and are not part of what is changed.

    Scenario: The password is kept
      Given a database on localhost with the password "p@ss/word"
      When a pool is made for it
      Then the pool connects to the host "127.0.0.1"
      And the pool connects with the password "p@ss/word"

    Scenario: What else is asked of the connection is kept
      Given a database on localhost asked for with the application name "the site"
      When a pool is made for it
      Then the pool connects to the host "127.0.0.1"
      And the pool connects with the application name "the site"

    Scenario: A port that is not the usual one is kept
      Given the database address "postgres://postgres:postgres@localhost:55432/croquet_scores_development"
      When a pool is made for it
      Then the pool connects to "postgres://postgres:postgres@127.0.0.1:55432/croquet_scores_development"

  Rule: A database connected to with encryption is connected to by its name

    An encrypted connection checks the name it connects to against the name
    its certificate was made out to, and a certificate made out to localhost
    does not match 127.0.0.1. Better a wait than a connection refused.

    Scenario: A database on localhost connected to with encryption
      Given a database on localhost that is connected to with encryption
      When a pool is made for it
      Then the pool connects to the host "localhost"

    Scenario: A database on localhost connected to without encryption
      Given a database on localhost that is connected to without encryption
      When a pool is made for it
      Then the pool connects to the host "127.0.0.1"

  Rule: What is not an address is left for the database driver to refuse

    Whatever refuses it does so with its own words, which is where somebody
    looks for them, and a pool that changed what it could not read would
    only hide which setting was wrong.

    Scenario: Something that is not an address
      Given the database address "not an address"
      When a pool is made for it
      Then the pool connects to "not an address"
