import {
  isValidFormat,
  isValidChecksum,
  isValidDate,
  calculateAge,
} from '../pesel-utils';

describe('pesel-utils', () => {
  describe('isValidFormat', () => {
    it('returns true for valid 11-digit PESEL', () => {
      expect(isValidFormat('12345678901')).toBe(true);
    });

    it('returns false for invalid length', () => {
      expect(isValidFormat('123')).toBe(false);
    });
  });

  describe('isValidChecksum', () => {
    it('returns true for valid checksum', () => {
      expect(isValidChecksum('82090500000')).toBe(true);
    });

    it('returns false for invalid checksum', () => {
      expect(isValidChecksum('82090500001')).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('validates leap year and regular dates', () => {
      expect(isValidDate(1982, 9, 5)).toBe(true);
      expect(isValidDate(2000, 2, 29)).toBe(true);
    });

    it('returns false for bad dates', () => {
      expect(isValidDate(1982, 13, 5)).toBe(false);
      expect(isValidDate(1982, 9, 32)).toBe(false);
      expect(isValidDate(1983, 2, 29)).toBe(false);
    });
  });

  describe('calculateAge', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2025-05-24'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns correct age in years', () => {
      expect(calculateAge(1982, 9, 5)).toBe(42);
      expect(calculateAge(1982, 5, 24)).toBe(43);
      expect(calculateAge(1982, 5, 25)).toBe(42);
      expect(calculateAge(2025, 6, 1)).toBe(0);
    });
  });
});
