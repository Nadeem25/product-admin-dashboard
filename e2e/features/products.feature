Feature: Products

  Scenario: User adds a new product successfully
    Given I am on the products page
    When I click the add product button
    Then Dialog form should open
    When I fill in the product form with valid details
    And I click save product
    Then I should see the new product in the list


  Scenario: User fails to add a product with empty fields
    Given I am on the products page
    When I click the add product button
    Then Dialog form should open
    And I click save product
    Then I should see a validation error message