@postgres
Feature: What tournaments are called

  The list of a reader's keys says which tournament a key is limited to
  (`WhatAKeyMayDoInTournament.feature`), and a key holds only the tournament's
  id, so the list asks what the tournaments its keys name are called. Each is
  answered with its name and the year it starts in, which tells tournaments of
  one name apart.

  It is for anybody, since tournaments and their names are public. A
  tournament there is not, or an id that is none, is left out of the answer and
  not refused: a key may name a tournament that has since gone, and the list of
  keys is still to be drawn.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"

  Rule: A tournament is answered with its name and the year it starts in

    Scenario: A tournament is answered by its name
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the names of "Spring Open" are asked for
      Then the tournament named is called "Spring Open"

    Scenario: A tournament is answered with the year it starts in
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the names of "Spring Open" are asked for
      Then the tournament named starts in 2026

  Rule: What is not a tournament is left out

    Scenario: A tournament there is not is left out
      When the names of a tournament there is not are asked for
      Then no tournaments are named

    Scenario: Something that is not an id is left out
      When the names of "not-an-id" as an id are asked for
      Then no tournaments are named
