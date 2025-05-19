import * as vscode from 'vscode';
import { RailsMapping } from '../types';
import { getRailsMapping } from '../rails/mapping';
import { getExpectedTestPath } from '../rails/testPath';
import { fileExists } from '../vscode/fileUtils';
import { ScriptItem } from '../ui/scriptItem';
import createGenerateTestButton from './buttons/createGenerateTest';
import createRunTestButton from './buttons/createRunTest';
import openTestFileButton from './buttons/openTestFile';

export class RailnamiTreeProvider implements vscode.TreeDataProvider<ScriptItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<ScriptItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private currentFilePath = '';
  private currentMapping: RailsMapping | null = null;

  /** Notify the tree that the active editor has changed. */
  updateForFile(filePath: string): void {
    this.currentFilePath = vscode.workspace.asRelativePath(filePath);
    this.currentMapping = getRailsMapping(this.currentFilePath);
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: ScriptItem): vscode.TreeItem {
    return element;
  }

  async getChildren(): Promise<ScriptItem[]> {
    const items: ScriptItem[] = [];
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    const isTestFile = /_test\.rb$/.test(this.currentFilePath);

    if (isTestFile) {
      items.push(createRunTestButton(this.currentMapping));
      return items;
    }

    if (workspaceFolder && this.currentMapping && this.currentMapping.fileType === 'source') {
      const { generatorType, className } = this.currentMapping;
      const testFileUri = getExpectedTestPath(generatorType, className, workspaceFolder);
      if (await fileExists(testFileUri)) {
        items.push(openTestFileButton(this.currentMapping));
      } else {
        items.push(createGenerateTestButton(this.currentMapping));
      }
    }

    return items;
  }
}
