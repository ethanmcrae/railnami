import * as vscode from 'vscode';
import { RailsMapping } from '../types';
import { ScriptItem } from './scriptItem';
import openSchemaButton from './buttons/openSchema';

export default async function showSchema(
  mapping: RailsMapping,
  items: ScriptItem[]
): Promise<void> {
  if (['model', 'view', 'controller'].includes(mapping.fileType)) {
    items.push(openSchemaButton(mapping.className));
  }
}
