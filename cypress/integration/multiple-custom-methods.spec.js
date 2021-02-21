/// <reference types="cypress" />

context('multiple custom methods', () => {
  it('should toggle streams and show the appropriate statuses', () => {
    cy.visit('/multiple-custom-methods');

    const repetable = () => {
      cy.get('[data-cy="start-first"]').click();
      cy.get('[data-cy="start-second"]').click();

      cy.get('[data-cy="issue-66-status-first-stream"]').shouldHaveDangerClass();
      cy.get('[data-cy="issue-66-status-second-stream"]').shouldHaveDangerClass();

      cy.get('[data-cy="stop-first"]').click();
      cy.get('[data-cy="stop-second"]').click();

      cy.get('[data-cy="issue-66-status-first-stream"]').shouldHaveSuccessClass();
      cy.get('[data-cy="issue-66-status-second-stream"]').shouldHaveSuccessClass();
    };

    repetable();
    repetable();
  });
});
