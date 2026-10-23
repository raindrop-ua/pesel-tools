import { Injectable } from '@angular/core';
import {
  isValidFormat,
  isValidChecksum,
  isValidDate,
  calculateAge,
  decodePeselDate,
} from './pesel-utils';

export interface PeselInfo {
  valid: boolean;
  birthDate?: string; // ISO: 'YYYY-MM-DD'
  sex?: 'male' | 'female';
  age?: number;
  serial?: string;
  message?: string;
}

export class InvalidPeselFormatError extends Error {
  constructor(message = 'PESEL must be exactly 11 digits.') {
    super(message);
    this.name = 'InvalidPeselFormatError';
  }
}

export class InvalidPeselChecksumError extends Error {
  constructor(message = 'Invalid PESEL checksum.') {
    super(message);
    this.name = 'InvalidPeselChecksumError';
  }
}

export class InvalidPeselDateError extends Error {
  constructor(message = 'Invalid birth date derived from PESEL.') {
    super(message);
    this.name = 'InvalidPeselDateError';
  }
}

@Injectable({
  providedIn: 'root',
})
export class PeselParserService {
  private decodeBirthDateParts(pesel: string): {
    birthYear: number;
    month: number;
    day: number;
  } {
    const parts = decodePeselDate(pesel.slice(0, 6));
    if (!parts) {
      throw new InvalidPeselDateError('Invalid month value in PESEL.');
    }
    return { birthYear: parts.year, month: parts.month, day: parts.day };
  }

  /**
   * Parses a PESEL number and extracts birthdate and sex, performing validation.
   * @param pesel The PESEL number string.
   * @returns A PeselInfo object containing the parsed information and validation result.
   * @throws InvalidPeselFormatError if the PESEL format is invalid.
   * @throws InvalidPeselChecksumError if the PESEL checksum is invalid.
   * @throws InvalidPeselDateError if the derived birthdate is invalid.
   */
  public parsePesel(pesel: string): PeselInfo {
    if (!isValidFormat(pesel)) {
      throw new InvalidPeselFormatError();
    }

    if (!isValidChecksum(pesel)) {
      throw new InvalidPeselChecksumError();
    }

    const { birthYear, month, day } = this.decodeBirthDateParts(pesel);

    // Basic date validation
    if (!isValidDate(birthYear, month, day)) {
      throw new InvalidPeselDateError();
    }

    const birthDate = `${birthYear.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const sexDigit = parseInt(pesel.charAt(9), 10);
    const sex = sexDigit % 2 === 0 ? 'female' : 'male';
    const serial = pesel.substring(6, 10);
    const age = calculateAge(birthYear, month, day);

    return { valid: true, birthDate, sex, serial, age };
  }

  /**
   * Validates the format, checksum, and derivable date of a PESEL number.
   * This method returns a boolean indicating validity without returning parsed data.
   * @param pesel The PESEL number string.
   * @returns True if the PESEL is valid, false otherwise.
   */
  public validatePesel(pesel: string): boolean {
    if (!isValidFormat(pesel)) {
      return false;
    }

    if (!isValidChecksum(pesel)) {
      return false;
    }

    try {
      const { birthYear, month, day } = this.decodeBirthDateParts(pesel);

      return isValidDate(birthYear, month, day);
    } catch {
      // This catch is unreachable in current flow, retained as safety fallback
      return false;
    }
  }
}
