import { TestBed } from '@angular/core/testing';
import {
  PeselParserService,
  InvalidPeselFormatError,
  InvalidPeselChecksumError,
  InvalidPeselDateError,
  PeselInfo,
} from '../pesel-parser.service';

describe('PeselParserService - Integration', () => {
  let service: PeselParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeselParserService);
  });

  describe('parsePesel', () => {
    it('should return correct info for valid PESEL (male)', () => {
      const pesel = '82090500017';
      const expected: Omit<PeselInfo, 'age'> = {
        valid: true,
        birthDate: '1982-09-05',
        sex: 'male',
        serial: '0001',
      };
      const result = service.parsePesel(pesel);
      expect(result).toMatchObject(expected);
      expect(result.age).toBeGreaterThanOrEqual(0);
    });

    it('should return correct info for valid PESEL (female)', () => {
      const pesel = '91062800008';
      const expected: Omit<PeselInfo, 'age'> = {
        valid: true,
        birthDate: '1991-06-28',
        sex: 'female',
        serial: '0000',
      };
      const result = service.parsePesel(pesel);
      expect(result).toMatchObject(expected);
    });

    it('throws InvalidPeselFormatError for wrong length', () => {
      expect(() => service.parsePesel('1234567890')).toThrow(
        InvalidPeselFormatError,
      );
    });

    it('throws InvalidPeselChecksumError for bad checksum', () => {
      expect(() => service.parsePesel('82090500001')).toThrow(
        InvalidPeselChecksumError,
      );
    });

    it('throws InvalidPeselDateError for invalid derived date', () => {
      expect(() => service.parsePesel('82130500007')).toThrow(
        InvalidPeselDateError,
      );
      expect(() => service.parsePesel('82023000005')).toThrow(
        InvalidPeselDateError,
      );
      expect(() => service.parsePesel('82043100004')).toThrow(
        InvalidPeselDateError,
      );
    });
  });

  describe('validatePesel', () => {
    it.each([
      ['82090500000', true],
      ['123', false],
      ['82090500001', false],
      ['82130500007', false],
      ['82023000005', false],
    ])('should validate PESEL "%s" as %s', (pesel, expected) => {
      expect(service.validatePesel(pesel)).toBe(expected);
    });
  });
});
