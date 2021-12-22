import moment from 'moment';

/**
 * Formats a Date string into month/date (MMYY) e.g., 0521, 1021, 0122
 */
export const formatDateAsMMYY = (date: string) => {
  const momentObj = moment(date);
  const month = momentObj.month().toString().padStart(2, '0');
  const year = momentObj.year().toString().slice(2);
  return `${month}${year}`;
}