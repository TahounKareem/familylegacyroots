export const ARABIC_GREGORIAN_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر"
];

export const ARABIC_WEEKDAYS = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت"
];

export function formatArabicGregorianDate(dateInput: Date | string): {
  dayName: string;
  dayNum: number;
  monthName: string;
  year: number;
  formatted: string;
  isoDate: string;
} {
  let d: Date;
  if (typeof dateInput === "string") {
    // If it's YYYY-MM-DD, parse year, month, day directly to avoid timezone shift
    const parts = dateInput.split("-");
    if (parts.length === 3) {
      d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      d = new Date(dateInput);
    }
  } else {
    d = dateInput;
  }

  const dayName = ARABIC_WEEKDAYS[d.getDay()];
  const dayNum = d.getDate();
  const monthName = ARABIC_GREGORIAN_MONTHS[d.getMonth()];
  const year = d.getFullYear();

  const pad = (n: number) => n.toString().padStart(2, "0");
  const isoDate = `${year}-${pad(d.getMonth() + 1)}-${pad(dayNum)}`;

  return {
    dayName,
    dayNum,
    monthName,
    year,
    formatted: `${dayName}، ${dayNum} ${monthName} ${year}`,
    isoDate
  };
}

/**
 * 30-minute intervals from 09:00 AM to 05:00 PM (nothing after 5:00 PM)
 */
export const AVAILABLE_TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM"
];

export function formatTimeSlotArabic(time: string): string {
  return time
    .replace("AM", "صباحاً")
    .replace("PM", "مساءً");
}
