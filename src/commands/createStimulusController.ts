import * as vscode from 'vscode';
import stimulusControllerTemplate from '../templates/stimulusController';
import { stripControllerSuffix, toSnakeCase } from '../utils/fileUtils';
import { getWorkspaceFolder } from '../vscode/fileUtils';

export async function createStimulusController(): Promise<void> {
  const workspaceFolder = getWorkspaceFolder();
  if (!workspaceFolder) return;

  // Get a polished controller name response from the developer
  let controllerName = await vscode.window.showInputBox({
    prompt: 'Stimulus controller name (spaces allowed)',
    placeHolder: '<your-controller-name>'
  });
  if (!controllerName) { return; }
  controllerName = toSnakeCase(controllerName);
  controllerName = stripControllerSuffix(controllerName);

  try {
    // Build the controller directory path (supports subdirectories)
    const controllersDir = vscode.Uri.joinPath(
      workspaceFolder.uri,
      'app',
      'javascript',
      'controllers'
    );
    const segments = controllerName.split('/');
    const fileBaseName = segments.pop()!;
    const targetDir = segments.length
      ? vscode.Uri.joinPath(controllersDir, ...segments)
      : controllersDir;

    // Ensure the directory exists
    await vscode.workspace.fs.createDirectory(targetDir);

    // Create the file URI
    const fileUri = vscode.Uri.joinPath(targetDir, `${fileBaseName}_controller.js`);

    // Only write the file if it doesn't exist
    let fileExists = false;
    try {
      await vscode.workspace.fs.stat(fileUri);
      fileExists = true;
    } catch {
      // File does not exist, will be created below
    }

    if (!fileExists) {
      await vscode.workspace.fs.writeFile(fileUri, Buffer.from(stimulusControllerTemplate));
    }

    // Open the file in the editor
    const doc = await vscode.workspace.openTextDocument(fileUri);
    await vscode.window.showTextDocument(doc);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error creating Stimulus controller: ${error.message}`);
  }
}
