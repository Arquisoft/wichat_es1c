Feature: Register a new user

  Scenario: The user navigates to the register page from login
    Given The user is on the login page
    When The user clicks on the register link
    Then The user should be redirected to the register page

  Scenario: Register a new user successfully
    Given The user is on the register page
    When The user fills the name, email, and password fields and clicks the register button
    Then The user should be redirected to the home page

