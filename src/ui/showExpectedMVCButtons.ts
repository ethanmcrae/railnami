import * as vscode from 'vscode';
import { RailsMapping } from '../types';
import { ScriptItem } from './scriptItem';
import { getExpectedControllerPath, getExpectedModelPath, getExpectedViewPath } from '../rails/expectedPaths';
import { fileExists } from '../vscode/fileUtils';
import { openControllerFileButton, openModelFileButton, openViewFileButton } from './buttons/openExpectedMVC';

export default async function showExpectedMVCButtons(
  workspace: vscode.WorkspaceFolder,
  mapping: RailsMapping,
  items: ScriptItem[]
): Promise<void> {
  const { fileType, className } = mapping;

  if (fileType === 'model') {
    const viewFileUri = getExpectedViewPath(className, workspace);
    if (await fileExists(viewFileUri)) {
      items.push(openViewFileButton(className));
    }
    const controllerFileUri = getExpectedControllerPath(className, workspace);
    if (await fileExists(controllerFileUri)) {
      items.push(openControllerFileButton(className));
    }
  } else if (fileType === 'view') {
    const controllerFileUri = getExpectedControllerPath(className, workspace);
    if (await fileExists(controllerFileUri)) {
      items.push(openControllerFileButton(className));
    }
    const modelFileUri = getExpectedModelPath(className, workspace);
    if (await fileExists(modelFileUri)) {
      items.push(openModelFileButton(className));
    }
  } else if (fileType === 'controller') {
    const modelFileUri = getExpectedModelPath(className, workspace);
    if (await fileExists(modelFileUri)) {
      items.push(openModelFileButton(className));
    }
    const viewFileUri = getExpectedViewPath(className, workspace);
    if (await fileExists(viewFileUri)) {
      items.push(openViewFileButton(className));
    }
  }
}
