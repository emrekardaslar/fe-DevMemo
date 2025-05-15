import {
  formatDate,
  getCurrentDate,
  getCurrentWeekDates,
  getWeekDates,
  getMonthDates,
  addDays,
  formatDateForDisplay,
  isToday,
  isPastDate,
  isFutureDate,
  parseDate,
  isValidDateString
} from '../../utils/dateUtils';

describe('Date Utility Functions', () => {
  // Focus on the core functions that don't require complex mocking
  describe('formatDate', () => {
    it('formats a date string to YYYY-MM-DD', () => {
      const result = formatDate('2023-05-15T12:34:56Z');
      expect(result).toBe('2023-05-15');
    });
  });

  describe('parseDate', () => {
    it('parses a valid YYYY-MM-DD string', () => {
      const result = parseDate('2023-05-15');
      expect(result).toBeInstanceOf(Date);
    });

    it('returns null for an invalid format', () => {
      expect(parseDate('05/15/2023')).toBeNull();
      expect(parseDate('not a date')).toBeNull();
    });
  });

  describe('isValidDateString', () => {
    it('returns true for a valid YYYY-MM-DD string', () => {
      expect(isValidDateString('2023-05-15')).toBe(true);
    });

    it('returns false for an invalid format', () => {
      expect(isValidDateString('05/15/2023')).toBe(false);
      expect(isValidDateString('15-05-2023')).toBe(false);
      expect(isValidDateString('not a date')).toBe(false);
    });

    it('returns false for an invalid date', () => {
      expect(isValidDateString('2023-02-30')).toBe(false);
    });
  });
}); 