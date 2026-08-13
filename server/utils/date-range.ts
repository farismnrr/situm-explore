export function isValidDateRange(fromDate: string, toDate: string, maxDays = 366): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fromDate) || !/^\d{4}-\d{2}-\d{2}$/.test(toDate)) return false
  const from = new Date(`${fromDate}T00:00:00.000Z`)
  const to = new Date(`${toDate}T00:00:00.000Z`)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return false
  if (from.toISOString().slice(0, 10) !== fromDate || to.toISOString().slice(0, 10) !== toDate) return false
  return from <= to && (to.getTime() - from.getTime()) / 86400000 <= maxDays
}
