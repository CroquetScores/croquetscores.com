@postgres
Feature: Migrating the database

  The schema arrives as numbered SQL files applied in filename order. Each is
  recorded as it is applied, in the same transaction that applies it, so that
  it is never applied a second time.

  There are no migrations yet. The first one arrives with the Postgres event
  store, and brings with it the scenarios saying what it made. What is here is
  what is true of the runner whether there is anything to run or not.

  Background:
    Given a migrated database

  Scenario: What has been applied is written down
    Then the table "schema_migrations" exists

  Scenario: Migrating again applies nothing
    When the migrations are applied
    Then no migration is applied
