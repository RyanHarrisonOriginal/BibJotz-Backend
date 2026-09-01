export function normalizeLabel(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function displayLabel(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}
