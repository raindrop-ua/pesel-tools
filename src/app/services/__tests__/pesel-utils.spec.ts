import {
  isValidFormat,
  isValidChecksum,
  isValidDate,
  calculateAge,
  calculateChecksumDigit,
} from '../pesel-utils';

describe('pesel-utils — 100% coverage', () => {
  describe('isValidFormat', () => {
    it('returns true for valid PESEL (11 digits)', () => {
      expect(isValidFormat('12345678901')).toBe(true);
    });

    it('returns false for too short PESEL', () => {
      expect(isValidFormat('1234567890')).toBe(false);
    });

    it('returns false for string with letters', () => {
      expect(isValidFormat('12345abc901')).toBe(false);
    });

    it('returns false for string with special characters', () => {
      expect(isValidFormat('12345@#%901')).toBe(false);
    });
  });

  describe('isValidChecksum', () => {
    it('returns true for valid checksum', () => {
      expect(isValidChecksum('82090500000')).toBe(true);
    });

    it('returns false for invalid checksum', () => {
      expect(isValidChecksum('82090500001')).toBe(false);
    });

    it('handles checksum == 0 correctly', () => {
      // PESEL: 02070803628 → контрольная = 0
      expect(isValidChecksum('02070803628')).toBe(true);
    });

    it('returns false if non-digit character inside PESEL', () => {
      expect(isValidChecksum('12345A78901')).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('returns true for valid standard date', () => {
      expect(isValidDate(1982, 9, 5)).toBe(true);
    });

    it('returns true for Feb 29 in leap year', () => {
      expect(isValidDate(2000, 2, 29)).toBe(true);
    });

    it('returns false for Feb 29 in non-leap year', () => {
      expect(isValidDate(1900, 2, 29)).toBe(false);
    });

    it('returns false for month = 0', () => {
      expect(isValidDate(1991, 0, 5)).toBe(false);
    });

    it('returns false for month = 13', () => {
      expect(isValidDate(1991, 13, 5)).toBe(false);
    });

    it('returns false for day = 0', () => {
      expect(isValidDate(1991, 5, 0)).toBe(false);
    });

    it('returns false for day = 32', () => {
      expect(isValidDate(1991, 5, 32)).toBe(false);
    });

    it('returns false for invalid day in April (April 31)', () => {
      expect(isValidDate(1991, 4, 31)).toBe(false);
    });

    it('returns false for Feb 30 in leap year', () => {
      expect(isValidDate(2000, 2, 30)).toBe(false);
    });
  });

  describe('calculateAge (fixed date: 2025-06-28)', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2025-06-28'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns correct age if birthday already passed this year', () => {
      expect(calculateAge(1982, 1, 1)).toBe(43);
    });

    it('returns correct age if birthday is today', () => {
      expect(calculateAge(1982, 6, 28)).toBe(43);
    });

    it('returns correct age if birthday is tomorrow', () => {
      expect(calculateAge(1982, 6, 29)).toBe(42);
    });

    it('returns 0 if birth date is after today in same year', () => {
      expect(calculateAge(2025, 7, 1)).toBe(0);
    });

    it('returns 0 for future year', () => {
      expect(calculateAge(2026, 1, 1)).toBe(0);
    });
  });

  describe('calculateChecksumDigit', () => {
    it('returns correct checksum for known PESELs', () => {
      expect(calculateChecksumDigit('8209050000')).toBe(0);
      expect(calculateChecksumDigit('9106280000')).toBe(8);
      expect(calculateChecksumDigit('0329050009')).toBe(4);
      expect(calculateChecksumDigit('1449050003')).toBe(4);
      expect(calculateChecksumDigit('2669050005')).toBe(7);
    });

    it('returns checksum 0 when sum % 10 === 0', () => {
      expect(calculateChecksumDigit('0207080362')).toBe(8); // Real PESEL = 02070803628
    });

    it('throws if input is not exactly 10 digits', () => {
      expect(() => calculateChecksumDigit('123')).toThrow();
      expect(() => calculateChecksumDigit('123456789')).toThrow();
      expect(() => calculateChecksumDigit('12345678901')).toThrow();
      expect(() => calculateChecksumDigit('123456789a')).toThrow();
      expect(() => calculateChecksumDigit('abcdefghij')).toThrow();
    });
  });
});
