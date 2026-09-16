const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Preserve the source's precision; year-only records never acquire a month. */
export function formatCareerDate(value: string) {
  if (value === 'present') return 'Present'
  const [year, month] = value.split('-')
  return month ? `${months[Number(month) - 1]} ${year}` : year
}

export function formatCareerPeriod(start: string, end?: string) {
  return end
    ? `${formatCareerDate(start)} — ${formatCareerDate(end)}`
    : formatCareerDate(start)
}
