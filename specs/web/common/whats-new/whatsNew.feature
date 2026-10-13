@browser @postgres
Feature: A reader is told when there is something new to read

  There are two what's new pages, written in the help like any other page of
  it: one for everybody, and one for the people who run tournaments. Each is
  rewritten when a release changes something a reader would notice, and left
  alone when it does not. A reader who has not been told about the latest one
  is told by an alert on the page they start from: the home page for the
  public what's new, and the admin's first page for the admin's. Nowhere else.
  An alert on every page would be read as a nuisance and then ignored, and a
  reader going somewhere has said where they are going.

  The alert offers three things, which are the three things a reader might
  want to say to it:

    - to view what's new, which leads to the page;
    - to be reminded next time, which puts the alert away until the reader's
      next visit and no longer;
    - to never be shown the alert, which puts it away for good.

  Which release a page is says itself: it names the date it was released.
  That is what is compared with what the reader has been told, rather than
  whether the page's words have changed, so that mending a typo does not tell
  everybody again. Whoever writes the page decides what counts as a new
  release, and says so by changing the date. Where a language has not
  translated the page, or has not kept up with it, the release is still the
  English page's, so a translation that is late does not hold the alert back.

  The two pages are told apart. Having seen what is new for the public says
  nothing about what is new for the admin, and a person who runs tournaments
  may want one and have no use for the other.

  What a reader has said is kept in their browser, as the theme and the
  language are, and not on their account. A reader who is not signed in can
  say it too, and one who is signed in on a second machine is asked again
  there. It is a form that gets posted and a cookie that comes back, so
  everything here works with no scripting; and the admin's page has the alert
  said into it by the server, as it has its header and footer
  (`admin.feature`).

  Background:
    Given a viewport 1200 pixels wide
    And a reader signed in as "someone@example.com"

  Rule: A reader who has not been told of the latest release is told

    Scenario Outline: The alert is on the page the reader starts from
      Given the <kind> what's new was released on "2026-10-13"
      When <place> is opened
      Then the page has the alert about what's new

    Examples:
      | kind   | place             |
      | public | the home page     |
      | admin  | the admin         |

    Scenario Outline: The alert offers the three choices
      Given the <kind> what's new was released on "2026-10-13"
      When <place> is opened
      Then the alert offers "View what's new"
      And the alert offers "Remind me next time"
      And the alert offers "Never show me this alert"

    Examples:
      | kind   | place             |
      | public | the home page     |
      | admin  | the admin         |

    Scenario Outline: Viewing what's new leads to the page
      Given the <kind> what's new was released on "2026-10-13"
      When <place> is opened
      Then the alert's "View what's new" leads to "<address>"

    Examples:
      | kind   | place         | address                  |
      | public | the home page | /help/whats-new          |
      | admin  | the admin     | /help/admin/whats-new    |

    Scenario Outline: The alert is in the reader's language
      Given the <kind> what's new was released on "2026-10-13"
      And a browser that asks for "en-XA"
      When <place> is opened
      Then every word in the alert is in the test locale

    Examples:
      | kind   | place             |
      | public | the home page     |
      | admin  | the admin         |

    Scenario: A page that does not say when it was released is not announced
      Given the public what's new does not say when it was released
      When the home page is opened
      Then the page has no alert about what's new

  Rule: The admin's alert sits beneath the years, above the admin's content

    The admin draws its years as the home page does, and the alert is said into
    its page by the server before the admin has drawn anything. It is placed
    where the home page has it, beneath the years and above what the page is
    for, and not above the years where it was first said.

    Scenario: The alert is beneath the years
      Given the admin what's new was released on "2026-10-13"
      And a browser that runs scripts
      When the admin is opened
      Then the alert is beneath the years

    Scenario: The alert is above the admin's content
      Given the admin what's new was released on "2026-10-13"
      And a browser that runs scripts
      When the admin is opened
      Then the alert is above the admin's content

  Rule: The alert is on the first page and on no other

    Scenario: A page of the help has no alert
      Given the public what's new was released on "2026-10-13"
      When the page at "/help" is opened
      Then the page has no alert about what's new

    Scenario: A year of the public pages has no alert
      Given the public what's new was released on "2026-10-13"
      When the page at "/2026" is opened
      Then the page has no alert about what's new

    Scenario: A year of the admin has no alert
      Given the admin what's new was released on "2026-10-13"
      When the admin for 2026 is opened
      Then the page has no alert about what's new

  Rule: Reading what's new is what tells the reader

    The alert says there is something to read, so once it has been read there
    is nothing to say. That is true however the page was reached: a reader who
    went there by the link in the help, or by an address they were sent, has
    read it as much as one who pressed the alert. So it is being shown the
    page that counts, and not the alert's link.

    Scenario Outline: Following the alert's link quietens the alert
      Given the <kind> what's new was released on "2026-10-13"
      And <place> is open
      And the alert's "View what's new" is followed
      When <place> is opened
      Then the page has no alert about what's new

    Examples:
      | kind   | place             |
      | public | the home page     |
      | admin  | the admin         |

    Scenario Outline: Opening the page some other way quietens it as well
      Given the <kind> what's new was released on "2026-10-13"
      And the page at "<address>" is open
      When <place> is opened
      Then the page has no alert about what's new

    Examples:
      | kind   | place         | address                  |
      | public | the home page | /help/whats-new          |
      | admin  | the admin     | /help/admin/whats-new    |

    Scenario Outline: A later release is told again
      Given the <kind> what's new was released on "2026-10-13"
      And the page at "<address>" is open
      And the <kind> what's new was released on "2026-11-02"
      When <place> is opened
      Then the page has the alert about what's new

    Examples:
      | kind   | place         | address                  |
      | public | the home page | /help/whats-new          |
      | admin  | the admin     | /help/admin/whats-new    |

    Scenario: A release that is not later is not told again
      Given the public what's new was released on "2026-10-13"
      And the page at "/help/whats-new" is open
      And the public what's new was released on "2026-10-01"
      When the home page is opened
      Then the page has no alert about what's new

    Scenario: A language the help has no page for is shown the English one, and that counts
      Given the public what's new was released on "2026-10-13"
      And a browser that asks for "en-XA"
      And the page at "/help/whats-new" is open
      When the home page is opened
      Then the page has no alert about what's new

  Rule: The public and the admin are told apart

    Scenario: Reading the public's what's new leaves the admin's to be read
      Given the public what's new was released on "2026-10-13"
      And the admin what's new was released on "2026-10-13"
      And the page at "/help/whats-new" is open
      When the admin is opened
      Then the page has the alert about what's new

    Scenario: Reading the admin's what's new leaves the public's to be read
      Given the public what's new was released on "2026-10-13"
      And the admin what's new was released on "2026-10-13"
      And the page at "/help/admin/whats-new" is open
      When the home page is opened
      Then the page has the alert about what's new

  Rule: Being reminded next time puts the alert away for the visit

    A reader who says to remind them has not read it and has not refused it:
    they are busy. So the release is not counted as read, and the alert comes
    back when they next arrive. A visit ends when the browser is closed, which
    is the reader's own way of saying they are done, and is what a cookie with
    no lifetime of its own already follows.

    Scenario Outline: The alert goes away
      Given the <kind> what's new was released on "2026-10-13"
      And <place> is open
      When the alert's "Remind me next time" is chosen
      Then the page has no alert about what's new

    Examples:
      | kind   | place             |
      | public | the home page     |
      | admin  | the admin         |

    Scenario Outline: The reader is brought back to the page they were on
      Given the <kind> what's new was released on "2026-10-13"
      And <place> is open
      When the alert's "Remind me next time" is chosen
      Then the address is "<address>"

    Examples:
      | kind   | place         | address |
      | public | the home page | /       |
      | admin  | the admin     | /admin/ |

    Scenario: The alert stays away for the rest of the visit
      Given the public what's new was released on "2026-10-13"
      And the home page is open
      And the alert's "Remind me next time" is chosen
      When the page at "/help" is opened
      And the home page is opened
      Then the page has no alert about what's new

    Scenario Outline: The alert is back on the next visit
      Given the <kind> what's new was released on "2026-10-13"
      And <place> is open
      And the alert's "Remind me next time" is chosen
      And the reader's visit has ended
      When <place> is opened
      Then the page has the alert about what's new

    Examples:
      | kind   | place             |
      | public | the home page     |
      | admin  | the admin         |

    Scenario: Reminding about one is not reminding about the other
      Given the public what's new was released on "2026-10-13"
      And the admin what's new was released on "2026-10-13"
      And the home page is open
      And the alert's "Remind me next time" is chosen
      When the admin is opened
      Then the page has the alert about what's new

  Rule: Never being shown the alert puts it away for good

    This is the reader's word on the alert, and not on the release. So it is
    kept past the next release, which is what a reader choosing it is asking
    for. They can still read what's new from the help, which is where it is
    written.

    Scenario Outline: The alert goes away
      Given the <kind> what's new was released on "2026-10-13"
      And <place> is open
      When the alert's "Never show me this alert" is chosen
      Then the page has no alert about what's new

    Examples:
      | kind   | place             |
      | public | the home page     |
      | admin  | the admin         |

    Scenario Outline: The reader is brought back to the page they were on
      Given the <kind> what's new was released on "2026-10-13"
      And <place> is open
      When the alert's "Never show me this alert" is chosen
      Then the address is "<address>"

    Examples:
      | kind   | place         | address |
      | public | the home page | /       |
      | admin  | the admin     | /admin/ |

    Scenario Outline: The alert stays away on the next visit
      Given the <kind> what's new was released on "2026-10-13"
      And <place> is open
      And the alert's "Never show me this alert" is chosen
      And the reader's visit has ended
      When <place> is opened
      Then the page has no alert about what's new

    Examples:
      | kind   | place             |
      | public | the home page     |
      | admin  | the admin         |

    Scenario Outline: The alert stays away for a later release
      Given the <kind> what's new was released on "2026-10-13"
      And <place> is open
      And the alert's "Never show me this alert" is chosen
      And the <kind> what's new was released on "2026-11-02"
      When <place> is opened
      Then the page has no alert about what's new

    Examples:
      | kind   | place             |
      | public | the home page     |
      | admin  | the admin         |

    Scenario: Never being shown one is not never being shown the other
      Given the public what's new was released on "2026-10-13"
      And the admin what's new was released on "2026-10-13"
      And the home page is open
      And the alert's "Never show me this alert" is chosen
      When the admin is opened
      Then the page has the alert about what's new

    Scenario: The page itself can still be read
      Given the public what's new was released on "2026-10-13"
      And the home page is open
      And the alert's "Never show me this alert" is chosen
      When the page at "/help/whats-new" is opened
      Then the page opens

  Rule: What a reader has said is kept where only the server can read it

    It is held to the same standard as the theme's cookie, and for the same
    reason: the next cookie this site sets will be copied from the way this
    one is.

    Scenario: What is chosen to be reminded of is never sent in the clear
      Given the public what's new was released on "2026-10-13"
      And the home page is open
      When the alert's "Remind me next time" is chosen
      Then what the reader chose is kept in a cookie marked Secure

    Scenario: What is chosen to be reminded of cannot be read by a script
      Given the public what's new was released on "2026-10-13"
      And the home page is open
      When the alert's "Remind me next time" is chosen
      Then what the reader chose is kept in a cookie marked HttpOnly

    Scenario: What is chosen never to be shown is never sent in the clear
      Given the public what's new was released on "2026-10-13"
      And the home page is open
      When the alert's "Never show me this alert" is chosen
      Then what the reader chose is kept in a cookie marked Secure

    Scenario: What is chosen never to be shown cannot be read by a script
      Given the public what's new was released on "2026-10-13"
      And the home page is open
      When the alert's "Never show me this alert" is chosen
      Then what the reader chose is kept in a cookie marked HttpOnly

    Scenario: What has been read is never sent in the clear
      Given the public what's new was released on "2026-10-13"
      When the page at "/help/whats-new" is opened
      Then what the reader has read is kept in a cookie marked Secure

    Scenario: What has been read cannot be read by a script
      Given the public what's new was released on "2026-10-13"
      When the page at "/help/whats-new" is opened
      Then what the reader has read is kept in a cookie marked HttpOnly

  Rule: Another site cannot make the choice

    A page elsewhere can put a button in front of a reader that posts to this
    site, which would silence an alert the reader never saw, and for a year.

    Scenario: A button on another site does not put the alert away
      Given the public what's new was released on "2026-10-13"
      And a page on another site with a button that posts "never" to the alert here
      When the reader presses the button on that page
      And the home page is opened
      Then the page has the alert about what's new

  Rule: A reader is only sent back to this site

    The choice returns the reader to the page it was made on, as the theme's
    does, and under the same rule (`theme.feature`): a form can say anything,
    so where it asks to go is honoured only where that is on this site.

    Scenario: A return to another site is refused
      Given the public what's new was released on "2026-10-13"
      When a return to "https://evil.example" is asked for with the choice "Remind me next time"
      Then the reader is sent to "/"
