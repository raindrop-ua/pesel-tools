/**
 * Checks if the PESEL string has the correct format (11 digits).
 * @param pesel The PESEL number string.
 * @returns True if the format is valid, false otherwise.
 */
export function isValidFormat(pesel: string): boolean {
  return /^\d{11}$/.test(pesel);
}

/**
 * Checks if the PESEL number has a valid checksum.
 * @param pesel The PESEL number string.
 * @returns True if the checksum is valid, false otherwise.
 */
export function isValidChecksum(pesel: string): boolean {
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const sum = pesel
    .substring(0, 10)
    .split('')
    .reduce((acc, digit, idx) => acc + parseInt(digit, 10) * weights[idx], 0);

  const controlDigit = (10 - (sum % 10)) % 10;

  return controlDigit === parseInt(pesel.charAt(10), 10);
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
export function isValidDate(year: number, month: number, day: number): boolean {
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
 * Calculates the age based on birth year, month, and day.
 * This method uses a standard age calculation logic.
 * @param birthYear The birth year.
 * @param birthMonth The birth month (1-12).
 * @param birthDay The birthday (1-31).
 * @returns The calculated age in years.
 */
export function calculateAge(
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
