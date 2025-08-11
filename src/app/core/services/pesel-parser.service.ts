import { Injectable } from '@angular/core';
import {
  isValidFormat,
  isValidChecksum,
  isValidDate,
  calculateAge,
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

    const year = parseInt(pesel.substring(0, 2), 10);
    let month = parseInt(pesel.substring(2, 4), 10);
    const day = parseInt(pesel.substring(4, 6), 10);

    let century = 1900;
    if (month >= 81 && month <= 92) {
      century = 1800;
      month -= 80;
    } else if (month >= 61 && month <= 72) {
      century = 2200;
      month -= 60;
    } else if (month >= 41 && month <= 52) {
      century = 2100;
      month -= 40;
    } else if (month >= 21 && month <= 32) {
      century = 2000;
      month -= 20;
    } else if (month >= 1 && month <= 12) {
      century = 1900; // Explicitly state 1900-1999 range
    } else {
      // This case should ideally be caught by date validation later,
      // but adding an extra check here is fine.
      throw new InvalidPeselDateError('Invalid month value in PESEL.');
    }

    const birthYear = century + year;

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
      const year = parseInt(pesel.substring(0, 2), 10);
      let month = parseInt(pesel.substring(2, 4), 10);
      const day = parseInt(pesel.substring(4, 6), 10);

      let century = 1900;
      if (month >= 81 && month <= 92) {
        century = 1800;
        month -= 80;
      } else if (month >= 61 && month <= 72) {
        century = 2200;
        month -= 60;
      } else if (month >= 41 && month <= 52) {
        century = 2100;
        month -= 40;
      } else if (month >= 21 && month <= 32) {
        century = 2000;
        month -= 20;
      } else if (month >= 1 && month <= 12) {
        century = 1900;
      } else {
        return false;
      }

      const birthYear = century + year;

      return isValidDate(birthYear, month, day);
    } catch {
      // This catch is unreachable in current flow, retained as safety fallback
      return false;
    }
  }
}
