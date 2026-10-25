@postgres
Feature: The tournaments played in countries the world rankings do not list

  The world rankings keep a list of the events they have ranked for
  Association Croquet and another for Golf Croquet, and each names the
  countries it has (`FileWorldRankingCountries.feature`). The import takes a
  tournament's country from them where it can (`WorldRankingEvents.feature`),
  so a tournament played in a country the list of its own sport does not name
  is one whose country is worth an administrator's checking
  (`countries.feature`). The application answers them.

  A tournament is judged by the list of its own sport: a country only the
  Golf Croquet list names is not one an Association Croquet tournament was
  ranked in. A sport with no list of its own, such as American 6 Wicket,
  cannot be judged, so its tournaments are not answered.

  Each is answered with its name, the code of its country, the country's
  name, and where it is found, as "2026/ac/spring-open", which is also where
  the old site had it. They are answered in order of their country's name,
  those of one country by the day they started and then by name, so that the
  order does not change from one visit to the next. An archived tournament is
  not answered, since it is not one a reader is sent to.

  Only an administrator can ask: anybody else is refused with
  `Account.NotAnAdministrator`.

  Background:
    Given the application's tournaments
    And the moment "2026-10-09T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be for the sport "ac"

  Rule: A tournament in a country the list of its sport does not name is answered

    Scenario: A tournament in a country no list names is answered
      Given the tournament is to be played in the country "fj"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then "Fiji Open" is answered

    Scenario: A tournament in a country the list of its sport names is not answered
      Given the Association Croquet world rankings list names the country "Australia"
      And the tournament is to be played in the country "au"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then "Spring Open" is not answered

    Scenario: A Golf Croquet tournament in a country the Golf Croquet list names is not answered
      Given the Golf Croquet world rankings list names the country "New Zealand"
      And the tournament is to be for the sport "gc"
      And the tournament is to be played in the country "nz"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then "Spring Open" is not answered

    Scenario: A tournament in a country only the other sport's list names is answered
      Given the Golf Croquet world rankings list names the country "Mauritius"
      And the tournament is to be played in the country "mu"
      And "organiser@example.com" has created the tournament "Mauritius Open"
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then "Mauritius Open" is answered

    Scenario: A tournament of a sport with no list is not answered
      Given the tournament is to be for the sport "a6w"
      And the tournament is to be played in the country "fj"
      And "organiser@example.com" has created the tournament "Fiji Six"
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then "Fiji Six" is not answered

    Scenario: An archived tournament is not answered
      Given the tournament is to be played in the country "fj"
      And "organiser@example.com" has created the tournament "Fiji Open"
      And "organiser@example.com" has archived the tournament "Fiji Open"
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then "Fiji Open" is not answered

    Scenario: Nothing to answer answers no tournaments
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then 0 tournaments are answered

  Rule: A tournament is answered with where it is, and the country it is in

    Scenario: A tournament is answered with its country's code
      Given the tournament is to be played in the country "fj"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then "Fiji Open" is answered as played in the country "fj"

    Scenario: A tournament is answered with its country's name
      Given the tournament is to be played in the country "fj"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then "Fiji Open" is answered as played in "Fiji"

    Scenario: A tournament is answered with where it is found
      Given the tournament is to be played in the country "fj"
      And the tournament is to start at "2026-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then "Fiji Open" is answered as found at "2026/ac/fiji-open"

  Rule: The tournaments are answered in order of their country, then the day they started, then their name

    Scenario: Tournaments are answered in order of their country's name
      Given the tournament is to be played in the country "ws"
      And "organiser@example.com" has created the tournament "Samoa Open"
      And the tournament is to be played in the country "fj"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then the first tournament answered is "Fiji Open"
      And the second tournament answered is "Samoa Open"

    Scenario: Tournaments of one country are answered in order of the day they started
      Given the tournament is to be played in the country "fj"
      And the tournament is to start at "2026-10-05T00:00:00Z"
      And "organiser@example.com" has created the tournament "Fiji Plate"
      And the tournament is to start at "2026-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then the first tournament answered is "Fiji Open"
      And the second tournament answered is "Fiji Plate"

    Scenario: Tournaments of one country and day are answered in order of their name
      Given the tournament is to be played in the country "fj"
      And "organiser@example.com" has created the tournament "Fiji Plate"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the reader signed in to the account for "admin@example.com" lists the tournaments in unlisted countries
      Then the first tournament answered is "Fiji Open"
      And the second tournament answered is "Fiji Plate"

  Rule: Only an administrator can ask

    Scenario: A reader who is not an administrator is refused
      When the reader signed in to the account for "organiser@example.com" lists the tournaments in unlisted countries
      Then listing the tournaments in unlisted countries is refused with "Account.NotAnAdministrator"
