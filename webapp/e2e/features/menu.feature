Feature: Menu navigation

  Scenario: The user logs in and opens the FAQ from the menu
    Given A valid user
    When I log in and click the HELP button
    Then I should be redirected to the FAQ page
