export function toDate(input: Date | string | number) {
  const date = input instanceof Date ? input : new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatRelativeTime(input: Date | string | number) {
  const date = toDate(input);
  if (!date) return "";

  const deltaSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const abs = Math.abs(deltaSeconds);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (abs < 60) return rtf.format(deltaSeconds, "second");
  const minutes = Math.round(deltaSeconds / 60);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 7) return rtf.format(days, "day");
  const weeks = Math.round(days / 7);
  if (Math.abs(weeks) < 5) return rtf.format(weeks, "week");
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return rtf.format(months, "month");
  const years = Math.round(days / 365);
  return rtf.format(years, "year");
}

// Default URL
export const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";
