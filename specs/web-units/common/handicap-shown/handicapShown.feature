Feature: A handicap is shown without a decimal where it is a whole number

  A handicap is kept in the events as it was written, with a sign if it has
  one, and with a fraction of one digit if it has one. The pages and the API
  show the number it is (`TournamentContents.feature`), so a whole number is
  shown as a whole number and a plus sign is not shown. The admin's lists are
  made from the events, and show the same by this. A fraction that is not
  nought is shown as it was written, and so is a minus.

  Scenario Outline: A handicap is shown as a reader would say it
    Given the handicap "<written>"
    When the handicap is shown
    Then the handicap shown is "<shown>"

    Examples:
      | written | shown |
      | 4       | 4     |
      | 4.0     | 4     |
      | 4.5     | 4.5   |
      | +4.0    | 4     |
      | +4      | 4     |
      | -2.0    | -2    |
      | -2.5    | -2.5  |
      | 10.0    | 10    |
      | 0.0     | 0     |
