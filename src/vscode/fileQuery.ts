import * as vscode from 'vscode';
import { fileNameFromUri } from './fileUtils';

/**
 * Opens the given file, searches for the query, and moves the cursor to the first match (if any).
 * @param fileUri The file to be searched
 * @param searchQuery The string to search for in the file
 */
export async function openFileAndRevealQuery(fileUri: vscode.Uri, searchQuery: string) {
  const document = await vscode.workspace.openTextDocument(fileUri);

  const text = document.getText();
  const matchIndex = text.indexOf(searchQuery);

  if (matchIndex === -1) {
    vscode.window.showWarningMessage(`Could not find within ${fileNameFromUri(fileUri)}`);
    return;
  }

  // Figure out the position (line/character) of the match
  const position = document.positionAt(matchIndex);

  // Reveal the match in the editor
  const editor = await vscode.window.showTextDocument(document, { preview: false });
  editor.selection = new vscode.Selection(position, position);
  editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
}
