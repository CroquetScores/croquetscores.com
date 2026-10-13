@browser @postgres
Feature: The admin lists the reader's tournaments

  The admin's front door is a list of the tournaments the reader has a part
  in: those they manage and those they score. It is where a manager goes to
  get at a tournament they are running and a scorer goes to get at the scores
  they are entering, so it shows nobody else's, even where they are public.
  Only a reader who is signed in has tournaments to list, so one who is not is
  sent to sign in first, and brought back once they have, as every page of an
  account's own is (`profile.feature`).

  The list is of the website it is read on. A reader on Gateball Scores is
  there for gateball, and a tournament they run on Croquet Scores is found by
  going there.

  A reader cannot both manage and score a tournament: a manager is not made a
  scorer, and a scorer made a manager stops being one (`addScorer.feature`,
  `addManager.feature`). So each row offers what one part allows, never a mix
  of both. What a manager does to a tournament and what a scorer does are
  both done from the tournament's own page in the admin, so Manage and Scores
  go where its name does, and Edit goes to the page that edits it.

  The list is of one year at a time, because a club that has run the same
  tournaments for years would otherwise be scrolling past every one of them to
  find this season's. It starts at this year, by the reader's own clock, since
  that is the year a reader is nearly always after. A year chosen is in the
  address, /admin/2025, so that it can be linked to and the browser's back
  button goes back to the year before. The admin's front door, /admin/, stays
  where it is and lists this year. A tournament belongs to the year it starts
  in, which is also the year in its address, so one that runs over the new
  year is found where its address says it is.

  A reader whose account administers the site may do to every tournament
  what its managers may (`administrators.feature`), so the list is of every
  tournament on the website, each offering what a manager is offered, and the
  years are those any tournament on the website is in.

  The years to choose from are in the secondary navigation, and are the years
  the reader has a tournament in on this website, newest first. Finding them
  from each tournament's events would mean reading every tournament there is,
  so they are kept by a projection as tournaments are created and changed,
  along with the list itself (`TournamentsByAccount.feature`).

  Every word the list says is in the reader's language, as the rest of the
  admin's is (`admin.feature`), and so are the dates, whose months the browser
  names in the language the page is in.

  The admin draws the list itself, so every scenario here runs scripts. It is
  laid out for a phone first, and so the scenarios are read on a phone's
  width.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And the reader's clock says "2026-09-26"
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"

  Rule: Only a reader signed in sees the list

    Scenario: A reader not signed in is sent to sign in first
      Given the reader has signed out
      When the admin is opened
      Then the sign in page is shown

    Scenario: A reader not signed in is sent to sign in first from any year
      Given the reader has signed out
      When the admin for 2025 is opened
      Then the sign in page is shown

    Scenario: A reader who signs in from there is brought back to the year they asked for
      Given the reader has signed out
      And the admin for 2025 is open
      When the reader signs in as "organiser@example.com" with the password "correct horse battery staple"
      Then the address is "/admin/2025"

  Rule: A new tournament is started from above the list

    Any reader who is signed in can create a tournament, and becomes its first
    manager (`CreateTournament.feature`), so every one of them is offered to,
    whatever year is chosen and whether or not it has tournaments in it. It is
    above the tournaments rather than beneath them, where a long list would
    push it off a phone's screen.

    Scenario: The list offers a new tournament
      When the admin is opened
      Then the list offers "New Tournament"

    Scenario: A new tournament is offered above the tournaments
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then "New Tournament" is above the tournaments

    Scenario: A new tournament is offered in a year with no tournaments
      When the admin for 2025 is opened
      Then the list offers "New Tournament"

    Scenario: A new tournament is offered to a reader who only scores
      Given "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And "other@example.com" has made "organiser@example.com" a scorer of "Autumn Open"
      When the admin is opened
      Then the list offers "New Tournament"

    Scenario: A new tournament is started on a page of its own
      Given the admin is open
      When "New Tournament" is pressed
      Then the address is "/admin/tournaments/new"

    Scenario: A new tournament can be asked for with a thumb
      When the admin is opened
      Then "New Tournament" is at least 44 pixels tall

  Rule: The list is of the tournaments the reader manages or scores

    Scenario: A tournament the reader manages is listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" is listed

    Scenario: A tournament the reader scores is listed
      Given "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And "other@example.com" has made "organiser@example.com" a scorer of "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" is listed

    Scenario: A tournament the reader has no part in is not listed
      Given "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" is not listed

    Scenario: A tournament the reader has archived is listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" is listed

  Rule: An administrator's list is of every tournament on the website

    Scenario: A tournament an administrator has no part in is listed
      Given "organiser@example.com" has been given the role "Administrator"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" is listed

    Scenario: A tournament an administrator has no part in offers what a manager does
      Given "organiser@example.com" has been given the role "Administrator"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" offers "Manage"

    Scenario: A tournament on another website is not listed for an administrator
      Given "organiser@example.com" has been given the role "Administrator"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open" on the website "gateballscores.com"
      When the admin is opened
      Then the tournament "Autumn Open" is not listed

    Scenario: A year an administrator has no tournament of their own in is offered
      Given "organiser@example.com" has been given the role "Administrator"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2024-10-03"
      When the admin is opened
      Then the year 2024 is offered

    Scenario: A year's address lists every tournament in it for an administrator
      Given "organiser@example.com" has been given the role "Administrator"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2024-10-03"
      When the admin for 2024 is opened
      Then the tournament "Autumn Open" is listed

    Scenario: An account the role was taken from is listed only its own tournaments
      Given "organiser@example.com" has been given the role "Administrator"
      And "organiser@example.com" has had the role "Administrator" taken away
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" is not listed

  Rule: A world ranking officer's list adds every tournament of a sport with world rankings that counts towards them

    An account that holds the World Ranking Officer role may change the world
    ranking name of any player (`changeWorldRankingName.feature`), and only
    association croquet and golf croquet have players known by name to the
    world rankings (`Sport.feature`). So its list is of the tournaments it
    manages or scores, offering what its part allows, and every tournament of
    those two sports on the website that counts towards the world rankings
    besides, each offering its players, which is what the officer is there for.
    A tournament that does not count has no rankings to look after, so it is
    listed only where the officer manages or scores it. The years are those
    any of them is in.

    Scenario: A tournament of a sport with world rankings is listed for a world ranking officer
      Given "organiser@example.com" has been given the role "World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" is listed

    Scenario: A tournament a world ranking officer has no part in offers its players
      Given "organiser@example.com" has been given the role "World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" offers "Players"

    Scenario: A tournament a world ranking officer has no part in offers nothing a manager is offered
      Given "organiser@example.com" has been given the role "World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" does not offer "Manage"

    Scenario: Players leads to the tournament in the admin
      Given "organiser@example.com" has been given the role "World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      And the tournament "Autumn Open" is for the sport "ac"
      And the admin is open
      When "Players" is pressed for the tournament "Autumn Open"
      Then the address is "/admin/2026/ac/autumn-open"

    Scenario: A tournament a world ranking officer manages offers what a manager does
      Given "organiser@example.com" has been given the role "World Ranking Officer"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" offers "Manage"

    Scenario: A tournament of a sport without world rankings is not listed for a world ranking officer
      Given "organiser@example.com" has been given the role "World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" does not count towards the world rankings
      And the tournament "Autumn Open" is for the sport "rc"
      When the admin is opened
      Then the tournament "Autumn Open" is not listed

    Scenario: A tournament that does not count towards the world rankings is not listed for a world ranking officer with no part in it
      Given "organiser@example.com" has been given the role "World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" does not count towards the world rankings
      When the admin is opened
      Then the tournament "Autumn Open" is not listed

    Scenario: A tournament that does not count towards the world rankings is listed for a world ranking officer who manages it
      Given "organiser@example.com" has been given the role "World Ranking Officer"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" does not count towards the world rankings
      When the admin is opened
      Then the tournament "Spring Open" is listed

    Scenario: A tournament that does not count towards the world rankings is listed for a world ranking officer who scores it
      Given "organiser@example.com" has been given the role "World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" does not count towards the world rankings
      And "other@example.com" has made "organiser@example.com" a scorer of "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" is listed

    Scenario: A year of a tournament that does not count towards the world rankings is not offered to a world ranking officer with no part in it
      Given "organiser@example.com" has been given the role "World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2024-10-03"
      And the tournament "Autumn Open" does not count towards the world rankings
      When the admin is opened
      Then the year 2024 is not offered

    Scenario: A year of a tournament of a sport with world rankings is offered to a world ranking officer
      Given "organiser@example.com" has been given the role "World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2024-10-03"
      When the admin is opened
      Then the year 2024 is offered

  Rule: The list is of the website it is read on

    Scenario: A tournament on this website is listed
      Given "organiser@example.com" has created the tournament "Spring Open" on the website "croquetscores.com"
      When the admin is opened
      Then the tournament "Spring Open" is listed

    Scenario: A tournament on another website is not listed
      Given "organiser@example.com" has created the tournament "Spring Open" on the website "gateballscores.com"
      When the admin is opened
      Then the tournament "Spring Open" is not listed

  Rule: The list is of one year, and this year to begin with

    Scenario: This year's tournaments are listed to begin with
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-03"
      When the admin is opened
      Then the tournament "Spring Open" is listed

    Scenario: Last year's tournaments are not listed to begin with
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-03"
      When the admin is opened
      Then the tournament "Spring Open" is not listed

    Scenario: The year listed to begin with is said
      When the admin is opened
      Then the year chosen is 2026

    Scenario: Another year's tournaments are listed once it is chosen
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-03"
      And the admin is open
      When the year 2025 is chosen
      Then the tournament "Spring Open" is listed

    Scenario: The year chosen before is no longer listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-03"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2025-10-03"
      And the admin is open
      When the year 2025 is chosen
      Then the tournament "Spring Open" is not listed

    Scenario: A tournament over the new year is listed in the year it starts
      Given "organiser@example.com" has created the tournament "New Year Open"
      And the tournament "New Year Open" starts on "2025-12-30"
      And the tournament "New Year Open" finishes on "2026-01-02"
      And the admin is open
      When the year 2025 is chosen
      Then the tournament "New Year Open" is listed

    Scenario: A tournament over the new year is not listed in the year it finishes
      Given "organiser@example.com" has created the tournament "New Year Open"
      And the tournament "New Year Open" starts on "2025-12-30"
      And the tournament "New Year Open" finishes on "2026-01-02"
      When the admin is opened
      Then the tournament "New Year Open" is not listed

    Scenario: A year with no tournaments says so
      When the admin is opened
      Then the list says there are no tournaments

  Rule: The years offered are those the reader has tournaments in, newest first

    A year is offered for a tournament the reader manages or scores, archived
    or not, on this website. This year is offered whether they have a
    tournament in it or not, since it is where the list starts, and it takes
    its place among the others: a tournament already set up for next year puts
    next year before it.

    Scenario: A year the reader has a tournament in is offered
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      When the admin is opened
      Then the year 2024 is offered

    Scenario: A year the reader scores a tournament in is offered
      Given "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2024-10-03"
      And "other@example.com" has made "organiser@example.com" a scorer of "Autumn Open"
      When the admin is opened
      Then the year 2024 is offered

    Scenario: A year of archived tournaments alone is offered
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the admin is opened
      Then the year 2024 is offered

    Scenario: This year is offered when the reader has no tournament in it
      When the admin is opened
      Then the year 2026 is offered

    Scenario: A year the reader has no tournament in is not offered
      Given "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2024-10-03"
      When the admin is opened
      Then the year 2024 is not offered

    Scenario: A year of another website's tournaments alone is not offered
      Given "organiser@example.com" has created the tournament "Spring Open" on the website "gateballscores.com"
      And the tournament "Spring Open" starts on "2024-10-03"
      When the admin is opened
      Then the year 2024 is not offered

    Scenario: The years are offered newest first
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2027-03-06"
      When the admin is opened
      Then the first year offered is 2027
      And the second year offered is 2026
      And the third year offered is 2024

    Scenario: A year is offered once however many tournaments are in it
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      When the admin is opened
      Then 1 year is offered

  Rule: The years fit the width of the window

    The section bar wraps its tabs rather than hiding any (`LAYOUT.md`),
    because they are the page's own sections. Years are not: they grow by one
    every season, and a club with fifteen years of tournaments would wrap onto
    four rows on a phone before the list had begun. So the newest years are
    tabs, as many as fit on one row of the bar, and the years that do not fit
    are in a drop-down list at the end of the row. Where every year fits there
    is no drop-down list at all. It is the window's width now that decides,
    not its width when the admin was opened, since turning a phone round
    changes it.

    The year chosen is marked where it is. As a tab it is on black, as the
    section being read is (`LAYOUT.md`). In the drop-down list it is the item
    selected, and no tab is on black. Where the year chosen is a tab, the
    drop-down list selects none of its years and says "Earlier years", which
    is also its name for a reader who is listening rather than looking.

    Scenario: A few years on a phone are all tabs
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-03"
      When the admin is opened
      Then every year offered is a tab

    Scenario: A few years on a phone need no drop-down list
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-03"
      When the admin is opened
      Then no drop-down list of years is offered

    Scenario: Many years on a phone keep the newest as a tab
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin is opened
      Then the year 2026 is a tab

    Scenario: Many years on a phone put the oldest in the drop-down list
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin is opened
      Then the year 2015 is in the drop-down list

    Scenario: A year that is a tab is not in the drop-down list as well
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin is opened
      Then the year 2026 is not in the drop-down list

    Scenario: The tabs and the drop-down list keep to one row
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin is opened
      Then the years take one row of the bar

    Scenario: Many years on a wide screen are all tabs
      Given a viewport 1200 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin is opened
      Then every year offered is a tab

    Scenario: Narrowing the window moves the oldest years into the drop-down list
      Given a viewport 1200 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      And the admin is open
      When the window is narrowed to 375 pixels
      Then the year 2015 is in the drop-down list

    Scenario: Widening the window brings every year back as a tab
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      And the admin is open
      When the window is widened to 1200 pixels
      Then every year offered is a tab

    Scenario: The year chosen as a tab is on black
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin is opened
      Then the tab for 2026 is marked as the year chosen

    Scenario: A year not chosen is not on black
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin is opened
      Then the tab for 2025 is not marked as the year chosen

    Scenario: The drop-down list selects no year while the year chosen is a tab
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin is opened
      Then the drop-down list selects no year

    Scenario: The year chosen in the drop-down list is the item selected
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin for 2015 is opened
      Then the year selected in the drop-down list is 2015

    Scenario: No tab is on black while the year chosen is in the drop-down list
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin for 2015 is opened
      Then no tab is marked as the year chosen

    Scenario: Choosing a year from the drop-down list lists it
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      And the admin is open
      When 2015 is chosen from the drop-down list
      Then the address is "/admin/2015"

    Scenario: The drop-down list is named for a screen reader
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin is opened
      Then the drop-down list is named "Earlier years"

    Scenario: The drop-down list can be pressed with a thumb
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin is opened
      Then the drop-down list is at least 44 pixels tall

  Rule: The year chosen is in the address

    Scenario: Choosing a year puts it in the address
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-03"
      And the admin is open
      When the year 2025 is chosen
      Then the address is "/admin/2025"

    Scenario: A year's address lists that year's tournaments
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-03"
      When the admin for 2025 is opened
      Then the tournament "Spring Open" is listed

    Scenario: A year's address says which year it is
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-03"
      When the admin for 2025 is opened
      Then the year chosen is 2025

    Scenario: Going back returns to the year before
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-03"
      And the admin is open
      And the year 2025 is chosen
      When the browser goes back
      Then the year chosen is 2026

    Scenario: The admin's front door stays where it is
      When the admin is opened
      Then the address is "/admin/"

  Rule: The newest tournament comes first, and archived ones come last

    Tournaments that start on the same day are listed by name, so that the
    order does not change from one visit to the next.

    Scenario: The tournament that starts latest is first
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      When the admin is opened
      Then the first tournament is "Autumn Open"
      And the second tournament is "Spring Open"

    Scenario: Tournaments that start on the same day are listed by name
      Given "organiser@example.com" has created the tournament "Bowl"
      And the tournament "Bowl" starts on "2026-10-03"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      When the admin is opened
      Then the first tournament is "Autumn Open"
      And the second tournament is "Bowl"

    Scenario: An archived tournament comes after one that starts before it
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      And "organiser@example.com" has archived the tournament "Autumn Open"
      When the admin is opened
      Then the first tournament is "Spring Open"
      And the second tournament is "Autumn Open"

    Scenario: Archived tournaments are in the same order among themselves
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      And "organiser@example.com" has archived the tournament "Autumn Open"
      When the admin is opened
      Then the first tournament is "Autumn Open"
      And the second tournament is "Spring Open"

  Rule: Each tournament is dated by the days it runs

    The month is said once where both days are in it, so that the dates take
    as little of a phone's width as they can. A tournament of one day is dated
    by that day alone.

    Scenario Outline: A tournament is dated from its start to its finish
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "<starts>"
      And the tournament "Spring Open" finishes on "<finishes>"
      And the admin is open
      When the year <year> is chosen
      Then the tournament "Spring Open" is dated "<dated>"

      Examples:
        | starts     | finishes   | year | dated         |
        | 2026-10-03 | 2026-10-05 | 2026 | 03-05 Oct     |
        | 2026-09-29 | 2026-10-02 | 2026 | 29 Sep-02 Oct |
        | 2025-12-30 | 2026-01-02 | 2025 | 30 Dec-02 Jan |
        | 2026-10-03 | 2026-10-03 | 2026 | 03 Oct        |

    Scenario: An archived tournament is dated as any other is
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-03"
      And the tournament "Spring Open" finishes on "2026-10-05"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" is dated "03-05 Oct"

    Scenario: The month is named in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-03"
      And the tournament "Spring Open" finishes on "2026-10-05"
      When the admin is opened
      Then the tournament "Spring Open" is dated "03-05 oct"

  Rule: Every word the list says is in the reader's language

    The test locale shows it (`language.feature`): every phrase from a
    catalogue is marked, so a word that is not came from somewhere else. What
    is nobody's language is left out: a tournament's name, which is what its
    manager called it, its dates, whose months the browser names, and the
    years, which are numbers. Each row is looked at for each part a reader can
    have in it, since each offers different things, and a year with nothing in
    it says so in words of its own.

    Scenario: A tournament the reader manages is listed in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then every word in the list but the tournaments' own is in the test locale

    Scenario: A tournament the reader scores is listed in the reader's language
      Given a browser that asks for "en-XA"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And "other@example.com" has made "organiser@example.com" a scorer of "Autumn Open"
      When the admin is opened
      Then every word in the list but the tournaments' own is in the test locale

    Scenario: An archived tournament is listed in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the admin is opened
      Then every word in the list but the tournaments' own is in the test locale

    Scenario: A year with no tournaments says so in the reader's language
      Given a browser that asks for "en-XA"
      When the admin is opened
      Then every word in the list but the tournaments' own is in the test locale

    Scenario: The years are named in the reader's language
      Given a browser that asks for "en-XA"
      When the admin is opened
      Then the years are named in the test locale

    Scenario: The drop-down list of years is named in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin is opened
      Then the drop-down list of years is named in the test locale

    Scenario: The drop-down list of years says what it holds in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the admin is opened
      Then every word in the years but the years themselves is in the test locale

    Scenario: The list is in Spanish for a reader of Spanish
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      When the admin is opened
      Then the list offers "Nuevo torneo"

  Rule: A tournament's name leads to it

    Scenario: The name of a tournament leads to it in the admin
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-03"
      And the tournament "Spring Open" is for the sport "ac"
      And the admin is open
      When the name "Spring Open" is pressed
      Then the address is "/admin/2026/ac/spring-open"

    Scenario: The name of an archived tournament leads to it in the admin
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-03"
      And the tournament "Spring Open" is for the sport "ac"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And the admin is open
      When the name "Spring Open" is pressed
      Then the address is "/admin/2026/ac/spring-open"

    Scenario: The name of a tournament the reader scores leads to it in the admin
      Given "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      And the tournament "Autumn Open" is for the sport "ac"
      And "other@example.com" has made "organiser@example.com" a scorer of "Autumn Open"
      And the admin is open
      When the name "Autumn Open" is pressed
      Then the address is "/admin/2026/ac/autumn-open"

  Rule: What a tournament offers is what the reader's part in it allows

    Scenario Outline: A tournament the reader manages offers what a manager does
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" offers "<option>"

      Examples:
        | option  |
        | Manage  |
        | Edit    |
        | Archive |

    Scenario: A tournament the reader manages does not offer scores
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" does not offer "Scores"

    Scenario: A tournament the reader scores offers scores
      Given "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And "other@example.com" has made "organiser@example.com" a scorer of "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" offers "Scores"

    Scenario Outline: A tournament the reader scores offers nothing a manager is offered
      Given "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And "other@example.com" has made "organiser@example.com" a scorer of "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" does not offer "<option>"

      Examples:
        | option  |
        | Manage  |
        | Edit    |
        | Archive |

  Rule: Manage and Scores lead to the tournament, and Edit to editing it

    Scenario: Manage leads to the tournament in the admin
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-03"
      And the tournament "Spring Open" is for the sport "ac"
      And the admin is open
      When "Manage" is pressed for the tournament "Spring Open"
      Then the address is "/admin/2026/ac/spring-open"

    Scenario: Edit leads to editing the tournament in the admin
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-03"
      And the tournament "Spring Open" is for the sport "ac"
      And the admin is open
      When "Edit" is pressed for the tournament "Spring Open"
      Then the address is "/admin/2026/ac/spring-open/edit"

    Scenario: Scores leads to the tournament in the admin
      Given "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      And the tournament "Autumn Open" is for the sport "ac"
      And "other@example.com" has made "organiser@example.com" a scorer of "Autumn Open"
      And the admin is open
      When "Scores" is pressed for the tournament "Autumn Open"
      Then the address is "/admin/2026/ac/autumn-open"

  Rule: An archived tournament is struck through, and offers only to restore it

    An archived tournament is set aside rather than gone (`archive.feature`),
    so it is still listed, but struck through so that it is not mistaken for
    one being run. A line through a name is not read out, so the row says in
    words that it is archived as well, for a reader who is listening rather
    than looking. Nothing is done with an archived tournament until it is
    restored, so restoring it is all a manager is offered, and a scorer is
    offered nothing.

    Scenario: An archived tournament is struck through
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" is struck through

    Scenario: A tournament that is not archived is not struck through
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" is not struck through

    Scenario: An archived tournament is said to be archived to a screen reader
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" is announced as archived

    Scenario: A tournament that is not archived is not said to be archived
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" is not announced as archived

    Scenario: An archived tournament the reader manages offers to restore it
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" offers "Restore"

    Scenario Outline: An archived tournament the reader manages offers nothing else
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" does not offer "<option>"

      Examples:
        | option  |
        | Manage  |
        | Edit    |
        | Archive |
        | Scores  |

    Scenario: A tournament that is not archived does not offer to restore it
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" does not offer "Restore"

    Scenario Outline: An archived tournament the reader scores offers nothing
      Given "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And "other@example.com" has made "organiser@example.com" a scorer of "Autumn Open"
      And "other@example.com" has archived the tournament "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" does not offer "<option>"

      Examples:
        | option  |
        | Scores  |
        | Restore |

  Rule: A tournament is archived and restored from the list

    Archiving is undone by restoring, and restoring by archiving, so neither
    asks the reader to confirm: a question before something that can be put
    back in one press is a question the reader learns to press through.

    Scenario: Archiving a tournament strikes it through
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the admin is open
      When "Archive" is pressed for the tournament "Spring Open"
      Then the tournament "Spring Open" is struck through

    Scenario: Archiving a tournament moves it after the others
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      And the admin is open
      When "Archive" is pressed for the tournament "Autumn Open"
      Then the first tournament is "Spring Open"
      And the second tournament is "Autumn Open"

    Scenario: A tournament archived from the list is kept archived
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the admin is open
      And "Archive" is pressed for the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" is struck through

    Scenario: Restoring a tournament takes the line through it away
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And the admin is open
      When "Restore" is pressed for the tournament "Spring Open"
      Then the tournament "Spring Open" is not struck through

    Scenario: Restoring a tournament puts it back in its place
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      And "organiser@example.com" has archived the tournament "Autumn Open"
      And the admin is open
      When "Restore" is pressed for the tournament "Autumn Open"
      Then the first tournament is "Autumn Open"
      And the second tournament is "Spring Open"

    Scenario: A tournament restored from the list is kept restored
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And the admin is open
      And "Restore" is pressed for the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" is not struck through

  Rule: The list is laid out for a phone first

    A tournament's name is the thing a reader is looking for, so it wraps onto
    as many lines as it needs rather than being cut short (`LAYOUT.md`), and
    nothing in a row pushes the page wider than the phone it is read on. Its
    dates are beside it rather than above it, as they are on a wider screen,
    so that a row is read as when and what at a glance, and what can be done
    with it is beneath them both.

    Scenario: A tournament's dates are beside its name on a phone
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then the dates of "Spring Open" are on the same row as its name

    Scenario: A tournament's dates come before its name on a phone
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then the dates of "Spring Open" are to the left of its name

    Scenario: A long name wraps rather than widening the page
      Given "organiser@example.com" has created the tournament "The Northern Counties Invitation Golf Croquet Championship"
      When the admin is opened
      Then the page is no wider than the window

    Scenario: A long name is not cut short
      Given "organiser@example.com" has created the tournament "The Northern Counties Invitation Golf Croquet Championship"
      When the admin is opened
      Then the name "The Northern Counties Invitation Golf Croquet Championship" is shown whole

    Scenario Outline: What a tournament offers can be pressed with a thumb
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then "<option>" for the tournament "Spring Open" is at least 44 pixels tall
      And "<option>" for the tournament "Spring Open" is at least 44 pixels wide

      Examples:
        | option  |
        | Manage  |
        | Edit    |
        | Archive |

    Scenario: The name of a tournament can be pressed with a thumb
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then the name "Spring Open" is at least 44 pixels tall
