Feature: Login with a user

  Scenario: The user is not registered in the site
    Given An unregistered user
    When I fill the data in the login form and press submit
    Then An error message should be shown in the screen

  Scenario: The user is registered in the site and is redirected to /home
    Given A registered user
    When I fill the data in the login form and press submit
    Then I should be redirected to the /home page
