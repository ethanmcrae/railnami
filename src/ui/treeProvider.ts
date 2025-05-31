import * as vscode from 'vscode';
import { RailsMapping } from '../types';
import { getRailsMapping } from '../rails/mapping';
import { getExpectedTestPath, getExpectedViewPath } from '../rails/expectedPaths';
import { fileExists, getWorkspaceFolder } from '../vscode/fileUtils';
import { ScriptItem } from '../ui/scriptItem';
import createGenerateTestButton from './buttons/createGenerateTest';
import createRunTestButton from './buttons/createRunTest';
import openTestFileButton from './buttons/openTest';
import createStimulusController from './buttons/createStimulusController';
import showExpectedMVCButtons from './showExpectedMVCButtons';
import showSchema from './showSchema';

export class RailnamiTreeProvider implements vscode.TreeDataProvider<ScriptItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<ScriptItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private currentFilePath = '';
  private currentMapping: RailsMapping | null = null;

  // Triggers this.getChildren() to fire
  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }

  /** Notify the tree that the active editor has changed. */
  updateForFile(filePath: string | undefined): void {
    this.currentFilePath = vscode.workspace.asRelativePath(filePath || '');
    this.currentMapping = getRailsMapping(this.currentFilePath);
    this.refresh();
  }

  getTreeItem(element: ScriptItem): vscode.TreeItem {
    return element;
  }

  async onRefresh(): Promise<ScriptItem[]> {
    if (!this.currentMapping) return []; // Guard
    
  const workspaceFolder = getWorkspaceFolder();
  if (!workspaceFolder) return [];

    const items: ScriptItem[] = [];
    const { fileType, generatorType, className } = this.currentMapping;
    const isTestable = ['model', 'controller'].includes(fileType);

    if (fileType === 'test') {
      items.push(createRunTestButton(this.currentMapping));
      return items;
    }
    else if (isTestable && workspaceFolder) {
      const testFileUri = getExpectedTestPath(generatorType, className, workspaceFolder);
      if (await fileExists(testFileUri)) {
        items.push(openTestFileButton(this.currentMapping));
      } else {
        items.push(createGenerateTestButton(this.currentMapping));
      }
    }

    await showExpectedMVCButtons(workspaceFolder, this.currentMapping, items);
    await showSchema(this.currentMapping, items);

    items.push(createStimulusController(this.currentMapping));

    return items;
  }

  async getChildren(): Promise<ScriptItem[]> { return this.onRefresh(); }
}
