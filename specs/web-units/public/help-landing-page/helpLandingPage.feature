@browser
Feature: The first page of the help helps a reader find an answer without knowing where it is

  A reader who opens the help has a question and not yet a subject. The search
  box at the top is for the ones who can put the question into words. For the
  others the page shows what is most often asked, as questions, each leading to
  the article that answers it, and then the subjects the help is written under,
  as cards that can be read at a glance and pressed anywhere.

  The popular questions are a list of links written in each language's own first
  page of the help (`helpPages.feature` holds every language to the same ones),
  so which questions are popular is decided where the help is written and not in
  the site's code. The addresses of the pages are what they were, and the search
  is as it was (`helpSearch.feature`).

  A card is one link and not three. The whole of it is pressed, and a reader who
  moves by keyboard or by screen reader stops once on it and not on its title,
  then its words, then its edge.

  Rule: The first page does not say what it plainly is

    The panel is a search box and the page is the help, and a reader who has
    arrived at it knows both. A heading that says "Help", a sentence that says
    what the help is for, and a label over the search box that says it is for a
    question, are three things to read before the first of the questions. They
    are not shown.

    They are not taken away from those who cannot see the page, who have nothing
    else to say where they are: the page keeps its title, which is in the tab and
    is what a screen reader announces, and the search box keeps its name.

    Scenario: The page shows no heading above the search box
      When the first page of the help is opened in the browser
      Then the title of the page is not shown

    Scenario: The page is still called Help
      When the first page of the help is opened in the browser
      Then the page is titled "Help"

    Scenario: The title comes before the search box in the order of the page
      When the first page of the help is opened in the browser
      Then the title of the page comes before the search box in the order of the page

    Scenario: The title is the only first level heading
      When the first page of the help is opened in the browser
      Then the page has 1 first level heading

    Scenario: The page shows no sentence about what the help is for
      When the first page of the help is opened in the browser
      Then the article does not say "How to use the site, for the people who use it."

    Scenario: The search box shows no label
      When the first page of the help is opened in the browser
      Then the search box shows no label

    Scenario: The search box is still called by its question
      When the first page of the help is opened in the browser
      Then the search box is called "Your question"

  Rule: The panel and the popular questions are headed alike

    The panel and the popular questions are two sections of one page, side by
    side in what they are, and are headed alike: each by a second level heading,
    at the size the panel's was. A heading larger than another says its section
    matters more, and neither does. The subjects have no heading shown, being
    cards that say what they are themselves; the page keeps one for a screen
    reader, which has no cards to see.

    Scenario: The panel is headed by a second level heading
      When the first page of the help is opened in the browser
      Then the panel's title is a second level heading

    Scenario: The popular questions are as large as the panel's title
      When the first page of the help is opened in the browser
      Then the heading "Popular questions" is as large as the panel's title

    Scenario: The subjects have no heading shown
      When the first page of the help is opened in the browser
      Then the heading of the subjects is not shown

    Scenario: The subjects still have a heading for a screen reader
      When the first page of the help is opened in the browser
      Then the page has a heading for the subjects

  Rule: The words of the first page are black in the light theme

    The page's text is a near-black, which on the green of a card reads as grey.
    The words of the first page, its headings, what is typed in the search box,
    the words under a card's title and the words of a result, are black in the
    light theme. The links, being links, keep the colour of links.

    In the dark theme they are the pale colour the rest of the text is: black
    on a dark card would be a hole.

    Scenario: The words under the title of a subject are black
      Given the reader's browser asks for light colours
      When the first page of the help is opened in the browser
      Then the words under the title of the card "Readers" are black

    Scenario: The heading of the popular questions is black
      Given the reader's browser asks for light colours
      When the first page of the help is opened in the browser
      Then the heading "Popular questions" is black

    Scenario: The title of the search box is black
      Given the reader's browser asks for light colours
      When the first page of the help is opened in the browser
      Then the panel's title is black

    Scenario: What is typed in the search box is black
      Given the reader's browser asks for light colours
      When the first page of the help is opened in the browser
      Then the words typed in the search box are black

    Scenario: In the dark theme the words are not black
      Given the reader's browser asks for dark colours
      When the first page of the help is opened in the browser
      Then the words under the title of the card "Readers" are not black

  Rule: Only the first page is laid out as cards

    The cards are found by the bookmarks the first page's headings are given. A
    page of the help that happens to give a heading the same bookmark is not the
    first page, and is left as the help is laid out everywhere else.

    Scenario: A heading with the bookmark of the subjects, on another page, is shown
      Given a page of the help that uses the bookmarks of the first page
      When that page is opened in the browser
      Then its heading "Subjects" is shown

    Scenario: A list after that heading is not laid out as cards
      Given a page of the help that uses the bookmarks of the first page
      When that page is opened in the browser
      Then its list is not laid out as cards

  Rule: The search box is a card like the others

    The panel, the popular questions and the subjects are all cards, one colour
    and one shape, so that the page reads as a set of things to choose from and
    the search is the first of them and not a bare field above the rest.

    Scenario: The search box is the colour of a subject card
      When the first page of the help is opened in the browser
      Then the search box is the colour of a subject card

    Scenario: The search box has the corners of a subject card
      When the first page of the help is opened in the browser
      Then the search box has the corners of a subject card

  Rule: The popular questions are a card like the subjects

    Scenario: The popular questions are the colour of a subject card
      When the first page of the help is opened in the browser
      Then the popular questions are the colour of a subject card

    Scenario: The cards are the colour of the alternating rows of a list of tournaments
      When the first page of the help is opened in the browser
      Then a subject card is the colour of the alternating rows of a list

    Scenario: The popular questions have the corners of a subject card
      When the first page of the help is opened in the browser
      Then the popular questions have the corners of a subject card

  Rule: The sections are 1rem apart

    A rem is the size of the page's own letters, so the gaps grow with them for
    a reader who has made the letters larger. Each stands 1rem below what is
    above it, and nothing else is between them: not a rule, and not room left
    over from the section above.

    Scenario: The popular questions are 1rem below the search box's card
      When the first page of the help is opened in the browser
      Then the popular questions are 1rem below the search box

    Scenario: The subject cards are 1rem below the popular questions
      When the first page of the help is opened in the browser
      Then the subject cards are 1rem below the popular questions

  Rule: The popular questions are below the search box

    Scenario: The popular questions come after the search box
      When the first page of the help is opened in the browser
      Then the popular questions come after the search box

    Scenario: There are five popular questions
      When the first page of the help is opened in the browser
      Then there are 5 popular questions

    Scenario Outline: A popular question leads to the article that answers it
      When the first page of the help is opened in the browser
      And the popular question "<question>" is followed
      Then the article is called "<article>"

      Examples:
        | question                              | article             |
        | How do I create a tournament?         | Creating a tournament |
        | How do I add players to a tournament? | Players             |
        | How do I enter scores?                | Scores              |
        | How do I reset my password?           | Signing in          |
        | How do rankings work?                 | Rankings            |

    Scenario: A popular question leads to the part of the article that answers it
      When the first page of the help is opened in the browser
      And the popular question "How do I enter scores?" is followed
      Then the address ends with "#entering-a-score"

  Rule: The subjects are cards

    Scenario: There is a card for each of the four subjects
      When the first page of the help is opened in the browser
      Then there are 4 subject cards

    Scenario Outline: A card leads to its subject
      When the first page of the help is opened in the browser
      And the card "<subject>" is followed
      Then the article is called "<article>"

      Examples:
        | subject                | article                            |
        | Readers                | Help for readers                   |
        | Your account           | Help for your account              |
        | Tournament managers    | Help for tournament managers       |
        | World ranking officers | Help for world ranking officers    |

    Scenario: The whole card is pressed, and not only its title
      When the first page of the help is opened in the browser
      And the words under the title of the card "Readers" are pressed
      Then the article is called "Help for readers"

    Scenario: A card says what is in its subject
      When the first page of the help is opened in the browser
      Then the card "Your account" has words under its title

  Rule: A card is one stop for the keyboard

    Scenario: Each card is stopped at once
      When the first page of the help is opened in the browser
      And the keyboard goes through the cards
      Then it stops 4 times

    Scenario: The card the keyboard is on is marked
      When the first page of the help is opened in the browser
      And the keyboard goes to the first card
      Then one card is marked as the one the keyboard is on

  Rule: The cards fit the screen they are read on

    Scenario: Cards stand beside each other on a wide screen
      Given a screen 1280 pixels wide
      When the first page of the help is opened in the browser
      Then the first two cards are side by side

    Scenario: Cards stand one above another on a phone
      Given a screen 360 pixels wide
      When the first page of the help is opened in the browser
      Then the first two cards are one above the other

    Scenario: The page does not scroll sideways on a phone
      Given a screen 360 pixels wide
      When the first page of the help is opened in the browser
      Then the page does not scroll sideways

  Rule: The addresses of the help are what they were

    Scenario Outline: A subject is where it was
      When the help is opened at "<address>"
      Then that address is answered with a page

      Examples:
        | address                      |
        | /help/readers                |
        | /help/accounts               |
        | /help/tournament-managers    |
        | /help/world-ranking-officers |
