import * as vscode from 'vscode';
import { removeFileEnding } from '../utils/fileUtils';

/**
 * Test if the current file is a partial.
 */
export function isPartialPath(): string | null {
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return null; }
  // Get path to current file
  const path = editor.document.uri.fsPath.split('/');
  const fileName = path.at(-1);
  if (fileName === undefined) { return null; }
  // Test to see if it is a partial file
  const isPartial = /^_.*\.html\.erb$/.test(fileName); // e.g. _[file-name].html.erb
  if (!isPartial) { return null; }
  // Format the path from the views directory
  path[path.length - 1] = removeFileEnding(path.at(-1)!.slice(1));
  const viewsIndex = path.indexOf('views');
  const partialPath = path.slice(viewsIndex + 1).join('/');
  if (!partialPath) { return null; }
  // Return if it was a valid path
  return partialPath;
}
