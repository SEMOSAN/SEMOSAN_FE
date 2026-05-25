export function formatBirthDate(text: string): string {
  const digits = text.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
  }
  if (digits.length > 4) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return digits;
}

export function isValidBirthDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) return false;
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

export function isAtLeast14YearsOld(dateStr: string): boolean {
  const [y, m, d] = dateStr.split("-").map(Number);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 14);
  return new Date(y, m - 1, d) <= cutoff;
}
