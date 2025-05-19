import * as vscode from 'vscode';
import { getRailsMapping } from '../rails/mapping';
import { getExpectedTestPath } from '../rails/testPath';
import { fileExists } from '../vscode/fileUtils';
import { getOrCreateTerminal } from '../vscode/terminal';

export async function generateTestForCurrentFile(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor with a Rails file.');
    return;
  }

  const filePath = vscode.workspace.asRelativePath(editor.document.uri.fsPath);
  const mapping = getRailsMapping(filePath);
  if (!mapping || mapping.fileType === 'test') {
    vscode.window.showWarningMessage('Select a Rails class (model, controller, …) to generate tests for.');
    return;
  }

  const { generatorType, className } = mapping;
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder found.');
    return;
  }

  const terminal = getOrCreateTerminal('Rails Generator');
  terminal.show();
  terminal.sendText(`bin/rails generate test_unit:${generatorType} ${className}`);

  const testFileUri = getExpectedTestPath(generatorType, className, workspaceFolder);
  // Poll for the generated file and offer to open it.  Future: consider using
  // vscode.workspace.onDidCreateFiles for real‑time events.
  setTimeout(async () => {
    if (await fileExists(testFileUri)) {
      const selection = await vscode.window.showInformationMessage(`Created test file for ${className}`, 'Open Test File');
      if (selection === 'Open Test File') {
        const doc = await vscode.workspace.openTextDocument(testFileUri);
        await vscode.window.showTextDocument(doc);
      }
    }
  }, 1000);
}
