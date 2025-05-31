import * as vscode from 'vscode';
import { removeFileEnding } from '../utils/fileUtils';
import { findFileUri } from '../vscode/fileUtils';

/**
 * Return the schema.rb file URI
 */
export default function schemaPath(): Promise<vscode.Uri | null> {
  return findFileUri('db/schema.rb');
}
