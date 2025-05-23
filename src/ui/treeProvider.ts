import * as vscode from 'vscode';
import { RailsMapping } from '../types';
import { getRailsMapping } from '../rails/mapping';
import { getExpectedTestPath } from '../rails/testPath';
import { fileExists } from '../vscode/fileUtils';
import { ScriptItem } from '../ui/scriptItem';
import createGenerateTestButton from './buttons/createGenerateTest';
import createRunTestButton from './buttons/createRunTest';
import openTestFileButton from './buttons/openTestFile';
import createStimulusController from './buttons/createStimulusController';

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

  async getChildren(): Promise<ScriptItem[]> {
    if (!this.currentMapping) { return []; } // Guard

    const items: ScriptItem[] = [];
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    const { fileType } = this.currentMapping;
    const isTestable = ['model', 'controller'].includes(fileType);

    if (fileType === 'test') {
      items.push(createRunTestButton(this.currentMapping));
      return items;
    }
    else if (isTestable && workspaceFolder) {
      const { generatorType, className } = this.currentMapping;
      const testFileUri = getExpectedTestPath(generatorType, className, workspaceFolder);
      if (await fileExists(testFileUri)) {
        items.push(openTestFileButton(this.currentMapping));
      } else {
        items.push(createGenerateTestButton(this.currentMapping));
      }
    }

    items.push(createStimulusController(this.currentMapping));

    return items;
  }
}
