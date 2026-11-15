Feature: The help tells a reader with an iPhone how to put the site on their home screen

  A reader on an Android phone is offered a button at the foot of the page and
  the browser's own menu for putting the site on the home screen
  (`webAppManifest.feature`). A reader on an iPhone is offered neither: Safari
  never tells a page that the site can be installed, so the site has no
  button to show, and what Safari does offer is in its Share sheet, under a
  name few people look for. So the help says where it is.

  It is a page of the help for readers, in every language the help is written
  in, found by the first page of that help, by the search, and by the address
  it has in every language. It is written in words and has no pictures. A
  picture of what an iPhone draws is out of date by the next release of the
  phone, and it would be a copy to keep in step in each language, so
  the page names each thing the reader will press as the phone names it.

  What follows is held to the page as it is written in English. What each
  other language is held to is that it has the same page, with the same
  bookmarks, so that a link to a part of it is not a link to the top of the
  page and nobody is told why.

  Rule: The help for readers has a page about the home screen, in every language

    Scenario: Each language has the page
      Given the help of every language
      When the page "readers/home-screen" of each is converted
      Then each has a title

    Scenario Outline: Each language bookmarks the <bookmark> section
      Given the help of every language
      When the page "readers/home-screen" of each is converted
      Then each has the bookmark "<bookmark>"

      Examples:
        | bookmark              |
        | on-an-iphone          |
        | on-an-ipad            |
        | on-other-phones       |
        | if-there-is-no-option |

  Rule: The page is found from the help for readers

    Scenario: Each language's first page for readers leads to it
      Given the help of every language
      When the page "readers/index" of each is converted
      Then each links to "/help/readers/home-screen"

    Scenario: The page is opened by its address
      When the help page "readers/home-screen" is opened
      Then the page is the one about the home screen

    Scenario: The page is the same in another language
      Given the reader has chosen German
      When the help page "readers/home-screen" is opened
      Then the page is the one about the home screen
      And the page is in German

  Rule: The page says how, on an iPhone, in the order the reader does it

    Safari is named, since it is the browser the site's pages are most often
    read in on an iPhone and the one that has always had this. The other
    browsers on an iPhone have it too now, from a later version of the phone,
    so the page says to look in their Share menu in the same way, and which
    version, rather than telling a reader on one of them that they cannot.

    Scenario: The page says to open the site in Safari
      When the English page "readers/home-screen" is converted
      Then the section "on-an-iphone" says "Safari"

    Scenario: The page says to press Share
      When the English page "readers/home-screen" is converted
      Then the section "on-an-iphone" says "Share"

    Scenario: The page says to press Add to Home Screen
      When the English page "readers/home-screen" is converted
      Then the section "on-an-iphone" says "Add to Home Screen"

    Scenario: The page says to press Add
      When the English page "readers/home-screen" is converted
      Then the section "on-an-iphone" says "Add"

    Scenario: The steps are in the order they are done
      When the English page "readers/home-screen" is converted
      Then the section "on-an-iphone" says "Share" before "Add to Home Screen"

    Scenario: The page says the other browsers on an iPhone can do it
      When the English page "readers/home-screen" is converted
      Then the section "on-an-iphone" says "iOS 16.4"

    Scenario: The page says where the Share button is on an iPad
      When the English page "readers/home-screen" is converted
      Then the section "on-an-ipad" says "top"

  Rule: The page says what the reader will have

    Scenario: The page says the site opens without the browser's controls
      When the English page "readers/home-screen" is converted
      Then the page says "without the browser's address bar"

    Scenario: The page says the site still needs a connection
      When the English page "readers/home-screen" is converted
      Then the page says "needs a connection"

    Scenario: The page says the site gets an icon
      When the English page "readers/home-screen" is converted
      Then the page says "icon"

    Scenario: The page says a try website cannot be put there
      When the English page "readers/home-screen" is converted
      Then the page says "try website"

  Rule: The page says what to do on other phones, and when there is no option

    Scenario: The page says an Android phone offers the button
      When the English page "readers/home-screen" is converted
      Then the section "on-other-phones" says "Install"

    Scenario: The page says an Android phone's menu has it too
      When the English page "readers/home-screen" is converted
      Then the section "on-other-phones" says "menu"

    Scenario: The page says what to do if the option is not there
      When the English page "readers/home-screen" is converted
      Then the section "if-there-is-no-option" says "reading in a private window"

  Rule: A reader who asks in their own words finds the page

    Readers do not ask for the home screen. They ask how to install the app, or
    how to get the site as an icon, and the help has to answer both.

    Scenario Outline: The question "<question>" finds the page
      Given the help is searched in English
      When the question "<question>" is asked
      Then the first result is "readers/home-screen"

      Examples:
        | question                  |
        | add to home screen        |
        | how do I install the app  |
        | put the site on my iPhone |
        | make an icon on my phone  |
