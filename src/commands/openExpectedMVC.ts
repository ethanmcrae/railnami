import * as vscode from 'vscode';
import { getRailsMapping } from '../rails/mapping';
import { fileExists, getWorkspaceFolder } from '../vscode/fileUtils';
import { getExpectedControllerPath, getExpectedModelPath, getExpectedViewPath } from '../rails/expectedPaths';

export async function openModelForCurrentFile(): Promise<void> {
  const mapping = getRailsMapping();
  if (!mapping) return;
  const { className } = mapping;

  const workspaceFolder = getWorkspaceFolder();
  if (!workspaceFolder) return;
  
  const modelFileUri = getExpectedModelPath(className, workspaceFolder);
  if (!(await fileExists(modelFileUri))) {
    vscode.window.showErrorMessage('No model file found.');
    return;
  }

  const doc = await vscode.workspace.openTextDocument(modelFileUri);
  await vscode.window.showTextDocument(doc);
}

export async function openViewForCurrentFile(): Promise<void> {
  const mapping = getRailsMapping();
  if (!mapping) return;
  const { className } = mapping;

  const workspaceFolder = getWorkspaceFolder();
  if (!workspaceFolder) return;
  
  const viewFileUri = getExpectedViewPath(className, workspaceFolder);
  if (!(await fileExists(viewFileUri))) {
    vscode.window.showErrorMessage('No view file found.');
    return;
  }

  const doc = await vscode.workspace.openTextDocument(viewFileUri);
  await vscode.window.showTextDocument(doc);
}

export async function openControllerForCurrentFile(): Promise<void> {
  const mapping = getRailsMapping();
  if (!mapping) return;
  const { className } = mapping;

  const workspaceFolder = getWorkspaceFolder();
  if (!workspaceFolder) return;
  
  const controllerFileUri = getExpectedControllerPath(className, workspaceFolder);
  if (!(await fileExists(controllerFileUri))) {
    vscode.window.showErrorMessage('No controller file found.');
    return;
  }

  const doc = await vscode.workspace.openTextDocument(controllerFileUri);
  await vscode.window.showTextDocument(doc);
}
