/// <reference types="cypress" />

context('inheritance', () => {
  it('should click the button to toggle the issue#61 and show that subscriptions have been unsubscribed', () => {
    cy.visit('/inheritance');

    cy.get('[data-cy="toggle-issue-61"]').click();

    cy.get('[data-cy="issue-61-status"]').should(
      'contain.text',
      'Issue#61 directive unsubscribed true and component unsubscribed true'
    );
  });

  it('should click the button to toggle the issue#97 and show that subscriptions have been unsubscribed', () => {
    cy.visit('/inheritance');

    cy.get('[data-cy="toggle-issue-97"]').click();

    cy.get('[data-cy="issue-97-status"]').should(
      'contain.text',
      'Issue#97 component unsubscribed true'
    );
  });
});
