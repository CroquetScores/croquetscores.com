@postgres
Feature: Migrating the database

  The schema arrives as numbered SQL files applied in filename order. Each is
  recorded as it is applied, in the same transaction that applies it, so that
  it is never applied a second time.

  Background:
    Given a migrated database

  Scenario: The event store is there
    Then the table "events" exists
    And the table "schema_migrations" exists
    And "0001-event-store.sql" is recorded as applied

  Scenario: Migrating again applies nothing
    When the migrations are applied
    Then no migration is applied
