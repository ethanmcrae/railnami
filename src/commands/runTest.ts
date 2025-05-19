import * as vscode from 'vscode';
import { getOrCreateTerminal } from '../vscode/terminal';

export async function runTestForCurrentFile(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor.');
    return;
  }

  const fileFsPath = editor.document.uri.fsPath;
  if (!/_test\.rb$/.test(fileFsPath)) {
    vscode.window.showWarningMessage('Current file is not a test file (*.rb ending with _test.rb).');
    return;
  }

  const relativePath = vscode.workspace.asRelativePath(fileFsPath);
  const terminal = getOrCreateTerminal('Rails Tests');
  terminal.show();
  terminal.sendText(`bin/rails test ${relativePath}`);
}
