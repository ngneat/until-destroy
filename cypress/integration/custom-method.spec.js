/// <reference types="cypress" />

context('custom method', () => {
  it('should click the button and show that the interval service has unsubscribed from subscription', () => {
    cy.visit('/custom-method')
      .get('[data-cy="destroy-service"]')
      .click()
      .get('[data-cy="interval-service-status"]')
      .shouldHaveSuccessClass();
  });
});
