Feature: Home Page

  Scenario: User is welcomed on the home page
    Given A logged-in user with a valid token
    When I visit the home page
    Then I should see a welcome message

  Scenario: Home page loads required components
    Given A logged-in user
    When I visit the home page
    Then I should see the OptionsDropdown and PersonalRanking components
