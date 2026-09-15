describe('PESEL tools flows', () => {
  const visitClean = (path: string) => {
    cy.visit(path, {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  };

  let consoleErrors: unknown[][];
  beforeEach(() => {
    consoleErrors = [];
    cy.on('window:before:load', (win) => {
      const original = win.console.error.bind(win.console);
      win.console.error = (...args: unknown[]) => {
        consoleErrors.push(args);
        original(...args);
      };
    });
  });
  afterEach(() => {
    expect(consoleErrors, 'browser console errors').to.deep.equal([]);
  });

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

    cy.location('pathname').should('equal', '/generator');
    cy.title().should('contain', 'PESEL');
    cy.get('input[aria-label="Day of birth"]').type('05');
    cy.get('input[aria-label="Month of birth"]').type('09');
    cy.get('input[aria-label="Year of birth"]').type('1982');
    cy.contains('button', 'Generate').click();

    cy.get('[data-testid="pesel-number"]')
      .should('have.length', 1)
      .first()
      .invoke('text')
      .should('match', /^820905\d{5}$/);
    cy.screenshot('generator-desktop-single', { capture: 'viewport' });
  });

  it('matches birthday input focus styling in both themes and fits the Random option on mobile', () => {
    cy.viewport(1000, 850);
    visitClean('/generator');
    for (const theme of ['Light', 'Dark']) {
      cy.get(`button[title="${theme}"]`).click();
      cy.get('input[aria-label="Day of birth"]').focus();
      cy.wait(250); // Allow the shared 200ms focus transition to finish.
      cy.get('input[aria-label="Day of birth"]')
        .parent()
        .then(($wrapper) => {
          const expected = getComputedStyle($wrapper[0]);
          const border = expected.borderColor;
          const shadow = expected.boxShadow;
          cy.get('#generation-count').focus();
          cy.wait(250);
          cy.get('#generation-count').should(($input) => {
            const actual = getComputedStyle($input[0]);
            expect(actual.borderColor).to.equal(border);
            expect(actual.boxShadow).to.equal(shadow);
          });
        });
    }
    cy.screenshot('generator-count-focus-desktop', { capture: 'viewport' });
    cy.viewport(360, 800);
    cy.get('app-radio-select').contains('label', 'Random').should('be.visible');
    cy.window().should((win) =>
      expect(win.document.documentElement.scrollWidth).to.equal(win.innerWidth),
    );
    cy.screenshot('generator-count-focus-mobile', { capture: 'viewport' });
  });

  it('generates both sexes for a selected date and replaces each previous batch', () => {
    visitClean('/generator');
    cy.get('input[aria-label="Day of birth"]').type('29');
    cy.get('input[aria-label="Month of birth"]').type('02');
    cy.get('input[aria-label="Year of birth"]').type('2000');
    cy.get('app-radio-select').contains('label', 'Random').click();
    cy.get('#generation-count').clear().type('10000');
    cy.get('button[type="submit"]').click();
    cy.contains('Showing 100 of 10000', { timeout: 15000 });
    cy.get('[data-testid="pesel-number"]').should('have.length', 100);
    let copied = '';
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText')
        .callsFake(async (text: string) => {
          copied = text;
        })
        .log(false);
    });
    cy.get('app-pesel-output > div > app-toolbar button[title="Copy"]').click();
    cy.then(() => {
      const values = copied.split('\n');
      expect(new Set(values).size).to.equal(10000);
      expect(values.every((value) => /^002229\d{5}$/.test(value))).to.equal(
        true,
      );
      expect(
        values.filter((value) => Number(value[9]) % 2 === 0).length,
      ).to.equal(5000);
    });
    cy.get('#generation-count').clear().type('1');
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="pesel-number"]').should('have.length', 1);
    cy.get('#generation-count').clear().type('10001');
    cy.get('button[type="submit"]').click();
    cy.get('[role="alert"]').should('contain.text', 'Only 10000 unique');
    cy.get('[data-testid="pesel-number"]').should('not.exist');
  });

  it('generates ascending serials for every sex and styles the sequential checkbox', () => {
    cy.viewport(1000, 850);
    visitClean('/generator');
    cy.get('input[aria-label="Day of birth"]').type('29');
    cy.get('input[aria-label="Month of birth"]').type('02');
    cy.get('input[aria-label="Year of birth"]').type('2000');
    cy.get('#generation-count').clear().type('3');
    cy.contains('label', 'Sequential serial numbers').click();
    cy.get('#sequential-serials').should('be.checked');
    cy.contains('button', 'Generate Random').should('be.disabled');
    for (const [sex, serials] of [
      ['Female', ['0000', '0002', '0004']],
      ['Male', ['0001', '0003', '0005']],
      ['Random', ['0000', '0001', '0002']],
    ] as const) {
      cy.get('app-radio-select').contains('label', sex).click();
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="pesel-number"]').should(($rows) => {
        expect(
          [...$rows].map((row) => row.textContent!.trim().slice(6, 10)),
        ).to.deep.equal(serials);
      });
    }
    cy.get('button[title="Light"]').click();
    cy.get('#sequential-serials').focus();
    cy.screenshot('generator-sequential-light', { capture: 'viewport' });
    cy.get('button[title="Dark"]').click();
    cy.get('#sequential-serials').focus();
    cy.screenshot('generator-sequential-dark', { capture: 'viewport' });
    cy.viewport(360, 800);
    cy.window().should((win) =>
      expect(win.document.documentElement.scrollWidth).to.equal(win.innerWidth),
    );
    cy.screenshot('generator-sequential-mobile', { capture: 'viewport' });
    cy.contains('label', 'Sequential serial numbers').click();
    cy.get('#sequential-serials').should('not.be.checked');
    cy.contains('button', 'Generate Random').should('not.be.disabled').click();
    cy.get('[data-testid="pesel-number"]').should('have.length', 3);
  });

  it('cleans up legacy persisted results without restoring them', () => {
    cy.visit('/generator', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'pesel-list:v1',
          JSON.stringify(['82090500017']),
        );
      },
    });
    cy.get('app-simple-generator').should('be.visible');
    cy.get('[data-testid="pesel-number"]').should('not.exist');
    cy.window().should((win) =>
      expect(win.localStorage.getItem('pesel-list:v1')).to.equal(null),
    );
  });

  it('exports a 100000-number batch on mobile without persisting it', () => {
    cy.viewport(390, 844);
    visitClean('/generator');
    cy.get('#generation-count').clear().type('100000');
    cy.contains('button', 'Generate Random').click();
    cy.contains('Showing 100 of 100000', { timeout: 20000 });
    cy.get('[data-testid="pesel-number"]').should('have.length', 100);
    cy.window().then((win) => {
      expect(win.localStorage.getItem('pesel-list:v1')).to.equal(null);
      expect(win.document.documentElement.scrollWidth).to.equal(win.innerWidth);
    });
    let copied = '';
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText')
        .callsFake(async (text: string) => {
          copied = text;
        })
        .log(false);
      cy.spy(win.URL, 'createObjectURL').as('downloadBlob');
    });
    cy.get('app-pesel-output > div > app-toolbar button[title="Copy"]').click();
    cy.then(() => expect(new Set(copied.split('\n')).size).to.equal(100000));
    cy.get(
      'app-pesel-output > div > app-toolbar button[title="Save JSON File"]',
    ).click();
    cy.get('@downloadBlob')
      .its('firstCall.args.0')
      .then((blob) => {
        return (blob as unknown as Blob).text().then((text) => {
          expect(JSON.parse(text).length).to.equal(100000);
        });
      });
    cy.get('app-pesel-output').scrollIntoView();
    cy.screenshot('generator-mobile-batch', { capture: 'viewport' });
    cy.reload();
    cy.get('app-simple-generator').should('be.visible');
    cy.get('[data-testid="pesel-number"]').should('not.exist');
    cy.contains('button', 'Generate Random').click();
    cy.get('[data-testid="pesel-number"]').should('have.length', 1);
  });
});
