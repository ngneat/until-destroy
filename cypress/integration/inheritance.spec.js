/// <reference types="cypress" />

context('inheritance', () => {
  it('should click the button to toggle the issue#61 and show that subscriptions have been unsubscribed', () => {
    cy.visit('/inheritance')
      .get('[data-cy="toggle-issue-61"]')
      .click()
      .get('[data-cy="issue-61-status"]')
      .shouldHaveSuccessClass();
  });

  it('should click the button to toggle the issue#97 and show that subscriptions have been unsubscribed', () => {
    cy.visit('/inheritance')
      .get('[data-cy="toggle-issue-97"]')
      .click()
      .get('[data-cy="issue-97-status"]')
      .shouldHaveSuccessClass();
  });
});
