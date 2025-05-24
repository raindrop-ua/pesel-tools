import { Injectable } from '@angular/core';

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
  parsePesel(pesel: string): PeselInfo {
    if (!this.isValidFormat(pesel)) {
      throw new InvalidPeselFormatError();
    }

    if (!this.isValidChecksum(pesel)) {
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
    if (!this.isValidDate(birthYear, month, day)) {
      throw new InvalidPeselDateError();
    }

    const birthDate = `${birthYear.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const sexDigit = parseInt(pesel.charAt(9), 10);
    const sex = sexDigit % 2 === 0 ? 'female' : 'male';
    const serial = pesel.substring(6, 10);
    const age = this.calculateAge(birthYear, month, day);

    return { valid: true, birthDate, sex, serial, age };
  }

  /**
   * Validates the format, checksum, and derivable date of a PESEL number.
   * This method returns a boolean indicating validity without returning parsed data.
   * @param pesel The PESEL number string.
   * @returns True if the PESEL is valid, false otherwise.
   */
  validatePesel(pesel: string): boolean {
    if (!this.isValidFormat(pesel)) {
      return false;
    }

    if (!this.isValidChecksum(pesel)) {
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

      return this.isValidDate(birthYear, month, day);
    } catch {
      return false;
    }
  }

  /**
   * Checks if the given year, month, and day form a valid date.
   * This method performs a purely numerical/calendrical validation,
   * avoiding potential timezone issues with Date objects.
   * @param year The full year (e.g., 1990).
   * @param month The month (1-12).
   * @param day The day of the month (1-31).
   * @returns True if the date is valid, according to calendar rules, false otherwise.
   */
  private isValidDate(year: number, month: number, day: number): boolean {
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }

    const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Check for leap year for February
    if (month === 2) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        if (day > 29) return false;
      } else {
        if (day > 28) return false;
      }
    } else {
      if (day > daysInMonth[month]) return false;
    }

    return true;
  }

  /**
   * Checks if the PESEL string has the correct format (11 digits).
   * @param pesel The PESEL number string.
   * @returns True if the format is valid, false otherwise.
   */
  private isValidFormat(pesel: string): boolean {
    return /^\d{11}$/.test(pesel);
  }

  /**
   * Checks if the PESEL number has a valid checksum.
   * @param pesel The PESEL number string.
   * @returns True if the checksum is valid, false otherwise.
   */
  private isValidChecksum(pesel: string): boolean {
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const sum = pesel
      .substring(0, 10)
      .split('')
      .reduce((acc, digit, idx) => acc + parseInt(digit, 10) * weights[idx], 0);

    const controlDigit = (10 - (sum % 10)) % 10;

    return controlDigit === parseInt(pesel.charAt(10), 10);
  }

  /**
   * Calculates the age based on birth year, month, and day.
   * This method uses a standard age calculation logic.
   * @param birthYear The birth year.
   * @param birthMonth The birth month (1-12).
   * @param birthDay The birthday (1-31).
   * @returns The calculated age in years.
   */
  private calculateAge(
    birthYear: number,
    birthMonth: number,
    birthDay: number,
  ): number {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Month is 0-indexed in Date
    const currentDay = today.getDate();

    let age = currentYear - birthYear;

    // Adjust age if a birthday hasn't occurred yet this year
    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && currentDay < birthDay)
    ) {
      age--;
    }

    // Ensure age is not negative (though this should not happen with valid data)
    return Math.max(0, age);
  }
}
