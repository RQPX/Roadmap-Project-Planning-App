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
  
  // If value is strictly less than or equal to 1 AND appears to be a decimal
  // We distinguish: values like 0.75, 0.2, 1.0 (decimal) vs 75, 20, 100 (percentage)
  // Rule: if value <= 1 and is NOT an integer > 1, treat as decimal
  if (value >= 0 && value <= 1) {
    return Math.round(value * 100);
  }
  
  // If already a percentage (1-100), return as is
  return Math.round(value);
}

/**
 * Determines if a project is delayed based on end date and status
 * A project is delayed if:
 * - Its end date is in the past
 * - AND its status is not one of the "completed" statuses
 */
export function isProjectDelayed(endDate: string | undefined | null, status: string | undefined | null): boolean {
  if (!endDate) return false;
  
  const completedStatuses = ["Cloturé", "En service", "Abandonne"];
  if (status && completedStatuses.includes(status)) return false;

  try {
    let end: Date;
    if (/^\d{4}-\d{2}-\d{2}/.test(endDate)) {
      const parts = endDate.substring(0, 10).split("-");
      end = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(endDate)) {
      const parts = endDate.split("/");
      end = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else {
      end = new Date(endDate);
    }
    if (isNaN(end.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return end < today;
  } catch {
    return false;
  }
}

