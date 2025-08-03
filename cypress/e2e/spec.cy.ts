describe('First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('Ultimate PESEL Tools');
  });
});
