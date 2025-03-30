Feature: Register Form

  Scenario: The user navigates to the register page and completes registration
    Given The user is on the login page
    When The user clicks on the register link
    Then The user should be redirected to the register page
    And The user fills the form and clicks "Registrarse"
    Then The user should be redirected to the home page