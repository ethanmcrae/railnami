// Railnami VS Code Extension – main entry point
import * as vscode from 'vscode';

// ───────────────────────────────────────────────────────────────────────────────
// Types & helpers
// ───────────────────────────────────────────────────────────────────────────────

type RailsGeneratorType = 'model' | 'controller' | 'job' | 'mailer' | 'channel';

type FileType = 'source' | 'test';

interface RailsMapping {
  generatorType: RailsGeneratorType;
  className: string;
  fileType: FileType;
}

/** Convert snake‑case or path to Ruby constant (e.g. "admin/users" → "Admin::Users"). */
function classify(pathPart: string): string {
  return pathPart
    .split('/')
    .map(seg => seg.replace(/(?:^|_)([a-z])/g, (_, c: string) => c.toUpperCase()))
    .join('::');
}

/** Attempt to infer generatorType, className & fileType from a workspace‑relative path. */
function getRailsMapping(filePath: string): RailsMapping | null {
  // Source files under app/*
  const sourceMatchers: { pattern: RegExp; generatorType: RailsGeneratorType; suffix?: string }[] = [
    { pattern: /^app\/models\/(.+)\.rb$/, generatorType: 'model' },
    { pattern: /^app\/controllers\/(.+)_controller\.rb$/, generatorType: 'controller', suffix: '_controller' },
    { pattern: /^app\/jobs\/(.+)_job\.rb$/, generatorType: 'job', suffix: '_job' },
    { pattern: /^app\/mailers\/(.+)_mailer\.rb$/, generatorType: 'mailer', suffix: '_mailer' },
    { pattern: /^app\/channels\/(.+)_channel\.rb$/, generatorType: 'channel', suffix: '_channel' }
  ];

  for (const m of sourceMatchers) {
    const match = filePath.match(m.pattern);
    if (match) {
      let base = match[1];
      if (m.suffix) base = base.replace(new RegExp(`${m.suffix}$`), '');
      return {
        generatorType: m.generatorType,
        className: classify(base),
        fileType: 'source'
      };
    }
  }

  // Test files under test/*s
  const testMatchers: { pattern: RegExp; generatorType: RailsGeneratorType; suffix?: string }[] = [
    { pattern: /^test\/models\/(.+?)_model_test\.rb$/, generatorType: 'model' },
    { pattern: /^test\/controllers\/(.+?)_controller_test\.rb$/, generatorType: 'controller' },
    { pattern: /^test\/jobs\/(.+?)_job_test\.rb$/, generatorType: 'job' },
    { pattern: /^test\/mailers\/(.+?)_mailer_test\.rb$/, generatorType: 'mailer' },
    { pattern: /^test\/channels\/(.+?)_channel_test\.rb$/, generatorType: 'channel' }
  ];

  for (const m of testMatchers) {
    const match = filePath.match(m.pattern);
    if (match) {
      return {
        generatorType: m.generatorType,
        className: classify(match[1]),
        fileType: 'test'
      };
    }
  }

  return null;
}

function getExpectedTestPath(
  generatorType: RailsGeneratorType,
  className: string,
  workspaceFolder: vscode.WorkspaceFolder
): vscode.Uri {
  const fileName = className
    .split('::')
    .pop()!
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();
  return vscode.Uri.joinPath(
    workspaceFolder.uri,
    `test/${generatorType}s`,
    `${fileName}_${generatorType}_test.rb`
  );
}

async function fileExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

function getOrCreateTerminal(name: string): vscode.Terminal {
  return vscode.window.terminals.find(t => t.name === name) ?? vscode.window.createTerminal({ name });
}

