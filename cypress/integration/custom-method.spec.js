/// <reference types="cypress" />

context('custom method', () => {
  it('should click the button and show that the interval service has unsubscribed from subscription', () => {
    cy.visit('/custom-method');

    cy.get('[data-cy="destroy-service"]').click();

    cy.get('[data-cy="interval-service-subscription-is-unsubscribed"]').should(
      'contain.text',
      'Interval service subscription is unsubscribed: true'
    );
  });
});
