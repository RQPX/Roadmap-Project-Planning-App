/**
 * FORMAT PROGRESS UTILITY
 */

export function formatProgressValue(value: number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  if (isNaN(value)) return 0;

  if (value >= 0 && value <= 1) {
    return Math.round(value * 100);
  }

  return Math.round(value);
}

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
