/**
 * Removes the file extension (the part from the first dot to the end) from a filename string.
 * Handles filenames with no extension, multiple dots, and leading dots (like .bashrc).
 */
export function removeFileEnding(filename: string): string {
  const regex = /\..*$/;
  return filename.replace(regex, '');
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')   // helloWorld → hello_World
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // ABCDef → ABC_Def
    .replace(/[\s\-]+/g, '_')                 // spaces or dashes to underscores
    .toLowerCase();
}

export function stripControllerSuffix(str: string): string {
  return str.replace(/_controller$/, '');
}
