export function humanName(className: string): string {
  return className.split('::').pop() || '';
}
