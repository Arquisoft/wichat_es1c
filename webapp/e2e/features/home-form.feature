Feature: Home page functionality

  Scenario: User sees a welcome message
    Given The user logins
    When The user is redirected to the Home page
    Then The home page should display the message "Nos alegra verte de nuevo. Explora tus rankings y disfruta de la experiencia de WiChat."

  Scenario: User sees a personalized welcome message
    Given The user logins
    When The user is redirected to the Home page
    Then The home page should display a personalized welcome message including the user's name