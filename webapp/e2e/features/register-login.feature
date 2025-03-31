Feature: Register and login with the same user

  Scenario: Register and login with the same user
    Given The user navigates to the register page
    When The user fills the registration form
    Then The user should be redirected to the home page
    And The user logs out and lands on the login page
    And The user fills in the login form with the same credentials
    Then The user is redirected back to the home page
