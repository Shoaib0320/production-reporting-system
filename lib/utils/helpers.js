export function formatDate(date, locale = 'ur-PK') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date, locale = 'ur-PK') {
  return new Date(date).toLocaleString(locale);
}

export function formatNumber(num, decimals = 2) {
  return Number(num).toFixed(decimals);
}

export function calculateTotalWeight(pieceWeight, totalPieces) {
  return Number(pieceWeight) * Number(totalPieces);
}

export function getShiftName(shift) {
  const shifts = {
    morning: 'صبح',
    evening: 'شام',
    night: 'رات',
  };
  return shifts[shift] || shift;
}

export function getRoleName(role) {
  const roles = {
    admin: 'ایڈمن',
    operator: 'آپریٹر',
    supervisor: 'سپروائزر',
  };
  return roles[role] || role;
}
