Feature: A caller with no key has a day's allowance

  A caller with no key may ask the public API for 500 requests a day, counted
  by address (`rateLimit.feature` in `specs/web` holds the rest of the limits).
  The minute's allowance stops such a caller long before a day's, so a site
  started as it is run cannot show the day's allowance being used up: this
  starts the limit with a smaller day's allowance, to see it held to.

  Scenario: A caller with no key that has used its day is told to wait
    Given the API allows a caller with no key 3 requests a day
    And the caller has asked 3 times
    When the caller asks
    Then the API answers 429
    And the API's code is "RateLimit.PerDay"

  Scenario: A caller with no key that has not used its day is answered
    Given the API allows a caller with no key 3 requests a day
    And the caller has asked 2 times
    When the caller asks
    Then the API answers 200

  Scenario: Another address has a day of its own
    Given the API allows a caller with no key 3 requests a day
    And the caller has asked 3 times
    And the caller is at the address "203.0.113.9"
    When the caller asks
    Then the API answers 200

  Scenario: A caller that has used its day is told none is left
    Given the API allows a caller with no key 3 requests a day
    And the caller has asked 3 times
    When the caller asks
    Then the API says 0 are left
