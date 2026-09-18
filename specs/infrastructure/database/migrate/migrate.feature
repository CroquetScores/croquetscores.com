@postgres
Feature: Migrating the database

  The schema arrives as numbered SQL files applied in filename order. Each is
  recorded as it is applied, in the same transaction that applies it, so that
  it is never applied a second time.

  What any one migration makes is specified by whatever uses it — the first,
  which keeps events, by the Postgres event store's scenarios — rather than
  here. What is here is what is true of the runner whatever there is to run.

  Background:
    Given a migrated database

  Scenario: What has been applied is written down
    Then the table "schema_migrations" exists

  Scenario: Migrating again applies nothing
    When the migrations are applied
    Then no migration is applied
