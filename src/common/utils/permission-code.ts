export function normalizePermissionCode(value: string) {
  return value.trim().toUpperCase();
}

export function parsePermissionCodes(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === 'string' && item.length > 0)
    .map((item) => normalizePermissionCode(item))
    .filter(Boolean);
}
