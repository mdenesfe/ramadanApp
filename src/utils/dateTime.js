export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export function dateFromTimeStr(now, timeStr) {
  const [hour, minute] = timeStr.split(':').map(Number);
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute
  );
}

export function formatRemainingTime(milliseconds) {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getCurrentDateStr(locale = 'tr-TR') {
  return new Date().toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    weekday: 'short'
  });
}

export function getCurrentTimeStr(locale = 'tr-TR') {
  return new Date().toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getHijriDate(locale = 'tr-TR') {
  const date = new Date();
  const day = date.toLocaleDateString(locale, {
    calendar: 'islamic',
    day: 'numeric'
  });
  const month = date.toLocaleDateString(locale, {
    calendar: 'islamic',
    month: 'long'
  });

  return `${day} ${month}`; // Yıl kısmını kaldırdık
} 