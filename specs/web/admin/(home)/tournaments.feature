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

  Rule: A world ranking officer's list adds every tournament of a sport it looks after

    An account that holds the AC World Ranking Officer or the GC World Ranking
    Officer role may change the world ranking name of any player in a
    tournament of that role's sport (`changeWorldRankingName.feature`), and
    only association croquet and golf croquet have players known by name to
    the world rankings (`Sport.feature`). So its list is of the tournaments it
    manages or scores, of any sport, offering what its part allows, and every
    tournament of the sport or sports it holds a role for on the website
    besides, each
    offering its players, which is what the officer is there for. A
    tournament of the other of the two is not in it, since the officers of one
    sport are not those of the other. Whether any of a tournament's
    competitions counts towards the world rankings is each competition's to
    say (`competitionRules.feature`), and the officer narrows the list by it
    (the rule below). The years are those any of them is in.

    Scenario: A tournament of a sport with world rankings is listed for a world ranking officer
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" has a block that counts towards the world rankings
      When the admin is opened
      Then the tournament "Autumn Open" is listed

    Scenario: A tournament a world ranking officer has no part in offers its players
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" has a block that counts towards the world rankings
      When the admin is opened
      Then the tournament "Autumn Open" offers "Players"

    Scenario: A tournament a world ranking officer has no part in offers nothing a manager is offered
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" has a block that counts towards the world rankings
      When the admin is opened
      Then the tournament "Autumn Open" does not offer "Manage"

    Scenario: Players leads to the tournament in the admin
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" has a block that counts towards the world rankings
      And the tournament "Autumn Open" starts on "2026-10-03"
      And the tournament "Autumn Open" is for the sport "ac"
      And the admin is open
      When "Players" is pressed for the tournament "Autumn Open"
      Then the address is "/admin/2026/ac/autumn-open"

    Scenario: A tournament a world ranking officer manages offers what a manager does
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the admin is opened
      Then the tournament "Spring Open" offers "Manage"

    Scenario: A Golf Croquet tournament is not listed for an AC world ranking officer
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" is for the sport "gc"
      When the admin is opened
      Then the tournament "Autumn Open" is not listed

    Scenario: An Association Croquet tournament is not listed for a GC world ranking officer
      Given "organiser@example.com" has been given the role "GC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" is for the sport "ac"
      When the admin is opened
      Then the tournament "Autumn Open" is not listed

    Scenario: A Golf Croquet tournament is listed for a GC world ranking officer
      Given "organiser@example.com" has been given the role "GC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" has a block that counts towards the world rankings
      And the tournament "Autumn Open" is for the sport "gc"
      When the admin is opened
      Then the tournament "Autumn Open" is listed

    Scenario: Both sports' tournaments are listed for an officer of both
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "organiser@example.com" has been given the role "GC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" has a block that counts towards the world rankings
      And "other@example.com" has created the tournament "Winter Open"
      And the tournament "Winter Open" has a block that counts towards the world rankings
      And the tournament "Autumn Open" is for the sport "ac"
      And the tournament "Winter Open" is for the sport "gc"
      When the admin is opened
      Then the tournament "Autumn Open" is listed
      And the tournament "Winter Open" is listed

    Scenario: A Golf Croquet tournament an AC world ranking officer manages is still listed
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" is for the sport "gc"
      When the admin is opened
      Then the tournament "Autumn Open" offers "Manage"

    Scenario: A Golf Croquet tournament an AC world ranking officer scores is still listed
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" is for the sport "gc"
      And "other@example.com" has made "organiser@example.com" a scorer of "Autumn Open"
      When the admin is opened
      Then the tournament "Autumn Open" is listed

    Scenario: A tournament of a sport without world rankings is not listed for a world ranking officer
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" is for the sport "rc"
      When the admin is opened
      Then the tournament "Autumn Open" is not listed

    Scenario: A year of a tournament of the other sport is not offered to a world ranking officer
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2024-10-03"
      And the tournament "Autumn Open" is for the sport "gc"
      When the admin is opened
      Then the year 2024 is not offered

    Scenario: A year of a tournament of a sport with world rankings is offered to a world ranking officer
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2024-10-03"
      When the admin is opened
      Then the year 2024 is offered

  Rule: A world ranking officer narrows its list by what the tournaments count towards

    Every tournament of the sports an officer looks after is more than it
    wants to read down, so its list has three toggles. "Manager/Scorer" lists
    the tournaments it manages or scores. "World Ranking" lists those with a
    competition in use that counts towards the world rankings, and "Not World
    Ranking" those with none. A tournament is listed when any toggle that
    applies to it is on, so each one adds tournaments rather than taking them
    away. To begin with "Manager/Scorer" and "World Ranking" are on, which is
    its own tournaments and the ones it is there to look after.

    Only an officer is offered them: a manager or a scorer has nothing in
    their list that is not theirs to narrow it by. Like the other choices
    they are kept in the address, so that the back button undoes one, and
    belong to nobody but the reader who made them.

    Background:
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Ranked Open"
      And the tournament "Ranked Open" has a block that counts towards the world rankings
      And "other@example.com" has created the tournament "Social Open"
      And the tournament "Social Open" has a block that does not count towards the world rankings
      And "organiser@example.com" has created the tournament "Own Open"
      And the tournament "Own Open" has a block that does not count towards the world rankings

    Scenario: The toggles are offered to an officer
      When the admin is opened
      Then the toggle "Manager/Scorer" is offered

    Scenario: The toggles are on the row of New Tournament where the screen is wide enough
      Given a viewport 1200 pixels wide
      When the admin is opened
      Then the toggle "Manager/Scorer" is on the row of "New Tournament"

    Scenario: The toggles are on the row of New Tournament for each toggle
      Given a viewport 1200 pixels wide
      When the admin is opened
      Then the toggle "Not World Ranking" is on the row of "New Tournament"

    Scenario: A toggle that is on shows a tick
      When the admin is opened
      Then the toggle "Manager/Scorer" shows a tick

    Scenario: A toggle that is off shows no tick
      When the admin is opened
      Then the toggle "Not World Ranking" shows no tick

    Scenario: A toggle pressed on shows a tick
      Given the admin is opened
      When the toggle "Not World Ranking" is pressed
      Then the toggle "Not World Ranking" shows a tick

    Scenario: A toggle pressed off shows no tick
      Given the admin is opened
      When the toggle "Manager/Scorer" is pressed
      Then the toggle "Manager/Scorer" shows no tick

    Scenario: A toggle that is off looks as New Tournament does
      When the admin is opened
      Then the toggle "Not World Ranking" looks as "New Tournament" does

    Scenario: A toggle that is on looks as New Tournament does
      When the admin is opened
      Then the toggle "Manager/Scorer" looks as "New Tournament" does

    Scenario: Manager/Scorer is on to begin with
      When the admin is opened
      Then the toggle "Manager/Scorer" is on

    Scenario: World Ranking is on to begin with
      When the admin is opened
      Then the toggle "World Ranking" is on

    Scenario: Not World Ranking is off to begin with
      When the admin is opened
      Then the toggle "Not World Ranking" is off

    Scenario: A tournament that counts is listed to begin with
      When the admin is opened
      Then the tournament "Ranked Open" is listed

    Scenario: A tournament the officer manages is listed to begin with
      When the admin is opened
      Then the tournament "Own Open" is listed

    Scenario: A tournament that does not count and is not the officer's is not listed to begin with
      When the admin is opened
      Then the tournament "Social Open" is not listed

    Scenario: Not World Ranking lists a tournament that does not count
      Given the admin is open
      When the toggle "Not World Ranking" is pressed
      Then the tournament "Social Open" is listed

    Scenario: World Ranking turned off does not list a tournament that counts
      Given the admin is open
      When the toggle "World Ranking" is pressed
      Then the tournament "Ranked Open" is not listed

    Scenario: Manager/Scorer turned off does not list a tournament the officer manages
      Given the admin is open
      When the toggle "Manager/Scorer" is pressed
      Then the tournament "Own Open" is not listed

    Scenario: A toggle pressed is on
      Given the admin is open
      When the toggle "Not World Ranking" is pressed
      Then the toggle "Not World Ranking" is on

    Scenario: A toggle pressed is kept when the page is loaded again
      Given the admin is open
      When the toggle "Not World Ranking" is pressed
      And the page is loaded again
      Then the toggle "Not World Ranking" is on

    Scenario: The back button undoes a toggle
      Given the admin is open
      And the toggle "Not World Ranking" is pressed
      When the browser goes back
      Then the toggle "Not World Ranking" is off

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

  Rule: The list is narrowed by country, region and sport, to those the reader can see

    The home page narrows its lists by a country, a region of it and a sport
    (`home.feature`), and so does this one. What is offered to choose from is
    only what the list in front of the reader holds: the countries, regions
    and sports of the tournaments listed for the year chosen, and so, for a
    world ranking officer, of the tournaments of the sports it looks after,
    and for a manager or a scorer, of the tournaments it has a part in. A
    reader is never offered a choice that would list nothing, and never
    learns from the filter that a tournament they cannot see is there.

    Regions belong to a country, so a region is offered once a country has
    been chosen, and then only the regions of that country the list holds. A
    country that is not divided into regions offers none.

    The country, the region and the sport are fields the reader types into,
    which suggest the names that have what has been typed so far. No line is
    drawn between the groups of countries, since the suggestions of a field
    have no place for one. A choice is made as a name offered is chosen, with
    no button to press, since this page runs scripts as it is. It is kept in the address, as the year is
    (`/admin/2026?country=nz`), so that it can be linked to and the browser's
    back button undoes it. The choices belong to the year they were offered
    from, so choosing another year clears them: a country offered in 2026 may
    be nowhere in 2025. A choice in the address that is not offered is
    ignored rather than refused, as an unreadable sorting is on the home page.

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is played in the region "can"
      And the tournament "Spring Open" is for the sport "ac"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-17"
      And the tournament "Autumn Open" is played in the country "nz"
      And the tournament "Autumn Open" is played in the region "auc"
      And the tournament "Autumn Open" is for the sport "gc"
      And "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-10-24"
      And the tournament "Summer Open" is played in the country "au"
      And the tournament "Summer Open" is played in the region "vic"
      And the tournament "Summer Open" is for the sport "ac"

    Scenario: A reader who is not an officer is not offered the toggles
      When the admin is opened
      Then the toggle "Manager/Scorer" is not offered

    Scenario: Nothing is filtered by to begin with
      When the admin is opened
      Then the tournament "Spring Open" is listed
      And the tournament "Autumn Open" is listed
      And the tournament "Summer Open" is listed

    Scenario: A country the list holds is offered
      When the admin is opened
      Then the filter offers "New Zealand" as a country

    Scenario Outline: The countries the list holds are offered the ones most played in first
      Given "organiser@example.com" has created the tournament "Winter Open"
      And the tournament "Winter Open" starts on "2026-10-31"
      And the tournament "Winter Open" is played in the country "jp"
      When the admin is opened
      Then the <which> country in the filter is "<country>"

      Examples:
        | which  | country     |
        | first  | Australia   |
        | second | New Zealand |
        | third  | Japan       |

    Scenario: A part of a country's name offers the countries that have it
      Given the admin is open
      When "Zeal" is typed as the country
      Then the filter offers "New Zealand" as a country

    Scenario: A part of a country's name does not offer a country that lacks it
      Given the admin is open
      When "Zeal" is typed as the country
      Then the filter does not offer "Australia" as a country

    Scenario: A part of a sport's name does not offer a sport that lacks it
      Given the admin is open
      When "Golf" is typed as the sport
      Then the filter does not offer "Association Croquet" as a sport

    Scenario: A name typed that is not offered lists everything, as an address that is not offered does
      Given the admin is open
      When "Atlantis" is typed as the country
      Then the tournament "Summer Open" is listed

    Scenario: A name that is half deleted stays in the box to go on editing
      Given the admin is open
      And "New Zealand" is chosen as the country
      When "New Zealan" is typed as the country
      Then the country box of the filter says "New Zealan"
      And the tournament "Summer Open" is listed

    Scenario: A country the list does not hold is not offered
      When the admin is opened
      Then the filter does not offer "Japan" as a country

    Scenario: A country held only by a tournament of another year is not offered
      Given "organiser@example.com" has created the tournament "Winter Open"
      And the tournament "Winter Open" starts on "2025-06-07"
      And the tournament "Winter Open" is played in the country "jp"
      When the admin is opened
      Then the filter does not offer "Japan" as a country

    Scenario: A country held only by a tournament the reader has no part in is not offered
      Given "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Cherry Open"
      And the tournament "Cherry Open" starts on "2026-10-31"
      And the tournament "Cherry Open" is played in the country "jp"
      When the admin is opened
      Then the filter does not offer "Japan" as a country

    Scenario: A country chosen lists its tournaments
      Given the admin is open
      When "New Zealand" is chosen as the country
      Then the tournament "Spring Open" is listed

    Scenario: A country chosen does not list another country's tournaments
      Given the admin is open
      When "New Zealand" is chosen as the country
      Then the tournament "Summer Open" is not listed

    Scenario: No region is offered until a country has been chosen
      When the admin is opened
      Then the filter offers no region

    Scenario: A region of the country chosen that the list holds is offered
      Given the admin is open
      When "New Zealand" is chosen as the country
      Then the filter offers "Canterbury" as a region

    Scenario: A region of the country chosen that the list does not hold is not offered
      Given the admin is open
      When "New Zealand" is chosen as the country
      Then the filter does not offer "Otago" as a region

    Scenario: A region of another country is not offered
      Given the admin is open
      When "New Zealand" is chosen as the country
      Then the filter does not offer "Victoria" as a region

    Scenario: A region chosen lists its tournaments
      Given the admin is open
      And "New Zealand" is chosen as the country
      When "Canterbury" is chosen as the region
      Then the tournament "Spring Open" is listed

    Scenario: A region chosen does not list another region's tournaments
      Given the admin is open
      And "New Zealand" is chosen as the country
      When "Canterbury" is chosen as the region
      Then the tournament "Autumn Open" is not listed

    Scenario: A region chosen is dropped when another country is chosen
      Given the admin is open
      And "New Zealand" is chosen as the country
      And "Canterbury" is chosen as the region
      When "Australia" is chosen as the country
      Then the tournament "Summer Open" is listed

    Scenario: A sport the list holds is offered
      When the admin is opened
      Then the filter offers "Golf Croquet" as a sport

    Scenario: A sport the list does not hold is not offered
      When the admin is opened
      Then the filter does not offer "Ricochet" as a sport

    Scenario: A sport chosen lists its tournaments
      Given the admin is open
      When "Golf Croquet" is chosen as the sport
      Then the tournament "Autumn Open" is listed

    Scenario: A sport chosen does not list another sport's tournaments
      Given the admin is open
      When "Golf Croquet" is chosen as the sport
      Then the tournament "Spring Open" is not listed

    Scenario: A country and a sport chosen together narrow by both
      Given the admin is open
      And "New Zealand" is chosen as the country
      When "Association Croquet" is chosen as the sport
      Then the tournament "Autumn Open" is not listed

    Scenario: A country and a sport chosen together still list what matches both
      Given the admin is open
      And "New Zealand" is chosen as the country
      When "Association Croquet" is chosen as the sport
      Then the tournament "Spring Open" is listed

    Scenario: An archived tournament is narrowed as any other is
      Given "organiser@example.com" has archived the tournament "Summer Open"
      And the admin is open
      When "New Zealand" is chosen as the country
      Then the tournament "Summer Open" is not listed

    Scenario: A filter that lists nothing says so
      Given the admin is open
      And "Australia" is chosen as the country
      When "Golf Croquet" is chosen as the sport
      Then the list says no tournament matches

    Scenario: What was chosen is in the address
      Given the admin for 2026 is open
      When "New Zealand" is chosen as the country
      Then the address is "/admin/2026?country=nz"

    Scenario: A filter in the address is chosen when the admin is opened at it
      When the admin is opened at "/admin/2026?country=nz"
      Then the country chosen is "New Zealand"

    Scenario: A filter in the address narrows the list
      When the admin is opened at "/admin/2026?country=nz"
      Then the tournament "Summer Open" is not listed

    Scenario: A country in the address that is not offered is ignored
      When the admin is opened at "/admin/2026?country=jp"
      Then the tournament "Summer Open" is listed

    Scenario: The browser's back button undoes a choice
      Given the admin is open
      And "New Zealand" is chosen as the country
      When the browser goes back
      Then the tournament "Summer Open" is listed

    Scenario: The box says the country again when the browser goes back and then forward
      Given the admin is open
      And "New Zealand" is chosen as the country
      And the browser goes back
      And the country box of the filter says ""
      When the browser goes forward
      Then the country box of the filter says "New Zealand"

    Scenario: Choosing another year clears the choices
      Given "organiser@example.com" has created the tournament "Winter Open"
      And the tournament "Winter Open" starts on "2025-06-07"
      And the tournament "Winter Open" is played in the country "au"
      And the admin is open
      And "New Zealand" is chosen as the country
      When the year 2025 is chosen
      Then the tournament "Winter Open" is listed

    Scenario: A year with no tournaments offers no filter
      When the admin for 2020 is opened
      Then no filter is offered

    Scenario: The filter says its words in the reader's language
      Given a browser that asks for "en-XA"
      When the admin is opened
      Then every word in the filter is in the test locale

    Scenario: The filter is no wider than a phone
      When the admin is opened
      Then the page is no wider than the window

  Rule: A world ranking officer is offered what the tournaments it looks after hold

    The same list is narrowed, so the choices are those of the tournaments of
    the sports it holds a role for, besides its own, and never those of a
    sport it does not.

    Background:
      Given "other@example.com" has an account, confirmed
      And "other@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is for the sport "ac"
      And the tournament "Spring Open" has a block that counts towards the world rankings
      And "other@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-17"
      And the tournament "Autumn Open" is played in the country "jp"
      And the tournament "Autumn Open" is for the sport "gc"
      And the tournament "Autumn Open" has a block that counts towards the world rankings
      And "other@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-10-24"
      And the tournament "Summer Open" is played in the country "au"
      And the tournament "Summer Open" is for the sport "ac"
      And the tournament "Summer Open" has a block that counts towards the world rankings
      And "organiser@example.com" has been given the role "GC World Ranking Officer"

    Scenario: A country of a tournament it looks after is offered
      When the admin is opened
      Then the filter offers "Japan" as a country

    Scenario: A country of a tournament of a sport it does not look after is not offered
      When the admin is opened
      Then the filter does not offer "New Zealand" as a country

    Scenario: The sport it looks after is offered
      When the admin is opened
      Then the filter offers "Golf Croquet" as a sport

    Scenario: A sport it does not look after is not offered
      When the admin is opened
      Then the filter does not offer "Association Croquet" as a sport

    Scenario: A country chosen narrows the tournaments it looks after
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      And the admin is open
      When "Australia" is chosen as the country
      Then the tournament "Spring Open" is not listed

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
