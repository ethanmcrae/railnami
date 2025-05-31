import * as vscode from 'vscode';
import { RailsMapping } from '../types';
import { ScriptItem } from './scriptItem';
import { getExpectedTestPath } from '../rails/expectedPaths';
import { fileExists } from '../vscode/fileUtils';
import { createGenerateTestButton, createRunTestButton, openTestFileButton } from './buttons/testing';

export default async function showTesting(
  workspace: vscode.WorkspaceFolder,
  mapping: RailsMapping,
  items: ScriptItem[]
): Promise<void> {
  const { fileType, generatorType, className } = mapping;
  const isTestable = ['model', 'controller'].includes(fileType);

  if (fileType === 'test') {
    items.push(createRunTestButton(mapping));
  }

  else if (isTestable) {
    const testFileUri = getExpectedTestPath(generatorType, className, workspace);
    vscode.window.showInformationMessage(testFileUri.path);
    if (await fileExists(testFileUri)) {
      items.push(openTestFileButton(mapping));
    } else {
      items.push(createGenerateTestButton(mapping));
    }
  }
}
