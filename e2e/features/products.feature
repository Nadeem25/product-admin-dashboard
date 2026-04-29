Feature: Products

  Scenario: User adds a new product successfully
    Given I am on the products page
    When I click the add product button
    And I fill in the product form with valid details
    And I click save product
    Then I should see the new product in the list