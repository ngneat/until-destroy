/// <reference types="cypress" />

context('directive', () => {
  it('should click the button and shown that http directive has unsubscribed from subscription', () => {
    cy.visit('/directive')
      .get('[data-cy="toggle-http-directive"]')
      .click()
      .get('[data-cy="directive-status"]')
      .shouldHaveSuccessClass();
  });
});
