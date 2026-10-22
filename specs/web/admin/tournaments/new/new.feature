@browser @postgres
Feature: A new tournament is created in the admin

  /admin/tournaments/new is where a reader creates a tournament, having
  pressed "New Tournament" above their list (`tournaments.feature`). It asks
  for everything a tournament begins with, as creating one says it
  (`create.feature`): its name, when it starts and finishes, the sport and
  the format it is played in, the country and the region it is played in, any
  subtitle, whether it is national and whether it is international. How its
  competitions are played and counted is each competition's to say, in the
  dialog that adds it (`competition.feature`).

  What it asks is what the website being read offers. The sports and formats
  are the ones its site offers, in the order the site gives them, since a
  tournament in any other would be refused (`CreateTournament.feature`). A
  region is asked for only where the country chosen is divided into regions:
  one that is not is its own one region, and there is nothing to choose. A
  region asked for need not be chosen, since a tournament need be in no
  region (`create.feature`). For
  the same reason Gateball Scores asks for neither a sport nor a format:
  gateball is the only sport its site offers and Standard the only format, and
  every tournament created there is a Standard tournament of gateball.

  What can be decided for the reader is decided, so that a tournament of the
  ordinary kind is a name, two days and a country away: the first sport the
  site offers and the Standard format are chosen to begin with, and it is
  neither national nor international.
  National and international are asked separately, and cannot both be
  true: a tournament said to be both is refused (`create.feature`). So the
  form never lets them be ticked together, rather than letting the reader
  tick both and then telling them it cannot be done. Ticking one unticks the
  other. Both can be false: a tournament that is neither national nor
  international, which is most of them, has neither ticked.

  Whoever creates it is its first manager, and is taken to it in the admin,
  where the tournament is run from. What the site refuses is said beside the
  field it is about, by the refusal's code, and nothing is kept; what was
  typed stays typed, so that it can be put right rather than typed again.

  The form is a dialog, as every form that is a page's purpose is
  (`STYLE.md`): its title, its fields, and the one button that does what it
  is for, with no button to cancel. Its words are in the reader's language, as
  the rest of the admin's are (`admin.feature`), and so are the sports, the
  formats and the countries it offers, which the site names in the reader's
  language as it offers them.

  The admin draws the form itself, so every scenario here runs scripts, and
  it is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"

  Rule: Only a reader signed in sees the form

    Scenario: A reader not signed in is sent to sign in first
      Given the reader has signed out
      When the new tournament page is opened
      Then the sign in page is shown

    Scenario: A reader who signs in from there is brought back to the form
      Given the reader has signed out
      And the new tournament page is open
      When the reader signs in as "organiser@example.com" with the password "correct horse battery staple"
      Then the address is "/admin/tournaments/new"

  Rule: The form asks for what a tournament begins with

    Scenario Outline: The form asks for each thing a tournament begins with
      When the new tournament page is opened
      Then the form asks for "<field>"

      Examples:
        | field                        |
        | Name                         |
        | Starts                       |
        | Finishes                     |
        | Sport                        |
        | Format                       |
        | Country                      |
        | Subtitle                     |
        | National‑level event         |
        | International‑level event    |

    Scenario: The form is titled for what it does
      When the new tournament page is opened
      Then the dialog is titled "New Tournament"

    Scenario: The form's one button creates the tournament
      When the new tournament page is opened
      Then the form's button is "Create Tournament"

    Scenario: The form offers no way to cancel
      When the new tournament page is opened
      Then the form has 1 button

  Rule: The reader is taken to the first field

    Scenario: The name is where the reader is taken
      When the new tournament page is opened
      Then "Name" has the focus

  Rule: The sports and formats are the ones the website offers

    Scenario Outline: Croquet Scores offers its sports in its order
      When the new tournament page is opened
      Then the <which> sport offered is "<sport>"

      Examples:
        | which  | sport               |
        | first  | Association Croquet |
        | second | Golf Croquet        |
        | third  | American 6 Wicket   |
        | fourth | Ricochet            |

    Scenario: Croquet Scores offers no other sport
      When the new tournament page is opened
      Then 4 sports are offered

    Scenario: Gateball Scores asks for no sport
      Given a site served as "gateballscores.com"
      And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the new tournament page is opened
      Then the form does not ask for "Sport"

    Scenario: A tournament created on Gateball Scores is a tournament of gateball
      Given a site served as "gateballscores.com"
      And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      And the new tournament page is open
      And "Spring Open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the country "Fiji" is chosen
      When "Create Tournament" is pressed
      Then the address is "/admin/2026/gb/spring-open"

    Scenario Outline: Croquet Scores offers its formats in its order
      When the new tournament page is opened
      Then the <which> format offered is "<format>"

      Examples:
        | which  | format                       |
        | first  | Standard                     |
        | second | Teams                        |
        | third  | Eire Cup                     |
        | fourth | Interstate Shield            |
        | fifth  | GC World Team Championship   |

    Scenario: Gateball Scores asks for no format
      Given a site served as "gateballscores.com"
      And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the new tournament page is opened
      Then the form does not ask for "Format"

    Scenario: A gateball tournament is created in the Standard format
      Given a site served as "gateballscores.com"
      And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      And the new tournament page is open
      And "Spring Open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the country "Fiji" is chosen
      When "Create Tournament" is pressed
      Then the tournament "Spring Open" is kept in the format "Standard"

  Rule: A region is asked for only where the country has regions

    Scenario: A country with regions asks for one
      Given the new tournament page is open
      When the country "Australia" is chosen
      Then the form asks for "Region"

    Scenario: The regions offered are the country's
      Given the new tournament page is open
      When the country "Australia" is chosen
      Then the region "Victoria" is offered

    Scenario: A country that is its own one region asks for none
      Given the new tournament page is open
      When the country "Fiji" is chosen
      Then the form does not ask for "Region"

    Scenario: Nothing asks for a region before a country is chosen
      When the new tournament page is opened
      Then the form does not ask for "Region"

    Scenario: No region is chosen to begin with
      Given the new tournament page is open
      When the country "Australia" is chosen
      Then no region is chosen

    Scenario: A tournament with no region chosen is kept in no region
      Given the new tournament page is open
      And "Spring Open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the country "Australia" is chosen
      When "Create Tournament" is pressed
      Then the tournament "Spring Open" is kept in no region

  Rule: What can be decided for the reader is decided to begin with

    Scenario: The first sport the site offers is chosen to begin with
      When the new tournament page is opened
      Then the sport chosen is "Association Croquet"

    Scenario: The Standard format is chosen to begin with
      When the new tournament page is opened
      Then the format chosen is "Standard"

    Scenario: A new tournament is not national to begin with
      When the new tournament page is opened
      Then "National‑level event" is not ticked

    Scenario: A new tournament is not international to begin with
      When the new tournament page is opened
      Then "International‑level event" is not ticked

    Scenario: Nothing else is filled in to begin with
      When the new tournament page is opened
      Then "Name" is empty

  Rule: Drawing a level test is asked about only where the format is played by teams

    Only a tournament played by teams has tests, and saying a Standard one
    draws them is refused (`create.feature`), so the form asks only once a
    format played by teams is chosen, ticked to begin with only for the GC
    World Team Championship, which has always drawn them.

    Scenario: The Standard format is not asked about level tests
      When the new tournament page is opened
      Then the form does not ask for "Level tests are drawn"

    Scenario: A format played by teams is asked about level tests
      Given the new tournament page is open
      When the format "Teams" is chosen
      Then the form asks for "Level tests are drawn"

    Scenario: Teams does not draw level tests to begin with
      Given the new tournament page is open
      When the format "Teams" is chosen
      Then "Level tests are drawn" is not ticked

    Scenario: The GC World Team Championship draws level tests to begin with
      Given the new tournament page is open
      When the format "GC World Team Championship" is chosen
      Then "Level tests are drawn" is ticked

    Scenario: A tournament said to draw level tests is created drawing them
      Given the new tournament page is open
      And "Spring Shield" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the format "Teams" is chosen
      And the country "Fiji" is chosen
      And the reader ticks "Level tests are drawn"
      When "Create Tournament" is pressed
      Then the tournament "Spring Shield" is kept drawing a level test

  Rule: A tournament may be national, international or neither, but never both

    Scenario: A tournament can be national
      Given the new tournament page is open
      When the reader ticks "National‑level event"
      Then "National‑level event" is ticked

    Scenario: A tournament can be international
      Given the new tournament page is open
      When the reader ticks "International‑level event"
      Then "International‑level event" is ticked

    Scenario: Ticking national unticks international
      Given the new tournament page is open
      And the reader ticks "International‑level event"
      When the reader ticks "National‑level event"
      Then "International‑level event" is not ticked

    Scenario: Ticking international unticks national
      Given the new tournament page is open
      And the reader ticks "National‑level event"
      When the reader ticks "International‑level event"
      Then "National‑level event" is not ticked

    Scenario: Unticking one leaves the other unticked
      Given the new tournament page is open
      And the reader ticks "National‑level event"
      When the reader unticks "National‑level event"
      Then "International‑level event" is not ticked

    Scenario: A tournament that is neither is created as neither
      Given the new tournament page is open
      And "Spring Open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the country "Fiji" is chosen
      When "Create Tournament" is pressed
      Then the tournament "Spring Open" is kept as not national
      And the tournament "Spring Open" is kept as not international

  Rule: Creating a tournament takes the reader to it

    Scenario: The reader is taken to the tournament they created
      Given the new tournament page is open
      And "Spring Open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the country "Australia" is chosen
      And the region "Victoria" is chosen
      When "Create Tournament" is pressed
      Then the address is "/admin/2026/ac/spring-open"

    Scenario: The tournament created is listed as one the reader manages
      Given the new tournament page is open
      And "Spring Open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the country "Australia" is chosen
      And the region "Victoria" is chosen
      And "Create Tournament" is pressed
      When the admin is opened
      Then the tournament "Spring Open" offers "Manage"

    Scenario: A tournament in a country that is its own one region is created
      Given the new tournament page is open
      And "Fiji Open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the country "Fiji" is chosen
      When "Create Tournament" is pressed
      Then the address is "/admin/2026/ac/fiji-open"

    Scenario: The tournament is played in the sport chosen
      Given the new tournament page is open
      And "Spring Open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the sport "Golf Croquet" is chosen
      And the country "Fiji" is chosen
      When "Create Tournament" is pressed
      Then the address is "/admin/2026/gc/spring-open"

  Rule: What is refused is said beside the field it is about

    Scenario Outline: A value that breaks a rule is refused beside its field
      Given the new tournament page is open
      And "<name>" is typed as the "Name"
      And "<starts>" is typed as the "Starts"
      And "<finishes>" is typed as the "Finishes"
      And the country "Fiji" is chosen
      When "Create Tournament" is pressed
      Then "<field>" is refused with "<code>"

      Examples:
        | name        | starts     | finishes   | field    | code                             |
        |             | 2026-10-03 | 2026-10-05 | Name     | TournamentName.Missing           |
        | spring open | 2026-10-03 | 2026-10-05 | Name     | TournamentName.AllLowerCase      |
        | Spring Open |            | 2026-10-05 | Starts   | ReadOnlyDate.Unreadable          |
        | Spring Open | 2026-10-03 |            | Finishes | ReadOnlyDate.Unreadable          |
        | Spring Open | 2026-10-05 | 2026-10-03 | Finishes | Tournament.FinishesBeforeStarts  |

    Scenario: A start in the year after next is refused beside the start
      Given the server's clock reads "2026-09-17T09:00:00Z"
      And the new tournament page is open
      And "Spring Open" is typed as the "Name"
      And "2028-01-01" is typed as the "Starts"
      And "2028-01-02" is typed as the "Finishes"
      And the country "Fiji" is chosen
      When "Create Tournament" is pressed
      Then "Starts" is refused with "Tournament.StartsAfterNextYear"

    Scenario: A finish in the year after next is refused beside the finish
      Given the server's clock reads "2026-09-17T09:00:00Z"
      And the new tournament page is open
      And "Spring Open" is typed as the "Name"
      And "2027-12-31" is typed as the "Starts"
      And "2028-01-01" is typed as the "Finishes"
      And the country "Fiji" is chosen
      When "Create Tournament" is pressed
      Then "Finishes" is refused with "Tournament.FinishesAfterNextYear"

    Scenario: A tournament with no country is refused beside the country
      Given the new tournament page is open
      And "Spring Open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      When "Create Tournament" is pressed
      Then "Country" is refused with "CreateTournament.NoSuchCountry"

    Scenario: A subtitle longer than a subtitle may be is refused beside it
      Given the new tournament page is open
      And "Spring Open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the country "Fiji" is chosen
      And 2001 characters are typed as the "Subtitle"
      When "Create Tournament" is pressed
      Then "Subtitle" is refused with "TournamentSubtitle.TooLong"

    Scenario: A refused form keeps what was typed
      Given the new tournament page is open
      And "spring open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the country "Fiji" is chosen
      When "Create Tournament" is pressed
      Then "Name" still says "spring open"

    Scenario: A refused form stays where it is
      Given the new tournament page is open
      And "spring open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the country "Fiji" is chosen
      When "Create Tournament" is pressed
      Then the address is "/admin/tournaments/new"

    Scenario: A refused tournament is not kept
      Given the new tournament page is open
      And "spring open" is typed as the "Name"
      And "2026-10-03" is typed as the "Starts"
      And "2026-10-05" is typed as the "Finishes"
      And the country "Fiji" is chosen
      And "Create Tournament" is pressed
      When the admin is opened
      Then the list says there are no tournaments

  Rule: Every word the form says is in the reader's language

    The test locale shows it (`language.feature`). The sports, the formats and
    the countries are among the form's words: each is in a catalogue by its
    code, and the API names them in the reader's language as it offers them,
    so the form shows what it is given. English takes their names from the
    tournament's own, rather than writing each out a second time to drift.

    The countries are listed in order of their names as the reader's language
    has them, since that is the order a reader looks for one in: Germany comes
    after Argentina in English, and before it in Spanish, as Alemania.

    The regions are the one thing on the form left as they are. There are
    hundreds of them, most already named in their own country's language, and
    they are named as the old site recorded them, so that what it recorded
    still reads as it did.

    Scenario: The form is in the reader's language
      Given a browser that asks for "en-XA"
      When the new tournament page is opened
      Then every word in the form is in the test locale

    Scenario: A refused form is in the reader's language
      Given a browser that asks for "en-XA"
      And the new tournament page is open
      When the form is sent as it is
      Then the form says what it refused
      And every word in the form is in the test locale

    Scenario: The countries are in order of their names in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      When the new tournament page is opened
      Then the country "Alemania" is offered before the country "Argentina"

    Scenario: The countries are in order of their names in English
      Given a site offering the languages it is served with
      And a browser that asks for "en"
      When the new tournament page is opened
      Then the country "Argentina" is offered before the country "Germany"

  Rule: The form is laid out for a phone first

    What is read together is side by side, on a phone as much as anywhere:
    when a tournament starts and when it finishes, its format and its sport,
    and its country and the region of it. Where only one of a pair is asked
    for, it has the row to itself.

    Scenario: The start and the finish are on one row
      When the new tournament page is opened
      Then "Starts" and "Finishes" are on the same row

    Scenario: The start comes before the finish
      When the new tournament page is opened
      Then "Starts" is to the left of "Finishes"

    Scenario: The format and the sport are on one row
      When the new tournament page is opened
      Then "Format" and "Sport" are on the same row

    Scenario: The format comes before the sport
      When the new tournament page is opened
      Then "Format" is to the left of "Sport"

    Scenario: The country and its region are on one row
      Given the new tournament page is open
      When the country "Australia" is chosen
      Then "Country" and "Region" are on the same row

    Scenario: The country comes before its region
      Given the new tournament page is open
      When the country "Australia" is chosen
      Then "Country" is to the left of "Region"

    Scenario: The form is no wider than the window
      When the new tournament page is opened
      Then the page is no wider than the window

    Scenario: The button can be pressed with a thumb
      When the new tournament page is opened
      Then "Create Tournament" is at least 44 pixels tall
