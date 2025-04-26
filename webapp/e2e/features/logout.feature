Feature: Logout functionality

  Scenario: The user logs in and logs out using the logout button
    Given A valid user
    When I log in and click the logout button
    Then I should be redirected to the login page
