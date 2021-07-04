Cypress.Commands.add('shouldHaveSuccessClass', { prevSubject: 'element' }, $element =>
  cy.wrap($element).should('have.class', 'is-success')
);

Cypress.Commands.add('shouldHaveDangerClass', { prevSubject: 'element' }, $element =>
  cy.wrap($element).should('have.class', 'is-danger')
);
