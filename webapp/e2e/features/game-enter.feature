Feature: Accessing the game

  Scenario: The user logs in and navigates to the game page
    Given A valid user
    When I log in and click the Juego button
    Then I should see the game configuration screen
