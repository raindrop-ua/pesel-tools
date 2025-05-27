import { TestBed } from '@angular/core/testing';
import * as utils from './pesel-utils';
import {
  PeselParserService,
  InvalidPeselFormatError,
  InvalidPeselChecksumError,
  InvalidPeselDateError,
} from './pesel-parser.service';

describe('PeselParserService — 100% coverage', () => {
  let service: PeselParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeselParserService);
  });

  describe('parsePesel — valid PESELs', () => {
    it('parses PESEL from 1800s', () => {
      const result = service.parsePesel('02910500090');
      expect(result.birthDate).toBe('1802-11-05');
    });

    it('parses PESEL from 1900s', () => {
      const result = service.parsePesel('82090500017');
      expect(result.birthDate).toBe('1982-09-05');
    });

    it('parses PESEL from 2000s', () => {
      const result = service.parsePesel('03290500094');
      expect(result.birthDate).toBe('2003-09-05');
    });

    it('parses PESEL from 2100s', () => {
      const result = service.parsePesel('14490500034');
      expect(result.birthDate).toBe('2114-09-05');
    });

    it('parses PESEL from 2200s', () => {
      const result = service.parsePesel('26690500057');
      expect(result.birthDate).toBe('2226-09-05');
    });

    it('validatePesel covers 1800s month range', () => {
      expect(service.validatePesel('02820500098')).toBe(true); // 1802-02-05
    });

    it('validatePesel covers 2200s month range', () => {
      expect(service.validatePesel('22620500052')).toBe(true); // 2226-02-05
    });

    it('validatePesel covers 2100s month range', () => {
      expect(service.validatePesel('14410500036')).toBe(true); // 2114-02-05
    });

    it('validatePesel covers 2000s month range', () => {
      expect(service.validatePesel('03220500097')).toBe(true); // 2003-02-05
    });

    it('validatePesel covers 1900s month range', () => {
      expect(service.validatePesel('82020500010')).toBe(true); // 1982-02-05
    });

    it('detects sex: male', () => {
      const result = service.parsePesel('91062800152');
      expect(result.sex).toBe('male');
    });

    it('detects sex: female', () => {
      const result = service.parsePesel('91062800008');
      expect(result.sex).toBe('female');
    });

    it('returns full object structure with age', () => {
      const result = service.parsePesel('91062800008');
      expect(result).toEqual(
        expect.objectContaining({
          valid: true,
          birthDate: '1991-06-28',
          sex: 'female',
          serial: '0000',
          age: expect.any(Number),
        }),
      );
    });
  });

  describe('parsePesel — invalid PESELs', () => {
    it('throws InvalidPeselFormatError if PESEL too short', () => {
      expect(() => service.parsePesel('123')).toThrow(InvalidPeselFormatError);
    });

    it('throws InvalidPeselFormatError if PESEL too long', () => {
      expect(() => service.parsePesel('123456789012')).toThrow(
        InvalidPeselFormatError,
      );
    });

    it('throws InvalidPeselChecksumError for invalid checksum', () => {
      expect(() => service.parsePesel('82090500001')).toThrow(
        InvalidPeselChecksumError,
      );
    });

    it('throws InvalidPeselDateError for invalid day (Feb 30)', () => {
      expect(() => service.parsePesel('82023000005')).toThrow(
        InvalidPeselDateError,
      );
    });

    it('throws InvalidPeselDateError for month > 12 and < 21', () => {
      expect(() => service.parsePesel('82130500007')).toThrow(
        InvalidPeselDateError,
      );
    });

    it('throws InvalidPeselDateError for April 31 (exists in PESEL range)', () => {
      expect(() => service.parsePesel('82043100004')).toThrow(
        InvalidPeselDateError,
      );
    });
  });

  describe('validatePesel', () => {
    it('returns true for a valid PESEL', () => {
      expect(service.validatePesel('82090500000')).toBe(true);
    });

    it('returns false for PESEL with bad format', () => {
      expect(service.validatePesel('123')).toBe(false);
    });

    it('returns false for PESEL with bad checksum', () => {
      expect(service.validatePesel('82090500001')).toBe(false);
    });

    it('returns false for PESEL with invalid derived date', () => {
      expect(service.validatePesel('82130500007')).toBe(false);
    });

    it('returns false for PESEL with Feb 30', () => {
      expect(service.validatePesel('82023000005')).toBe(false);
    });

    it('returns false for month out of range (9999...)', () => {
      expect(service.validatePesel('99999999999')).toBe(false);
    });

    it('validatePesel throws internally and returns false via catch', () => {
      const brokenInput = {} as unknown as string;
      expect(service.validatePesel(brokenInput)).toBe(false);
    });

    it('validatePesel triggers catch via mocked isValidDate', () => {
      jest.spyOn(utils, 'isValidDate').mockImplementation(() => {
        throw new Error('boom');
      });

      expect(service.validatePesel('82090500000')).toBe(false);
    });
  });
});
