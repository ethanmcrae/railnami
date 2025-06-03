import * as vscode from 'vscode';
import { RailsMapping } from '../types';
import { ScriptItem } from './scriptItem';
import { getExpectedControllerPath, getExpectedModelPath, getExpectedTestPath } from '../rails/expectedPaths';
import { createGenerateTestButton, createRunTestButton, openTestFileButton } from './buttons/testing';
import { fileExists } from '../vscode/fileUtils';
import { openControllerFileButton, openModelFileButton } from './buttons/openExpectedMVC';

export default async function showTesting(
  workspace: vscode.WorkspaceFolder,
  mapping: RailsMapping,
  items: ScriptItem[]
): Promise<void> {
  const { fileType, resourceType, className } = mapping;
  const isTestable = ['model', 'view', 'controller'].includes(fileType);

  // "Run Test" button along with a link to its non-test file
  if (fileType === 'test') {
    items.push(createRunTestButton(mapping)); // "Run Test"
    if (resourceType === 'model') {
      const modelFileUri = getExpectedModelPath(className, workspace);
      if (await fileExists(modelFileUri)) {
        items.push(openModelFileButton(className)); // "👀 Model file"
      }
    } else if (resourceType === 'controller') {
      const controllerFileUri = getExpectedControllerPath(className, workspace);
      if (await fileExists(controllerFileUri)) {
        items.push(openControllerFileButton(className)); // "👀 Controller file"
      }
    }
  }

  else if (isTestable) {
    const testFileUri = await getExpectedTestPath(resourceType, className, workspace);
    if (testFileUri) {
      items.push(openTestFileButton(mapping));
    } else {
      items.push(createGenerateTestButton(mapping));
    }
  }
}
