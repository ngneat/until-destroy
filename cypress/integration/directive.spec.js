/// <reference types="cypress" />

context('directive', () => {
  it('should click the button and shown that http directive has unsubscribed from subscription', () => {
    cy.visit('/directive');

    cy.get('[data-cy="toggle-http-directive"]').click();

    cy.get('[data-cy="http-directive-status"]').should(
      'contain.text',
      'Http directive subscription is unsubscribed: true'
    );
  });
});
