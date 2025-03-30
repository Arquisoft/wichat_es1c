Feature: Login with a user

  Scenario: The user is not registered in the site
    Given An unregistered user
    When I fill the data in the login form and press submit
    Then An error message should be shown in the screen


