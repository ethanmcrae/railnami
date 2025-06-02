import * as vscode from 'vscode';
import { getRailsMapping } from '../rails/mapping';
import { getExpectedTestPath } from '../rails/expectedPaths';
import { getWorkspaceFolder } from '../vscode/fileUtils';
import { getOrCreateTerminal } from '../vscode/terminal';
import { assumePlurality } from '../rails/fileNames';

export async function generateTestForCurrentFile(): Promise<void> {
  const mapping = getRailsMapping();
  if (!mapping || mapping.fileType === 'test') {
    vscode.window.showWarningMessage('Select a Rails class (model, controller, …) to generate tests for.');
    return;
  }

  const { generatorType, className } = mapping;
  const workspaceFolder = getWorkspaceFolder();
  if (!workspaceFolder) return;

  // Setup a listener for the test file to be created
  const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(workspaceFolder, '**/*.rb'));
  watcher.onDidCreate(async (uri: vscode.Uri) => {
    const testFileUri = await getExpectedTestPath(generatorType, className, workspaceFolder);
    if (uri.toString() === testFileUri?.toString()) {
      const doc = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(doc);
      watcher.dispose();
    }
  });

  // Create test file
  const pluralizedClassName = assumePlurality(generatorType, className);
  const terminal = getOrCreateTerminal('Railnami');
  terminal.show();
  terminal.sendText(`bin/rails generate test_unit:${generatorType} ${pluralizedClassName}`);
}
