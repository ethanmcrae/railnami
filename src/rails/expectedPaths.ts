import * as vscode from 'vscode';
import pluralize from 'pluralize';
import { RailsGeneratorType } from '../types';
import { demodulizeToFileName } from '../utils/pathUtils';

/**
 * Build the canonical *_test.rb path for a given Rails class.
 */
export function getExpectedTestPath(
  generatorType: RailsGeneratorType,
  className: string,
  workspaceFolder: vscode.WorkspaceFolder
): vscode.Uri {
  const fileName = demodulizeToFileName(className, "plural");
  return vscode.Uri.joinPath(
    workspaceFolder.uri,
    `test/${pluralize(generatorType)}`,
    `${fileName}_${generatorType}_test.rb`
  );
}

/**
 * Build the canonical models/*.rb path for a given Rails class.
 */
export function getExpectedModelPath(
  className: string,
  workspaceFolder: vscode.WorkspaceFolder
): vscode.Uri {
  const fileName = demodulizeToFileName(className);
  return vscode.Uri.joinPath(
    workspaceFolder.uri,
    `app/models/`,
    `${fileName}.rb`
  );
}

/**
 * Build the canonical views/.../index.html.rb path for a given Rails class.
 */
export function getExpectedViewPath(
  className: string,
  workspaceFolder: vscode.WorkspaceFolder
): vscode.Uri {
  const fileName = demodulizeToFileName(className);
  return vscode.Uri.joinPath(
    workspaceFolder.uri,
    `app/views/${pluralize(fileName)}`,
    'index.html.erb'
  );
}

/**
 * Build the canonical *_controller.rb path for a given Rails class.
 */
export function getExpectedControllerPath(
  className: string,
  workspaceFolder: vscode.WorkspaceFolder
): vscode.Uri {
  const fileName = demodulizeToFileName(className);
  return vscode.Uri.joinPath(
    workspaceFolder.uri,
    `app/controllers/`,
    `${pluralize(fileName)}_controller.rb`
  );
}
