/// <reference types="cypress" />

context('array of subscriptions', () => {
  it('should click the button and show that the document click component has unsubscribed from subscription', () => {
    cy.visit('/array-of-subscriptions')
      .get('[data-cy="toggle-document-click"]')
      .click()
      .get('[data-cy="document-click-status"]')
      .shouldHaveSuccessClass();
  });
});
