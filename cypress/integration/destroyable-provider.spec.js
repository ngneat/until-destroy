/// <reference types="cypress" />

context('destroyable provider', () => {
  it('should click the button and show that the destroyable provider has unsubscribed from subscriptions', () => {
    cy.visit('/destroyable-provider')
      .get('[data-cy="toggle-provider"]')
      .click()
      .get('[data-cy="provider-status"]')
      .shouldHaveSuccessClass();
  });
});
