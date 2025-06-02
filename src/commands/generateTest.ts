import * as vscode from 'vscode';
import { getRailsMapping } from '../rails/mapping';
import { getExpectedTestPath } from '../rails/expectedPaths';
import { getWorkspaceFolder } from '../vscode/fileUtils';
import { getOrCreateTerminal } from '../vscode/terminal';

export async function generateTestForCurrentFile(): Promise<void> {
  const mapping = getRailsMapping();
  if (!mapping || mapping.fileType === 'test') {
    vscode.window.showWarningMessage('Select a Rails class (model, controller, …) to generate tests for.');
    return;
  }

  const { generatorType, className } = mapping;
  const workspaceFolder = getWorkspaceFolder();
  if (!workspaceFolder) return;

  const terminal = getOrCreateTerminal('Railnami');
  terminal.show();
  terminal.sendText(`bin/rails generate test_unit:${generatorType} ${className}`);

  const testFileUri = await getExpectedTestPath(generatorType, className, workspaceFolder);
  // Poll for the generated file and offer to open it.  Future: consider using
  // vscode.workspace.onDidCreateFiles for real‑time events.
  setTimeout(async () => {
    if (testFileUri) {
      const doc = await vscode.workspace.openTextDocument(testFileUri);
      await vscode.window.showTextDocument(doc);
    }
  }, 500);
}
