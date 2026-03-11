/**
 * FORMAT PROGRESS UTILITY
 * 
 * Airtable stores progress as decimals (0-1).
 * This utility converts decimals to percentages (0-100) for display.
 */

/**
 * Formats progress value from decimal to percentage
 * @param value - Progress value (0-1 decimal from Airtable)
 * @returns Percentage value (0-100)
 */
export function formatProgressValue(value: number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  
  // If value is between 0 and 1, it's a decimal - multiply by 100
  if (value >= 0 && value <= 1) {
    return Math.round(value * 100);
  }
  
  // If already a percentage (0-100), return as is
  return Math.round(value);
}

/**
 * Formats progress value with percentage symbol
 * @param value - Progress value (0-1 decimal from Airtable)
 * @returns Formatted string like "75%"
 */
export function formatProgress(value: number | undefined | null): string {
  return `${formatProgressValue(value)}%`;
}
