@postgres
Feature: A reader can put the site on their phone's home screen

  People follow a tournament from the side of a lawn, on a phone, and want the
  site one touch away rather than a search or a bookmark deep in a browser. A
  browser will put a site on the home screen, to open in a window of its own
  with the site's icon beneath its name, once the site says what it is called,
  where it starts, what it looks like and which pictures stand for it. That is
  a small file, the web app manifest, and a link to it from every page.

  Each website says it for itself. Croquet Scores and Gateball Scores are two
  websites on one server (`crossSite.feature`), and a reader who has both on
  their home screen has to be able to tell them apart by name and by icon. So
  the manifest is not one of the site's files under the assets path
  (`assets.feature`), which are the same for every website and kept for a
  year: it is asked for by the address of the website the reader is on, and
  answers for that one.

  What the site is called in it is the site's own name and not a word of any
  language, as in a page's title (`pageDescription.feature`), so the manifest
  does not change with the reader's language and needs no cookie to be read.

  A try website does not offer any of it. It is a safe place to learn the site
  and what is entered there may be removed at any time (`betaSite.feature`), so
  a reader who put it on their home screen would be left with an icon that
  looks like the real website and holds nothing that lasts. It has no manifest,
  no link to one, no picture for a home screen, and no button.

  The manifest cannot follow the reader's choice of light or dark
  (`theme.feature`), since it says one colour for the window's frame and one for
  the screen shown while the site opens. It says the light ones, which are the
  site's own, and a page says the dark one for itself, in the page.

  A reader who does not know their browser can do this is told so by a button
  in the footer of every page, the admin's among them. It is there only for a
  reader the browser has said can install the site, so that it is never a
  button that does nothing, and it is an addition to the page like the text size
  (`textSize.feature`): without scripting there is no button, and the browser's
  own menu still offers the same. A browser that never says it can, such as
  Safari on an iPhone, gets no button, and is told how to do it in the help
  instead.

  An installed site is the site and no more, drawn by the same pages and
  needing the same connection. Reading with none, which would need a program of
  its own kept by the browser, is a feature of its own, and what a reader sees
  without a connection is the browser's.

  These scenarios run against a server with tournaments kept, and say nothing
  of what else a page holds, which is each page's own.

  Rule: Each website's manifest is its own

    Scenario Outline: The manifest is named for its website
      When the manifest is asked for at "<address>"
      Then the app's name is "<name>"
      And the app's short name is "<name>"

      Examples:
        | address            | name            |
        | croquetscores.com  | Croquet Scores  |
        | gateballscores.com | Gateball Scores |

    Scenario: A try website has no manifest
      When the manifest is asked for at "try.croquetscores.com"
      Then there is no manifest

    Scenario: The manifest is a web app manifest
      When the manifest is asked for at "croquetscores.com"
      Then its kind is a web app manifest

    Scenario: The manifest is the same in every language
      Given the reader asked for Welsh
      When the manifest is asked for at "croquetscores.com"
      Then the app's name is "Croquet Scores"

    Scenario: The manifest is not made from the reader's cookies
      When the manifest is asked for at "croquetscores.com"
      Then the answer does not vary by cookie

  Rule: The app opens on the website's own home page

    Scenario: The app starts at the home page
      When the manifest is asked for at "croquetscores.com"
      Then the app starts at the home page

    Scenario: The app is the whole website and nothing beside it
      When the manifest is asked for at "croquetscores.com"
      Then the app's scope is the whole website

    Scenario: The app has no controls of the browser's own
      When the manifest is asked for at "croquetscores.com"
      Then the app is shown in a window of its own

    # The identity is the home page's address, not wherever the app starts, so
    # that a later change of where it starts does not make a browser treat
    # the site as a second app and leave a reader with two icons.
    Scenario: The app is known by the home page's address
      When the manifest is asked for at "croquetscores.com"
      Then the app's identity is the home page's address

  Rule: The app is drawn in the site's colours

    Scenario: The window's frame is the green of the bars
      When the manifest is asked for at "croquetscores.com"
      Then the app's theme colour is the green of the bars

    Scenario: The screen shown while it opens is the page's own green
      When the manifest is asked for at "croquetscores.com"
      Then the app's background colour is the green of the page

  Rule: Each website has pictures of its own

    Scenario Outline: The icons are the website's
      When the manifest is asked for at "<address>"
      Then the app's icons are those of "<site>"

      Examples:
        | address            | site            |
        | croquetscores.com  | Croquet Scores  |
        | gateballscores.com | Gateball Scores |

    # A browser will not offer to install a site without a picture large
    # enough for a home screen and one large enough for the screen it opens on.
    Scenario: There is an icon large enough for a home screen
      When the manifest is asked for at "croquetscores.com"
      Then the app has an icon of 192 pixels

    Scenario: There is an icon large enough for the screen it opens on
      When the manifest is asked for at "croquetscores.com"
      Then the app has an icon of 512 pixels

    Scenario: Every icon the manifest names is there to be given
      When the manifest is asked for at "croquetscores.com"
      And each icon it names is asked for
      Then each icon is given

  Rule: Every page offers the manifest, and says how its website looks

    A reader installs from whichever page they are on, not from the home page,
    so the link is in the head of every page the site draws, the admin as well
    as the pages anyone may read. The pictures the page names for a browser's
    tab and for an iPhone's home screen are the website's own, as the
    manifest's are, since an iPhone takes its picture from the page.

    Scenario Outline: A page links to the manifest
      When the page "<path>" is asked for at "croquetscores.com"
      Then it links to the manifest

      Examples:
        | path           |
        | /              |
        | /terms-of-use  |
        | /help          |

    # The admin is shown to nobody who is not signed in, so it is looked at in
    # a browser by a reader who is.
    @browser
    Scenario: The admin links to the manifest
      Given a reader signed in as "someone@example.com"
      When the admin is opened
      Then the page open links to the manifest

    Scenario: A page that is not there links to the manifest too
      When the page "/no-such-page" is asked for at "croquetscores.com"
      Then it links to the manifest

    Scenario: A page has one link to the manifest
      When the page "/" is asked for at "croquetscores.com"
      Then it has one link to the manifest

    Scenario: The link is to the website the reader is on
      When the page "/" is asked for at "gateballscores.com"
      And the manifest it links to is asked for at "gateballscores.com"
      Then the app's name is "Gateball Scores"

    Scenario Outline: A page names a picture for a browser's tab
      When the page "/" is asked for at "<address>"
      Then its tab picture is that of "<site>"

      Examples:
        | address            | site            |
        | croquetscores.com  | Croquet Scores  |
        | gateballscores.com | Gateball Scores |

    Scenario Outline: A page names a picture for an iPhone's home screen
      When the page "/" is asked for at "<address>"
      Then its home screen picture is that of "<site>"

      Examples:
        | address            | site            |
        | croquetscores.com  | Croquet Scores  |
        | gateballscores.com | Gateball Scores |

    Scenario: A page asks for the green of the bars for a reader who has chosen light
      When the page "/" is asked for at "croquetscores.com"
      Then its theme colour for light is the green of the bars

    Scenario: A page asks for the black of the bars for a reader who has chosen dark
      When the page "/" is asked for at "croquetscores.com"
      Then its theme colour for dark is the black of the bars

  Rule: A try website offers none of it

    A reader may still see its own picture in a browser's tab, which is not an
    offer of anything.

    Scenario: A try website's page does not link to a manifest
      When the page "/" is asked for at "try.croquetscores.com"
      Then it does not link to the manifest

    Scenario: A try website's page names no picture for a home screen
      When the page "/" is asked for at "try.croquetscores.com"
      Then it names no home screen picture

    Scenario: A try website's page names a picture for a browser's tab
      When the page "/" is asked for at "try.croquetscores.com"
      Then its tab picture is that of "Croquet Scores"

  @browser
  Rule: A reader whose browser can install the site is offered a button to

    The browser says so when it can, and when it does not, as in a browser that
    has no such thing or one where the site is already installed, there is
    nothing to offer. The button is as tall as the footer's other buttons that
    are pressed with a thumb (`LAYOUT.md`), and says in words what it does.

    Scenario: A reader whose browser says it can install the site is offered the button
      Given scripting is switched on
      And the home page is open
      When the browser says the site can be installed
      Then the install button is shown

    Scenario: A reader whose browser says nothing is offered no button
      Given scripting is switched on
      And the home page is open
      Then the install button is not shown

    Scenario: A reader without scripting is offered no button
      Given scripting is switched off
      And the home page is open
      Then the install button is not shown

    Scenario: A reader on the site as an installed app is offered no button
      Given scripting is switched on
      And the site is open as an installed app
      When the browser says the site can be installed
      Then the install button is not shown

    Scenario: The button is on a page that is not the home page
      Given scripting is switched on
      And the terms of use page is open
      When the browser says the site can be installed
      Then the install button is shown

    Scenario: The button is as tall as a thumb needs
      Given a viewport 400 pixels wide
      And scripting is switched on
      And the home page is open
      When the browser says the site can be installed
      Then the install button is at least 44 pixels tall

    Scenario: Pressing the button asks the browser to install the site
      Given scripting is switched on
      And the home page is open
      And the browser says the site can be installed
      When the install button is pressed
      Then the browser is asked to install the site

    # A browser lets an offer be used once, so a button left on the page after
    # it would do nothing the second time it was pressed.
    Scenario: The button goes once it has been pressed
      Given scripting is switched on
      And the home page is open
      And the browser says the site can be installed
      When the install button is pressed
      Then the install button is not shown

    Scenario: The button goes once the site is installed
      Given scripting is switched on
      And the home page is open
      And the browser says the site can be installed
      When the browser says the site has been installed
      Then the install button is not shown

    Scenario: A try website is offered no button
      Given scripting is switched on
      And the try website's home page is open
      When the browser says the site can be installed
      Then the install button is not shown

  Rule: The manifest is kept for a while by anybody

    It is the same for every reader of a website and changes about as often as
    the site's name does, which is never, so there is no reason to ask for it
    each time and no reason a shared cache may not keep it. A day is long enough
    to spare the site the asking and short enough that a change reaches a
    reader's phone within a day.

    Scenario: The manifest may be kept by a shared cache
      When the manifest is asked for at "croquetscores.com"
      Then the answer may be kept by a shared cache

    Scenario: The manifest is kept for a day
      When the manifest is asked for at "croquetscores.com"
      Then the answer may be kept for a day

  Rule: The manifest is not one of the pages to be found

    Scenario: The manifest is not in the sitemap
      Given the site is told search engines are welcome
      When the sitemap is asked for at "croquetscores.com"
      Then it does not name the manifest
