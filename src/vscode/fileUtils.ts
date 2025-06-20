
import * as vscode from 'vscode';

export async function fileExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads the first line of a file.
 * @param {vscode.Uri} uri 
 * @returns {Promise<string>} The first line, or '' if file is empty or unreadable.
 */
export async function readFirstLine(uri: vscode.Uri): Promise<string> {
  try {
    const uint8Array = await vscode.workspace.fs.readFile(uri);
    const content = Buffer.from(uint8Array).toString('utf8');
    return content.split('\n')[0] || '';
  } catch (err) {
    return '';
  }
}

export async function findFileUri(relativePath: string) {
  const files = await vscode.workspace.findFiles(relativePath, '**/node_modules/**', 1);
  return files.length > 0 ? files[0] : null;
}

export function fileNameFromUri(uri: vscode.Uri): string {
  return uri.path.split('/').pop() || '';
}

export function getWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No workspace folder found.');
    }
    return workspaceFolder;
}

export async function openFile(fileUri: vscode.Uri): Promise<void> {
  const document = await vscode.workspace.openTextDocument(fileUri);
  await vscode.window.showTextDocument(document, { preview: false });
}

// Potential future helpers: readFileAsString, writeFile, ensureDir, etc.
