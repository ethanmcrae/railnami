import * as vscode from 'vscode';
import { RailsGeneratorType } from '../types';
import { demodulizeToFileName } from '../utils/pathUtils';

/**
 * Build the canonical *_test.rb path for a given Rails class.
 * Abstracted for reuse by both UI and generators.
 */
export function getExpectedTestPath(
  generatorType: RailsGeneratorType,
  className: string,
  workspaceFolder: vscode.WorkspaceFolder
): vscode.Uri {
  const fileName = demodulizeToFileName(className);
  return vscode.Uri.joinPath(
    workspaceFolder.uri,
    `test/${generatorType}s`,
    `${fileName}_${generatorType}_test.rb`
  );
}
