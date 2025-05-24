import { TestBed } from '@angular/core/testing';
import {
  PeselParserService,
  InvalidPeselFormatError,
  InvalidPeselChecksumError,
  InvalidPeselDateError,
  PeselInfo,
} from './pesel-parser.service';

// Define an interface that includes the private methods for testing purposes
// We define it separately and then cast the service instance to this type
interface TestablePeselParserService {
  parsePesel(pesel: string): PeselInfo;
  validatePesel(pesel: string): boolean;

  // Include private methods here as if they were public for type checking in tests
  isValidFormat(pesel: string): boolean;
  isValidChecksum(pesel: string): boolean;
  isValidDate(year: number, month: number, day: number): boolean;
  calculateAge(birthYear: number, birthMonth: number, birthDay: number): number;
}

describe('PeselParserService', () => {
  // Declare service with the TestablePeselParserService type
  let service: TestablePeselParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // Cast the injected service instance first to unknown, then to the testable interface
    service = TestBed.inject(
      PeselParserService,
    ) as unknown as TestablePeselParserService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('parsePesel', () => {
    // ... Tests for valid PESEL numbers ...
    it('should parse a valid PESEL for a male born in 1982', () => {
      const pesel = '82090500017'; // Example PESEL (male, 1982-09-05)
      const expected: Omit<PeselInfo, 'age'> = {
        valid: true,
        birthDate: '1982-09-05',
        sex: 'male',
        serial: '0001',
      };
      const result = service.parsePesel(pesel);
      expect(result.valid).toBe(expected.valid);
      expect(result.birthDate).toBe(expected.birthDate);
      expect(result.sex).toBe(expected.sex);
      expect(result.serial).toBe(expected.serial);
      expect(result.age).toEqual(jasmine.any(Number));
      expect(result.age).toBeGreaterThanOrEqual(0);
    });

    it('should parse a valid PESEL for a female born in 1991', () => {
      const pesel = '91062800008'; // Example PESEL (female, 1991-06-28)
      const expected: Omit<PeselInfo, 'age'> = {
        valid: true,
        birthDate: '1991-06-28',
        sex: 'female',
        serial: '0000',
      };
      const result = service.parsePesel(pesel);
      expect(result.valid).toBe(expected.valid);
      expect(result.birthDate).toBe(expected.birthDate);
      expect(result.sex).toBe(expected.sex);
      expect(result.serial).toBe(expected.serial);
      expect(result.age).toEqual(jasmine.any(Number));
      expect(result.age).toBeGreaterThanOrEqual(0);
    });

    it('should throw InvalidPeselFormatError for a PESEL with wrong length', () => {
      const invalidPesel = '1234567890'; // 10 digits
      expect(() => service.parsePesel(invalidPesel)).toThrowError(
        InvalidPeselFormatError,
      );

      const anotherInvalidPesel = '123456789012'; // 12 digits
      expect(() => service.parsePesel(anotherInvalidPesel)).toThrowError(
        InvalidPeselFormatError,
      );
    });

    it('should throw InvalidPeselChecksumError for a PESEL with invalid checksum', () => {
      const invalidPesel = '82090500001'; // Changed last digit of a valid PESEL
      expect(() => service.parsePesel(invalidPesel)).toThrowError(
        InvalidPeselChecksumError,
      );
    });

    it('should throw InvalidPeselDateError for a PESEL with invalid month', () => {
      // Calculate checksum for 8213050000X: (8*1 + 2*3 + 1*7 + 3*9 + 0*1 + 5*3 + 0*7 + 0*9 + 0*1 + 0*3) % 10 = 63 % 10 = 3 -> 10 - 3 = 7
      const peselWithInvalidMonth = '82130500007'; // Example with invalid month and "correct" checksum
      expect(() => service.parsePesel(peselWithInvalidMonth)).toThrowError(
        InvalidPeselDateError,
      );
    });

    it('should throw InvalidPeselDateError for a PESEL with invalid day', () => {
      // Calculate checksum for 8202300000X: (8*1 + 2*3 + 0*7 + 2*9 + 3*1 + 0*3 + 0*7 + 0*9 + 0*1 + 0*3) % 10 = 35 % 10 = 5 -> 10 - 5 = 5
      const peselWithInvalidDay = '82023000005'; // Example with invalid day (Feb 30) and "correct" checksum
      expect(() => service.parsePesel(peselWithInvalidDay)).toThrowError(
        InvalidPeselDateError,
      );
    });

    it('should throw InvalidPeselDateError for a PESEL with day exceeding days in month', () => {
      // Calculate checksum for 8204310000X: (8*1 + 2*3 + 0*7 + 4*9 + 3*1 + 1*3 + 0*7 + 0*9 + 0*1 + 0*3) % 10 = 56 % 10 = 6 -> 10 - 6 = 4
      const peselWithInvalidDay = '82043100004'; // Example with invalid day (April 31) and "correct" checksum
      expect(() => service.parsePesel(peselWithInvalidDay)).toThrowError(
        InvalidPeselDateError,
      );
    });
  });

  describe('validatePesel', () => {
    it('should return true for a valid PESEL', () => {
      const validPesel = '82090500000'; // Example valid PESEL
      expect(service.validatePesel(validPesel)).toBeTrue();
    });

    it('should return false for a PESEL with wrong format', () => {
      const invalidPesel = '123';
      expect(service.validatePesel(invalidPesel)).toBeFalse();
    });

    it('should return false for a PESEL with invalid checksum', () => {
      const invalidPesel = '82090500001';
      expect(service.validatePesel(invalidPesel)).toBeFalse();
    });

    it('should return false for a PESEL with invalid date', () => {
      const invalidPesel = '82130500007'; // Invalid month, "correct" checksum
      expect(service.validatePesel(invalidPesel)).toBeFalse();

      const anotherInvalidPesel = '82023000005'; // Feb 30th, "correct" checksum
      expect(service.validatePesel(anotherInvalidPesel)).toBeFalse();
    });
  });

  // Tests for private methods
  describe('Private Methods', () => {
    it('isValidFormat should return true for valid format', () => {
      const validPesel = '12345678901';
      expect(service.isValidFormat(validPesel)).toBeTrue();
    });

    it('isValidFormat should return false for invalid format', () => {
      const invalidPesel = '123';
      expect(service.isValidFormat(invalidPesel)).toBeFalse();
    });

    it('isValidChecksum should return true for valid checksum', () => {
      const validPesel = '82090500000';
      expect(service.isValidChecksum(validPesel)).toBeTrue();
    });

    it('isValidChecksum should return false for invalid checksum', () => {
      const invalidPesel = '82090500001';
      expect(service.isValidChecksum(invalidPesel)).toBeFalse();
    });

    it('isValidDate should return true for a valid date', () => {
      expect(service.isValidDate(1982, 9, 5)).toBeTrue();
      expect(service.isValidDate(2000, 2, 29)).toBeTrue(); // Leap year
    });

    it('isValidDate should return false for an invalid date', () => {
      expect(service.isValidDate(1982, 13, 5)).toBeFalse(); // Invalid month
      expect(service.isValidDate(1982, 9, 32)).toBeFalse(); // Invalid day
      expect(service.isValidDate(1983, 2, 29)).toBeFalse(); // Non-leap year
    });

    it('calculateAge should return the correct age', () => {
      // For testing purposes, let's fix the current date.
      const today = new Date('2025-05-24T12:00:00Z'); // Fixed date for the test

      // Temporarily replace the global Date constructor
      window.Date = class extends Date {
        // Or window.Date in a browser environment
        constructor(dateString?: string) {
          // If a date string is provided, call the original Date constructor
          // Otherwise, return the fixed 'today' date
          if (dateString) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            super(dateString as any); // Need cast here for the constructor signature
          } else {
            // This is the case when `new Date()` is called without arguments
            // Return a new Date object representing the fixed 'today'
            return today;
          }
        }

        // Add statics or prototype methods if needed, but for basic new Date() call, this might be enough.
        // For example, if your code calls Date.now(), you'd need to mock that too.
      } as typeof Date; // Cast the mock class back to the Date constructor type

      // Born on September 5, 1982 (Your birthday, Anton!)
      expect(service.calculateAge(1982, 9, 5)).toBe(2025 - 1982 - 1);

      // Born on May 24, 1982 (Birthday is today)
      expect(service.calculateAge(1982, 5, 24)).toBe(2025 - 1982);

      // Born on January 1, 1982 (Birthday has already occurred)
      expect(service.calculateAge(1982, 1, 1)).toBe(2025 - 1982);

      // Born on May 25, 1982 (Birthday is tomorrow)
      expect(service.calculateAge(1982, 5, 25)).toBe(2025 - 1982 - 1);

      // Born in 2025 after today
      expect(service.calculateAge(2025, 6, 1)).toBe(0);

      // Born in 2026
      expect(service.calculateAge(2026, 1, 1)).toBe(0);
    });
  });
});
