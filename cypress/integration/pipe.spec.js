/// <reference types="cypress" />

context('pipe', () => {
  it('should click the button and show that pipe has unsubscribed from subscription', () => {
    cy.visit('/pipe');

    cy.get('[data-cy="toggle-pipe"]').click();

    cy.get('[data-cy="pipe-unsubscribed"]').should('contain.text', 'Pipe unsubscribed: true');
  });
});
