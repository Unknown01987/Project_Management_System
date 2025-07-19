/**
 * Date utility functions for the project management app
 */

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {string} format - The format type ('short', 'long', 'medium')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    long: { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }
  };
  
  return dateObj.toLocaleDateString('en-US', options[format] || options.medium);
};

/**
 * Get relative time from now (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string} date - The date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (Math.abs(diffInSeconds) < 60) {
    return 'just now';
  }
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      const suffix = count === 1 ? '' : 's';
      const timeStr = `${count} ${interval.label}${suffix}`;
      return diffInSeconds > 0 ? `${timeStr} ago` : `in ${timeStr}`;
    }
  }
  
  return 'just now';
};

/**
 * Check if a date is overdue
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is in the past
 */
export const isOverdue = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj < now;
};

/**
 * Check if a date is due soon (within the next 24 hours)
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is due within 24 hours
 */
export const isDueSoon = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return dateObj <= tomorrow && dateObj >= now;
};

/**
 * Get the number of days between two dates
 * @param {Date|string} startDate - The start date
 * @param {Date|string} endDate - The end date
 * @returns {number} Number of days between the dates
 */
export const getDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffInTime = end.getTime() - start.getTime();
  const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
  
  return diffInDays;
};

/**
 * Format a date for input fields (YYYY-MM-DD)
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string for input fields
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return dateObj.toISOString().split('T')[0];
};

/**
 * Format a datetime for datetime-local input fields
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted datetime string for input fields
 */
export const formatDateTimeForInput = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  // Get local timezone offset
  const offset = dateObj.getTimezoneOffset();
  const localDate = new Date(dateObj.getTime() - (offset * 60 * 1000));
  
  return localDate.toISOString().slice(0, 16);
};

/**
 * Get the start of the day for a given date
 * @param {Date|string} date - The date
 * @returns {Date} Start of the day
 */
export const getStartOfDay = (date) => {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

/**
 * Get the end of the day for a given date
 * @param {Date|string} date - The date
 * @returns {Date} End of the day
 */
export const getEndOfDay = (date) => {
  const dateObj = new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
};

/**
 * Get the start of the week for a given date
 * @param {Date|string} date - The date
 * @returns {Date} Start of the week (Sunday)
 */
export const getStartOfWeek = (date) => {
  const dateObj = new Date(date);
  const day = dateObj.getDay();
  const diff = dateObj.getDate() - day;
  const startOfWeek = new Date(dateObj.setDate(diff));
  return getStartOfDay(startOfWeek);
};

/**
 * Get the end of the week for a given date
 * @param {Date|string} date - The date
 * @returns {Date} End of the week (Saturday)
 */
export const getEndOfWeek = (date) => {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
  return getEndOfDay(endOfWeek);
};

/**
 * Get the start of the month for a given date
 * @param {Date|string} date - The date
 * @returns {Date} Start of the month
 */
export const getStartOfMonth = (date) => {
  const dateObj = new Date(date);
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
};

/**
 * Get the end of the month for a given date
 * @param {Date|string} date - The date
 * @returns {Date} End of the month
 */
export const getEndOfMonth = (date) => {
  const dateObj = new Date(date);
  return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0, 23, 59, 59, 999);
};

/**
 * Check if a date is today
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if a date is this week
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is this week
 */
export const isThisWeek = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const startOfWeek = getStartOfWeek(new Date());
  const endOfWeek = getEndOfWeek(new Date());
  
  return dateObj >= startOfWeek && dateObj <= endOfWeek;
};

/**
 * Check if a date is this month
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is this month
 */
export const isThisMonth = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const now = new Date();
  
  return dateObj.getFullYear() === now.getFullYear() && 
         dateObj.getMonth() === now.getMonth();
};

/**
 * Get duration between two dates in human readable format
 * @param {Date|string} startDate - The start date
 * @param {Date|string} endDate - The end date
 * @returns {string} Human readable duration
 */
export const getDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInSeconds = Math.floor((end - start) / 1000);
  
  if (diffInSeconds < 0) return 'Invalid duration';
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      const suffix = count === 1 ? '' : 's';
      return `${count} ${interval.label}${suffix}`;
    }
  }
  
  return 'Less than a minute';
};

/**
 * Add days to a date
 * @param {Date|string} date - The base date
 * @param {number} days - Number of days to add
 * @returns {Date} New date with added days
 */
export const addDays = (date, days) => {
  const dateObj = new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

/**
 * Add hours to a date
 * @param {Date|string} date - The base date
 * @param {number} hours - Number of hours to add
 * @returns {Date} New date with added hours
 */
export const addHours = (date, hours) => {
  const dateObj = new Date(date);
  dateObj.setHours(dateObj.getHours() + hours);
  return dateObj;
};