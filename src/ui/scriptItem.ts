
import * as vscode from 'vscode';

/** Leaf node used by the Railnami tree view. */
export class ScriptItem extends vscode.TreeItem {
  constructor(
    label: string,
    description: string,
    iconName: string | undefined,
    command?: vscode.Command
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = description;
    this.description = description;
    this.iconPath = new vscode.ThemeIcon(iconName ?? 'tools');
    this.command = command;
  }
}

// Future: extend to collapsible items if nested test suites become desirable.
