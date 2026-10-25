Feature: The countries the world rankings' lists name

  The world rankings keep a list of the events they have ranked for
  Association Croquet and another for Golf Croquet, each with the country the
  event was played in (`WorldRankingEvents.feature` is where a tournament is
  found in them). Which countries a list names is asked of the files they are
  kept in, so that the site can tell a tournament played in a country the
  rankings have never ranked an event in.

  The countries are the site's own, by their codes. The two lists write them
  differently: the Association Croquet list has a list of countries of its own,
  by name, which its events number; the Golf Croquet list gives each event the
  three letters used for its country in sport. A country the site does not
  have is left out of what a list names, as it is left out of where the import
  finds a tournament.

  Rule: The Association Croquet list names the countries it lists

    Scenario: A country the list lists is named
      Given an Association Croquet list that lists "Australia"
      When the countries of the Association Croquet list are asked for
      Then the list names the country "au"

    Scenario: A country the list gives in its own words is named
      Given an Association Croquet list that lists "USA"
      When the countries of the Association Croquet list are asked for
      Then the list names the country "us"

    Scenario: A country the site does not have is left out
      Given an Association Croquet list that lists "Atlantis"
      When the countries of the Association Croquet list are asked for
      Then the list names no country

  Rule: The Golf Croquet list names the countries of its events

    Scenario: A country an event was played in is named
      Given a Golf Croquet event in "NZL"
      When the countries of the Golf Croquet list are asked for
      Then the list names the country "nz"

    Scenario: A country is named once however many events were played in it
      Given a Golf Croquet event in "NZL"
      And a Golf Croquet event in "NZL"
      When the countries of the Golf Croquet list are asked for
      Then the list names 1 country

    Scenario: A country the site does not have is left out
      Given a Golf Croquet event in "XXX"
      When the countries of the Golf Croquet list are asked for
      Then the list names no country

  Rule: A list names only its own sport's countries

    Scenario: A country only the Golf Croquet list names is not the Association Croquet list's
      Given a Golf Croquet event in "NZL"
      When the countries of the Association Croquet list are asked for
      Then the list names no country

  Rule: A row that cannot be read is refused with its file and line

    Scenario: A row of the Association Croquet list with too few fields is refused
      Given an Association Croquet list of countries with the row "1,Australia"
      When the countries of the Association Croquet list are asked for
      Then reading the list is refused with "WorldRankingCountries.UnreadableRow"

    Scenario: A row of the Golf Croquet list with too few fields is refused
      Given a Golf Croquet list of events with the row "1,2,Event,NZL"
      When the countries of the Golf Croquet list are asked for
      Then reading the list is refused with "WorldRankingCountries.UnreadableRow"
