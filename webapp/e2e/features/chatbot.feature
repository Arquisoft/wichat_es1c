Feature: Chatbot functionality

  Scenario: User interacts with the chatbot and receives a response
    Given The user is on the game page
    When The user opens the chatbot
    And The user types a question and submits it
    Then The chatbot should return a helpful response
