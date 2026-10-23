describe('PESEL batch checker, digit breakdown and test datasets', () => {
  let errors: unknown[][];

  beforeEach(() => {
    errors = [];
    cy.on('window:before:load', (win) => {
      win.localStorage.clear();
      const original = win.console.error.bind(win.console);
      win.console.error = (...args: unknown[]) => {
        errors.push(args);
        original(...args);
      };
    });
  });

  afterEach(() => {
    expect(errors, 'browser console errors').to.deep.equal([]);
  });

  it('checks mixed input and filters invalid values and duplicates', () => {
    cy.visit('/batch');
    cy.contains('button', 'Try a sample').click();
    cy.contains('Checked 5 rows. 2 valid.');
    cy.get('tbody tr').should('have.length', 5);
    cy.get('dl')
      .should('contain.text', 'Duplicate rows')
      .and('contain.text', '1');
    cy.get('[aria-label="Filter results"]')
      .contains('button', /\bInvalid\b/)
      .click();
    cy.get('tbody tr').should('have.length', 3);
    cy.get('tbody')
      .should('contain.text', 'Incorrect checksum')
      .and('contain.text', 'Invalid encoded birthdate');
    cy.get('[aria-label="Filter results"]')
      .contains('button', /\bValid\b/)
      .click();
    cy.get('tbody tr').should('have.length', 2);
    cy.get('[aria-label="Filter results"]')
      .contains('button', /\bDuplicates\b/)
      .click();
    cy.get('tbody tr').should('have.length', 1).and('contain.text', 'Row 1');
    cy.get('#batch-input').clear().type('123');
    cy.contains('h2', 'Validation results').should('not.exist');
    cy.contains('button', 'Check PESELs').click();
    cy.get('tbody tr')
      .should('have.length', 1)
      .and('contain.text', 'Must contain exactly 11 digits');
  });

  it('imports semicolon CSV with quoted metadata, leading zeros and an empty PESEL', () => {
    cy.visit('/batch');
    cy.get('#batch-file').selectFile({
      contents: Cypress.Buffer.from(
        '\ufeffname;PESEL;note\r\n"A; B";"00222900009";"line one\nline two with ""quotes"""\r\nC;"00222900009";duplicate\r\nD;;empty',
      ),
      fileName: 'quoted-cases.csv',
      mimeType: 'text/csv',
    });
    cy.contains('Loaded: quoted-cases.csv');
    cy.get('#batch-format').should('have.value', 'csv');
    cy.contains('button', 'Check PESELs').click();
    cy.contains('Checked 3 rows. 2 valid.');
    cy.get('tbody tr').should('have.length', 3);
    cy.get('tbody tr')
      .first()
      .should('contain.text', '00222900009')
      .and('contain.text', '2000-02-29');
    cy.get('tbody tr').eq(1).should('contain.text', 'Row 1');
    cy.get('tbody tr')
      .eq(2)
      .should('contain.text', '(empty)')
      .and('contain.text', 'Invalid');
  });

  it('paginates results and exports the full filtered dataset', () => {
    cy.visit('/batch');
    cy.get('#batch-input')
      .click()
      .invoke('val', Array(121).fill('00222900009').join('\n'))
      .trigger('input');
    cy.contains('button', 'Check PESELs').click();
    cy.contains('Checked 121 rows. 121 valid.');
    cy.get('tbody tr').should('have.length', 50);
    cy.contains('button', /\bNext\b/).click();
    cy.get('tbody tr').first().find('td').first().should('have.text', '51');
    cy.contains('Page 2 of 3');
    cy.window().then((win) => {
      cy.spy(win.URL, 'createObjectURL').as('exportBlob');
    });
    cy.contains('button', 'Export JSON').click();
    cy.get('@exportBlob')
      .its('lastCall.args.0')
      .then((blob) => {
        return (blob as unknown as Blob).text().then((text) => {
          const data = JSON.parse(text);
          expect(data).to.have.length(121);
          expect(data[120]).to.include({
            row: 121,
            pesel: '00222900009',
            duplicateOf: 1,
          });
        });
      });
    cy.contains('button', 'Export CSV').click();
    cy.get('@exportBlob')
      .its('lastCall.args.0')
      .then((blob) => {
        return (blob as unknown as Blob).text().then((text) => {
          expect(text.split('\r\n')).to.have.length(122);
        });
      });
    cy.get('[aria-label="Filter results"]')
      .contains('button', /\bDuplicates\b/)
      .click();
    cy.contains('Page 1 of 3');
    cy.get('tbody tr').first().find('td').first().should('have.text', '2');
    cy.get('[aria-label="Filter results"]')
      .contains('button', /\bInvalid\b/)
      .click();
    cy.contains('No rows match this filter.');
    cy.contains('button', 'Export CSV').should('be.disabled');
  });

  it('cancels a large validation without leaking partial or stale results', () => {
    cy.visit('/batch');
    cy.get('#batch-file').selectFile({
      contents: Cypress.Buffer.from(
        Array(100000).fill('82090500017').join('\n'),
      ),
      fileName: 'large-list.txt',
      mimeType: 'text/plain',
    });
    cy.contains('Loaded: large-list.txt');
    cy.contains('button', 'Check PESELs').click();
    cy.contains('button', /\bCancel\b/).click();
    cy.contains('Validation cancelled.');
    cy.contains('h2', 'Validation results').should('not.exist');
    cy.contains('button', 'Clear').click();
    cy.get('#batch-input').should('have.prop', 'readOnly', false).type('123');
    cy.contains('button', 'Check PESELs').click();
    cy.contains('Checked 1 row. 0 valid.');
    cy.get('tbody tr').should('have.length', 1).and('contain.text', '123');
  });

  it('checks and exports 100000 rows on mobile while rendering one page', () => {
    cy.viewport(390, 844);
    cy.visit('/batch');
    cy.get('#batch-file').selectFile({
      contents: Cypress.Buffer.from(
        Array(100000).fill('00222900009').join('\n'),
      ),
      fileName: 'hundred-thousand.txt',
      mimeType: 'text/plain',
    });
    cy.contains('Loaded: hundred-thousand.txt');
    cy.get('#batch-input')
      .should('have.prop', 'readOnly', true)
      .invoke('val')
      .should('have.length', 5000);
    cy.contains('All 1,199,999 characters are used for checking.');
    cy.contains('button', 'Check PESELs').click();
    cy.contains('Checked 100,000 rows. 100,000 valid.', { timeout: 30000 });
    cy.get('tbody tr').should('have.length', 50);
    cy.get('dl').should('contain.text', '99,999');
    cy.window().then((win) => {
      cy.spy(win.URL, 'createObjectURL').as('largeExport');
    });
    cy.contains('button', 'Export JSON').click();
    cy.get('@largeExport')
      .its('lastCall.args.0')
      .then((blob) => {
        return (blob as unknown as Blob).text().then((text) => {
          const data = JSON.parse(text);
          expect(data).to.have.length(100000);
          expect(data[99999]).to.include({
            row: 100000,
            pesel: '00222900009',
            duplicateOf: 1,
          });
        });
      });
    cy.window().should((win) =>
      expect(win.document.documentElement.scrollWidth).to.equal(win.innerWidth),
    );
    cy.viewport(320, 844);
    cy.get('.summary-tile dd').should(($values) => {
      for (const value of $values) {
        const range = value.ownerDocument.createRange();
        range.selectNodeContents(value);
        expect(range.getBoundingClientRect().width).to.be.at.most(
          value.clientWidth + 1,
        );
      }
    });
    cy.viewport(390, 844);
    cy.contains('h2', 'Validation results').scrollIntoView();
    cy.screenshot('batch-mobile-results', { capture: 'viewport' });
  });

  it('transfers every tester preset to the batch checker with the expected outcomes', () => {
    for (const [label, total, valid] of [
      ['Dates & centuries', 16, 11],
      ['Checksum', 4, 1],
      ['Invalid formats', 6, 0],
      ['Mixed & duplicates', 6, 3],
    ] as const) {
      cy.visit('/test-data');
      cy.get('[aria-label="Choose a test dataset"]')
        .contains('button', label)
        .click();
      cy.contains('h2', label);
      cy.get('tbody tr').should('have.length', total);
      cy.contains('button', 'Check this set').click();
      cy.location('pathname').should('equal', '/batch');
      cy.contains(`Checked ${total} rows. ${valid} valid.`);
      cy.get('tbody tr').should('have.length', total);
      cy.location('search').should('equal', '');
      cy.window().then((win) => {
        expect(
          Object.keys(win.localStorage).filter((key) => key !== 'theme'),
        ).to.deep.equal([]);
      });
      cy.reload();
      cy.get('#batch-input').should('have.value', '');
      cy.contains('h2', 'Validation results').should('not.exist');
    }
  });

  it('explains century encoding and both matching and incorrect checksums', () => {
    cy.visit('/parser');
    cy.get('input[name="pesel"]').type('82090500017');
    cy.get('.digit-group').should('have.length', 6);
    cy.get('.group-sex').click();
    cy.get('#digit-description').should('contain.text', '1 is odd: male');
    cy.contains('summary', 'How the checksum is calculated').click();
    cy.contains('Weighted sum: 113');
    cy.get('app-pesel-breakdown')
      .should('contain.text', 'Expected: 7')
      .and('contain.text', 'Supplied: 7');
    cy.get('input[name="pesel"]').clear().type('82090500018').blur();
    cy.get('app-result-output > div').should('not.exist');
    cy.get('app-pesel-breakdown')
      .should('contain.text', 'Mismatch')
      .and('contain.text', 'The checksum fails.');
    cy.get('input[name="pesel"]').clear().type('00222900009');
    cy.get('.group-month').click();
    cy.get('#digit-description')
      .should('contain.text', '22 − 20 = 2')
      .and('contain.text', '2000–2099');
    cy.get('input[name="pesel"]').clear();
    cy.get('.digit-group').should('not.exist');
    cy.contains('Enter 11 digits above');
  });

  it('fits the new tools and expanded menu on mobile and tablet', () => {
    for (const width of [320, 390, 768, 1024]) {
      cy.viewport(width, 900);
      cy.visit('/test-data');
      cy.contains('h1', 'PESEL test datasets');
      cy.window().should((win) =>
        expect(win.document.documentElement.scrollWidth).to.equal(
          win.innerWidth,
        ),
      );
      if (width < 1024) {
        cy.get('button[aria-label="Toggle menu"]').click();
        cy.get('nav[aria-label="Mobile"]')
          .contains('a', 'Batch checker')
          .click();
        cy.contains('h1', 'Batch PESEL checker');
        cy.get('nav[aria-label="Mobile"]').should('not.exist');
      } else {
        cy.get('nav[aria-label="Main"]').contains('a', 'Batch checker').click();
      }
      cy.contains('button', 'Try a sample').click();
      cy.contains('Checked 5 rows. 2 valid.');
      cy.window().should((win) =>
        expect(win.document.documentElement.scrollWidth).to.equal(
          win.innerWidth,
        ),
      );
    }
  });
});
