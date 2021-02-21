/// <reference types="cypress" />

context('destroyable provider', () => {
  it('should click the button and show that the destroyable provider has unsubscribed from subscriptions', () => {
    cy.visit('/destroyable-provider');

    cy.get('[data-cy="toggle-provider"]').click();

    cy.get('[data-cy="provider-status"]').should(
      'contain.text',
      'Provider subject is unsubscribed true and subscription is unsubscribed true'
    );
  });
});
