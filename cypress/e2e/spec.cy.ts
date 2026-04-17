describe('PESEL tools flows', () => {
  const visitClean = (path: string) => {
    cy.visit(path, {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  };

  it('parses a valid PESEL and shows extracted data', () => {
    visitClean('/parser');

    cy.get('input[name="pesel"]').type('82090500017');

    cy.contains('Birth Date: 05.09.1982');
    cy.contains('Sex: Male');
    cy.contains('Serial number: 0001');
  });

  it('shows validation error for PESEL with bad checksum', () => {
    visitClean('/parser');

    cy.get('input[name="pesel"]').type('82090500001').blur();

    cy.contains('Incorrect checksum');
  });

  it('generates a PESEL from provided birth date', () => {
    visitClean('/generator');

    cy.get('input[aria-label="Day of birth"]').type('05');
    cy.get('input[aria-label="Month of birth"]').type('09');
    cy.get('input[aria-label="Year of birth"]').type('1982');
    cy.contains('button', 'Generate').click();

    cy.get('.pesel-item .number')
      .should('have.length', 1)
      .first()
      .invoke('text')
      .should('match', /^820905\d{5}$/);
  });
});
