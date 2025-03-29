Feature: Register a new user

  Scenario: The user navigates to the register page from login
    Given The user is on the login page
    When The user clicks on the register link
    Then The user should be redirected to the register page

