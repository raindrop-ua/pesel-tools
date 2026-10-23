import { inspectPesel } from './pesel-inspection';
import { calculateChecksumDigit, decodePeselDate } from '@services/pesel-utils';
import { PeselParserService } from '@services/pesel-parser.service';
import { PESEL_TEST_SETS } from '@core/testing/pesel-test-sets';

describe('PESEL inspection and tester fixtures', () => {
  it('explains a valid PESEL with independent checksum terms', () => {
    const info = inspectPesel('82090500017');
    expect(info.valid).toBe(true);
    expect(info.birthDate).toBe('1982-09-05');
    expect(info.sex).toBe('male');
    expect(info.serial).toBe('0001');
    expect(info.checksum?.terms.map((term) => term.product)).toEqual([
      8, 6, 0, 81, 0, 15, 0, 0, 0, 3,
    ]);
    expect(info.checksum?.sum).toBe(113);
    expect(info.checksum?.expected).toBe(7);
    expect(info.checksum?.actual).toBe(7);
  });

  it('decodes the fields but reports an incorrect checksum', () => {
    const info = inspectPesel('82090500018');
    expect(info.valid).toBe(false);
    expect(info.issues).toEqual(['checksum']);
    expect(info.birthDate).toBe('1982-09-05');
    expect(info.checksum?.expected).toBe(7);
    expect(info.checksum?.actual).toBe(8);
  });

  it('reports all structural issues instead of masking a date behind a checksum error', () => {
    const info = inspectPesel('82023000006');
    expect(info.issues).toEqual(['date', 'checksum']);
    expect(info.birthDate).toBeNull();
  });

  it.each([
    '',
    '8209050001',
    '820905000170',
    '820905 00017',
    '８２０９０５０００１７',
  ])('does not decode malformed input %j', (value) => {
    const info = inspectPesel(value);
    expect(info.issues).toEqual(['format']);
    expect(info.checksum).toBeNull();
    expect(info.birthDate).toBeNull();
  });

  it.each([
    ['008101', 1800, 1, 80],
    ['000101', 1900, 1, 0],
    ['002101', 2000, 1, 20],
    ['004101', 2100, 1, 40],
    ['006101', 2200, 1, 60],
  ] as const)(
    'decodes %s without losing the century',
    (value, year, month, offset) => {
      expect(decodePeselDate(value)).toMatchObject({
        year,
        month,
        day: 1,
        offset,
      });
    },
  );

  it.each([
    '000001',
    '001301',
    '002001',
    '003301',
    '004001',
    '005301',
    '006001',
    '007301',
    '008001',
    '009301',
  ])('rejects impossible month code in %s', (value) => {
    expect(decodePeselDate(value)).toBeNull();
  });

  const parser = new PeselParserService();
  for (const set of PESEL_TEST_SETS) {
    for (const item of set.cases) {
      it(`${set.id}: ${item.scenario}`, () => {
        const inspection = inspectPesel(item.pesel);
        expect(inspection.valid).toBe(item.expectedValid);
        expect(inspection.issues).toEqual(item.expectedIssues);
        expect(parser.validatePesel(item.pesel)).toBe(item.expectedValid);
        if (item.expectedIssues.includes('date')) {
          expect(Number(item.pesel[10])).toBe(
            calculateChecksumDigit(item.pesel.slice(0, 10)),
          );
        }
      });
    }
  }
});
