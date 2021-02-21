/// <reference types="cypress" />

context('array of subscriptions', () => {
  it('should click the button and show that the document click component has unsubscribed from subscription', () => {
    cy.visit('/array-of-subscriptions');

    cy.get('[data-cy="toggle-document-click"]').click();

    cy.get('[data-cy="document-click-status"]').should(
      'contain.text',
      'Document click subscription is unsubscribed: true'
    );
  });
});
