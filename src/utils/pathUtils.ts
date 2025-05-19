/** Convert snake‑case or path to Ruby constant (e.g. "admin/users" → "Admin::Users"). */
export function classify(pathPart: string): string {
  return pathPart
    .split('/')
    .map(seg => seg.replace(/(?:^|_)([a-z])/g, (_, c: string) => c.toUpperCase()))
    .join('::');
}

/** Convert Ruby constant to snake_case file name (e.g. "Admin::User" → "admin_user"). */
export function demodulizeToFileName(className: string): string {
  return className
    .split('::')
    .pop()!
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

// Future path helpers (pluralisation, namespacing conventions, etc.) live here.