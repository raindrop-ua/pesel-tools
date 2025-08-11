import { Injectable } from '@angular/core';
import { calculateChecksumDigit, isValidDate } from './pesel-utils';

export class InvalidBirthDateError extends Error {
  constructor(message = 'Provided birth date is invalid.') {
    super(message);
    this.name = 'InvalidBirthDateError';
  }
}

export class InvalidDateRangeError extends Error {
  constructor(message = 'PESEL supports only years between 1800 and 2299.') {
    super(message);
    this.name = 'InvalidDateRangeError';
  }
}

@Injectable({
  providedIn: 'root',
})
export class PeselGeneratorService {
  /**
   * Generates a valid PESEL number.
   *
   * You can optionally provide parameters to generate a PESEL for a specific
   * birthdate and sex. If parameters are not provided, they will be
   * generated randomly within reasonable ranges.
   *
   * @param options Optional parameters for generation.
   * @param options.year The desired birth year (full year, e.g., 1990).
   * @param options.month The desired birth month (1-12).
   * @param options.day The desired birthday (1-31).
   * @param options.sex The desired sex ('male' or 'female').
   * @returns A valid PESEL number string.
   * @throws Error if unable to generate a valid PESEL (e.g., invalid date combination provided).
   */
  public generatePesel(options?: {
    year?: number;
    month?: number;
    day?: number;
    sex?: 'male' | 'female';
  }): string {
    const today = new Date();
    const currentYear = today.getFullYear();

    let birthYear: number;
    let birthMonth: number;
    let birthDay: number;
    let sex: 'male' | 'female';

    // 1. Determining the year, month and day of birth
    if (options?.year && options?.month && options?.day) {
      birthYear = Number(options.year);
      birthMonth = Number(options.month);
      birthDay = Number(options.day);

      // Simple check of validity of entered date before proceeding
      if (!isValidDate(birthYear, birthMonth, birthDay)) {
        throw new InvalidBirthDateError();
      }
    } else {
      // Generate a random date of birth (e.g. within the last 100 years)
      const maxBirthYear = currentYear; // Can be limited to earlier years if necessary
      const minBirthYear = currentYear - 100;
      birthYear =
        Math.floor(Math.random() * (maxBirthYear - minBirthYear + 1)) +
        minBirthYear;

      const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      // Generate a random month and day, making sure they are valid for the year
      do {
        birthMonth = Math.floor(Math.random() * 12) + 1;
        const maxDay =
          birthMonth === 2 &&
          ((birthYear % 4 === 0 && birthYear % 100 !== 0) ||
            birthYear % 400 === 0)
            ? 29
            : daysInMonth[birthMonth];
        birthDay = Math.floor(Math.random() * maxDay) + 1;
      } while (!isValidDate(birthYear, birthMonth, birthDay)); // Retry if an invalid date is generated (though this is unlikely with maxDay calculation)
    }

    // 2. Sex determination
    if (options?.sex) {
      sex = options.sex;
    } else {
      sex = Math.random() < 0.5 ? 'male' : 'female';
    }

    // 3. Formation of the first 6 digits (year, month, day, taking into account the century)
    let monthCode: number;
    const peselYear = birthYear % 100;

    // Determining the century and adjusting the month
    if (birthYear >= 1800 && birthYear <= 1899) {
      monthCode = birthMonth + 80;
    } else if (birthYear >= 1900 && birthYear <= 1999) {
      monthCode = birthMonth; // 1900-1999 do not require adjustment
    } else if (birthYear >= 2000 && birthYear <= 2099) {
      monthCode = birthMonth + 20;
    } else if (birthYear >= 2100 && birthYear <= 2199) {
      monthCode = birthMonth + 40;
    } else if (birthYear >= 2200 && birthYear <= 2299) {
      monthCode = birthMonth + 60;
    } else {
      throw new InvalidDateRangeError();
    }

    const peselDatePart =
      peselYear.toString().padStart(2, '0') +
      monthCode.toString().padStart(2, '0') +
      birthDay.toString().padStart(2, '0');

    // 4. Generate last 4 digits (unique number + gender)
    // The ninth digit (0-9) indicates gender: even for females, odd for males.
    // The last (eleventh) digit is the checksum.
    // Generate 3 random digits for the number, and the 4th (the tenth in the full PESEL) will determine the gender.

    let serialPart = '';
    for (let i = 0; i < 3; i++) {
      serialPart += Math.floor(Math.random() * 10).toString();
    }

    let sexDigit;
    if (sex === 'female') {
      // Even number (0, 2, 4, 6, 8)
      sexDigit = Math.floor(Math.random() * 5) * 2;
    } else {
      // Odd number (1, 3, 5, 7, 9)
      sexDigit = Math.floor(Math.random() * 5) * 2 + 1;
    }

    const firstTenDigits = peselDatePart + serialPart + sexDigit.toString();

    // 5. Calculate checksum
    const checksumDigit = calculateChecksumDigit(firstTenDigits);

    // 6. Formation of the final PESEL
    return firstTenDigits + checksumDigit.toString();
  }
}
