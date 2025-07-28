import {
  PeselGeneratorService,
  InvalidBirthDateError,
  InvalidDateRangeError,
} from './pesel-generator.service';
import * as utils from './pesel-utils';

describe('PeselGeneratorService — 100% coverage', () => {
  let service: PeselGeneratorService;

  beforeEach(() => {
    service = new PeselGeneratorService(); // ← без TestBed
  });

  describe('generatePesel with valid parameters', () => {
    it('generates PESEL for a known birth date and male', () => {
      const pesel = service.generatePesel({
        year: 1982,
        month: 9,
        day: 5,
        sex: 'male',
      });

      expect(pesel.length).toBe(11);
      expect(pesel.substring(0, 2)).toBe('82'); // 1982
      expect(pesel.substring(2, 4)).toBe('09'); // September
      expect(pesel.substring(4, 6)).toBe('05'); // Day
      const sexDigit = parseInt(pesel.charAt(9), 10);
      expect(sexDigit % 2).toBe(1); // male = odd
    });

    it('generates PESEL for 2003 female with correct month offset', () => {
      const pesel = service.generatePesel({
        year: 2003,
        month: 2,
        day: 28,
        sex: 'female',
      });

      expect(pesel.substring(2, 4)).toBe('22'); // 02 + 20 = 22
      const sexDigit = parseInt(pesel.charAt(9), 10);
      expect(sexDigit % 2).toBe(0); // female = even
    });

    it('generates PESEL for 1820 female with +80 month offset', () => {
      const pesel = service.generatePesel({
        year: 1820,
        month: 4,
        day: 5,
        sex: 'female',
      });

      expect(pesel.substring(2, 4)).toBe('84');
    });

    it('generates PESEL for 2220 male with +60 month offset', () => {
      const pesel = service.generatePesel({
        year: 2220,
        month: 1,
        day: 1,
        sex: 'male',
      });

      expect(pesel.substring(2, 4)).toBe('61');
    });
  });

  describe('generatePesel with random data', () => {
    it('generates a PESEL string if no options passed', () => {
      const pesel = service.generatePesel();
      expect(pesel).toMatch(/^\d{11}$/);
    });
  });

  describe('generatePesel — error handling', () => {
    it('throws InvalidBirthDateError for invalid date', () => {
      expect(() =>
        service.generatePesel({ year: 2000, month: 2, day: 30 }),
      ).toThrow(InvalidBirthDateError);
    });

    it('throws InvalidDateRangeError for year < 1800', () => {
      expect(() =>
        service.generatePesel({ year: 1799, month: 12, day: 31 }),
      ).toThrow(InvalidDateRangeError);
    });

    it('throws InvalidDateRangeError for year > 2299', () => {
      expect(() =>
        service.generatePesel({ year: 2300, month: 1, day: 1 }),
      ).toThrow(InvalidDateRangeError);
    });
  });

  describe('generated PESEL has valid checksum', () => {
    it('checksum digit is valid', () => {
      const pesel = service.generatePesel({
        year: 1990,
        month: 6,
        day: 15,
        sex: 'male',
      });

      const body = pesel.slice(0, 10);
      const checksum = parseInt(pesel[10], 10);

      expect(utils.calculateChecksumDigit(body)).toBe(checksum);
    });
  });
});
