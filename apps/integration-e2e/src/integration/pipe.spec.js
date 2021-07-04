/// <reference types="cypress" />

context('pipe', () => {
  it('should click the button and show that pipe has unsubscribed from subscription', () => {
    cy.visit('/pipe')
      .get('[data-cy="toggle-pipe"]')
      .click()
      .get('[data-cy="pipe-status"]')
      .shouldHaveSuccessClass();
  });
});
