import * as vscode from 'vscode';
import { getRailsMapping } from '../rails/mapping';
import { demodulizeToFileName } from '../utils/pathUtils';
import { openFileAndRevealQuery } from '../vscode/fileQuery';
import schemaPath from '../rails/schemaPath';

export default async function openSchemaAtTable(): Promise<void> {
  const mapping = getRailsMapping();
  if (!mapping) return;
  const { className } = mapping;

  const schemaUri = await schemaPath();
  if (!schemaUri) {
    vscode.window.showWarningMessage('Could not find the schema file.');
    return;
  }

  const table_name = demodulizeToFileName(className, "plural");
  const query = `create_table "${table_name}"`;
  openFileAndRevealQuery(schemaUri, query);
}
