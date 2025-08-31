/**
 * Formats a date string to DD.MM.YYYY format
 * @param dateString - The date string to format
 * @returns Formatted date string (e.g., "01.01.1970")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

/**
 * Formats a date string to YYYY-MM-DD format
 * @param dateString - The date string to format
 * @returns Formatted date string (e.g., "1970-01-01")
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};
