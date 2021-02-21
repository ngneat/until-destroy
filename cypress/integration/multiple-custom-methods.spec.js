/// <reference types="cypress" />

context('multiple custom methods', () => {
  it('should toggle streams and show the appropriate statuses', () => {
    cy.visit('/multiple-custom-methods');

    const repetable = () => {
      cy.get('[data-cy="start-first"]').click();
      cy.get('[data-cy="start-second"]').click();

      cy.get('[data-cy="issue-66-status-first-stream"]').should(
        'contain.text',
        'first stream started true and first stream stopped false'
      );
      cy.get('[data-cy="issue-66-status-second-stream"]').should(
        'contain.text',
        'second stream started true and second stream stopped false'
      );

      cy.get('[data-cy="stop-first"]').click();
      cy.get('[data-cy="stop-second"]').click();

      cy.get('[data-cy="issue-66-status-first-stream"]').should(
        'contain.text',
        'first stream started false and first stream stopped true'
      );
      cy.get('[data-cy="issue-66-status-second-stream"]').should(
        'contain.text',
        'second stream started false and second stream stopped true'
      );
    };

    repetable();
    repetable();
  });
});
