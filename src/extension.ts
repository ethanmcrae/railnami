import * as vscode from 'vscode';
import { RailnamiTreeProvider } from './ui/treeProvider';
import { generateTestForCurrentFile } from './commands/generateTest';
import { runTestForCurrentFile } from './commands/runTest';
import { openTestForCurrentFile } from './commands/openTest';
import { registerSnippetCommands } from './commands/insertSnippet';
import { renderPartial } from './commands/renderPartial';
import { MemoryStore } from './memory/memoryStore';

export function activate(context: vscode.ExtensionContext): void {
  const treeProvider = new RailnamiTreeProvider();
  vscode.window.createTreeView('railnami', {
    treeDataProvider: treeProvider,
    showCollapseAll: false
  });

  // Keep tree in sync with active editor
  if (vscode.window.activeTextEditor) {
    treeProvider.updateForFile(vscode.window.activeTextEditor.document.uri.fsPath);
  }

  // Refresh when the user switches editors
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      const currentFilePath = editor?.document.uri.fsPath;

      treeProvider.updateForFile(currentFilePath);
      MemoryStore.editorUpdate();
    })
  );

  // Refresh when any *_test.rb file is created
  const testWatcher = vscode.workspace.createFileSystemWatcher('**/*_test.rb', false, true, true);
  context.subscriptions.push(
    testWatcher,
    testWatcher.onDidCreate(uri => treeProvider.updateForFile(uri.fsPath))
  );

  // Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('railnami.generateTestForCurrentFile', generateTestForCurrentFile),
    vscode.commands.registerCommand('railnami.openTestForCurrentFile', openTestForCurrentFile),
    vscode.commands.registerCommand('railnami.runTestForCurrentFile', runTestForCurrentFile),
    vscode.commands.registerCommand('railnami.insertSnippet.renderPartial', renderPartial),
    vscode.commands.registerCommand('railnami.unsupportedFile', () =>
      vscode.window.showErrorMessage('Error: Can only create test files for supported Rails classes.')
    )
  );

  registerSnippetCommands(context);
}

export function deactivate(): void {
  // Nothing to clean up (yet). Place disposal logic here if terminals or
  // diagnostics become long‑lived resources.
}
