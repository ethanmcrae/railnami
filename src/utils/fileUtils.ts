/**
 * Removes the file extension (the part from the first dot to the end) from a filename string.
 * Handles filenames with no extension, multiple dots, and leading dots (like .bashrc).
 */
export function removeFileEnding(filename: string): string {
  const regex = /\..*$/;
  return filename.replace(regex, '');
}
