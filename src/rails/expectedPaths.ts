import * as vscode from 'vscode';
import pluralize from 'pluralize';
import { RailsGeneratorType } from '../types';
import { demodulizeToFileName } from '../utils/pathUtils';
import { buildFileNameFromGenerator } from './fileNames';
import { fileExists } from '../vscode/fileUtils';

/**
 * Build the canonical *_test.rb path for a given Rails class.
 */
export async function getExpectedTestPath(
  generatorType: RailsGeneratorType,
  className: string,
  workspaceFolder: vscode.WorkspaceFolder
): Promise<vscode.Uri | null> {
  const fileName = buildFileNameFromGenerator(generatorType, className, false);
  if (!fileName) return null;

  const uri = vscode.Uri.joinPath(
    workspaceFolder.uri,
    `test/${pluralize(generatorType)}`,
    `${fileName}_test.rb`
  );
  
  if (await fileExists(uri)) return uri;
  return null;
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
