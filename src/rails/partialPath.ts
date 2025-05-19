import * as vscode from 'vscode';
import { removeFileEnding } from '../utils/fileUtils';

/**
 * Test if the current file is a partial.
 */
export function isPartialPath(shared = false): string | null {
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return null; }

  const currentFilePath = editor.document.uri.fsPath.split('/');
  const fileName = currentFilePath.pop();
  if (!fileName) { return null; }
  
  const sharedConditional = !shared || (currentFilePath.pop() === 'shared');
  const isPartial = /^_.*\.html\.erb$/.test(fileName); // e.g. _[file-name].html.erb

  if (isPartial && sharedConditional) {
    return removeFileEnding(fileName.slice(1)); // Strip off the "_" prefix and file name ending
  }
  return null;
}
