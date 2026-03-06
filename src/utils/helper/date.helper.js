import dayjs from '../dayjs.js';

export function parseDateIST(dateStr, format = 'DD-MM-YYYY') {
  const valid = dayjs(dateStr, format, true).isValid();
  if (!valid) return null;
  return dayjs.tz(dateStr, format, 'Asia/Kolkata').toDate();
}

export function formatDateIST(date, format = 'DD-MM-YYYY') {
  return dayjs.tz(date, 'Asia/Kolkata').format(format);
}
