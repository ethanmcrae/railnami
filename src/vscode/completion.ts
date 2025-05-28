/**
 * Builds the arguments part for the locals hash with snippet placeholders.
 * @param args Record of variable names and their default values (can be undefined)
 * @param startIndex Where to start the tabstops (default 1)
 * @returns String like: variable: ${1}, variable2: ${2}
 */
export function buildLocalsSnippetArgs(
  args: Record<string, string | undefined>,
  startIndex = 1
): string {
  return Object.entries(args)
    .map(([key, value], i) =>
      value
        ? `${key}: \${${startIndex + i}:${value}}`
        : `${key}: \${${startIndex + i}}`
    )
    .join(', ');
}
