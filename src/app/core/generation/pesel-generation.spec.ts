import {
  generatePeselBatch,
  GenerationCapacityError,
  InvalidBirthDateError,
  InvalidDateRangeError,
  InvalidGenerationOptionsError,
  MAX_BATCH_SIZE,
} from './pesel-generation';
import { PeselParserService } from '@services/pesel-parser.service';

const options = { year: 2000, month: 2, day: 29, sex: 'female' as const };
const parser = new PeselParserService();

describe('PESEL batch generation', () => {
  afterEach(() => vi.restoreAllMocks());

  it.each([1800, 1900, 2000, 2100, 2200, 2299])(
    'round-trips century %i through the parser',
    (year) => {
      for (const sex of ['male', 'female'] as const) {
        const batch = generatePeselBatch(50, { year, month: 12, day: 31, sex });
        for (const pesel of batch) {
          expect(parser.parsePesel(pesel)).toMatchObject({
            valid: true,
            birthDate: `${year}-12-31`,
            sex,
          });
        }
      }
    },
  );

  it.each(['female', 'male', undefined] as const)(
    'generates the entire sequential serial range for %s',
    (sex) => {
      const random = vi.spyOn(Math, 'random');
      const count = sex === undefined ? 10000 : 5000;
      const batch = generatePeselBatch(count, {
        ...options,
        sex,
        serialMode: 'sequential',
      });
      expect(batch).toHaveLength(count);
      expect(new Set(batch).size).toBe(count);
      batch.forEach((pesel, index) => {
        const expected =
          sex === undefined ? index : index * 2 + (sex === 'male' ? 1 : 0);
        expect(pesel.slice(6, 10)).toBe(String(expected).padStart(4, '0'));
        expect(parser.parsePesel(pesel).birthDate).toBe('2000-02-29');
      });
      expect(random).not.toHaveBeenCalled();
      expect(() =>
        generatePeselBatch(count + 1, {
          ...options,
          sex,
          serialMode: 'sequential',
        }),
      ).toThrow(GenerationCapacityError);
    },
  );

  it('skips excluded serials in order and restarts independent sequential batches', () => {
    const sequentialOptions = { ...options, serialMode: 'sequential' as const };
    const first = generatePeselBatch(5, sequentialOptions);
    expect(generatePeselBatch(5, sequentialOptions)).toEqual(first);
    expect(
      generatePeselBatch(3, sequentialOptions, [first[0], first[2]]),
    ).toEqual([first[1], first[3], first[4]]);
  });

  it('rejects a sequential request without a date and unknown serial modes', () => {
    expect(() => generatePeselBatch(1, { serialMode: 'sequential' })).toThrow(
      'require a birthdate',
    );
    expect(() =>
      generatePeselBatch(1, { ...options, serialMode: 'invalid' as 'random' }),
    ).toThrow(InvalidGenerationOptionsError);
  });

  it('exhausts all 5000 female serials without duplicates even with constant randomness', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const batch = generatePeselBatch(5000, options);
    expect(new Set(batch).size).toBe(5000);
    expect(
      batch.every((pesel) => parser.parsePesel(pesel).sex === 'female'),
    ).toBe(true);
    expect(() => generatePeselBatch(1, options, batch)).toThrow(
      GenerationCapacityError,
    );
    expect(generatePeselBatch(1, options, batch.slice(0, -1))).toEqual([
      batch.at(-1),
    ]);
  });

  it('excludes scattered existing values, duplicates and unrelated numbers correctly', () => {
    const all = generatePeselBatch(10_000, { year: 2000, month: 2, day: 29 });
    const blocked = all.filter((_, index) => index % 3 === 0);
    const remaining = generatePeselBatch(
      10_000 - blocked.length,
      { year: 2000, month: 2, day: 29 },
      [...blocked, ...blocked, 'bad', '00022900000'],
    );
    expect(new Set([...blocked, ...remaining]).size).toBe(10_000);
  });

  it('does not exclude numbers for another date or sex', () => {
    const male = generatePeselBatch(5000, { ...options, sex: 'male' });
    const otherDate = generatePeselBatch(10, { ...options, day: 28 });
    expect(
      generatePeselBatch(5000, options, [...male, ...otherDate]),
    ).toHaveLength(5000);
  });

  it('generates 100000 valid unique numbers without future random dates', () => {
    const today = new Date(2026, 0, 1);
    const batch = generatePeselBatch(MAX_BATCH_SIZE, {}, [], today);
    expect(new Set(batch).size).toBe(MAX_BATCH_SIZE);
    for (const pesel of batch) {
      const parsed = parser.parsePesel(pesel);
      expect(
        parsed.birthDate! >= '1926-01-01' && parsed.birthDate! <= '2026-01-01',
      ).toBe(true);
    }
  });

  it.each([0, -1, 1.5, NaN, Infinity, MAX_BATCH_SIZE + 1])(
    'rejects invalid count %s',
    (count) => {
      expect(() => generatePeselBatch(count)).toThrow(
        InvalidGenerationOptionsError,
      );
    },
  );
  it.each([NaN, Infinity, 2.5])('rejects non-integer date parts %s', (day) => {
    expect(() => generatePeselBatch(1, { ...options, day })).toThrow(
      InvalidBirthDateError,
    );
  });
  it('rejects invalid, partial and out-of-range dates and invalid sex', () => {
    expect(() => generatePeselBatch(1, { year: 2000 })).toThrow(
      InvalidGenerationOptionsError,
    );
    expect(() => generatePeselBatch(1, { ...options, year: 1900 })).toThrow(
      InvalidBirthDateError,
    );
    expect(() =>
      generatePeselBatch(1, { year: 2300, month: 1, day: 1 }),
    ).toThrow(InvalidDateRangeError);
    expect(() => generatePeselBatch(1, { sex: 'other' as 'male' })).toThrow(
      InvalidGenerationOptionsError,
    );
    expect(() => generatePeselBatch(5001, options)).toThrow(
      GenerationCapacityError,
    );
  });
});
