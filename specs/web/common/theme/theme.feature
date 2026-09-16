Feature: Sending a reader back where they came from

  Choosing a theme returns the reader to the page they chose it on, and the form
  says which page that is. A form can say anything — and with no CSRF token on
  it, another site can post one — so where it asks to go is only honoured when
  that is somewhere on this site. Anywhere else is refused by sending the reader
  to the home page.

  Scenario Outline: A place on this site is honoured
    When a return to "<asked>" is asked for
    Then the reader is sent to "<sent>"

    Examples:
      | asked             | sent              |
      | /                 | /                 |
      | /help             | /help             |
      | /gc?year=2026#top | /gc?year=2026#top |
      | /../etc           | /etc              |

  Scenario Outline: Anywhere else is refused
    When a return to "<asked>" is asked for
    Then the reader is sent to "/"

    Examples:
      | asked                |
      | //evil.example       |
      | /\\evil.example      |
      | \\\\evil.example     |
      | https://evil.example |
      | javascript:alert(1)  |

  Scenario: A return that says nothing sends the reader home
    When no return is asked for
    Then the reader is sent to "/"