function createTestButton(items: ScriptItem[], description = '') {
  items.push(
    new ScriptItem('Run Test', description, 'play', {
      command: 'railnami.runTestForCurrentFile',
      title: 'Run Test'
    })
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Extension activation
// ───────────────────────────────────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext) {
  const treeProvider = new RailnamiTreeProvider();
  vscode.window.createTreeView('railnami', {
    treeDataProvider: treeProvider,
    showCollapseAll: false
  });

  // Keep tree in sync with active editor
  if (vscode.window.activeTextEditor) {
    treeProvider.updateForFile(vscode.window.activeTextEditor.document.uri.fsPath);
  }
  // Refresh when the user switches editors
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor =>
      treeProvider.updateForFile(editor?.document.uri.fsPath || '')
    )
  );
  // Refresh when any *_test.rb file is created
  const testWatcher = vscode.workspace.createFileSystemWatcher('**/*_test.rb', false, true, true);
  context.subscriptions.push(
    testWatcher,
    testWatcher.onDidCreate(uri => treeProvider.updateForFile(uri.fsPath))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('railnami.generateTestForCurrentFile', generateTestForCurrentFile),
    vscode.commands.registerCommand('railnami.unsupportedFile', () =>
      vscode.window.showErrorMessage('Error: Can only create test files for supported Rails classes.')
    ),
    vscode.commands.registerCommand('railnami.runTestForCurrentFile', runTestForCurrentFile)
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Tree provider
// ───────────────────────────────────────────────────────────────────────────────

class RailnamiTreeProvider implements vscode.TreeDataProvider<ScriptItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<ScriptItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private currentFilePath = '';
  private currentMapping: RailsMapping | null = null;

  updateForFile(filePath: string) {
    this.currentFilePath = vscode.workspace.asRelativePath(filePath);
    this.currentMapping = getRailsMapping(this.currentFilePath);
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: ScriptItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<ScriptItem[]> {
    const items: ScriptItem[] = [];
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    const isTestFile = /_test\.rb$/.test(this.currentFilePath);

    // Description for Run Test button, if mapping available
    const description = this.currentMapping
      ? `${this.currentMapping.className} ${this.currentMapping.generatorType}`
      : '';

    if (isTestFile) createTestButton(items, description);

    if (workspaceFolder && this.currentMapping && this.currentMapping.fileType === 'source') {
      const { generatorType, className } = this.currentMapping;
      const testFileUri = getExpectedTestPath(generatorType, className, workspaceFolder);

      return fileExists(testFileUri).then(exists => {
        if (!exists) {
          const humanName = className.split('::').pop();
          items.push(
            new ScriptItem(`Create ${humanName} Test`, generatorType, 'file-code', {
              command: 'railnami.generateTestForCurrentFile',
              title: 'Create Test File'
            })
          );
        }
        return items;
      });
    }

    return Promise.resolve(items);
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Commands
// ───────────────────────────────────────────────────────────────────────────────

async function generateTestForCurrentFile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor with a Rails file.');
    return;
  }

  const filePath = vscode.workspace.asRelativePath(editor.document.uri.fsPath);
  const mapping = getRailsMapping(filePath);
  if (!mapping || mapping.fileType === 'test') {
    vscode.window.showWarningMessage('Select a Rails class (model, controller, …) to generate tests for.');
    return;
  }

  const { generatorType, className } = mapping;
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder found.');
    return;
  }

  const terminal = getOrCreateTerminal('Rails Generator');
  terminal.show();
  terminal.sendText(`bin/rails generate test_unit:${generatorType} ${className}`);

  const testFileUri = getExpectedTestPath(generatorType, className, workspaceFolder);
  setTimeout(async () => {
    if (await fileExists(testFileUri)) {
      vscode.window
        .showInformationMessage(`Created test file for ${className}`, 'Open Test File')
        .then(selection => {
          if (selection === 'Open Test File') {
            vscode.workspace.openTextDocument(testFileUri).then(doc => vscode.window.showTextDocument(doc));
          }
        });
    }
  }, 1000);
}

async function runTestForCurrentFile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor.');
    return;
  }

  const fileFsPath = editor.document.uri.fsPath;
  if (!/_test\.rb$/.test(fileFsPath)) {
    vscode.window.showWarningMessage('Current file is not a test file (*.rb ending with _test.rb).');
    return;
  }

  const relativePath = vscode.workspace.asRelativePath(fileFsPath);
  const terminal = getOrCreateTerminal('Rails Tests');
  terminal.show();
  terminal.sendText(`bin/rails test ${relativePath}`);
}

// ───────────────────────────────────────────────────────────────────────────────
// Tree item wrapper
// ───────────────────────────────────────────────────────────────────────────────

class ScriptItem extends vscode.TreeItem {
  constructor(
    label: string,
    description: string,
    iconName?: string,
    command?: vscode.Command
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = description;
    this.description = description;
    this.iconPath = new vscode.ThemeIcon(iconName ?? 'tools');
    this.command = command;
  }
}

// ───────────────────────────────────────────────────────────────────────────────
export function deactivate() { }
