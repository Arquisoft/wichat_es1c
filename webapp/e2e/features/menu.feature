Feature: Accessing the FAQ

  Scenario: The user logs in and accesses the FAQ
    Given I am on the login page
    When I log in with valid credentials and open the FAQ menu
    Then I should see the FAQ page with the questions
