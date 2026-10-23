import {
  batchResultsCsv,
  csvCell,
  MAX_VALIDATION_CHARS,
  MAX_VALIDATION_ROWS,
  parseBatchInput,
  validatePeselBatch,
} from './pesel-batch';
import { PESEL_TEST_SETS, testCasesCsv } from '@core/testing/pesel-test-sets';

describe('batch input', () => {
  it('accepts list separators and keeps leading zeros and original invalid values', () => {
    expect(
      parseBatchInput(
        '\ufeff00222900009\n82090500017;123,abc\t82090500018',
        'list',
      ),
    ).toEqual(['00222900009', '82090500017', '123', 'abc', '82090500018']);
  });

  it.each([',', ';', '\t'])(
    'detects delimiter %j and a case-insensitive PESEL column',
    (delimiter) => {
      const text = `name${delimiter} PeSeL ${delimiter}notes\r\n"A${delimiter} B"${delimiter}"00222900009"${delimiter}"one\nline and ""quotes"""\r\nC${delimiter}82090500017${delimiter}test`;
      expect(parseBatchInput(text, 'csv')).toEqual([
        '00222900009',
        '82090500017',
      ]);
    },
  );

  it('supports a single CSV column without a header', () => {
    expect(parseBatchInput('"00222900009"\r\n"82090500017"', 'csv')).toEqual([
      '00222900009',
      '82090500017',
    ]);
  });

  it('preserves quoted empty fields and missing cells for validation', () => {
    expect(parseBatchInput('pesel\n""\n00222900009', 'csv')).toEqual([
      '',
      '00222900009',
    ]);
    expect(parseBatchInput('name,pesel\nA,\nB', 'csv')).toEqual(['', '']);
  });

  it('ignores blank physical CSV lines', () => {
    expect(
      parseBatchInput('pesel\n\n00222900009\n\n82090500017', 'csv'),
    ).toEqual(['00222900009', '82090500017']);
  });

  it.each(['pesel\n"not closed', 'pesel\n"123"oops', 'pesel\n123"45'])(
    'rejects malformed CSV %j',
    (text) => {
      expect(() => parseBatchInput(text, 'csv')).toThrow(/CSV/);
    },
  );

  it('rejects ambiguous multi-column CSV and duplicate PESEL headers', () => {
    expect(() => parseBatchInput('name,id\nA,00222900009', 'csv')).toThrow(
      /header named PESEL/,
    );
    expect(() => parseBatchInput('pesel,PESEL\n1,2', 'csv')).toThrow(
      /only one/,
    );
  });

  it.each(['', ' \n ', 'pesel'])(
    'rejects empty input or header-only CSV %j',
    (text) => {
      expect(() =>
        parseBatchInput(text, text === 'pesel' ? 'csv' : 'list'),
      ).toThrow();
    },
  );

  it('enforces character and row limits', () => {
    expect(() =>
      parseBatchInput('0'.repeat(MAX_VALIDATION_CHARS + 1), 'list'),
    ).toThrow(/too large/);
    expect(() =>
      parseBatchInput('1\n'.repeat(MAX_VALIDATION_ROWS + 1), 'list'),
    ).toThrow(/100,000/);
    expect(() =>
      parseBatchInput('pesel\n' + '1\n'.repeat(MAX_VALIDATION_ROWS + 1), 'csv'),
    ).toThrow(/100,000/);
  });

  it('round-trips every test dataset, including empty and spaced invalid inputs', () => {
    for (const set of PESEL_TEST_SETS) {
      expect(parseBatchInput(testCasesCsv(set.cases), 'csv')).toEqual(
        set.cases.map((item) => item.pesel),
      );
    }
  });
});

describe('batch validation and exports', () => {
  it('retains order, leading zeros, independent errors and duplicate row references', async () => {
    const rows = await validatePeselBatch(
      ['00222900009', '82090500001', '00222900009', '', ''],
      new AbortController().signal,
    );
    expect(rows.map((row) => row.row)).toEqual([1, 2, 3, 4, 5]);
    expect(rows.map((row) => row.duplicateOf)).toEqual([
      null,
      null,
      1,
      null,
      4,
    ]);
    expect(rows.map((row) => row.valid)).toEqual([
      true,
      false,
      true,
      false,
      false,
    ]);
    expect(rows[0].pesel).toBe('00222900009');
    expect(rows[1].issues).toEqual(['checksum']);
    expect(rows[3].issues).toEqual(['format']);
  });

  it('reports progress and allows cancellation between chunks', async () => {
    const controller = new AbortController();
    const progress: number[] = [];
    const promise = validatePeselBatch(
      Array(1000).fill('82090500017'),
      controller.signal,
      (count) => {
        progress.push(count);
        controller.abort();
      },
    );
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
    expect(progress).toEqual([250]);
  });

  it('rejects an already cancelled job', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      validatePeselBatch(['82090500017'], controller.signal),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('exports all supplied rows and preserves strings in JSON', async () => {
    const rows = await validatePeselBatch(
      Array(121).fill('00222900009'),
      new AbortController().signal,
    );
    const csv = batchResultsCsv(rows);
    expect(csv.split('\r\n')).toHaveLength(122);
    expect(parseBatchInput(csv, 'csv')).toEqual(Array(121).fill('00222900009'));
    expect(JSON.parse(JSON.stringify(rows))[0].pesel).toBe('00222900009');
    expect(csv).toContain('"121","00222900009","true"');
  });

  it.each(['=SUM(1,2)', '+cmd', '-1+2', '@SUM(1)', '  =1+1', '\tcmd', '\rcmd'])(
    'neutralizes spreadsheet formula input %j',
    (value) => {
      expect(csvCell(value).startsWith('"\'')).toBe(true);
    },
  );

  it('quotes embedded delimiters and escaped quotes', () => {
    expect(csvCell('a,"b"')).toBe('"a,""b"""');
  });
});
