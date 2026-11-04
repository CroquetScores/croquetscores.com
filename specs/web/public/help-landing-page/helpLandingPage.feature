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

    Scenario: The page shows no sentence about what the help is for
      When the first page of the help is opened in the browser
      Then the article does not say "How to use the site, for the people who use it."

    Scenario: The search box shows no label
      When the first page of the help is opened in the browser
      Then the search box shows no label

    Scenario: The search box is still called by its question
      When the first page of the help is opened in the browser
      Then the search box is called "Your question"

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
