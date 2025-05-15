/**
 * Utility functions for date operations in the StandupSync application
 */

/**
 * Formats a date string to YYYY-MM-DD format
 * @param date A Date object or ISO date string
 * @returns Formatted date string in YYYY-MM-DD format
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * Gets the current date in YYYY-MM-DD format
 * @returns Current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  return formatDate(new Date());
};

/**
 * Gets the start and end dates of the current week (Sunday to Saturday)
 * @returns Object with startDate and endDate in YYYY-MM-DD format
 */
export const getCurrentWeekDates = (): { startDate: string; endDate: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
  
  // Calculate the date of Sunday (start of week)
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - dayOfWeek);
  
  // Calculate the date of Saturday (end of week)
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + (6 - dayOfWeek));
  
  return {
    startDate: formatDate(sunday),
    endDate: formatDate(saturday)
  };
};

/**
 * Gets the start and end dates of a week containing the specified date
 * @param date A date within the desired week
 * @returns Object with startDate and endDate in YYYY-MM-DD format
 */
export const getWeekDates = (date: Date | string): { startDate: string; endDate: string } => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dayOfWeek = d.getDay();
  
  // Calculate the date of Sunday (start of week)
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - dayOfWeek);
  
  // Calculate the date of Saturday (end of week)
  const saturday = new Date(d);
  saturday.setDate(d.getDate() + (6 - dayOfWeek));
  
  return {
    startDate: formatDate(sunday),
    endDate: formatDate(saturday)
  };
};

/**
 * Gets the start and end dates of the month for a given date
 * @param date A date within the desired month (or current date if not provided)
 * @returns Object with startDate and endDate in YYYY-MM-DD format
 */
export const getMonthDates = (date?: Date | string): { startDate: string; endDate: string } => {
  const d = date ? (typeof date === 'string' ? new Date(date) : date) : new Date();
  
  // First day of the month
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
  
  // Last day of the month
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  
  return {
    startDate: formatDate(firstDay),
    endDate: formatDate(lastDay)
  };
};

/**
 * Adds days to a given date
 * @param date The starting date
 * @param days Number of days to add (can be negative)
 * @returns A new date with days added/subtracted in YYYY-MM-DD format
 */
export const addDays = (date: Date | string, days: number): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

/**
 * Formats a date for display in a user-friendly format
 * @param date Date to format
 * @param format Format style ('short', 'medium', 'long', 'full')
 * @returns Formatted date string
 */
export const formatDateForDisplay = (
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = { 
    dateStyle: format 
  } as any;
  
  return new Intl.DateTimeFormat('en-US', options).format(d);
};

/**
 * Determines if a date is today
 * @param date Date to check
 * @returns True if the date is today, false otherwise
 */
export const isToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
};

/**
 * Determines if a date is in the past
 * @param date Date to check
 * @returns True if the date is in the past, false otherwise
 */
export const isPastDate = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return d < today;
};

/**
 * Determines if a date is in the future
 * @param date Date to check
 * @returns True if the date is in the future, false otherwise
 */
export const isFutureDate = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return d > today;
};

/**
 * Parses a YYYY-MM-DD date string safely, returning null if invalid
 * @param dateString String in YYYY-MM-DD format
 * @returns Date object or null if invalid
 */
export const parseDate = (dateString: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return null;
  }
  
  const d = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return null;
  }
  
  // Additional check for valid day of month
  // Extract the year, month, and day from the input string
  const [year, month, day] = dateString.split('-').map(Number);
  
  // JavaScript months are 0-indexed, so subtract 1 from the month
  const jsMonth = month - 1;
  
  // Check if the created date matches the input components
  // If not, it means the date was invalid and JavaScript normalized it
  if (d.getFullYear() !== year || d.getMonth() !== jsMonth || d.getDate() !== day) {
    return null;
  }
  
  return d;
};

/**
 * Validates a date string is in YYYY-MM-DD format and is a valid date
 * @param dateString String to validate
 * @returns True if valid, false otherwise
 */
export const isValidDateString = (dateString: string): boolean => {
  return parseDate(dateString) !== null;
}; 