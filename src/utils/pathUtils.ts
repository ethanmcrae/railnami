import * as vscode from 'vscode';
import pluralize from 'pluralize';

/** Convert snake‑case or path to Ruby constant (e.g. "admin/users" → "Admin::Users"). */
export function classify(pathPart: string): string {
  const pathPartPlural = pathPart
    .split('/')
    .map(seg => seg.replace(/(?:^|_)([a-z])/g, (_, c: string) => c.toUpperCase()))
    .join('::');
  return pluralize.singular(pathPartPlural);
}

/** Convert Ruby constant to snake_case file name (e.g. "Admin::User" → "admin_user"). */
export function demodulizeToFileName(
  className: string,
  form: 'singular' | 'plural' = 'singular'
): string {
  let fileName = className
    .split('::')
    .pop()!
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();

  if (form === 'plural') {
    fileName = pluralize(fileName);
  } else if (form === 'singular') {
    fileName = pluralize.singular(fileName);
  }

  return fileName;
}

// Future path helpers (pluralisation, namespacing conventions, etc.) live here.