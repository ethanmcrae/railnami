import * as vscode from 'vscode';
import { RailsMapping } from '../types';
import { ScriptItem } from './scriptItem';
import { getExpectedTestPath } from '../rails/expectedPaths';
import { createGenerateTestButton, createRunTestButton, openTestFileButton } from './buttons/testing';

export default async function showTesting(
  workspace: vscode.WorkspaceFolder,
  mapping: RailsMapping,
  items: ScriptItem[]
): Promise<void> {
  const { fileType, generatorType, className } = mapping;
  const isTestable = ['model', 'view', 'controller'].includes(fileType);

  if (fileType === 'test') {
    items.push(createRunTestButton(mapping));
  }

  else if (isTestable) {
    const testFileUri = await getExpectedTestPath(generatorType, className, workspace);
    if (testFileUri) {
      items.push(openTestFileButton(mapping));
    } else {
      items.push(createGenerateTestButton(mapping));
    }
  }
}
